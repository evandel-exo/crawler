import { XMLParser } from 'fast-xml-parser';

// Dev sandbox by default; production is https://mydatapi.aade.gr/myDATA/
export const MYDATA_BASE_URL = process.env.MYDATA_BASE_URL ?? 'https://mydataapidev.aade.gr/';

export type Creds = { user: string; key: string; entityVat?: string };
export type Line = { lineNumber: number; netValue: number; vatAmount: number; vatCategory: string; itemDescr?: string };
export type Invoice = {
  mark: string; issuerVat: string; issuerName: string; issuerCountry: string;
  series: string; aa: string; issueDate: string; invoiceType: string;
  net: number; vat: number; gross: number; lines: Line[];
};
export type LineClassification = { lineNumber: number; amount: number; category: string; type: string | null; vatType: string | null; vatAmount: number; vatCategory: string };

const ARRAYS = new Set(['invoice', 'invoiceDetails', 'cancelledInvoice', 'response', 'error']);
const parser = new XMLParser({ removeNSPrefix: true, parseTagValue: false, isArray: (name) => ARRAYS.has(name) });

async function call(path: string, creds: Creds, init: RequestInit = {}) {
  const res = await fetch(new URL(path, MYDATA_BASE_URL), {
    ...init,
    headers: { 'aade-user-id': creds.user, 'Ocp-Apim-Subscription-Key': creds.key, 'Content-Type': 'application/xml' },
    signal: AbortSignal.timeout(60_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`myDATA HTTP ${res.status}: ${text.slice(0, 300)}`);
  return parser.parse(text);
}

const num = (v: unknown) => Number(v ?? 0);

function toInvoice(inv: any): Invoice {
  const h = inv.invoiceHeader ?? {};
  const s = inv.invoiceSummary ?? {};
  return {
    mark: String(inv.mark),
    issuerVat: String(inv.issuer?.vatNumber ?? ''),
    issuerName: String(inv.issuer?.name ?? ''),
    issuerCountry: String(inv.issuer?.country ?? 'GR'),
    series: String(h.series ?? ''), aa: String(h.aa ?? ''),
    issueDate: String(h.issueDate ?? ''), invoiceType: String(h.invoiceType ?? ''),
    net: num(s.totalNetValue), vat: num(s.totalVatAmount), gross: num(s.totalGrossValue),
    lines: (inv.invoiceDetails ?? []).map((d: any) => ({
      lineNumber: num(d.lineNumber), netValue: num(d.netValue), vatAmount: num(d.vatAmount),
      vatCategory: String(d.vatCategory ?? ''), itemDescr: d.itemDescr ? String(d.itemDescr) : undefined,
    })),
  };
}

/** Invoices other businesses issued to this client (its expenses), plus marks they later cancelled. */
export async function fetchReceivedInvoices(creds: Creds, dateFrom: string, dateTo: string) {
  const invoices: Invoice[] = [];
  const cancelled: string[] = [];
  let token: { nextPartitionKey: string; nextRowKey: string } | undefined;
  do {
    const q = new URLSearchParams({ mark: '0', dateFrom, dateTo });
    if (creds.entityVat) q.set('entityVatNumber', creds.entityVat);
    if (token) { q.set('nextPartitionKey', token.nextPartitionKey); q.set('nextRowKey', token.nextRowKey); }
    const doc = (await call(`RequestDocs?${q}`, creds)).RequestedDoc ?? {};
    for (const inv of doc.invoicesDoc?.invoice ?? []) invoices.push(toInvoice(inv));
    for (const c of doc.cancelledInvoicesDoc?.cancelledInvoice ?? []) cancelled.push(String(c.invoiceMark));
    token = doc.continuationToken;
  } while (token);
  return { invoices, cancelled };
}

const money = (n: number) => n.toFixed(2);

export function buildExpensesXml(mark: string, entityVat: string | undefined, lines: LineClassification[]): string {
  const details = lines.map((l) => {
    const e3 = `<expensesClassificationDetailData>${l.type ? `<classificationType>${l.type}</classificationType>` : ''}<classificationCategory>${l.category}</classificationCategory><amount>${money(l.amount)}</amount></expensesClassificationDetailData>`;
    const vat = l.vatType
      ? `<expensesClassificationDetailData><classificationType>${l.vatType}</classificationType><amount>${money(l.amount)}</amount><vatAmount>${money(l.vatAmount)}</vatAmount><vatCategory>${l.vatCategory}</vatCategory></expensesClassificationDetailData>`
      : '';
    return `<invoicesExpensesClassificationDetails><lineNumber>${l.lineNumber}</lineNumber>${e3}${vat}</invoicesExpensesClassificationDetails>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><ExpensesClassificationsDoc xmlns="https://www.aade.gr/myDATA/expensesClassificaton/v1.0"><expensesInvoiceClassification><invoiceMark>${mark}</invoiceMark>${entityVat ? `<entityVatNumber>${entityVat}</entityVatNumber>` : ''}${details}</expensesInvoiceClassification></ExpensesClassificationsDoc>`;
}

export async function sendExpensesClassification(creds: Creds, xml: string): Promise<{ classificationMark?: string; error?: string }> {
  const r = (await call('SendExpensesClassification', creds, { method: 'POST', body: xml })).ResponseDoc?.response?.[0];
  if (r?.statusCode === 'Success') return { classificationMark: String(r.classificationMark) };
  const errors = (r?.errors?.error ?? []).map((e: any) => `${e.code}: ${e.message}`).join('; ');
  return { error: errors || String(r?.statusCode ?? 'Άγνωστη απάντηση myDATA') };
}

/** HTML date input (YYYY-MM-DD) → myDATA query format (dd/MM/yyyy). */
export const toMyDataDate = (iso: string) => iso.split('-').reverse().join('/');

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import type { AddressInfo } from 'node:net';

// Fake myDATA: two DEH invoices issued to the client, a page break between them, then one cancellation.
const invoiceXml = (mark: string, date: string) => `<invoice><mark>${mark}</mark><issuer><vatNumber>090000045</vatNumber><country>GR</country><branch>0</branch></issuer>
  <invoiceHeader><series>A</series><aa>${mark.slice(-3)}</aa><issueDate>${date}</issueDate><invoiceType>1.1</invoiceType><currency>EUR</currency></invoiceHeader>
  <invoiceDetails><lineNumber>1</lineNumber><netValue>100.00</netValue><vatCategory>1</vatCategory><vatAmount>24.00</vatAmount></invoiceDetails>
  <invoiceSummary><totalNetValue>100.00</totalNetValue><totalVatAmount>24.00</totalVatAmount><totalWithheldAmount>0</totalWithheldAmount><totalFeesAmount>0</totalFeesAmount><totalStampDutyAmount>0</totalStampDutyAmount><totalOtherTaxesAmount>0</totalOtherTaxesAmount><totalDeductionsAmount>0</totalDeductionsAmount><totalGrossValue>124.00</totalGrossValue></invoiceSummary></invoice>`;
const received: { url: string; headers: Record<string, unknown>; body: string }[] = [];
const fake = createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  received.push({ url: req.url!, headers: req.headers, body });
  res.setHeader('Content-Type', 'application/xml');
  if (req.url!.startsWith('/RequestDocs')) {
    const page2 = req.url!.includes('nextPartitionKey');
    return res.end(`<?xml version="1.0"?><RequestedDoc xmlns="http://www.aade.gr/myDATA/invoice/v1.0">
      ${page2 ? '' : '<continuationToken><nextPartitionKey>p</nextPartitionKey><nextRowKey>r</nextRowKey></continuationToken>'}
      <invoicesDoc>${page2 ? invoiceXml('400000000000002', '2026-03-01') : invoiceXml('400000000000001', '2026-02-01')}</invoicesDoc>
      ${page2 ? '<cancelledInvoicesDoc><cancelledInvoice><invoiceMark>400000000000099</invoiceMark><cancellationMark>1</cancellationMark><cancellationDate>2026-03-02</cancellationDate></cancelledInvoice></cancelledInvoicesDoc>' : ''}
      </RequestedDoc>`);
  }
  if (req.url!.startsWith('/SendExpensesClassification')) {
    const mark = /<invoiceMark>(\d+)/.exec(body)![1];
    return res.end(`<ResponseDoc><response><index>1</index><classificationMark>9${mark.slice(-3)}</classificationMark><statusCode>Success</statusCode></response></ResponseDoc>`);
  }
  res.statusCode = 404; res.end();
}).listen(0);

const dir = mkdtempSync(`${tmpdir()}/logistis-`);
Object.assign(process.env, {
  DATA_DIR: dir, APP_PASSWORD: 'test-pass', APP_SECRET: 'test-secret', ANTHROPIC_API_KEY: '',
  MYDATA_BASE_URL: `http://127.0.0.1:${(fake.address() as AddressInfo).port}/`, MYDATA_USER: 'office', MYDATA_KEY: 'office-key',
});
const { start } = await import('../src/server.ts');
const app: Server = start(0);
const base = `http://127.0.0.1:${(app.address() as AddressInfo).port}`;
after(() => { app.close(); fake.close(); });

let cookie = '';
const post = (path: string, body: URLSearchParams | FormData) => fetch(base + path, { method: 'POST', body, headers: { cookie }, redirect: 'manual' });
const get = async (path: string) => (await fetch(base + path, { headers: { cookie } })).text();
const until = async (check: () => Promise<boolean>) => { for (let i = 0; i < 50 && !(await check()); i++) await new Promise((r) => setTimeout(r, 50)); };

test('accountant flow: sync → classify → supplier memory → send-all → bank → client upload', async () => {
  assert.equal((await fetch(base + '/', { redirect: 'manual' })).status, 303); // 303 to login
  assert.equal((await post('/login', new URLSearchParams({ password: 'wrong' }))).status, 200);
  const login = await post('/login', new URLSearchParams({ password: 'test-pass' }));
  cookie = login.headers.get('set-cookie')!.split(';')[0];

  await post('/clients', new URLSearchParams({ name: 'Καφέ Ακρόπολις ΙΚΕ', vat: '801234567' }));
  assert.match(await get('/'), /Καφέ Ακρόπολις ΙΚΕ/);

  assert.equal((await post('/clients/1/sync', new URLSearchParams({ from: '2026-02-01', to: '2026-03-31' }))).status, 303);
  const docs = received.filter((r) => r.url.startsWith('/RequestDocs'));
  assert.equal(docs.length, 2);
  assert.match(docs[0].url, /mark=0&dateFrom=01%2F02%2F2026&dateTo=31%2F03%2F2026&entityVatNumber=801234567/);
  assert.equal(docs[0].headers['aade-user-id'], 'office');
  assert.equal(docs[0].headers['ocp-apim-subscription-key'], 'office-key');

  // No AI key: both invoices wait for manual classification with a clear Greek message.
  await until(async () => (await get('/clients/1')).split('ANTHROPIC_API_KEY').length === 3);
  const page = await get('/clients/1');
  assert.match(page, /Προς χαρακτηρισμό \(2\)/);
  assert.match(page, /E3_585_011 · Ενέργεια/);

  await post('/clients/1/invoices/400000000000001/send', new URLSearchParams({ l_1: 'category2_3|E3_585_011', v_1: 'VAT_361' }));
  const sent = received.filter((r) => r.url.startsWith('/SendExpensesClassification'));
  assert.equal(sent.length, 1);
  assert.match(sent[0].body, /<entityVatNumber>801234567<\/entityVatNumber>.*<classificationType>E3_585_011<\/classificationType><classificationCategory>category2_3<\/classificationCategory><amount>100.00<\/amount>.*<classificationType>VAT_361<\/classificationType>/s);

  // The second DEH invoice now carries the accountant's own choice and can go out in bulk.
  const after1 = await get('/clients/1');
  assert.match(after1, /από ιστορικό/);
  assert.match(after1, /Αποστολή 1 έτοιμων χαρακτηρισμών/);
  await post('/clients/1/send-all', new URLSearchParams());
  assert.equal(received.filter((r) => r.url.startsWith('/SendExpensesClassification')).length, 2);
  assert.match(await get('/clients/1'), /Προς χαρακτηρισμό \(0\)[\s\S]*Απεσταλμένα \(2\)[\s\S]*9002/);

  // Invalid combination never reaches myDATA.
  const invalid = await post('/clients/1/invoices/400000000000001/send', new URLSearchParams({ l_1: 'category2_1|E3_585_011' }));
  assert.equal(invalid.status, 303);
  assert.equal(received.filter((r) => r.url.startsWith('/SendExpensesClassification')).length, 2);

  const csv = new FormData();
  csv.set('file', new File(['Ημερομηνία;Περιγραφή;Ποσό\n05/02/2026;ΔΕΗ ΛΟΓΑΡΙΑΣΜΟΣ;-124,00\n06/02/2026;ΑΓΝΩΣΤΗ ΠΛΗΡΩΜΗ;-30,00\n'], 'kinhseis.csv', { type: 'text/csv' }));
  await post('/clients/1/bank', csv);
  const bank = await get('/clients/1?tab=bank');
  assert.match(bank, /Ταιριάζουν 1 από 2 πληρωμές/);
  assert.match(bank, /Χωρίς παραστατικό/);

  // Client uploads a receipt photo through the public link, without logging in.
  const token = /\/u\/([a-f0-9]{32})/.exec(await get('/clients/1?tab=docs'))![1];
  const up = new FormData();
  up.append('files', new File([Buffer.from('89504e470d0a1a0a', 'hex')], 'apodeixi.png', { type: 'image/png' }));
  up.append('files', new File(['<script>'], 'evil.html', { type: 'text/html' }));
  const upRes = await fetch(`${base}/u/${token}`, { method: 'POST', body: up });
  assert.match(await upRes.text(), /evil\.html δεν είναι φωτογραφία ή PDF/);
  const docsPage = await get('/clients/1?tab=docs');
  assert.match(docsPage, /apodeixi\.png/);
  assert.doesNotMatch(docsPage, /evil\.html/);
  assert.equal((await fetch(`${base}/clients/1/uploads/1`, { redirect: 'manual' })).status, 303); // file needs login
  assert.equal((await fetch(`${base}/u/notatoken`)).status, 404);
});

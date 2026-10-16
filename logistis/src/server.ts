import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { db, DATA_DIR, encrypt, decrypt } from './db.ts';
import { fetchReceivedInvoices, buildExpensesXml, sendExpensesClassification, toMyDataDate, type Creds, type Invoice, type Line } from './mydata.ts';
import { suggest, isValid, allowedFor, categoryLabels, typeLabels, invoiceTypeLabels, VAT_TYPES, type Suggestion } from './classify.ts';
import { parseStatement, matchPayments } from './bank.ts';
import { extract, ACCEPTED, type Extracted } from './receipts.ts';
import { DEMO_USER, seedDemo, deleteDemo, demoFetch, demoMark, hasDemo } from './demo.ts';

type Client = { id: number; name: string; vat: string; mydata_user: string | null; mydata_key_enc: string | null; upload_token: string };
type InvoiceRow = { mark: string; client_id: number; issuer_vat: string; issuer_name: string; issuer_country: string; series: string; aa: string; issue_date: string; invoice_type: string; net: number; vat: number; gross: number; lines_json: string; status: string; suggestion_json: string | null; classification_mark: string | null; error: string | null };

// ---------- HTML ----------
class Raw { readonly s: string; constructor(s: string) { this.s = s; } }
const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
function html(strings: TemplateStringsArray, ...vals: unknown[]): Raw {
  const part = (v: unknown): string => (v instanceof Raw ? v.s : Array.isArray(v) ? v.map(part).join('') : v === false || v == null ? '' : esc(v));
  return new Raw(strings.reduce((out, s, i) => out + s + (i < vals.length ? part(vals[i]) : ''), ''));
}
const eur = (n: number) => n.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' });
const grDate = (iso: string | null) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—');
const sel = (on: boolean) => new Raw(on ? 'selected' : '');

const ICONS = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  spark: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>',
  alert: '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  sync: '<path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M3 21v-5h5"/><path d="M21 3v5h-5"/>',
  upload: '<path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
} as const;
const icon = (name: keyof typeof ICONS) => new Raw(`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`);

// Hidden native input so the button text is Greek, not the browser's "Choose file".
const PICK_JS = "const n=this.files.length;this.closest('label').querySelector('.chosen').textContent=n===1?this.files[0].name:n?n+' αρχεία επιλέχθηκαν':''";
const filePicker = (name: string, accept: string, label: string, multiple = false) =>
  html`<label class="picker"><input class="sr-only" type="file" name="${name}" accept="${accept}" ${new Raw(multiple ? 'multiple' : '')} required onchange="${PICK_JS}"><span class="btn btn-secondary">${icon('upload')}${label}</span><span class="chosen"></span></label>`;

const CSS = `
:root { color-scheme: light;
  --bg:#f5f5f2; --surface:#fff; --sunken:#fafaf8; --ink:#17181a; --ink-2:#4a4c50; --muted:#74767b; --line:#e4e4df; --line-2:#d3d3cc;
  --accent:#2448c7; --accent-ink:#fff; --accent-soft:#eef2ff; --focus:#2448c766;
  --ok:#11734a; --ok-soft:#e8f5ee; --ai:#6a3fc2; --ai-soft:#f2edfc; --warn:#9a5b00; --warn-soft:#fdf3e1; --bad:#b42318; --bad-soft:#fdecea;
  --radius:12px; --shadow:0 1px 2px #0000000d, 0 1px 1px #00000008; }
@media (prefers-color-scheme: dark) { :root { color-scheme: dark;
  --bg:#111214; --surface:#1a1b1e; --sunken:#151619; --ink:#ececea; --ink-2:#c3c4c7; --muted:#8e9096; --line:#2a2b2f; --line-2:#3a3b40;
  --accent:#7c9cff; --accent-ink:#0d1330; --accent-soft:#1d2440; --focus:#7c9cff66;
  --ok:#4cc38a; --ok-soft:#143024; --ai:#b39bff; --ai-soft:#251d3d; --warn:#f0b357; --warn-soft:#33270f; --bad:#ff8a80; --bad-soft:#3a1715; --shadow:none; } }
* { box-sizing: border-box; }
body { margin: 0; font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--ink); -webkit-font-smoothing: antialiased; }
a { color: var(--accent); text-decoration: none; } a:hover { text-decoration: underline; }
.i { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.num, .amount { font-variant-numeric: tabular-nums; } .num { text-align: right; white-space: nowrap; }
.muted { color: var(--muted); } .small { font-size: 13px; }

.topbar { position: sticky; top: 0; z-index: 5; background: var(--surface); border-bottom: 1px solid var(--line); }
.topbar .inner { max-width: 1120px; margin: 0 auto; padding: 0 16px; height: 56px; display: flex; align-items: center; gap: 16px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 650; color: var(--ink); letter-spacing: -.01em; }
.brand:hover { text-decoration: none; }
.logo { width: 28px; height: 28px; border-radius: 8px; background: var(--accent); color: var(--accent-ink); display: grid; place-items: center; font-weight: 700; font-size: 15px; }
.topbar nav { margin-left: auto; display: flex; gap: 4px; }
.topbar nav a { color: var(--ink-2); padding: 6px 10px; border-radius: 8px; font-size: 14px; } .topbar nav a:hover { background: var(--sunken); text-decoration: none; }

main { max-width: 1120px; margin: 0 auto; padding: 28px 16px 80px; }
.page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
.crumb { font-size: 13px; color: var(--muted); margin-bottom: 6px; } .crumb a { color: var(--muted); }
h1 { font-size: 24px; line-height: 1.2; letter-spacing: -.02em; margin: 0; font-weight: 680; }
h2 { font-size: 15px; margin: 32px 0 12px; font-weight: 650; display: flex; align-items: center; gap: 8px; }
.count { font-size: 12px; font-weight: 600; background: var(--sunken); border: 1px solid var(--line); color: var(--ink-2); padding: 0 7px; border-radius: 99px; }

.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); }
.pad { padding: 16px 18px; }
.stack > * + * { margin-top: 12px; }

.tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--line); margin: 0 0 20px; overflow-x: auto; }
.tabs a { display: flex; align-items: center; gap: 8px; padding: 10px 12px; color: var(--muted); font-weight: 550; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; }
.tabs a:hover { color: var(--ink); text-decoration: none; }
.tabs a[aria-current] { color: var(--ink); border-bottom-color: var(--accent); }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 16px; }
@media (max-width: 520px) { .stats { grid-template-columns: 1fr 1fr; gap: 8px; } .stat { padding: 10px 12px; } .stat .value { font-size: 18px; } }
.stat { padding: 14px 16px; } .stat .label { font-size: 13px; color: var(--muted); } .stat .value { font-size: 22px; font-weight: 650; letter-spacing: -.01em; margin-top: 2px; }

.toolbar { display: flex; gap: 12px 16px; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; padding: 14px 18px; }
.field { display: grid; gap: 4px; font-size: 13px; color: var(--muted); font-weight: 500; }
.inline { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; }

input, select { font: inherit; font-size: 14px; color: var(--ink); background: var(--surface); border: 1px solid var(--line-2); border-radius: 8px; height: 38px; padding: 0 10px; max-width: 100%; }
select { appearance: none; padding-right: 32px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2374767b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; background-size: 16px; }
input[type=file] { height: auto; padding: 6px; }
input[type=file]::file-selector-button { font: inherit; border: 1px solid var(--line-2); background: var(--sunken); color: var(--ink); border-radius: 6px; padding: 4px 10px; margin-right: 10px; cursor: pointer; }
:is(input, select, button, a, summary):focus-visible { outline: 3px solid var(--focus); outline-offset: 1px; }

.btn { font: inherit; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 38px; padding: 0 14px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; white-space: nowrap; }
.btn-primary { background: var(--accent); color: var(--accent-ink); } .btn-primary:hover { filter: brightness(1.08); }
.btn-secondary { background: var(--surface); color: var(--ink); border-color: var(--line-2); } .btn-secondary:hover { background: var(--sunken); }
.btn:disabled { opacity: .5; cursor: not-allowed; filter: none; }
.btn-lg { height: 46px; font-size: 15px; padding: 0 18px; }

.badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 99px; white-space: nowrap; }
.badge .i { width: 13px; height: 13px; }
.b-ok { color: var(--ok); background: var(--ok-soft); } .b-ai { color: var(--ai); background: var(--ai-soft); }
.b-warn { color: var(--warn); background: var(--warn-soft); } .b-bad { color: var(--bad); background: var(--bad-soft); } .b-muted { color: var(--muted); background: var(--sunken); border: 1px solid var(--line); }

.banner { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: 10px; margin-bottom: 16px; font-size: 14px; }
.banner .i { margin-top: 3px; } .banner-warn { background: var(--warn-soft); color: var(--warn); } .banner-bad { background: var(--bad-soft); color: var(--bad); } .banner-ok { background: var(--ok-soft); color: var(--ok); }
.banner p { margin: 0; color: var(--ink-2); }

.inv { overflow: hidden; border-left: 3px solid var(--line-2); }
.inv.s-history { border-left-color: var(--ok); } .inv.s-ai { border-left-color: var(--ai); } .inv.s-warn { border-left-color: var(--warn); } .inv.s-bad { border-left-color: var(--bad); }
.inv-head { display: flex; justify-content: space-between; gap: 12px; padding: 14px 18px; }
.inv-head .who { font-weight: 650; font-size: 16px; } .inv-head .meta { font-size: 13px; color: var(--muted); margin-top: 2px; }
.inv-head .total { text-align: right; } .inv-head .total .amount { font-size: 18px; font-weight: 650; display: block; }
.inv-error { margin: 0 18px 12px; }
.line { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px 20px; padding: 12px 18px; border-top: 1px solid var(--line); background: var(--sunken); }
.line .desc { font-weight: 550; } .line .amts { font-size: 14px; } .line .amts .muted { display: block; font-size: 12px; }
.line .pick { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr; gap: 8px; }
@media (min-width: 560px) { .line .pick { grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); } }
.line .pick select { width: 100%; }
.line .why { grid-column: 1 / -1; font-size: 13px; color: var(--muted); display: flex; gap: 6px; align-items: center; margin-top: -2px; }
.inv-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 18px; border-top: 1px solid var(--line); }
@media (min-width: 820px) { .line { grid-template-columns: minmax(0, 1fr) 120px minmax(0, 2.6fr); align-items: center; } .line .pick { grid-column: auto; } .line .amts { text-align: right; } .line .why { grid-column: 3; } }

table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .03em; padding: 10px 14px; border-bottom: 1px solid var(--line); background: var(--sunken); }
td { padding: 11px 14px; border-bottom: 1px solid var(--line); vertical-align: top; } tr:last-child td { border-bottom: 0; }
.table-wrap { overflow-x: auto; }
.empty { text-align: center; padding: 40px 16px; color: var(--muted); }
.empty strong { display: block; color: var(--ink); font-size: 16px; margin-bottom: 4px; }

.grid-2 { display: grid; gap: 16px; } @media (min-width: 900px) { .grid-2 { grid-template-columns: 1.6fr 1fr; align-items: start; } }
.form-grid { display: grid; gap: 12px; } .form-grid input { width: 100%; }
.client-row a { font-weight: 600; color: var(--ink); }

.center { min-height: 100vh; display: grid; place-items: center; padding: 24px 16px; }
.narrow { width: 100%; max-width: 420px; min-width: 0; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.picker { position: relative; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; } .picker .chosen { font-size: 13px; color: var(--muted); }
.picker:focus-within .btn { outline: 3px solid var(--focus); outline-offset: 1px; }
.drop { display: grid; place-items: center; gap: 8px; text-align: center; padding: 32px 16px; border: 2px dashed var(--line-2); border-radius: var(--radius); background: var(--sunken); cursor: pointer; }
.drop .i { width: 32px; height: 32px; color: var(--accent); } .drop:hover, .drop:focus-within { border-color: var(--accent); } .drop .chosen { font-weight: 600; color: var(--accent); }
.progress { height: 6px; min-width: 90px; background: var(--sunken); border: 1px solid var(--line); border-radius: 99px; overflow: hidden; }
.progress span { display: block; height: 100%; background: var(--ok); }
.bar { height: 10px; min-width: 120px; background: var(--sunken); border-radius: 4px; overflow: hidden; }
.bar span { display: block; height: 100%; background: var(--accent); border-radius: 0 4px 4px 0; }
.dropdown { position: relative; } .dropdown > summary { list-style: none; } .dropdown > summary::-webkit-details-marker { display: none; }
.dropdown .menu { position: absolute; right: 0; top: 46px; width: min(360px, calc(100vw - 32px)); z-index: 10; }
.head-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.grid-even { display: grid; gap: 16px; } @media (min-width: 900px) { .grid-even { grid-template-columns: 1fr 1fr; align-items: start; } }
.card-title { padding: 14px 16px; border-bottom: 1px solid var(--line); font-weight: 650; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
td .sub { font-size: 12px; color: var(--muted); }
.copy { display: flex; gap: 8px; } .copy input { flex: 1; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
`;

function page(title: string, body: Raw, opts: { bare?: boolean } = {}) {
  const shell = opts.bare
    ? html`<div class="center"><div class="narrow">${body}</div></div>`
    : html`<header class="topbar"><div class="inner"><a class="brand" href="/"><span class="logo">N</span>N2X</a>
        <nav><a href="/">Πίνακας ελέγχου</a><a href="/logout">Έξοδος</a></nav></div></header><main>${body}</main>`;
  return html`<!doctype html><html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · N2X</title><style>${new Raw(CSS)}</style></head><body>${shell}</body></html>`;
}

const brandBlock = html`<div class="brand" style="justify-content:center;margin-bottom:20px;font-size:18px"><span class="logo">N</span>N2X</div>`;
const errorPage = (msg: string, back: string) => page('Σφάλμα', html`<div class="banner banner-bad">${icon('alert')}<div><strong>Κάτι πήγε στραβά</strong><p>${msg}</p></div></div><a class="btn btn-secondary" href="${back}">← Πίσω</a>`);

// ---------- auth ----------
const sessionValue = () => createHmac('sha256', process.env.APP_SECRET ?? '').update(`session:${process.env.APP_PASSWORD}`).digest('hex');
const safeEq = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const loggedIn = (req: IncomingMessage) => safeEq(/(?:^|;\s*)s=([a-f0-9]+)/.exec(req.headers.cookie ?? '')?.[1] ?? '', sessionValue());

// ---------- data ----------
const getClient = (id: number) => db.prepare('SELECT * FROM clients WHERE id = ?').get(id) as Client | undefined;
const AI_OFF_MARK = 'ANTHROPIC_API_KEY';

function credsFor(c: Client): Creds {
  if (c.mydata_user === DEMO_USER) return { user: DEMO_USER, key: '' };
  if (c.mydata_user && c.mydata_key_enc) return { user: c.mydata_user, key: decrypt(c.mydata_key_enc) };
  // Office-wide credentials of an accountant the client has authorised in myDATA.
  const { MYDATA_USER, MYDATA_KEY } = process.env;
  if (!MYDATA_USER || !MYDATA_KEY) throw new Error('Λείπουν στοιχεία myDATA για τον πελάτη και για το γραφείο');
  return { user: MYDATA_USER, key: MYDATA_KEY, entityVat: c.vat };
}

const rowToInvoice = (r: InvoiceRow): Invoice => ({
  mark: r.mark, issuerVat: r.issuer_vat, issuerName: r.issuer_name, issuerCountry: r.issuer_country, series: r.series, aa: r.aa,
  issueDate: r.issue_date, invoiceType: r.invoice_type, net: r.net, vat: r.vat, gross: r.gross, lines: JSON.parse(r.lines_json),
});

async function suggestPending(clientId: number) {
  const rows = db.prepare(`SELECT * FROM invoices WHERE client_id = ? AND status = 'new'`).all(clientId) as InvoiceRow[];
  const work = rows.map((r) => async () => {
    const h = db.prepare('SELECT lines_json FROM history WHERE issuer_vat = ? AND invoice_type = ? ORDER BY rowid DESC LIMIT 1').get(r.issuer_vat, r.invoice_type) as { lines_json: string } | undefined;
    try {
      const s = await suggest(rowToInvoice(r), h && JSON.parse(h.lines_json));
      db.prepare(`UPDATE invoices SET status = 'suggested', suggestion_json = ?, error = NULL WHERE mark = ?`).run(JSON.stringify(s), r.mark);
    } catch (e) {
      db.prepare(`UPDATE invoices SET status = 'suggested', error = ? WHERE mark = ?`).run((e as Error).message, r.mark);
    }
  });
  // A few AI calls at a time; a month can hold hundreds of invoices.
  const next = async (): Promise<void> => { const job = work.shift(); if (job) { await job(); return next(); } };
  await Promise.all(Array.from({ length: 4 }, next));
}

async function sendInvoice(c: Client, r: InvoiceRow, chosen: Suggestion['lines']): Promise<string | null> {
  const inv = rowToInvoice(r);
  const lines = inv.lines.map((l: Line) => {
    const s = chosen.find((x) => x.lineNumber === l.lineNumber);
    // shortcut: VAT classification only for lines that carry VAT; 0%/exempt lines would also need vatExemptionCategory.
    const vatType = l.vatAmount > 0 ? s?.vatType ?? null : null;
    return { lineNumber: l.lineNumber, amount: l.netValue, vatAmount: l.vatAmount, vatCategory: l.vatCategory, category: s?.category ?? '', type: s?.type ?? null, vatType };
  });
  const bad = lines.find((l) => !isValid(inv.invoiceType, l.category, l.type, l.vatType));
  if (bad) return `Γραμμή ${bad.lineNumber}: διαλέξτε έγκυρο χαρακτηρισμό`;
  const creds = credsFor(c);
  const res = creds.user === DEMO_USER ? { classificationMark: demoMark(), error: undefined } : await sendExpensesClassification(creds, buildExpensesXml(inv.mark, creds.entityVat, lines));
  if (res.error) {
    db.prepare(`UPDATE invoices SET status = 'error', error = ? WHERE mark = ?`).run(res.error, inv.mark);
    return res.error;
  }
  // The final choice stays on the invoice for the reports.
  const final: Suggestion = { source: r.suggestion_json ? (JSON.parse(r.suggestion_json) as Suggestion).source : 'history', lines: chosen };
  db.prepare(`UPDATE invoices SET status = 'sent', classification_mark = ?, suggestion_json = ?, error = NULL WHERE mark = ?`).run(res.classificationMark ?? null, JSON.stringify(final), inv.mark);
  db.prepare('INSERT INTO history (issuer_vat, invoice_type, lines_json) VALUES (?, ?, ?)').run(inv.issuerVat, inv.invoiceType, JSON.stringify(chosen));
  // Pending invoices from the same supplier now follow the accountant's choice instead of the AI's guess.
  const { changes } = db.prepare(`UPDATE invoices SET status = 'new' WHERE client_id = ? AND issuer_vat = ? AND invoice_type = ? AND status = 'suggested'
    AND (suggestion_json IS NULL OR json_extract(suggestion_json, '$.source') = 'ai')`).run(c.id, inv.issuerVat, inv.invoiceType);
  if (changes) await suggestPending(c.id);
  return null;
}

async function extractUpload(id: number, path: string, mime: string) {
  try {
    db.prepare('UPDATE uploads SET extracted_json = ?, error = NULL WHERE id = ?').run(JSON.stringify(await extract(path, mime)), id);
  } catch (e) {
    db.prepare('UPDATE uploads SET error = ? WHERE id = ?').run((e as Error).message, id);
  }
}

// ---------- views ----------
const isReady = (r: InvoiceRow) => !!r.suggestion_json && (JSON.parse(r.suggestion_json) as Suggestion).lines.every((l) => l.category);

function invoiceState(r: InvoiceRow, s?: Suggestion) {
  if (r.status === 'new') return { cls: '', badge: html`<span class="badge b-muted">${icon('clock')}Σε επεξεργασία…</span>` };
  if (r.status === 'error') return { cls: 's-bad', badge: html`<span class="badge b-bad">${icon('alert')}Απορρίφθηκε</span>` };
  if (s && isReady(r)) return s.source === 'history'
    ? { cls: 's-history', badge: html`<span class="badge b-ok">${icon('history')}Από ιστορικό</span>` }
    : { cls: 's-ai', badge: html`<span class="badge b-ai">${icon('spark')}Πρόταση AI</span>` };
  return { cls: 's-warn', badge: html`<span class="badge b-warn">${icon('alert')}Χρειάζεται επιλογή</span>` };
}

function lineRow(inv: InvoiceRow, line: Line, s?: Suggestion['lines'][number]) {
  const current = s?.category ? `${s.category}|${s.type ?? ''}` : '';
  const groups = Object.entries(allowedFor(inv.invoice_type)).map(([c, types]) => html`<optgroup label="${categoryLabels[c]}">${
    (types.length ? types : ['']).map((t) => { const v = `${c}|${t}`; return html`<option value="${v}" ${sel(v === current)}>${t ? `${t} · ${typeLabels[t] ?? ''}` : '(χωρίς τύπο Ε3)'}</option>`; })
  }</optgroup>`);
  const vatType = s?.category ? s.vatType : inv.issuer_country === 'GR' ? 'VAT_361' : null;
  const vat = line.vatAmount > 0
    ? html`<select name="v_${line.lineNumber}" aria-label="Χαρακτηρισμός ΦΠΑ γραμμής ${line.lineNumber}"><option value="">Χωρίς ΦΠΑ</option>${Object.entries(VAT_TYPES).map(([k, label]) => html`<option value="${k}" ${sel(k === vatType)}>${k} · ${label}</option>`)}</select>`
    : html`<span class="muted small" style="align-self:center">Χωρίς ΦΠΑ</span>`;
  return html`<div class="line">
    <div><div class="desc">${line.itemDescr || `Γραμμή ${line.lineNumber}`}</div></div>
    <div class="amts amount">${eur(line.netValue)}<span class="muted">ΦΠΑ ${eur(line.vatAmount)}</span></div>
    <div class="pick"><select name="l_${line.lineNumber}" aria-label="Χαρακτηρισμός Ε3 γραμμής ${line.lineNumber}"><option value="">Επιλέξτε χαρακτηρισμό…</option>${groups}</select>${vat}</div>
    ${s?.reason ? html`<div class="why">${icon(s.reason.startsWith('Όπως') ? 'history' : 'spark')}${s.reason}</div>` : ''}
  </div>`;
}

function invoicesView(c: Client) {
  const rows = db.prepare(`SELECT * FROM invoices WHERE client_id = ? AND status != 'cancelled' ORDER BY issue_date DESC`).all(c.id) as InvoiceRow[];
  const pending = rows.filter((r) => ['new', 'suggested', 'error'].includes(r.status));
  const sent = rows.filter((r) => r.status === 'sent');
  const ready = pending.filter((r) => r.status !== 'error' && isReady(r)).length;
  const aiOff = pending.some((r) => r.error?.includes(AI_OFF_MARK));
  const monthAgo = new Date(Date.now() - 31 * 86_400_000).toISOString().slice(0, 10);

  return html`
    <div class="stats">
      <div class="card stat"><div class="label">Προς χαρακτηρισμό</div><div class="value amount">${pending.length}</div></div>
      <div class="card stat"><div class="label">Έτοιμα για αποστολή</div><div class="value amount">${ready}</div></div>
      <div class="card stat"><div class="label">Απεσταλμένα</div><div class="value amount">${sent.length}</div></div>
      <div class="card stat"><div class="label">Σύνολο εξόδων</div><div class="value amount">${eur(rows.reduce((t, r) => t + r.gross, 0))}</div></div>
    </div>

    <div class="card toolbar">
      <form method="post" action="/clients/${c.id}/sync" class="inline">
        <label class="field">Από<input type="date" name="from" required value="${monthAgo}"></label>
        <label class="field">Έως<input type="date" name="to" required value="${new Date().toISOString().slice(0, 10)}"></label>
        <button class="btn btn-secondary">${icon('sync')}Λήψη από myDATA</button>
      </form>
      <form method="post" action="/clients/${c.id}/send-all">
        <button class="btn btn-primary" ${new Raw(ready ? '' : 'disabled')}>${icon('check')}${ready ? `Αποστολή ${ready} έτοιμων χαρακτηρισμών` : 'Κανένα έτοιμο για αποστολή'}</button>
      </form>
    </div>

    ${aiOff ? html`<div class="banner banner-warn" style="margin-top:16px">${icon('alert')}<div><strong>Οι προτάσεις AI είναι απενεργοποιημένες</strong>
      <p>Προσθέστε ${AI_OFF_MARK} στο αρχείο .env. Μέχρι τότε, οι προτάσεις έρχονται μόνο από το ιστορικό σας.</p></div></div>` : ''}

    <h2>Προς χαρακτηρισμό <span class="count">${pending.length}</span></h2>
    ${pending.length === 0
      ? html`<div class="card empty"><strong>Όλα χαρακτηρισμένα</strong>Πατήστε «Λήψη από myDATA» για να φέρετε νέα παραστατικά εξόδων.</div>`
      : html`<div class="stack">${pending.map((r) => {
        const s = r.suggestion_json ? (JSON.parse(r.suggestion_json) as Suggestion) : undefined;
        const state = invoiceState(r, s);
        const error = r.error && !r.error.includes(AI_OFF_MARK) ? r.error : '';
        return html`<form class="card inv ${state.cls}" method="post" action="/clients/${c.id}/invoices/${r.mark}/send">
          <div class="inv-head">
            <div><div class="who">${r.issuer_name || `ΑΦΜ ${r.issuer_vat}`}</div>
              <div class="meta">${r.issuer_name ? `ΑΦΜ ${r.issuer_vat} · ` : ''}${grDate(r.issue_date)} · ${r.series}/${r.aa} · ${invoiceTypeLabels[r.invoice_type] ?? `Τύπος ${r.invoice_type}`}</div></div>
            <div class="total"><span class="amount">${eur(r.gross)}</span>${state.badge}</div>
          </div>
          ${error ? html`<div class="banner banner-bad inv-error">${icon('alert')}<p>${error}</p></div>` : ''}
          ${(JSON.parse(r.lines_json) as Line[]).map((l) => lineRow(r, l, s?.lines.find((x) => x.lineNumber === l.lineNumber)))}
          <div class="inv-foot"><span class="muted small">ΜΑΡΚ ${r.mark}</span><button class="btn btn-primary">${icon('check')}Έγκριση & αποστολή</button></div>
        </form>`;
      })}</div>`}

    <h2>Απεσταλμένα <span class="count">${sent.length}</span></h2>
    ${sent.length === 0
      ? html`<div class="card empty">Δεν έχουν σταλεί χαρακτηρισμοί ακόμη.</div>`
      : html`<div class="card table-wrap"><table><tr><th>Ημερομηνία</th><th>Προμηθευτής</th><th class="num">Σύνολο</th><th>ΜΑΡΚ χαρακτηρισμού</th></tr>
        ${sent.map((r) => html`<tr><td>${grDate(r.issue_date)}</td><td>${r.issuer_name || r.issuer_vat}</td><td class="num">${eur(r.gross)}</td><td><span class="badge b-ok">${icon('check')}${r.classification_mark}</span></td></tr>`)}</table></div>`}`;
}

function bankView(c: Client) {
  const lines = db.prepare('SELECT b.*, i.issuer_name, i.issuer_vat, i.series, i.aa FROM bank_lines b LEFT JOIN invoices i ON i.mark = b.matched_mark WHERE b.client_id = ? ORDER BY b.date DESC').all(c.id) as { date: string; description: string; amount: number; matched_mark: string | null; issuer_name: string | null; issuer_vat: string | null; series: string | null; aa: string | null }[];
  const unpaid = db.prepare(`SELECT COUNT(*) n, COALESCE(SUM(gross), 0) total FROM invoices WHERE client_id = ? AND status != 'cancelled' AND mark NOT IN (SELECT matched_mark FROM bank_lines WHERE matched_mark IS NOT NULL)`).get(c.id) as { n: number; total: number };
  const out = lines.filter((l) => l.amount < 0);
  const matched = out.filter((l) => l.matched_mark).length;
  return html`
    <div class="stats">
      <div class="card stat"><div class="label">Πληρωμές με παραστατικό</div><div class="value amount">${matched} <span class="muted" style="font-size:15px">/ ${out.length}</span></div></div>
      <div class="card stat"><div class="label">Πληρωμές χωρίς παραστατικό</div><div class="value amount">${out.length - matched}</div></div>
      <div class="card stat"><div class="label">Παραστατικά χωρίς πληρωμή</div><div class="value amount">${unpaid.n} <span class="muted" style="font-size:15px">${eur(unpaid.total)}</span></div></div>
    </div>
    <form method="post" action="/clients/${c.id}/bank" enctype="multipart/form-data" class="card toolbar">
      <div class="field"><span>Κινήσεις λογαριασμού (CSV από το e-banking)</span>${filePicker('file', '.csv,text/csv', 'Επιλογή αρχείου CSV')}</div>
      <button class="btn btn-primary">${icon('upload')}Συμφωνία</button>
    </form>
    <p class="muted small">Ταιριάζουν ${matched} από ${out.length} πληρωμές.</p>
    ${lines.length
      ? html`<div class="card table-wrap"><table><tr><th>Ημερομηνία</th><th>Περιγραφή</th><th class="num">Ποσό</th><th>Παραστατικό</th></tr>
        ${lines.map((l) => html`<tr><td>${grDate(l.date)}</td><td>${l.description}</td><td class="num">${eur(l.amount)}</td>
          <td>${l.matched_mark ? html`<span class="badge b-ok">${icon('check')}${l.issuer_name || l.issuer_vat} ${l.series}/${l.aa}</span>`
            : l.amount < 0 ? html`<span class="badge b-warn">${icon('alert')}Χωρίς παραστατικό</span>` : html`<span class="badge b-muted">Είσπραξη</span>`}</td></tr>`)}</table></div>`
      : html`<div class="card empty"><strong>Δεν έχει ανέβει κίνηση λογαριασμού</strong>Κατεβάστε τις κινήσεις σε CSV από το e-banking του πελάτη και ανεβάστε τες εδώ.</div>`}`;
}

function uploadsView(c: Client, origin: string) {
  const ups = db.prepare('SELECT * FROM uploads WHERE client_id = ? ORDER BY id DESC').all(c.id) as { id: number; filename: string; created_at: string; extracted_json: string | null; error: string | null }[];
  const link = `${origin}/u/${c.upload_token}`;
  return html`<div class="card pad stack">
      <div><strong>Σύνδεσμος για τον πελάτη</strong><div class="muted small">Στείλτε τον με Viber ή email. Ο πελάτης ανεβάζει φωτογραφίες αποδείξεων χωρίς κωδικό.</div></div>
      <div class="copy"><input readonly value="${link}" aria-label="Σύνδεσμος πελάτη" onclick="this.select()">
        <button type="button" class="btn btn-secondary" onclick="navigator.clipboard.writeText(this.previousElementSibling.value);this.lastChild.textContent=' Αντιγράφηκε'">${icon('copy')}<span> Αντιγραφή</span></button></div>
    </div>
    <h2>Έγγραφα <span class="count">${ups.length}</span></h2>
    ${ups.length
      ? html`<div class="card table-wrap"><table><tr><th>Αρχείο</th><th>Στοιχεία</th><th>myDATA</th></tr>
      ${ups.map((u) => {
        const x = u.extracted_json ? (JSON.parse(u.extracted_json) as Extracted) : undefined;
        const inMyData = x?.issuerVat && x.total != null
          ? db.prepare('SELECT mark FROM invoices WHERE client_id = ? AND issuer_vat = ? AND ABS(gross - ?) < 0.02').get(c.id, x.issuerVat, x.total) as { mark: string } | undefined
          : undefined;
        return html`<tr><td><a href="/clients/${c.id}/uploads/${u.id}" target="_blank">${u.filename}</a><div class="muted small">${u.created_at}</div></td>
          <td>${x ? html`<strong>${x.docType}</strong> · ${x.issuerName ?? '—'} <span class="muted">(ΑΦΜ ${x.issuerVat ?? '—'})</span> · ${grDate(x.date)} · <span class="amount">${x.total != null ? eur(x.total) : '—'}</span>
              <div class="muted small">${x.summary}${x.category ? ` · ${categoryLabels[x.category] ?? x.category}` : ''}</div>`
            : u.error ? html`<span class="badge b-bad">${icon('alert')}Δεν διαβάστηκε</span><div class="muted small">${u.error}</div>` : html`<span class="badge b-muted">${icon('clock')}Ανάγνωση…</span>`}</td>
          <td>${!x ? '' : inMyData ? html`<span class="badge b-ok">${icon('check')}ΜΑΡΚ ${inMyData.mark}</span>` : html`<span class="badge b-warn">${icon('alert')}Δεν βρέθηκε</span>`}</td></tr>`;
      })}</table></div>`
      : html`<div class="card empty"><strong>Δεν έχουν ανέβει έγγραφα ακόμη</strong>Μόλις ο πελάτης ανεβάσει αποδείξεις, θα εμφανιστούν εδώ με τα στοιχεία τους.</div>`}`;
}

// ---------- office dashboard ----------
const MISSING_DOC = `u.extracted_json IS NOT NULL AND NOT EXISTS (SELECT 1 FROM invoices i WHERE i.client_id = u.client_id
  AND i.issuer_vat = json_extract(u.extracted_json, '$.issuerVat') AND ABS(i.gross - json_extract(u.extracted_json, '$.total')) < 0.02)`;
const stripSign = (label: string | undefined) => (label ?? '').replace(' (-) / (+)', '');
const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

function dashboardView() {
  const clients = db.prepare(`SELECT c.*,
      (SELECT COUNT(*) FROM invoices i WHERE i.client_id = c.id AND i.status IN ('new','suggested','error')) pending,
      (SELECT COUNT(*) FROM invoices i WHERE i.client_id = c.id AND i.status = 'sent') sent,
      (SELECT COUNT(*) FROM invoices i WHERE i.client_id = c.id AND i.status != 'cancelled') total,
      (SELECT COALESCE(SUM(gross), 0) FROM invoices i WHERE i.client_id = c.id AND i.status != 'cancelled') gross,
      (SELECT MAX(issue_date) FROM invoices i WHERE i.client_id = c.id) last_date,
      (SELECT COUNT(*) FROM bank_lines b WHERE b.client_id = c.id AND b.amount < 0 AND b.matched_mark IS NULL) unpaid,
      (SELECT COUNT(*) FROM uploads u WHERE u.client_id = c.id AND ${MISSING_DOC}) missing
    FROM clients c ORDER BY pending DESC, name`).all() as (Client & { pending: number; sent: number; total: number; gross: number; last_date: string | null; unpaid: number; missing: number })[];
  const ready = new Map<number, number>();
  for (const row of db.prepare(`SELECT * FROM invoices WHERE status = 'suggested'`).all() as InvoiceRow[]) if (isReady(row)) ready.set(row.client_id, (ready.get(row.client_id) ?? 0) + 1);
  const sum = (k: 'pending' | 'sent' | 'unpaid' | 'missing') => clients.reduce((t, c) => t + c[k], 0);

  type Alert = { kind: Raw; cid: number; client: string; text: string; sub: string; amount: number | null; tab: string };
  const alerts: Alert[] = [
    ...(db.prepare(`SELECT i.issuer_name, i.issuer_vat, i.gross, i.error, c.id cid, c.name FROM invoices i JOIN clients c ON c.id = i.client_id WHERE i.status = 'error' ORDER BY i.issue_date DESC LIMIT 5`).all() as { issuer_name: string; issuer_vat: string; gross: number; error: string; cid: number; name: string }[])
      .map((a) => ({ kind: html`<span class="badge b-bad">${icon('alert')}Απορρίφθηκε</span>`, cid: a.cid, client: a.name, text: a.issuer_name || `ΑΦΜ ${a.issuer_vat}`, sub: a.error, amount: a.gross, tab: 'invoices' })),
    ...(db.prepare(`SELECT b.date, b.description, b.amount, c.id cid, c.name FROM bank_lines b JOIN clients c ON c.id = b.client_id WHERE b.amount < 0 AND b.matched_mark IS NULL ORDER BY b.date DESC LIMIT 5`).all() as { date: string; description: string; amount: number; cid: number; name: string }[])
      .map((a) => ({ kind: html`<span class="badge b-warn">${icon('alert')}Πληρωμή χωρίς παραστατικό</span>`, cid: a.cid, client: a.name, text: a.description, sub: grDate(a.date), amount: a.amount, tab: 'bank' })),
    ...(db.prepare(`SELECT u.filename, json_extract(u.extracted_json, '$.issuerName') issuer, json_extract(u.extracted_json, '$.total') total, c.id cid, c.name FROM uploads u JOIN clients c ON c.id = u.client_id WHERE ${MISSING_DOC} ORDER BY u.id DESC LIMIT 5`).all() as { filename: string; issuer: string | null; total: number | null; cid: number; name: string }[])
      .map((a) => ({ kind: html`<span class="badge b-ai">${icon('upload')}Απόδειξη εκτός myDATA</span>`, cid: a.cid, client: a.name, text: a.issuer ?? a.filename, sub: a.filename, amount: a.total, tab: 'docs' })),
  ];

  const demoBox = hasDemo()
    ? ''
    : html`<div class="banner banner-ok" style="margin-bottom:16px">${icon('spark')}<div style="flex:1"><strong>Δείτε το N2X με δεδομένα επίδειξης</strong>
        <p>Φορτώνει 4 πελάτες με παραστατικά, πληρωμές και αποδείξεις. Η αποστολή στο myDATA γίνεται εικονικά. Τα αφαιρείτε με ένα κλικ.</p></div>
        <form method="post" action="/demo"><button class="btn btn-primary">Φόρτωση demo</button></form></div>`;

  return html`<div class="page-head"><div><h1>Πίνακας ελέγχου</h1><div class="muted small" style="margin-top:4px">${new Date().toLocaleDateString('el-GR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
      <div class="head-actions">
        <details class="dropdown"><summary class="btn btn-primary">+ Νέος πελάτης</summary>
          <form method="post" action="/clients" class="card pad form-grid menu">
            <label class="field">Επωνυμία<input name="name" required></label>
            <label class="field">ΑΦΜ<input name="vat" required pattern="\\d{9}" inputmode="numeric" maxlength="9"></label>
            <label class="field"><span>Χρήστης myDATA <span class="muted">(προαιρετικό)</span></span><input name="user" autocomplete="off"></label>
            <label class="field"><span>Subscription key <span class="muted">(προαιρετικό)</span></span><input name="key" type="password" autocomplete="off"></label>
            <p class="muted small" style="margin:0">Χωρίς δικά του στοιχεία, χρησιμοποιούνται τα στοιχεία του γραφείου ως εξουσιοδοτημένου λογιστή.</p>
            <button class="btn btn-primary">Προσθήκη πελάτη</button>
          </form></details>
      </div></div>
    ${demoBox}
    <div class="stats">
      <div class="card stat"><div class="label">Πελάτες</div><div class="value amount">${clients.length}</div></div>
      <div class="card stat"><div class="label">Προς χαρακτηρισμό</div><div class="value amount">${sum('pending')}</div></div>
      <div class="card stat"><div class="label">Έτοιμα για αποστολή</div><div class="value amount">${[...ready.values()].reduce((t, n) => t + n, 0)}</div></div>
      <div class="card stat"><div class="label">Απεσταλμένα</div><div class="value amount">${sum('sent')}</div></div>
      <div class="card stat"><div class="label">Πληρωμές χωρίς παραστατικό</div><div class="value amount">${sum('unpaid')}</div></div>
      <div class="card stat"><div class="label">Αποδείξεις εκτός myDATA</div><div class="value amount">${sum('missing')}</div></div>
    </div>

    <div class="card table-wrap"><div class="card-title">Πελάτες <span class="count">${clients.length}</span></div>
    ${clients.length
      ? html`<table><tr><th>Πελάτης</th><th class="num">Εκκρεμή</th><th class="num">Έτοιμα</th><th>Πρόοδος χαρακτηρισμού</th><th class="num">Πληρωμές χ. παρ.</th><th class="num">Αποδ. εκτός myDATA</th><th class="num">Σύνολο εξόδων</th><th>Τελευταίο παρ.</th></tr>
        ${clients.map((c) => html`<tr class="client-row">
          <td><a href="/clients/${c.id}">${c.name}</a><div class="sub">ΑΦΜ ${c.vat}${c.mydata_user === DEMO_USER ? ' · demo' : ''}</div></td>
          <td class="num">${c.pending ? html`<span class="badge b-warn">${c.pending}</span>` : html`<span class="badge b-ok">${icon('check')}0</span>`}</td>
          <td class="num">${ready.get(c.id) ?? 0}</td>
          <td><div class="progress" title="${c.sent} από ${c.total} απεσταλμένα"><span style="width:${pct(c.sent, c.total)}%"></span></div><div class="sub">${pct(c.sent, c.total)}% · ${c.sent}/${c.total}</div></td>
          <td class="num">${c.unpaid ? html`<a href="/clients/${c.id}?tab=bank">${c.unpaid}</a>` : '0'}</td>
          <td class="num">${c.missing ? html`<a href="/clients/${c.id}?tab=docs">${c.missing}</a>` : '0'}</td>
          <td class="num">${eur(c.gross)}</td>
          <td>${grDate(c.last_date)}</td></tr>`)}</table>`
      : html`<div class="empty"><strong>Κανένας πελάτης ακόμη</strong>Πατήστε «+ Νέος πελάτης» ή φορτώστε τα δεδομένα επίδειξης.</div>`}
    </div>

    <h2>Χρειάζονται προσοχή <span class="count">${alerts.length}</span></h2>
    ${alerts.length
      ? html`<div class="card table-wrap"><table><tr><th>Θέμα</th><th>Πελάτης</th><th>Λεπτομέρειες</th><th class="num">Ποσό</th><th></th></tr>
        ${alerts.map((a) => html`<tr><td>${a.kind}</td><td>${a.client}</td><td>${a.text}<div class="sub">${a.sub}</div></td>
          <td class="num">${a.amount == null ? '—' : eur(a.amount)}</td><td class="num"><a href="/clients/${a.cid}?tab=${a.tab}">Άνοιγμα →</a></td></tr>`)}</table></div>`
      : html`<div class="card empty"><strong>Όλα εντάξει</strong>Δεν υπάρχουν απορρίψεις, ασυμφωνίες πληρωμών ή αποδείξεις εκτός myDATA.</div>`}

    ${hasDemo() ? html`<form method="post" action="/demo/delete" style="margin-top:24px" onsubmit="return confirm('Να αφαιρεθούν όλα τα δεδομένα επίδειξης;')"><button class="btn btn-secondary">Αφαίρεση δεδομένων επίδειξης</button></form>` : ''}`;
}

function reportsView(c: Client) {
  const rows = db.prepare(`SELECT * FROM invoices WHERE client_id = ? AND status != 'cancelled'`).all(c.id) as InvoiceRow[];
  if (!rows.length) return html`<div class="card empty"><strong>Δεν υπάρχουν δεδομένα ακόμη</strong>Οι αναφορές γεμίζουν μόλις φέρετε παραστατικά από το myDATA.</div>`;
  const byCat = new Map<string, number>();
  let pendingNet = 0;
  for (const r of rows) {
    if (r.status !== 'sent') { pendingNet += r.net; continue; }
    const s = r.suggestion_json ? (JSON.parse(r.suggestion_json) as Suggestion) : undefined;
    for (const l of JSON.parse(r.lines_json) as Line[]) {
      const cat = s?.lines.find((x) => x.lineNumber === l.lineNumber)?.category || '—';
      byCat.set(cat, (byCat.get(cat) ?? 0) + l.netValue);
    }
  }
  const cats = [...byCat].sort((a, b) => b[1] - a[1]);
  const catMax = Math.max(...cats.map(([, v]) => v), 1);
  const catTotal = cats.reduce((t, [, v]) => t + v, 0);
  const suppliers = db.prepare(`SELECT issuer_vat, MAX(issuer_name) name, COUNT(*) n, SUM(net) net, SUM(vat) vat, SUM(gross) gross, MAX(issue_date) last FROM invoices
    WHERE client_id = ? AND status != 'cancelled' GROUP BY issuer_vat ORDER BY gross DESC LIMIT 10`).all(c.id) as { issuer_vat: string; name: string; n: number; net: number; vat: number; gross: number; last: string }[];
  const months = db.prepare(`SELECT substr(issue_date, 1, 7) month, COUNT(*) n, SUM(net) net, SUM(vat) vat, SUM(gross) gross FROM invoices
    WHERE client_id = ? AND status != 'cancelled' GROUP BY month ORDER BY month DESC LIMIT 12`).all(c.id) as { month: string; n: number; net: number; vat: number; gross: number }[];
  const monthMax = Math.max(...months.map((m) => m.gross), 1);
  const total = (k: 'net' | 'vat' | 'gross') => rows.reduce((t, r) => t + r[k], 0);
  const monthName = (m: string) => new Date(`${m}-01T00:00:00`).toLocaleDateString('el-GR', { month: 'long', year: 'numeric' });

  return html`
    <div class="stats">
      <div class="card stat"><div class="label">Παραστατικά</div><div class="value amount">${rows.length}</div></div>
      <div class="card stat"><div class="label">Καθαρή αξία</div><div class="value amount">${eur(total('net'))}</div></div>
      <div class="card stat"><div class="label">ΦΠΑ εισροών</div><div class="value amount">${eur(total('vat'))}</div></div>
      <div class="card stat"><div class="label">Συνολική αξία</div><div class="value amount">${eur(total('gross'))}</div></div>
    </div>
    <div class="grid-even">
      <div class="card table-wrap"><div class="card-title">Έξοδα ανά κατηγορία <span class="muted small">απεσταλμένα</span></div>
        ${cats.length ? html`<table><tr><th>Κατηγορία</th><th class="num">Καθαρό</th><th class="num">%</th><th></th></tr>
          ${cats.map(([cat, v]) => html`<tr><td>${stripSign(categoryLabels[cat]) || 'Χωρίς κατηγορία'}</td><td class="num">${eur(v)}</td><td class="num">${pct(v, catTotal)}%</td>
            <td><div class="bar" title="${stripSign(categoryLabels[cat])}: ${eur(v)}"><span style="width:${Math.round((v / catMax) * 100)}%"></span></div></td></tr>`)}
          ${pendingNet ? html`<tr><td class="muted">Δεν έχουν χαρακτηριστεί ακόμη</td><td class="num muted">${eur(pendingNet)}</td><td></td><td></td></tr>` : ''}</table>`
          : html`<div class="empty">Δεν έχουν σταλεί χαρακτηρισμοί ακόμη.</div>`}
      </div>
      <div class="card table-wrap"><div class="card-title">Ανά μήνα</div>
        <table><tr><th>Μήνας</th><th class="num">Παρ.</th><th class="num">ΦΠΑ</th><th class="num">Σύνολο</th><th></th></tr>
        ${months.map((m) => html`<tr><td>${monthName(m.month)}</td><td class="num">${m.n}</td><td class="num">${eur(m.vat)}</td><td class="num">${eur(m.gross)}</td>
          <td><div class="bar" title="${monthName(m.month)}: ${eur(m.gross)}"><span style="width:${Math.round((m.gross / monthMax) * 100)}%"></span></div></td></tr>`)}</table>
      </div>
    </div>
    <h2>Κύριοι προμηθευτές</h2>
    <div class="card table-wrap"><table><tr><th>Προμηθευτής</th><th class="num">Παραστατικά</th><th class="num">Καθαρό</th><th class="num">ΦΠΑ</th><th class="num">Σύνολο</th><th>Τελευταίο</th></tr>
      ${suppliers.map((s) => html`<tr><td>${s.name || '—'}<div class="sub">ΑΦΜ ${s.issuer_vat}</div></td><td class="num">${s.n}</td><td class="num">${eur(s.net)}</td><td class="num">${eur(s.vat)}</td><td class="num">${eur(s.gross)}</td><td>${grDate(s.last)}</td></tr>`)}</table></div>`;
}

// ---------- routing ----------
async function form(req: IncomingMessage, url: URL) {
  return new Request(url, { method: 'POST', headers: req.headers as HeadersInit, body: Readable.toWeb(req) as ReadableStream, duplex: 'half' } as RequestInit).formData();
}
const MAX_BODY = 25 * 1024 * 1024;

async function handle(req: IncomingMessage, res: ServerResponse) {
  const origin = `${req.headers['x-forwarded-proto'] ?? 'http'}://${req.headers.host}`;
  const url = new URL(req.url ?? '/', origin);
  const send = (body: Raw | string, status = 200) => { res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(body instanceof Raw ? body.s : body); };
  const redirect = (to: string) => { res.writeHead(303, { Location: to }); res.end(); };
  const p = url.pathname.split('/').filter(Boolean);
  if (req.method === 'POST' && Number(req.headers['content-length'] ?? 0) > MAX_BODY) return send('Πολύ μεγάλο αρχείο', 413);

  // Public: client document upload
  if (p[0] === 'u' && p[1]) {
    const c = db.prepare('SELECT * FROM clients WHERE upload_token = ?').get(p[1]) as Client | undefined;
    if (!c) return send(page('Μη έγκυρος σύνδεσμος', html`${brandBlock}<div class="card pad empty"><strong>Μη έγκυρος σύνδεσμος</strong>Ζητήστε νέο σύνδεσμο από το λογιστήριό σας.</div>`, { bare: true }), 404);
    let ok = '', bad = '';
    if (req.method === 'POST') {
      const files = (await form(req, url)).getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
      let saved = 0;
      for (const f of files) {
        if (!ACCEPTED.includes(f.type)) { bad = `Το ${f.name} δεν είναι φωτογραφία ή PDF`; continue; }
        const path = `${DATA_DIR}/uploads/${randomBytes(12).toString('hex')}`;
        await writeFile(path, Buffer.from(await f.arrayBuffer()));
        const { lastInsertRowid } = db.prepare('INSERT INTO uploads (client_id, filename, path, mime) VALUES (?, ?, ?, ?)').run(c.id, f.name, path, f.type);
        void extractUpload(Number(lastInsertRowid), path, f.type);
        saved++;
      }
      if (saved) ok = `Ευχαριστούμε! Λάβαμε ${saved} ${saved === 1 ? 'αρχείο' : 'αρχεία'}.`;
    }
    return send(page('Αποστολή εγγράφων', html`${brandBlock}
      <div class="card pad stack">
        <div><h1 style="font-size:20px">${c.name}</h1><p class="muted" style="margin:6px 0 0">Ανεβάστε φωτογραφίες ή PDF από αποδείξεις και τιμολόγια για το λογιστήριό σας.</p></div>
        ${ok ? html`<div class="banner banner-ok">${icon('check')}<p>${ok}</p></div>` : ''}
        ${bad ? html`<div class="banner banner-bad">${icon('alert')}<p>${bad}</p></div>` : ''}
        <form method="post" enctype="multipart/form-data" class="stack">
          <label class="drop">${icon('upload')}<strong>Πατήστε για φωτογραφία ή αρχείο</strong><span class="muted small">Μπορείτε να διαλέξετε πολλά μαζί</span><span class="chosen"></span>
            <input class="sr-only" type="file" name="files" multiple accept="image/*,application/pdf" required onchange="${PICK_JS}"></label>
          <button class="btn btn-primary btn-lg" style="width:100%">Αποστολή</button>
        </form>
      </div>`, { bare: true }));
  }

  if (p[0] === 'logout') {
    res.writeHead(303, { Location: '/login', 'Set-Cookie': 's=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
    return res.end();
  }

  if (p[0] === 'login') {
    let failed = false;
    if (req.method === 'POST') {
      const pw = String((await form(req, url)).get('password') ?? '');
      if (process.env.APP_PASSWORD && safeEq(pw, process.env.APP_PASSWORD)) {
        res.writeHead(303, { Location: '/', 'Set-Cookie': `s=${sessionValue()}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000${origin.startsWith('https') ? '; Secure' : ''}` });
        return res.end();
      }
      failed = true;
    }
    return send(page('Σύνδεση', html`${brandBlock}<form method="post" class="card pad stack">
      <div><h1 style="font-size:20px">Σύνδεση</h1><p class="muted small" style="margin:4px 0 0">Είσοδος στο γραφείο σας</p></div>
      ${failed ? html`<div class="banner banner-bad">${icon('alert')}<p>Λάθος κωδικός</p></div>` : ''}
      <label class="field">Κωδικός γραφείου<input type="password" name="password" required autofocus style="width:100%"></label>
      <button class="btn btn-primary" style="width:100%">Είσοδος</button></form>`, { bare: true }));
  }
  if (!loggedIn(req)) return redirect('/login');

  if (req.method === 'POST' && p[0] === 'demo') {
    if (p[1] === 'delete') deleteDemo(); else seedDemo();
    return redirect('/');
  }

  if (p.length === 0) return send(page('Πίνακας ελέγχου', dashboardView()));

  if (p[0] === 'clients' && req.method === 'POST' && p.length === 1) {
    const f = await form(req, url);
    const vat = String(f.get('vat') ?? '').trim();
    if (!/^\d{9}$/.test(vat)) return send(errorPage('Το ΑΦΜ πρέπει να έχει 9 ψηφία.', '/'), 400);
    const key = String(f.get('key') ?? '');
    db.prepare('INSERT INTO clients (name, vat, mydata_user, mydata_key_enc, upload_token) VALUES (?, ?, ?, ?, ?)')
      .run(String(f.get('name')).trim(), vat, String(f.get('user') ?? '') || null, key ? encrypt(key) : null, randomBytes(16).toString('hex'));
    return redirect('/');
  }

  const c = p[0] === 'clients' ? getClient(Number(p[1])) : undefined;
  if (!c) return send(page('Δεν βρέθηκε', html`<div class="card empty"><strong>Δεν βρέθηκε</strong><a href="/">← Πελάτες</a></div>`), 404);
  const back = `/clients/${c.id}${url.searchParams.get('tab') ? `?tab=${url.searchParams.get('tab')}` : ''}`;

  if (req.method === 'POST' && p[2] === 'sync') {
    const f = await form(req, url);
    try {
      const creds = credsFor(c);
      const { invoices, cancelled } = creds.user === DEMO_USER ? demoFetch(c.id) : await fetchReceivedInvoices(creds, toMyDataDate(String(f.get('from'))), toMyDataDate(String(f.get('to'))));
      const ins = db.prepare(`INSERT OR IGNORE INTO invoices (mark, client_id, issuer_vat, issuer_name, issuer_country, series, aa, issue_date, invoice_type, net, vat, gross, lines_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
      for (const i of invoices) ins.run(i.mark, c.id, i.issuerVat, i.issuerName, i.issuerCountry, i.series, i.aa, i.issueDate, i.invoiceType, i.net, i.vat, i.gross, JSON.stringify(i.lines));
      for (const m of cancelled) db.prepare(`UPDATE invoices SET status = 'cancelled' WHERE mark = ? AND client_id = ?`).run(m, c.id);
      void suggestPending(c.id);
      return redirect(back);
    } catch (e) {
      return send(errorPage((e as Error).message, back), 502);
    }
  }

  if (req.method === 'POST' && p[2] === 'invoices' && p[4] === 'send') {
    const r = db.prepare('SELECT * FROM invoices WHERE mark = ? AND client_id = ?').get(p[3], c.id) as InvoiceRow | undefined;
    if (!r) return send(errorPage('Το παραστατικό δεν βρέθηκε.', back), 404);
    const f = await form(req, url);
    const chosen = (JSON.parse(r.lines_json) as Line[]).map((l) => {
      const [category, type] = String(f.get(`l_${l.lineNumber}`) ?? '').split('|');
      return { lineNumber: l.lineNumber, category: category ?? '', type: type || null, vatType: String(f.get(`v_${l.lineNumber}`) ?? '') || null, reason: '' };
    });
    const err = await sendInvoice(c, r, chosen).catch((e: Error) => e.message);
    if (err) db.prepare('UPDATE invoices SET error = ? WHERE mark = ?').run(err, r.mark);
    return redirect(back);
  }

  if (req.method === 'POST' && p[2] === 'send-all') {
    const rows = db.prepare(`SELECT * FROM invoices WHERE client_id = ? AND status = 'suggested' AND suggestion_json IS NOT NULL`).all(c.id) as InvoiceRow[];
    for (const r of rows) {
      if (!isReady(r)) continue;
      const err = await sendInvoice(c, r, (JSON.parse(r.suggestion_json!) as Suggestion).lines).catch((e: Error) => e.message);
      if (err) db.prepare('UPDATE invoices SET error = ? WHERE mark = ?').run(err, r.mark);
    }
    return redirect(back);
  }

  if (req.method === 'POST' && p[2] === 'bank') {
    const file = (await form(req, url)).get('file');
    if (!(file instanceof File)) return send(errorPage('Λείπει το αρχείο.', `/clients/${c.id}?tab=bank`), 400);
    let lines;
    try { lines = parseStatement(await file.text()); } catch (e) { return send(errorPage((e as Error).message, `/clients/${c.id}?tab=bank`), 400); }
    const payables = db.prepare(`SELECT mark, issue_date issueDate, gross, issuer_name issuerName FROM invoices WHERE client_id = ? AND status != 'cancelled' AND mark NOT IN (SELECT matched_mark FROM bank_lines WHERE matched_mark IS NOT NULL)`).all(c.id) as { mark: string; issueDate: string; gross: number; issuerName: string }[];
    const matches = matchPayments(lines, payables);
    const ins = db.prepare('INSERT INTO bank_lines (client_id, date, description, amount, matched_mark) VALUES (?, ?, ?, ?, ?)');
    lines.forEach((l, i) => ins.run(c.id, l.date, l.description, l.amount, matches.get(i) ?? null));
    return redirect(`/clients/${c.id}?tab=bank`);
  }

  if (p[2] === 'uploads' && p[3]) {
    const u = db.prepare('SELECT * FROM uploads WHERE id = ? AND client_id = ?').get(Number(p[3]), c.id) as { path: string; mime: string } | undefined;
    if (!u) return send(errorPage('Το αρχείο δεν βρέθηκε.', `/clients/${c.id}?tab=docs`), 404);
    res.writeHead(200, { 'Content-Type': u.mime, 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'inline' });
    return res.end(await readFile(u.path));
  }

  const tab = url.searchParams.get('tab') ?? 'invoices';
  const n = (sql: string) => (db.prepare(sql).get(c.id) as { n: number }).n;
  const tabs = [
    ['invoices', 'Χαρακτηρισμός εξόδων', n(`SELECT COUNT(*) n FROM invoices WHERE client_id = ? AND status IN ('new','suggested','error')`)],
    ['bank', 'Τράπεζα', n('SELECT COUNT(*) n FROM bank_lines WHERE client_id = ? AND amount < 0 AND matched_mark IS NULL')],
    ['docs', 'Έγγραφα πελάτη', n('SELECT COUNT(*) n FROM uploads WHERE client_id = ?')],
    ['reports', 'Αναφορές', 0],
  ] as const;
  return send(page(c.name, html`<div class="page-head"><div><div class="crumb"><a href="/">Πίνακας ελέγχου</a> / Πελάτες</div><h1>${c.name}</h1>
      <div class="muted small" style="margin-top:4px">ΑΦΜ ${c.vat}</div></div></div>
    <nav class="tabs">${tabs.map(([k, label, count]) => html`<a href="/clients/${c.id}?tab=${k}" ${new Raw(k === tab ? 'aria-current="page"' : '')}>${label}${count ? html`<span class="count">${count}</span>` : ''}</a>`)}</nav>
    ${tab === 'bank' ? bankView(c) : tab === 'docs' ? uploadsView(c, origin) : tab === 'reports' ? reportsView(c) : invoicesView(c)}`));
}

export function start(port: number) {
  if (!process.env.APP_PASSWORD || !process.env.APP_SECRET) throw new Error('Set APP_PASSWORD and APP_SECRET');
  return createServer((req, res) => handle(req, res).catch((e) => {
    console.error(e);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Σφάλμα διακομιστή');
  })).listen(port);
}

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { db, DATA_DIR, encrypt, decrypt } from './db.ts';
import { fetchReceivedInvoices, buildExpensesXml, sendExpensesClassification, toMyDataDate, type Creds, type Invoice, type Line } from './mydata.ts';
import { suggest, isValid, allowedFor, categoryLabels, typeLabels, VAT_TYPES, type Suggestion } from './classify.ts';
import { parseStatement, matchPayments } from './bank.ts';
import { extract, ACCEPTED, type Extracted } from './receipts.ts';

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

const page = (title: string, body: Raw) => html`<!doctype html><html lang="el"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} · Λογιστής AI</title>
<style>
  :root { --bg:#f7f7f5; --fg:#1d1d1b; --muted:#6b6b66; --line:#e2e2dc; --card:#fff; --accent:#1f5eff; --ok:#16794c; --bad:#b42318; }
  @media (prefers-color-scheme: dark) { :root { --bg:#141413; --fg:#ecece8; --muted:#9a9a93; --line:#2e2e2b; --card:#1c1c1a; --accent:#7aa2ff; --ok:#4cc38a; --bad:#ff8a80; } }
  * { box-sizing: border-box; } body { margin:0; font:15px/1.5 system-ui, sans-serif; background:var(--bg); color:var(--fg); }
  main { max-width: 1100px; margin: 0 auto; padding: 24px 16px 64px; } a { color: var(--accent); }
  h1 { font-size: 22px; margin: 0 0 4px; } h2 { font-size: 17px; margin: 32px 0 8px; } .muted { color: var(--muted); }
  section, .card { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 16px; margin: 12px 0; }
  table { width: 100%; border-collapse: collapse; } td, th { text-align: left; padding: 6px 8px; border-top: 1px solid var(--line); vertical-align: top; }
  th { font-weight: 600; color: var(--muted); font-size: 13px; } .num { text-align: right; white-space: nowrap; }
  input, select, button { font: inherit; padding: 6px 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--fg); max-width: 100%; }
  button { background: var(--accent); color: #fff; border: 0; cursor: pointer; } button.secondary { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
  .row { display: flex; gap: 8px; flex-wrap: wrap; align-items: end; } label { display: grid; gap: 2px; font-size: 13px; color: var(--muted); }
  .ok { color: var(--ok); } .bad { color: var(--bad); } .tag { font-size: 12px; padding: 1px 6px; border-radius: 99px; border: 1px solid var(--line); }
  .scroll { overflow-x: auto; } select.cls { width: 340px; }
</style></head><body><main>${body}</main></body></html>`;

// ---------- auth ----------
const sessionValue = () => createHmac('sha256', process.env.APP_SECRET ?? '').update(`session:${process.env.APP_PASSWORD}`).digest('hex');
const safeEq = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const loggedIn = (req: IncomingMessage) => safeEq(/(?:^|;\s*)s=([a-f0-9]+)/.exec(req.headers.cookie ?? '')?.[1] ?? '', sessionValue());

// ---------- data ----------
const getClient = (id: number) => db.prepare('SELECT * FROM clients WHERE id = ?').get(id) as Client | undefined;

function credsFor(c: Client): Creds {
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
  if (bad) return `Γραμμή ${bad.lineNumber}: μη έγκυρος χαρακτηρισμός`;
  const creds = credsFor(c);
  const res = await sendExpensesClassification(creds, buildExpensesXml(inv.mark, creds.entityVat, lines));
  if (res.error) {
    db.prepare(`UPDATE invoices SET status = 'error', error = ? WHERE mark = ?`).run(res.error, inv.mark);
    return res.error;
  }
  db.prepare(`UPDATE invoices SET status = 'sent', classification_mark = ?, error = NULL WHERE mark = ?`).run(res.classificationMark ?? null, inv.mark);
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
function classificationSelect(inv: InvoiceRow, line: Line, s?: Suggestion['lines'][number]) {
  const current = s?.category ? `${s.category}|${s.type ?? ''}` : '';
  const groups = Object.entries(allowedFor(inv.invoice_type)).map(([c, types]) => html`<optgroup label="${categoryLabels[c]}">${
    (types.length ? types : ['']).map((t) => { const v = `${c}|${t}`; return html`<option value="${v}" ${new Raw(v === current ? 'selected' : '')}>${t ? `${t} · ${typeLabels[t] ?? ''}` : '(χωρίς τύπο Ε3)'}</option>`; })
  }</optgroup>`);
  const vatType = s?.category ? s.vatType : inv.issuer_country === 'GR' ? 'VAT_361' : null;
  const vat = line.vatAmount > 0
    ? html`<select name="v_${line.lineNumber}"><option value="">Χωρίς ΦΠΑ</option>${Object.entries(VAT_TYPES).map(([k, label]) => html`<option value="${k}" ${new Raw(k === vatType ? 'selected' : '')}>${k} · ${label}</option>`)}</select>`
    : '';
  return html`<div class="row"><select class="cls" name="l_${line.lineNumber}"><option value="">— Επιλογή —</option>${groups}</select>${vat}</div>
    ${s?.reason ? html`<div class="muted" style="font-size:13px">${s.reason}</div>` : ''}`;
}

function invoicesView(c: Client) {
  const rows = db.prepare(`SELECT * FROM invoices WHERE client_id = ? ORDER BY issue_date DESC`).all(c.id) as InvoiceRow[];
  const pending = rows.filter((r) => ['new', 'suggested', 'error'].includes(r.status));
  const sent = rows.filter((r) => r.status === 'sent');
  const ready = pending.filter((r) => r.suggestion_json && (JSON.parse(r.suggestion_json) as Suggestion).lines.every((l) => l.category)).length;
  return html`
    <section><form method="post" action="/clients/${c.id}/sync" class="row">
      <label>Από<input type="date" name="from" required value="${new Date(Date.now() - 31 * 86_400_000).toISOString().slice(0, 10)}"></label>
      <label>Έως<input type="date" name="to" required value="${new Date().toISOString().slice(0, 10)}"></label>
      <button>Λήψη παραστατικών από myDATA</button>
    </form>
    ${ready ? html`<form method="post" action="/clients/${c.id}/send-all" style="margin-top:12px"><button class="secondary">Αποστολή ${ready} έτοιμων χαρακτηρισμών</button></form>` : ''}
    </section>
    <h2>Προς χαρακτηρισμό (${pending.length})</h2>
    ${pending.length === 0 ? html`<p class="muted">Τίποτα εκκρεμές.</p>` : pending.map((r) => {
      const s = r.suggestion_json ? (JSON.parse(r.suggestion_json) as Suggestion) : undefined;
      const lines = JSON.parse(r.lines_json) as Line[];
      return html`<form class="card" method="post" action="/clients/${c.id}/invoices/${r.mark}/send">
        <div class="row" style="justify-content:space-between"><div><strong>${r.issuer_name || `ΑΦΜ ${r.issuer_vat}`}</strong>
          <span class="muted"> · ${r.issue_date} · ${r.series}/${r.aa} · τύπος ${r.invoice_type} · ΜΑΡΚ ${r.mark}</span></div>
          <div><strong>${eur(r.gross)}</strong> ${s ? html`<span class="tag">${s.source === 'history' ? 'από ιστορικό' : 'πρόταση AI'}</span>` : r.status === 'new' ? html`<span class="tag">σε επεξεργασία…</span>` : ''}</div></div>
        ${r.error ? html`<p class="bad">${r.error}</p>` : ''}
        <div class="scroll"><table><tr><th>Γρ.</th><th class="num">Καθαρό</th><th class="num">ΦΠΑ</th><th>Χαρακτηρισμός</th></tr>
        ${lines.map((l) => html`<tr><td>${l.lineNumber}${l.itemDescr ? html`<div class="muted">${l.itemDescr}</div>` : ''}</td><td class="num">${eur(l.netValue)}</td><td class="num">${eur(l.vatAmount)}</td>
          <td>${classificationSelect(r, l, s?.lines.find((x) => x.lineNumber === l.lineNumber))}</td></tr>`)}</table></div>
        <button style="margin-top:8px">Έγκριση & αποστολή</button></form>`;
    })}
    <details><summary>Απεσταλμένα (${sent.length})</summary><div class="scroll"><table><tr><th>Ημ/νία</th><th>Εκδότης</th><th class="num">Σύνολο</th><th>ΜΑΡΚ χαρακτηρισμού</th></tr>
      ${sent.map((r) => html`<tr><td>${r.issue_date}</td><td>${r.issuer_name || r.issuer_vat}</td><td class="num">${eur(r.gross)}</td><td class="ok">${r.classification_mark}</td></tr>`)}</table></div></details>`;
}

function bankView(c: Client) {
  const lines = db.prepare('SELECT b.*, i.issuer_name, i.issuer_vat, i.series, i.aa FROM bank_lines b LEFT JOIN invoices i ON i.mark = b.matched_mark WHERE b.client_id = ? ORDER BY b.date DESC').all(c.id) as { date: string; description: string; amount: number; matched_mark: string | null; issuer_name: string | null; issuer_vat: string | null; series: string | null; aa: string | null }[];
  const unpaid = db.prepare(`SELECT COUNT(*) n, COALESCE(SUM(gross), 0) total FROM invoices WHERE client_id = ? AND status != 'cancelled' AND mark NOT IN (SELECT matched_mark FROM bank_lines WHERE matched_mark IS NOT NULL)`).get(c.id) as { n: number; total: number };
  const out = lines.filter((l) => l.amount < 0);
  return html`<section><form method="post" action="/clients/${c.id}/bank" enctype="multipart/form-data" class="row">
      <label>Κίνηση λογαριασμού (CSV από e-banking)<input type="file" name="file" accept=".csv,text/csv" required></label><button>Συμφωνία</button></form>
    <p class="muted">Ταιριάζουν ${out.filter((l) => l.matched_mark).length} από ${out.length} πληρωμές. Παραστατικά χωρίς πληρωμή: ${unpaid.n} (${eur(unpaid.total)}).</p></section>
    ${lines.length ? html`<div class="scroll"><table><tr><th>Ημ/νία</th><th>Περιγραφή</th><th class="num">Ποσό</th><th>Παραστατικό</th></tr>
      ${lines.map((l) => html`<tr><td>${l.date}</td><td>${l.description}</td><td class="num">${eur(l.amount)}</td>
        <td>${l.matched_mark ? html`<span class="ok">✓ ${l.issuer_name || l.issuer_vat} ${l.series}/${l.aa}</span>` : l.amount < 0 ? html`<span class="bad">Χωρίς παραστατικό</span>` : html`<span class="muted">είσπραξη</span>`}</td></tr>`)}</table></div>` : ''}`;
}

function uploadsView(c: Client, origin: string) {
  const ups = db.prepare('SELECT * FROM uploads WHERE client_id = ? ORDER BY id DESC').all(c.id) as { id: number; filename: string; created_at: string; extracted_json: string | null; error: string | null }[];
  const link = `${origin}/u/${c.upload_token}`;
  return html`<section><p>Στείλτε στον πελάτη αυτόν τον σύνδεσμο (π.χ. με Viber) για να ανεβάζει φωτογραφίες αποδείξεων και τιμολογίων:</p>
    <p><input readonly value="${link}" style="width:100%" onclick="this.select()"></p></section>
    ${ups.length ? html`<div class="scroll"><table><tr><th>Αρχείο</th><th>Στοιχεία</th><th>myDATA</th></tr>
    ${ups.map((u) => {
      const x = u.extracted_json ? (JSON.parse(u.extracted_json) as Extracted) : undefined;
      const inMyData = x?.issuerVat && x.total != null
        ? db.prepare('SELECT mark FROM invoices WHERE client_id = ? AND issuer_vat = ? AND ABS(gross - ?) < 0.02').get(c.id, x.issuerVat, x.total) as { mark: string } | undefined
        : undefined;
      return html`<tr><td><a href="/clients/${c.id}/uploads/${u.id}" target="_blank">${u.filename}</a><div class="muted">${u.created_at}</div></td>
        <td>${x ? html`<strong>${x.docType}</strong> · ${x.issuerName ?? '-'} (ΑΦΜ ${x.issuerVat ?? '-'}) · ${x.date ?? '-'} · ${x.total != null ? eur(x.total) : '-'}<div class="muted">${x.summary}${x.category ? ` · ${categoryLabels[x.category] ?? x.category}` : ''}</div>` : u.error ? html`<span class="bad">${u.error}</span>` : html`<span class="muted">ανάγνωση…</span>`}</td>
        <td>${!x ? '' : inMyData ? html`<span class="ok">✓ ΜΑΡΚ ${inMyData.mark}</span>` : html`<span class="bad">Δεν βρέθηκε</span>`}</td></tr>`;
    })}</table></div>` : html`<p class="muted">Δεν έχουν ανέβει έγγραφα ακόμη.</p>`}`;
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
    if (!c) return send('Μη έγκυρος σύνδεσμος', 404);
    let msg = '';
    if (req.method === 'POST') {
      const files = (await form(req, url)).getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
      for (const f of files) {
        if (!ACCEPTED.includes(f.type)) { msg = `Το ${f.name} δεν είναι φωτογραφία ή PDF`; continue; }
        const path = `${DATA_DIR}/uploads/${randomBytes(12).toString('hex')}`;
        await writeFile(path, Buffer.from(await f.arrayBuffer()));
        const { lastInsertRowid } = db.prepare('INSERT INTO uploads (client_id, filename, path, mime) VALUES (?, ?, ?, ?)').run(c.id, f.name, path, f.type);
        void extractUpload(Number(lastInsertRowid), path, f.type);
      }
      msg ||= `Ευχαριστούμε! Λάβαμε ${files.length} αρχεία.`;
    }
    return send(page('Αποστολή εγγράφων', html`<h1>${c.name}</h1><p class="muted">Ανεβάστε φωτογραφίες ή PDF από αποδείξεις και τιμολόγια για το λογιστήριό σας.</p>
      ${msg ? html`<p class="ok">${msg}</p>` : ''}
      <form method="post" enctype="multipart/form-data" class="card"><input type="file" name="files" multiple accept="image/*,application/pdf" capture="environment" required>
      <p><button>Αποστολή</button></p></form>`));
  }

  if (p[0] === 'login') {
    if (req.method === 'POST') {
      const pw = String((await form(req, url)).get('password') ?? '');
      if (process.env.APP_PASSWORD && safeEq(pw, process.env.APP_PASSWORD)) {
        res.writeHead(303, { Location: '/', 'Set-Cookie': `s=${sessionValue()}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000${origin.startsWith('https') ? '; Secure' : ''}` });
        return res.end();
      }
    }
    return send(page('Σύνδεση', html`<h1>Λογιστής AI</h1><form method="post" class="card row"><label>Κωδικός γραφείου<input type="password" name="password" required autofocus></label><button>Είσοδος</button></form>`));
  }
  if (!loggedIn(req)) return redirect('/login');

  if (p.length === 0) {
    const clients = db.prepare(`SELECT c.*, (SELECT COUNT(*) FROM invoices i WHERE i.client_id = c.id AND i.status IN ('new','suggested','error')) pending FROM clients c ORDER BY name`).all() as (Client & { pending: number })[];
    return send(page('Πελάτες', html`<h1>Πελάτες</h1>
      <section><table><tr><th>Επωνυμία</th><th>ΑΦΜ</th><th class="num">Εκκρεμή παραστατικά</th></tr>
      ${clients.map((c) => html`<tr><td><a href="/clients/${c.id}">${c.name}</a></td><td>${c.vat}</td><td class="num">${c.pending}</td></tr>`)}</table></section>
      <h2>Νέος πελάτης</h2><form method="post" action="/clients" class="card row">
        <label>Επωνυμία<input name="name" required></label><label>ΑΦΜ<input name="vat" required pattern="\\d{9}"></label>
        <label>Χρήστης myDATA (προαιρετικό)<input name="user" autocomplete="off"></label><label>Subscription key (προαιρετικό)<input name="key" type="password" autocomplete="off"></label>
        <button>Προσθήκη</button></form>
      <p class="muted">Χωρίς δικά του στοιχεία myDATA, ο πελάτης χρησιμοποιεί τα στοιχεία του γραφείου (MYDATA_USER / MYDATA_KEY) ως εξουσιοδοτημένου λογιστή.</p>`));
  }

  if (p[0] === 'clients' && req.method === 'POST' && p.length === 1) {
    const f = await form(req, url);
    const vat = String(f.get('vat') ?? '').trim();
    if (!/^\d{9}$/.test(vat)) return send('Μη έγκυρο ΑΦΜ', 400);
    const key = String(f.get('key') ?? '');
    db.prepare('INSERT INTO clients (name, vat, mydata_user, mydata_key_enc, upload_token) VALUES (?, ?, ?, ?, ?)')
      .run(String(f.get('name')).trim(), vat, String(f.get('user') ?? '') || null, key ? encrypt(key) : null, randomBytes(16).toString('hex'));
    return redirect('/');
  }

  const c = p[0] === 'clients' ? getClient(Number(p[1])) : undefined;
  if (!c) return send('Δεν βρέθηκε', 404);
  const back = `/clients/${c.id}${url.searchParams.get('tab') ? `?tab=${url.searchParams.get('tab')}` : ''}`;

  if (req.method === 'POST' && p[2] === 'sync') {
    const f = await form(req, url);
    try {
      const { invoices, cancelled } = await fetchReceivedInvoices(credsFor(c), toMyDataDate(String(f.get('from'))), toMyDataDate(String(f.get('to'))));
      const ins = db.prepare(`INSERT OR IGNORE INTO invoices (mark, client_id, issuer_vat, issuer_name, issuer_country, series, aa, issue_date, invoice_type, net, vat, gross, lines_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
      for (const i of invoices) ins.run(i.mark, c.id, i.issuerVat, i.issuerName, i.issuerCountry, i.series, i.aa, i.issueDate, i.invoiceType, i.net, i.vat, i.gross, JSON.stringify(i.lines));
      for (const m of cancelled) db.prepare(`UPDATE invoices SET status = 'cancelled' WHERE mark = ? AND client_id = ?`).run(m, c.id);
      void suggestPending(c.id);
      return redirect(back);
    } catch (e) {
      return send(page('Σφάλμα', html`<p class="bad">${(e as Error).message}</p><a href="${back}">Πίσω</a>`), 502);
    }
  }

  if (req.method === 'POST' && p[2] === 'invoices' && p[4] === 'send') {
    const r = db.prepare('SELECT * FROM invoices WHERE mark = ? AND client_id = ?').get(p[3], c.id) as InvoiceRow | undefined;
    if (!r) return send('Δεν βρέθηκε', 404);
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
    const rows = db.prepare(`SELECT * FROM invoices WHERE client_id = ? AND status IN ('suggested','error') AND suggestion_json IS NOT NULL`).all(c.id) as InvoiceRow[];
    for (const r of rows) {
      const s = JSON.parse(r.suggestion_json!) as Suggestion;
      if (!s.lines.every((l) => l.category)) continue;
      const err = await sendInvoice(c, r, s.lines).catch((e: Error) => e.message);
      if (err) db.prepare('UPDATE invoices SET error = ? WHERE mark = ?').run(err, r.mark);
    }
    return redirect(back);
  }

  if (req.method === 'POST' && p[2] === 'bank') {
    const file = (await form(req, url)).get('file');
    if (!(file instanceof File)) return send('Λείπει αρχείο', 400);
    let lines;
    try { lines = parseStatement(await file.text()); } catch (e) { return send(page('Σφάλμα', html`<p class="bad">${(e as Error).message}</p><a href="${back}">Πίσω</a>`), 400); }
    const payables = db.prepare(`SELECT mark, issue_date issueDate, gross, issuer_name issuerName FROM invoices WHERE client_id = ? AND status != 'cancelled' AND mark NOT IN (SELECT matched_mark FROM bank_lines WHERE matched_mark IS NOT NULL)`).all(c.id) as { mark: string; issueDate: string; gross: number; issuerName: string }[];
    const matches = matchPayments(lines, payables);
    const ins = db.prepare('INSERT INTO bank_lines (client_id, date, description, amount, matched_mark) VALUES (?, ?, ?, ?, ?)');
    lines.forEach((l, i) => ins.run(c.id, l.date, l.description, l.amount, matches.get(i) ?? null));
    return redirect(`/clients/${c.id}?tab=bank`);
  }

  if (p[2] === 'uploads' && p[3]) {
    const u = db.prepare('SELECT * FROM uploads WHERE id = ? AND client_id = ?').get(Number(p[3]), c.id) as { path: string; mime: string } | undefined;
    if (!u) return send('Δεν βρέθηκε', 404);
    res.writeHead(200, { 'Content-Type': u.mime, 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'inline' });
    return res.end(await readFile(u.path));
  }

  const tab = url.searchParams.get('tab') ?? 'invoices';
  const tabs = { invoices: 'Χαρακτηρισμός εξόδων', bank: 'Τράπεζα', docs: 'Έγγραφα πελάτη' } as const;
  return send(page(c.name, html`<p><a href="/">← Πελάτες</a></p><h1>${c.name}</h1><p class="muted">ΑΦΜ ${c.vat}</p>
    <p class="row">${Object.entries(tabs).map(([k, label]) => (k === tab ? html`<strong>${label}</strong>` : html`<a href="/clients/${c.id}?tab=${k}">${label}</a>`))}</p>
    ${tab === 'bank' ? bankView(c) : tab === 'docs' ? uploadsView(c, origin) : invoicesView(c)}`));
}

export function start(port: number) {
  if (!process.env.APP_PASSWORD || !process.env.APP_SECRET) throw new Error('Set APP_PASSWORD and APP_SECRET');
  return createServer((req, res) => handle(req, res).catch((e) => {
    console.error(e);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Σφάλμα διακομιστή');
  })).listen(port);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  start(port);
  console.log(`Λογιστής AI: http://localhost:${port}`);
}

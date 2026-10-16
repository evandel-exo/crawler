import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { db, DATA_DIR } from './db.ts';
import type { Invoice, Line } from './mydata.ts';
import type { Suggestion } from './classify.ts';

/** Demo clients carry this as their myDATA user; sync and send are simulated for them. */
export const DEMO_USER = 'demo';

type Supplier = { vat: string; name: string; type: string; desc: string[]; net: number; vatCat: '1' | '2'; category: string; e3: string; vatType: string; reason: string };

// Fake ΑΦΜ (99…) so demo history can never pre-fill suggestions for real suppliers.
export const SUPPLIERS: Supplier[] = [
  { vat: '990000101', name: 'ΔΕΗ Α.Ε.', type: '1.1', desc: ['Λογαριασμός ρεύματος'], net: 180, vatCat: '1', category: 'category2_3', e3: 'E3_585_011', vatType: 'VAT_361', reason: 'Λογαριασμός ηλεκτρικού ρεύματος → Ενέργεια' },
  { vat: '990000102', name: 'COSMOTE', type: '2.1', desc: ['Σταθερή τηλεφωνία & internet'], net: 45, vatCat: '1', category: 'category2_3', e3: 'E3_585_013', vatType: 'VAT_361', reason: 'Πάροχος τηλεπικοινωνιών → Τηλεπικοινωνίες' },
  { vat: '990000103', name: 'ΜΕΤΡΟ ΑΕΒΕ', type: '1.1', desc: ['Καφές, ζάχαρη, γάλα', 'Αναλώσιμα καθαριότητας'], net: 410, vatCat: '2', category: 'category2_1', e3: 'E3_102_001', vatType: 'VAT_361', reason: 'Χονδρέμπορος τροφίμων → Αγορές εμπορευμάτων' },
  { vat: '990000104', name: 'ΕΥΔΑΠ Α.Ε.', type: '2.1', desc: ['Λογαριασμός νερού'], net: 38, vatCat: '1', category: 'category2_3', e3: 'E3_585_012', vatType: 'VAT_361', reason: 'Εταιρεία ύδρευσης → Ύδρευση' },
  { vat: '990000105', name: 'Ακίνητα Παππάς ΙΚΕ', type: '2.1', desc: ['Μίσθωμα καταστήματος'], net: 850, vatCat: '1', category: 'category2_3', e3: 'E3_585_014', vatType: 'VAT_361', reason: 'Μίσθωμα επαγγελματικού χώρου → Ενοίκια' },
  { vat: '990000106', name: 'Shell Hellas', type: '1.1', desc: ['Καύσιμα αυτοκινήτου'], net: 95, vatCat: '1', category: 'category2_4', e3: 'E3_585_016', vatType: 'VAT_361', reason: 'Καύσιμα επαγγελματικού οχήματος → Λοιπά έξοδα' },
  { vat: '990000107', name: 'ΠΛΑΙΣΙΟ COMPUTERS', type: '1.1', desc: ['Φορητός υπολογιστής'], net: 720, vatCat: '1', category: 'category2_7', e3: 'E3_882_001', vatType: 'VAT_362', reason: 'Εξοπλισμός πληροφορικής → Αγορά παγίου' },
  { vat: '990000108', name: 'Coca-Cola 3E', type: '1.1', desc: ['Αναψυκτικά'], net: 260, vatCat: '2', category: 'category2_1', e3: 'E3_102_001', vatType: 'VAT_361', reason: 'Προμηθευτής ποτών → Αγορές εμπορευμάτων' },
  { vat: '990000109', name: 'Γνώμων Τεχνική ΟΕ', type: '2.1', desc: ['Συντήρηση ψυκτικών'], net: 140, vatCat: '1', category: 'category2_3', e3: 'E3_585_009', vatType: 'VAT_361', reason: 'Τεχνική υπηρεσία → Λοιπές αμοιβές ημεδαπής' },
];

const CLIENTS = [
  { name: 'Καφέ Ακρόπολις ΙΚΕ', vat: '998000001', suppliers: [0, 1, 2, 4, 7, 8] },
  { name: 'Φούρνος Παπαδόπουλος ΟΕ', vat: '998000002', suppliers: [0, 2, 3, 5, 8] },
  { name: 'Ξενοδοχείο Αιγαίο ΑΕ', vat: '998000003', suppliers: [0, 1, 3, 4, 6, 7, 8] },
  { name: 'Ιατρείο Δρ. Νικολάου', vat: '998000004', suppliers: [0, 1, 4, 6] },
];

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const VAT_RATE = { '1': 0.24, '2': 0.13 } as const;
const r2 = (n: number) => Math.round(n * 100) / 100;
const day = (offset: number) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);
export const demoMark = () => `4${String(Date.now()).slice(-8)}${String(Math.floor(Math.random() * 1e6)).padStart(6, '0')}`;

function invoiceFor(s: Supplier, mark: string, date: string, seed: number): Invoice {
  const lines: Line[] = s.desc.map((d, i) => {
    const net = r2(s.net * (0.7 + ((seed * 7 + i * 13) % 10) / 15) / s.desc.length);
    return { lineNumber: i + 1, itemDescr: d, netValue: net, vatAmount: r2(net * VAT_RATE[s.vatCat]), vatCategory: s.vatCat };
  });
  const net = r2(lines.reduce((t, l) => t + l.netValue, 0)), vat = r2(lines.reduce((t, l) => t + l.vatAmount, 0));
  return { mark, issuerVat: s.vat, issuerName: s.name, issuerCountry: 'GR', series: 'Α', aa: String(1000 + seed), issueDate: date, invoiceType: s.type, net, vat, gross: r2(net + vat), lines };
}

const suggestionFor = (s: Supplier, inv: Invoice, source: Suggestion['source']): Suggestion => ({
  source,
  lines: inv.lines.map((l) => ({ lineNumber: l.lineNumber, category: s.category, type: s.e3, vatType: s.vatType, reason: source === 'history' ? 'Όπως το προηγούμενο παραστατικό του ίδιου προμηθευτή' : s.reason })),
});

export const hasDemo = () => !!db.prepare('SELECT 1 FROM clients WHERE mydata_user = ?').get(DEMO_USER);

export function seedDemo() {
  if (hasDemo()) return;
  const png = `${DATA_DIR}/uploads/demo-receipt.png`;
  writeFileSync(png, PNG);
  const insInv = db.prepare(`INSERT INTO invoices (mark, client_id, issuer_vat, issuer_name, issuer_country, series, aa, issue_date, invoice_type, net, vat, gross, lines_json, status, suggestion_json, classification_mark, error) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  const insHist = db.prepare('INSERT INTO history (issuer_vat, invoice_type, lines_json) VALUES (?, ?, ?)');
  const insBank = db.prepare('INSERT INTO bank_lines (client_id, date, description, amount, matched_mark) VALUES (?, ?, ?, ?, ?)');
  const insUp = db.prepare('INSERT INTO uploads (client_id, filename, path, mime, created_at, extracted_json) VALUES (?, ?, ?, ?, ?, ?)');
  let markSeq = 400_000_900_000_000;

  CLIENTS.forEach((cl, ci) => {
    const { lastInsertRowid } = db.prepare('INSERT INTO clients (name, vat, mydata_user, upload_token) VALUES (?, ?, ?, ?)').run(cl.name, cl.vat, DEMO_USER, randomBytes(16).toString('hex'));
    const clientId = Number(lastInsertRowid);
    let first: Invoice | undefined;

    cl.suppliers.forEach((si, k) => {
      const s = SUPPLIERS[si];
      // Monthly invoices for ~3 months; the older ones are already classified and paid.
      // Equipment is a one-off purchase; everything else is billed monthly.
      for (const age of s.category === 'category2_7' ? [52] : [82, 52, 22, 6].slice(k % 2)) {
        const inv = invoiceFor(s, String(markSeq++), day(age - k), ci * 31 + k * 7 + age);
        const sent = age > 30;
        const isLatest = age === 6;
        const variant = (ci + k) % 4;
        let status = 'sent', sug: Suggestion | null = suggestionFor(s, inv, 'history'), cmark: string | null = demoMark(), error: string | null = null;
        if (!sent) {
          cmark = null;
          status = 'suggested';
          if (isLatest && variant === 0) sug = { source: 'ai', lines: inv.lines.map((l) => ({ lineNumber: l.lineNumber, category: '', type: null, vatType: null, reason: 'Χρειάζεται χειροκίνητο χαρακτηρισμό' })) };
          else if (isLatest && variant === 1) { status = 'error'; error = 'myDATA: Το παραστατικό έχει ήδη χαρακτηριστεί από άλλο λογισμικό. Ελέγξτε τον χαρακτηρισμό στο myDATA.'; }
          else if (variant === 2) sug = suggestionFor(s, inv, 'ai');
        }
        insInv.run(inv.mark, clientId, inv.issuerVat, inv.issuerName, 'GR', inv.series, inv.aa, inv.issueDate, inv.invoiceType, inv.net, inv.vat, inv.gross, JSON.stringify(inv.lines), status, JSON.stringify(sug), cmark, error);
        if (sent) {
          insHist.run(inv.issuerVat, inv.invoiceType, JSON.stringify(sug!.lines));
          insBank.run(clientId, day(age - k - 9), `ΠΛΗΡΩΜΗ ${s.name}`, -inv.gross, inv.mark);
        }
        first ??= inv;
      }
    });

    insBank.run(clientId, day(18), 'ΑΓΟΡΑ POS ΚΑΤΑΣΤΗΜΑ 4021', -r2(64.3 + ci * 11), null);
    insBank.run(clientId, day(11), 'ΜΕΤΑΦΟΡΑ ΣΕ ΤΡΙΤΟ ΛΟΓ/ΣΜΟ', -r2(300 + ci * 45), null);
    insBank.run(clientId, day(25), 'ΚΑΤΑΘΕΣΗ POS ΠΩΛΗΣΕΙΣ', r2(2450 + ci * 380), null);
    insBank.run(clientId, day(9), 'ΚΑΤΑΘΕΣΗ ΜΕΤΡΗΤΩΝ', r2(800 + ci * 120), null);

    const uploads: [string, number, object][] = [
      [`timologio-${first!.issuerName.split(' ')[0].toLowerCase()}.jpg`, 3, { issuerVat: first!.issuerVat, issuerName: first!.issuerName, date: first!.issueDate, total: first!.gross, vatAmount: first!.vat, docType: 'Τιμολόγιο', category: SUPPLIERS[cl.suppliers[0]].category, summary: `Τιμολόγιο ${first!.issuerName}, συμφωνεί με το myDATA.` }],
      ['apodeixi-periptero.jpg', 2, { issuerVat: '990009901', issuerName: 'Περίπτερο Σταδίου', date: day(4), total: 18.6, vatAmount: 3.6, docType: 'Απόδειξη λιανικής', category: 'category2_4', summary: 'Γραφική ύλη από περίπτερο. Δεν έχει διαβιβαστεί στο myDATA.' }],
      ['taxi-apodeixi.jpg', 1, { issuerVat: '990009902', issuerName: 'Ταξί ΙΧΕ 4512', date: day(2), total: 24, vatAmount: 2.72, docType: 'Απόδειξη ταξί', category: 'category2_4', summary: 'Μετακίνηση με ταξί για επαγγελματικό ραντεβού.' }],
    ];
    for (const [name, age, x] of uploads) insUp.run(clientId, name, png, 'image/png', `${day(age)} 10:${10 + ci}:00`, JSON.stringify(x));
  });
}

/** New invoices "arriving" from myDATA for a demo client: one more from each of two regular suppliers. */
export function demoFetch(clientId: number): { invoices: Invoice[]; cancelled: string[] } {
  const vat = (db.prepare('SELECT vat FROM clients WHERE id = ?').get(clientId) as { vat: string }).vat;
  const cl = CLIENTS.find((c) => c.vat === vat) ?? CLIENTS[0];
  const base = Number(`4${String(Date.now()).slice(-10)}0000`.slice(0, 15));
  return { invoices: cl.suppliers.slice(0, 2).map((si, i) => invoiceFor(SUPPLIERS[si], String(base + i), day(0), Date.now() % 97 + i)), cancelled: [] };
}

export function deleteDemo() {
  const ids = (db.prepare('SELECT id FROM clients WHERE mydata_user = ?').all(DEMO_USER) as { id: number }[]).map((r) => r.id);
  for (const id of ids) for (const t of ['invoices', 'bank_lines', 'uploads']) db.prepare(`DELETE FROM ${t} WHERE client_id = ?`).run(id);
  db.prepare('DELETE FROM clients WHERE mydata_user = ?').run(DEMO_USER);
  db.prepare(`DELETE FROM history WHERE issuer_vat IN (${SUPPLIERS.map(() => '?').join(',')})`).run(...SUPPLIERS.map((s) => s.vat));
}

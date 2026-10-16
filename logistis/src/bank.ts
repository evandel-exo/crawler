export type BankLine = { date: string; description: string; amount: number };
export type Payable = { mark: string; issueDate: string; gross: number; issuerName: string };

/** Greek ("1.234,56") or English ("1,234.56") amounts → number. */
export function parseAmount(raw: string): number {
  let s = raw.replace(/[€\s]/g, '');
  const comma = s.lastIndexOf(','), dot = s.lastIndexOf('.');
  if (comma > dot) s = s.replace(/\./g, '').replace(',', '.');
  else if (comma >= 0) s = s.replace(/,/g, '');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ''); // "1.234": Greek thousands separator
  return Number(s);
}

/** dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy or yyyy-mm-dd → yyyy-mm-dd. */
export function parseDate(raw: string): string {
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/);
  if (!m) return '';
  const y = m[3].length === 2 ? `20${m[3]}` : m[3];
  return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

function splitRow(row: string, sep: string): string[] {
  const out: string[] = [];
  let cur = '', quoted = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') { if (quoted && row[i + 1] === '"') { cur += '"'; i++; } else quoted = !quoted; }
    else if (ch === sep && !quoted) { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/** Bank statement CSV export with a header row; columns are found by their Greek or English names. */
export function parseStatement(csv: string): BankLine[] {
  const rows = csv.replace(/^﻿/, '').split(/\r?\n/).filter((r) => r.trim());
  const headerIdx = rows.findIndex((r) => /ημερομ|ημ\/νία|date/i.test(r));
  if (headerIdx < 0) throw new Error('Δεν βρέθηκε γραμμή επικεφαλίδων με στήλη ημερομηνίας');
  const sep = [';', '\t', ','].reduce((a, b) => (rows[headerIdx].split(b).length > rows[headerIdx].split(a).length ? b : a));
  const head = splitRow(rows[headerIdx], sep);
  const col = (re: RegExp) => head.findIndex((h) => re.test(h));
  const date = col(/ημερομ|ημ\/νία|date/i), desc = col(/περιγρ|αιτιολ|description|details/i);
  const amount = col(/^ποσό|^ποσο|amount/i), debit = col(/χρέωσ|χρεωσ|debit/i), credit = col(/πίστωσ|πιστωσ|credit/i);
  if (amount < 0 && debit < 0) throw new Error('Δεν βρέθηκε στήλη ποσού ή χρέωσης');

  return rows.slice(headerIdx + 1).map((r) => {
    const c = splitRow(r, sep);
    const value = amount >= 0
      ? parseAmount(c[amount] ?? '')
      : (credit >= 0 && c[credit] ? parseAmount(c[credit]) : 0) - (c[debit] ? Math.abs(parseAmount(c[debit])) : 0);
    return { date: parseDate(c[date] ?? ''), description: desc >= 0 ? c[desc] ?? '' : '', amount: value };
  }).filter((l) => l.date && Number.isFinite(l.amount) && l.amount !== 0);
}

const DAY = 86_400_000;
const LEGAL_FORMS = new Set(['ΑΕ', 'ΑΕΕ', 'ΑΒΕΕ', 'ΙΚΕ', 'ΕΠΕ', 'ΟΕ', 'ΕΕ', 'ΜΟΝ', 'SA', 'LTD']);
const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase();
const nameWords = (name: string) => norm(name).split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 3 && !LEGAL_FORMS.has(w));

/** Pairs each outgoing payment with at most one invoice of the same gross amount paid 7 days before to 120 days after issue. */
export function matchPayments(lines: BankLine[], invoices: Payable[]): Map<number, string> {
  const candidates: { line: number; mark: string; score: number }[] = [];
  lines.forEach((l, i) => {
    if (l.amount >= 0) return;
    for (const inv of invoices) {
      if (Math.abs(inv.gross + l.amount) > 0.01) continue;
      const days = (Date.parse(l.date) - Date.parse(inv.issueDate)) / DAY;
      if (days < -7 || days > 120) continue;
      const nameHit = nameWords(inv.issuerName).some((w) => norm(l.description).includes(w));
      candidates.push({ line: i, mark: inv.mark, score: (nameHit ? 1000 : 0) - Math.abs(days) });
    }
  });
  const matched = new Map<number, string>(), used = new Set<string>();
  for (const c of candidates.sort((a, b) => b.score - a.score)) {
    if (matched.has(c.line) || used.has(c.mark)) continue;
    matched.set(c.line, c.mark);
    used.add(c.mark);
  }
  return matched;
}

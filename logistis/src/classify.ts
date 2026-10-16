import { z } from 'zod';
import table from './expense-classifications.json' with { type: 'json' };
import { ask } from './ai.ts';
import type { Invoice, LineClassification } from './mydata.ts';

const combos = table.combos as Record<string, Record<string, string[]>>;
export const categoryLabels = table.categoryLabels as Record<string, string>;
export const typeLabels = table.typeLabels as Record<string, string>;
export const invoiceTypeLabels = table.invoiceTypeLabels as Record<string, string>;
export const VAT_TYPES: Record<string, string> = {
  VAT_361: 'Αγορές & δαπάνες εσωτερικού',
  VAT_362: 'Αγορές παγίων',
  VAT_363: 'Λοιπές εισαγωγές (εκτός παγίων)',
  VAT_364: 'Ενδοκοινοτικές αποκτήσεις αγαθών',
  VAT_365: 'Ενδοκοινοτικές λήψεις υπηρεσιών',
  VAT_366: 'Λοιπές πράξεις λήπτη',
};

/** Valid category → E3 types for an invoice type; falls back to every code when AADE's table has no row for it. */
export function allowedFor(invoiceType: string): Record<string, string[]> {
  return combos[invoiceType] ?? Object.fromEntries(Object.keys(categoryLabels).map((c) => [c, Object.keys(typeLabels)]));
}

export function isValid(invoiceType: string, category: string, type: string | null, vatType: string | null): boolean {
  const types = allowedFor(invoiceType)[category];
  if (!types) return false;
  if (vatType && !(vatType in VAT_TYPES)) return false;
  return types.length === 0 ? !type : !!type && types.includes(type);
}

export type Suggestion = { source: 'history' | 'ai'; lines: (Omit<LineClassification, 'amount' | 'vatAmount' | 'vatCategory'> & { reason: string })[] };

const AiOut = z.object({
  lines: z.array(z.object({
    lineNumber: z.number().int(),
    category: z.string(),
    type: z.string().nullable(),
    vatType: z.string().nullable(),
    reason: z.string(),
  })),
});

const SYSTEM = `Είσαι έμπειρος Έλληνας λογιστής. Χαρακτηρίζεις γραμμές παραστατικών εξόδων για το myDATA της ΑΑΔΕ (Ε3 και ΦΠΑ).
Επιλέγεις ΜΟΝΟ συνδυασμούς κατηγορίας/τύπου από τη λίστα που σου δίνεται για τον τύπο παραστατικού. Αν η κατηγορία έχει κενή λίστα τύπων, type = null.
vatType: VAT_361 για αγορές εσωτερικού με ΦΠΑ, VAT_362 για πάγια, VAT_364/VAT_365 για ενδοκοινοτικά, null όταν η γραμμή δεν έχει ΦΠΑ.
Το reason είναι μία σύντομη πρόταση στα ελληνικά.`;

export async function suggest(inv: Invoice, history: Suggestion['lines'] | undefined): Promise<Suggestion> {
  // Same supplier and invoice type as before: reuse the accountant's own last choice, line by line.
  if (history?.length) {
    const last = history[history.length - 1];
    const lines = inv.lines.map((l) => {
      const h = history.find((x) => x.lineNumber === l.lineNumber) ?? last;
      return { ...h, lineNumber: l.lineNumber, vatType: l.vatAmount > 0 ? h.vatType : null, reason: 'Όπως το προηγούμενο παραστατικό του ίδιου προμηθευτή' };
    });
    if (lines.every((l) => isValid(inv.invoiceType, l.category, l.type, l.vatType))) return { source: 'history', lines };
  }

  const allowed = Object.entries(allowedFor(inv.invoiceType))
    .map(([c, types]) => `${c} (${categoryLabels[c]}): ${types.length ? types.map((t) => `${t} ${typeLabels[t] ?? ''}`).join(' | ') : '(χωρίς τύπο)'}`)
    .join('\n');
  const out = await ask(SYSTEM, [{
    type: 'text',
    text: `Τύπος παραστατικού: ${inv.invoiceType}
Εκδότης: ${inv.issuerName || '-'} (ΑΦΜ ${inv.issuerVat}, χώρα ${inv.issuerCountry})
Γραμμές:
${inv.lines.map((l) => `- γραμμή ${l.lineNumber}: καθαρό ${l.netValue}, ΦΠΑ ${l.vatAmount} (κατηγορία ΦΠΑ ${l.vatCategory})${l.itemDescr ? `, περιγραφή: ${l.itemDescr}` : ''}`).join('\n')}

Επιτρεπτοί συνδυασμοί:
${allowed}`,
  }], AiOut);

  return {
    source: 'ai',
    lines: inv.lines.map((l) => {
      const s = out.lines.find((x) => x.lineNumber === l.lineNumber);
      // An invalid pair would be rejected by myDATA; leave the line blank for the accountant instead.
      return s && isValid(inv.invoiceType, s.category, s.type, s.vatType)
        ? s
        : { lineNumber: l.lineNumber, category: '', type: null, vatType: null, reason: 'Χρειάζεται χειροκίνητο χαρακτηρισμό' };
    }),
  };
}

import { z } from 'zod';
import { readFile } from 'node:fs/promises';
import type Anthropic from '@anthropic-ai/sdk';
import { ask } from './ai.ts';
import { categoryLabels } from './classify.ts';

export const Extracted = z.object({
  issuerVat: z.string().nullable(),
  issuerName: z.string().nullable(),
  date: z.string().nullable().describe('YYYY-MM-DD'),
  total: z.number().nullable(),
  vatAmount: z.number().nullable(),
  docType: z.string().describe('π.χ. Τιμολόγιο, Απόδειξη λιανικής, Λογαριασμός ΔΕΗ'),
  category: z.string().nullable(),
  summary: z.string(),
});
export type Extracted = z.infer<typeof Extracted>;

export const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

/** Reads a photographed or scanned expense document a client uploaded. */
export async function extract(path: string, mime: string): Promise<Extracted> {
  const data = (await readFile(path)).toString('base64');
  const file: Anthropic.Beta.BetaContentBlockParam = mime === 'application/pdf'
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } }
    : { type: 'image', source: { type: 'base64', media_type: mime as 'image/jpeg', data } };
  return ask(
    `Διαβάζεις ελληνικά παραστατικά εξόδων για λογιστικό γραφείο. Συμπλήρωσε μόνο ό,τι φαίνεται καθαρά, αλλιώς null.
category: μία από ${Object.keys(categoryLabels).join(', ')} ή null. summary: μία πρόταση στα ελληνικά.`,
    [file, { type: 'text', text: 'Εξήγαγε τα στοιχεία του παραστατικού.' }],
    Extracted,
  );
}

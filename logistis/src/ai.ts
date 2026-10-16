import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import type { z } from 'zod';

let client: Anthropic | undefined;

/** One Claude call that must return JSON matching `schema`. */
export async function ask<T extends z.ZodType>(system: string, content: Anthropic.Beta.BetaContentBlockParam[], schema: T): Promise<z.infer<T>> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('Το AI δεν είναι ρυθμισμένο (λείπει ANTHROPIC_API_KEY)');
  client ??= new Anthropic();
  const r = await client.beta.messages.parse({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: betaZodOutputFormat(schema) },
    system,
    messages: [{ role: 'user', content }],
  });
  if (r.stop_reason === 'refusal' || r.parsed_output == null) throw new Error(`Το AI δεν απάντησε (${r.stop_reason})`);
  return r.parsed_output;
}

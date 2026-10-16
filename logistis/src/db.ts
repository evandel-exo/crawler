import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

export const DATA_DIR = process.env.DATA_DIR ?? 'data';
mkdirSync(`${DATA_DIR}/uploads`, { recursive: true });

export const db = new DatabaseSync(`${DATA_DIR}/logistis.db`);
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    vat TEXT NOT NULL UNIQUE,
    mydata_user TEXT,
    mydata_key_enc TEXT,
    upload_token TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS invoices (
    mark TEXT PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    issuer_vat TEXT, issuer_name TEXT, issuer_country TEXT,
    series TEXT, aa TEXT, issue_date TEXT, invoice_type TEXT,
    net REAL, vat REAL, gross REAL,
    lines_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- new | suggested | sent | error | cancelled
    suggestion_json TEXT,
    classification_mark TEXT,
    error TEXT
  );
  -- Final classifications the accountant sent; the memory that pre-fills the next invoice from the same supplier.
  CREATE TABLE IF NOT EXISTS history (
    issuer_vat TEXT NOT NULL,
    invoice_type TEXT NOT NULL,
    lines_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS bank_lines (
    id INTEGER PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    date TEXT, description TEXT, amount REAL,
    matched_mark TEXT
  );
  CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    filename TEXT NOT NULL, path TEXT NOT NULL, mime TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    extracted_json TEXT, error TEXT
  );
`);

// myDATA subscription keys give access to a client's tax data, so they are encrypted at rest.
const key = () => {
  const secret = process.env.APP_SECRET;
  if (!secret) throw new Error('APP_SECRET is not set');
  return createHash('sha256').update(secret).digest();
};

export function encrypt(text: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key(), iv);
  const ct = Buffer.concat([c.update(text, 'utf8'), c.final()]);
  return [iv, c.getAuthTag(), ct].map((b) => b.toString('base64')).join('.');
}

export function decrypt(payload: string): string {
  const [iv, tag, ct] = payload.split('.').map((s) => Buffer.from(s, 'base64'));
  const d = createDecipheriv('aes-256-gcm', key(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(ct), d.final()]).toString('utf8');
}

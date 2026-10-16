import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import type { AddressInfo } from 'node:net';

Object.assign(process.env, { DATA_DIR: mkdtempSync(`${tmpdir()}/n2x-demo-`), APP_PASSWORD: 'pw', APP_SECRET: 's', ANTHROPIC_API_KEY: '' });
const { start } = await import('../src/server.ts');
const { SUPPLIERS } = await import('../src/demo.ts');
const { isValid } = await import('../src/classify.ts');
const app = start(0);
const base = `http://127.0.0.1:${(app.address() as AddressInfo).port}`;
after(() => app.close());

let cookie = '';
const post = (path: string, body = new URLSearchParams()) => fetch(base + path, { method: 'POST', body, headers: { cookie }, redirect: 'manual' });
const get = async (path: string) => (await fetch(base + path, { headers: { cookie } })).text();

test('every demo supplier uses a classification myDATA accepts', () => {
  for (const s of SUPPLIERS) assert.ok(isValid(s.type, s.category, s.e3, s.vatType), s.name);
});

test('demo mode: load, browse, sync, send, report, remove', async () => {
  cookie = (await post('/login', new URLSearchParams({ password: 'pw' }))).headers.get('set-cookie')!.split(';')[0];
  assert.match(await get('/'), /Φόρτωση demo/);

  await post('/demo');
  await post('/demo'); // a second click must not duplicate the clients
  const dash = await get('/');
  assert.equal(dash.split('· demo').length - 1, 4);
  assert.match(dash, /Χρειάζονται προσοχή/);
  assert.match(dash, /Απορρίφθηκε/);
  assert.match(dash, /Πληρωμή χωρίς παραστατικό/);
  assert.match(dash, /Απόδειξη εκτός myDATA/);
  assert.doesNotMatch(dash, /Φόρτωση demo/);

  const id = /href="\/clients\/(\d+)"/.exec(dash)![1];
  const before = await get(`/clients/${id}`);
  assert.match(before, /Από ιστορικό|Πρόταση AI/);

  // Simulated myDATA: sync brings new invoices from regular suppliers, pre-filled from history.
  await post(`/clients/${id}/sync`, new URLSearchParams({ from: '2026-01-01', to: '2026-12-31' }));
  await new Promise((r) => setTimeout(r, 200));
  const pendingBefore = Number(/Προς χαρακτηρισμό <span class="count">(\d+)</.exec(await get(`/clients/${id}`))![1]);

  await post(`/clients/${id}/send-all`);
  const afterSend = await get(`/clients/${id}`);
  const pendingAfter = Number(/Προς χαρακτηρισμό <span class="count">(\d+)</.exec(afterSend)![1]);
  assert.ok(pendingAfter < pendingBefore, `${pendingAfter} < ${pendingBefore}`);

  const reports = await get(`/clients/${id}?tab=reports`);
  assert.match(reports, /Έξοδα ανά κατηγορία/);
  assert.match(reports, /Κύριοι προμηθευτές/);
  assert.match(reports, /class="bar"/);
  assert.match(await get(`/clients/${id}?tab=bank`), /Χωρίς παραστατικό/);
  const docs = await get(`/clients/${id}?tab=docs`);
  assert.match(docs, /Δεν βρέθηκε/);
  const file = /href="(\/clients\/\d+\/uploads\/\d+)"/.exec(docs)![1];
  assert.equal((await fetch(base + file, { headers: { cookie } })).status, 200);

  await post('/demo/delete');
  const cleared = await get('/');
  assert.doesNotMatch(cleared, /· demo/);
  assert.match(cleared, /Φόρτωση demo/);
});

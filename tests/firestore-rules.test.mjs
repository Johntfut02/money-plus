// Integração com o emulador real do Firestore. Não substitui as regras por funções JS.
// Execute por emulators:exec, usando firebase.test.json e o projeto demo abaixo.
import assert from 'node:assert/strict';

const project = 'demo-money-plus-v1';
const host = process.env.FIRESTORE_EMULATOR_HOST;
if (!host || !/^(127\.0\.0\.1|localhost):[0-9]+$/.test(host)) {
  throw new Error('É necessário um emulador local. Execute o comando em docs/protecao-dados.md.');
}
const origin = `http://${host}`;
const base = `${origin}/v1/projects/${project}/databases/(default)/documents`;
const prefix = `rules-test-${Date.now()}`;
const userA = `${prefix}-a`;
const userB = `${prefix}-b`;
let checked = 0;

// Tokens não assinados destinam-se exclusivamente ao emulador.
function token(uid) {
  const now = Math.floor(Date.now() / 1000);
  const part = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${part({ alg: 'none', typ: 'JWT' })}.${part({
    iss: `https://securetoken.google.com/${project}`, aud: project,
    sub: uid, user_id: uid, iat: now, exp: now + 3600,
    firebase: { identities: {}, sign_in_provider: 'custom' }
  })}.`;
}

function field(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value)
    ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(field) } };
  return { mapValue: { fields: fields(value) } };
}
function fields(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, field(value)]));
}

async function request(method, path, uid, data, query = '') {
  const headers = { 'Content-Type': 'application/json' };
  if (uid) headers.Authorization = `Bearer ${token(uid)}`;
  const response = await fetch(`${base}/${path}${query}`, {
    method, headers, signal: AbortSignal.timeout(10000),
    body: data === undefined ? undefined : JSON.stringify({ fields: fields(data) })
  });
  const text = await response.text();
  return { status: response.status, text };
}
async function allowed(result, label) {
  assert(result.status >= 200 && result.status < 300, `${label}: HTTP ${result.status} ${result.text}`);
  checked++;
}
async function denied(result, label) {
  assert.equal(result.status, 403, `${label}: HTTP ${result.status} ${result.text}`);
  checked++;
}

function transaction(id, overrides = {}) {
  return { id, name: 'Teste fictício', type: 'expense', amount: 15,
    category: 'Food', date: '2026-10-08', paymentMethod: 'Pix', notes: '', ...overrides };
}
const tx = id => `users/${userA}/transactions/${id}`;

// Owner creation must succeed first: a closed/broken emulator must fail this suite.
await allowed(await request('PATCH', tx('valid'), userA, transaction('valid')), 'owner creates');
await allowed(await request('GET', tx('valid'), userA), 'owner reads');
await allowed(await request('GET', `users/${userA}/transactions`, userA), 'owner lists');
await denied(await request('GET', tx('valid'), userB), 'other account reads');
await denied(await request('GET', `users/${userA}/transactions`, userB), 'other account lists');
await denied(await request('PATCH', tx('valid'), userB, transaction('valid', { amount: 99 })), 'other account edits');
await denied(await request('DELETE', tx('valid'), userB), 'other account deletes');
await denied(await request('GET', tx('valid'), null), 'signed-out read');
await denied(await request('PATCH', tx('anonymous'), null, transaction('anonymous')), 'signed-out create');
await allowed(await request('PATCH', tx('valid'), userA, { amount: 25 }, '?updateMask.fieldPaths=amount&currentDocument.exists=true'), 'partial edit');
assert.match((await request('GET', tx('valid'), userA)).text, /25/);

const invalidTransactions = [
  { amount: 0 }, { amount: -1 }, { amount: '15' }, { amount: 1000000000 }, { amount: 0.011 },
  { type: 'other' }, { category: 'Other' }, { category: 'Income' },
  { type: 'income', category: 'Food' }, { paymentMethod: 'Other' },
  { name: '' }, { name: '   ' }, { name: 'x'.repeat(101) },
  { notes: 1 }, { notes: 'x'.repeat(501) }, { admin: true },
  { id: 'wrong-id' }, { date: '2026-02-30' }, { date: '2026-04-31' },
  { date: '2026-13-01' }, { date: '2026-02-29' }, { date: '2100-02-29' },
  { date: '08/10/2026' }, { date: '0000-01-01' }, { date: null }
];
for (const [index, invalid] of invalidTransactions.entries()) {
  const id = `invalid-${index}`;
  await denied(await request('PATCH', tx(id), userA, transaction(id, invalid)), `invalid transaction ${index}`);
}
const missing = transaction('missing-field'); delete missing.amount;
await denied(await request('PATCH', tx('missing-field'), userA, missing), 'missing required amount');
const withoutNotes = transaction('optional-notes'); delete withoutNotes.notes;
await allowed(await request('PATCH', tx('optional-notes'), userA, withoutNotes), 'optional notes');
await allowed(await request('PATCH', tx('leap'), userA, transaction('leap', { date: '2028-02-29', amount: 0.01 })), 'leap date and cent');
await allowed(await request('PATCH', tx('century'), userA, transaction('century', { date: '2000-02-29' })), 'leap century');
await allowed(await request('PATCH', tx('income'), userA, transaction('income', { type: 'income', category: 'Income', amount: 19.99 })), 'income and decimal amount');
await denied(await request('PATCH', tx('valid'), userA, { amount: -1 }, '?updateMask.fieldPaths=amount'), 'invalid partial edit');
await denied(await request('PATCH', tx('valid'), userA, { id: 'replacement' }, '?updateMask.fieldPaths=id'), 'changed document ID');

const budget = `users/${userA}/budgets/2026-10`;
await allowed(await request('PATCH', budget, userA, { limits: { Food: 500, Housing: 800 } }), 'budget creates');
await allowed(await request('PATCH', budget, userA, { limits: { Food: 650 } }, '?updateMask.fieldPaths=limits.Food'), 'category merge');
assert.match((await request('GET', budget, userA)).text, /800/);
await allowed(await request('PATCH', budget, userA, { limits: { Food: 0 } }, '?updateMask.fieldPaths=limits.Food'), 'zero budget');
await denied(await request('GET', budget, userB), 'other account budget');
await denied(await request('PATCH', budget, userB, { limits: { Food: 50 } }), 'other account budget write');
for (const [index, data] of [{ limits: { Food: -1 } }, { limits: { Food: '500' } }, { limits: { Unknown: 1 } }, { limits: [] }, { limits: { Food: 1000000000 } }, { limits: {}, extra: 1 }, { limits: { Food: 1.234 } }].entries()) {
  await denied(await request('PATCH', `users/${userA}/budgets/2027-${String(index + 1).padStart(2, '0')}`, userA, data), `invalid budget ${index}`);
}
await denied(await request('PATCH', `users/${userA}/budgets/2026-13`, userA, { limits: {} }), 'invalid month');
await allowed(await request('PATCH', `users/${userA}/budgets/2026-11`, userA, { limits: {} }), 'empty limits');

const finance = `users/${userA}/settings/finance`;
await allowed(await request('PATCH', finance, userA, { openingBalance: -150.5, openingDate: '2026-10-08' }), 'negative opening balance');
await allowed(await request('GET', finance, userA), 'owner finance reads');
await denied(await request('GET', finance, userB), 'other account finance');
await denied(await request('PATCH', finance, userB, { openingBalance: 0, openingDate: '2026-10-08' }), 'other account finance write');
for (const [index, invalid] of [{ openingBalance: '0' }, { openingBalance: -1000000000 }, { openingBalance: -150.505 }, { openingDate: '2026-02-30' }, { openingDate: '1800-01-01' }, { extra: true }].entries()) {
  await denied(await request('PATCH', finance, userA, { openingBalance: 0, openingDate: '2026-10-08', ...invalid }), `invalid finance ${index}`);
}
await denied(await request('PATCH', `users/${userA}`, userA, { admin: true }), 'unknown root document');
await denied(await request('PATCH', `users/${userA}/private/other`, userA, { arbitrary: true }), 'unknown collection');
await denied(await request('PATCH', `users/${userA}/settings/other`, userA, { arbitrary: true }), 'unknown setting');
await denied(await request('PATCH', `${tx('valid')}/attachments/one`, userA, { arbitrary: true }), 'nested collection');
await allowed(await request('DELETE', tx('valid'), userA), 'owner deletes');
const deletedUpdate = await request('PATCH', tx('valid'), userA, { amount: 99 }, '?updateMask.fieldPaths=amount&currentDocument.exists=true');
assert.equal(deletedUpdate.status, 404, deletedUpdate.text);
console.log(`PASS: ${checked} rule checks in the Firestore emulator, including isolation, valid writes, rejected fields, partial updates and deletes. No production data accessed.`);

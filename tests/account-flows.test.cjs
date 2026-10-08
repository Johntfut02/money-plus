const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..') + path.sep;
const stripImports = source => source.replace(/^import[\s\S]*?;\s*/gm, '');
const i18n = fs.readFileSync(root + 'js/i18n.js', 'utf8').replace(/\bexport /g, '');
const app = stripImports(fs.readFileSync(root + 'js/app.js', 'utf8')).replace(/startApp\(\);\s*$/, '');
const row = { id: 'one', name: 'Test', category: 'Income', type: 'income', amount: 100, date: '2026-10-02', paymentMethod: 'Pix', notes: '' };
class Element {
  constructor(dataset = {}) { this.dataset = dataset; this.style = {}; this.handlers = {}; this.value = ''; this.textContent = ''; this.innerHTML = ''; this.disabled = false; this.attributes = {}; this.classList = { add() {}, remove() {}, toggle() {} }; }
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener(key, handler) { (this.handlers[key] ||= []).push(handler); }
}
class FixedDate extends Date { constructor(...args) { super(...(args.length ? args : ['2026-10-02T12:00:00'])); } }
function fixture({ user = { uid: 'account-a', displayName: 'Joao Test' }, rows = [], form = false, failLoad = false, monthlyBudgets = {}, budgetPage = false, search = '' } = {}) {
  const nodes = Object.fromEntries(['#session-message','#toast','#category-options','#category-selected','#form-error','#signout','[data-greeting]','#cash-chart'].map(key => [key, new Element()]));
  const month = new Element(), language = new Element(), userName = new Element(), avatar = new Element(), submit = new Element();
  const totals = ['income','expenses','savings','balance','donut'].map(total => new Element({ total }));
  const listeners = {};
  const fields = new Map(Object.entries({ amount: '100', description: 'Test', date: '2026-10-02', type: 'income', category: 'Income', paymentMethod: 'Pix', notes: '' }));
  let categoryMarkup = '';
  Object.defineProperty(nodes['#category-options'], 'innerHTML', {
    get: () => categoryMarkup,
    set: value => {
      categoryMarkup = value;
      const checked = value.match(/name="category" value="([^"]+)" checked/);
      if (checked) fields.set('category', checked[1]);
    }
  });
  const formNode = new Element();
  formNode.elements = Object.fromEntries([...fields.keys()].map(key => {
    const field = new Element();
    Object.defineProperty(field, 'value', { get: () => fields.get(key), set: value => fields.set(key, value) });
    return [key, field];
  }));
  formNode.querySelectorAll = () => [submit, ...Object.values(formNode.elements)];
  if (form) nodes['#transaction-form'] = formNode;
  if (budgetPage) {
    nodes['#budget-categories'] = new Element();
    nodes['[data-daily-average]'] = new Element();
    nodes['[data-active-budgets]'] = new Element();
  }
  const arrays = { '.month-control': [month], '.language-control': [language], '.user-name': [userName], '.avatar': [avatar], '[data-total]': totals };
  let observer;
  const auth = { currentUser: user, authStateReady: async () => {} };
  const location = { search, pathname: '/index.html', href: '', replaced: '', replace(value) { this.replaced = value; } };
  const state = { reads: 0, saves: [], updates: [], deletes: [], errors: [] };
  const context = vm.createContext({
    app: {}, getAuth: () => auth,
    onAuthStateChanged: (_, callback) => { observer = callback; callback(auth.currentUser); },
    signOut: async () => { auth.currentUser = null; observer(null); },
    carregarTransacoes: async () => { state.reads++; if (failLoad) throw new Error('offline'); return rows; },
    carregarOrcamentos: async () => monthlyBudgets,
    carregarSaldoInicial: async () => ({ openingBalance: 0, openingDate: null }),
    salvarSaldoInicial: async () => {},
    validOpening: () => true,
    salvarLimite: async () => {},
    salvarTransacao: async value => { state.saves.push(value); },
    atualizarTransacao: async (value, uid) => { state.updates.push({ value, uid }); },
    excluirTransacao: async id => { state.deletes.push(id); },
    document: { documentElement: {}, body: { dataset: { session: 'loading' }, setAttribute() {} }, querySelector: key => nodes[key] || null, querySelectorAll: key => arrays[key] || [], addEventListener: (key, callback) => { listeners[key] = callback; } },
    location, history: { replaceState() {} }, navigator: { language: 'pt-BR' }, localStorage: { getItem: () => null, setItem() {} },
    window: { confirm: () => true }, FormData: class { get(key) { return fields.get(key); } },
    Date: FixedDate, Intl, URLSearchParams, setTimeout: () => 1, clearTimeout() {}, crypto: { randomUUID: () => 'created-id' },
    console: { error: error => state.errors.push(error) }
  });
  vm.runInContext(i18n + '\n' + app, context);
  return { context, nodes, month, language, userName, avatar, submit, formNode, state, auth, location, listeners, totals, fields, changeUser(user) { auth.currentUser = user; observer(user); } };
}
async function run() {
  let f = fixture({ user: null }); await vm.runInContext('startApp()', f.context);
  assert.equal(f.location.replaced, 'login.html'); assert.equal(f.state.reads, 0);

  f = fixture(); await vm.runInContext('startApp()', f.context);
  assert.equal(f.context.document.body.dataset.session, 'ready');
  assert.equal(vm.runInContext('calculateBalance()', f.context), 0);
  assert.equal(vm.runInContext('transactions.length', f.context), 0);
  assert.equal(f.month.value, '2026-10'); assert.match(f.month.innerHTML, /2027-10/);
  assert.equal(f.userName.textContent, 'Joao Test');
  for (const callback of f.language.handlers.change) callback({ target: { value: 'en' } });
  assert.match(f.nodes['[data-greeting]'].textContent, /Hello/);
  f.changeUser({ uid: 'account-b' }); assert.equal(f.location.replaced, 'login.html'); assert.equal(f.context.document.body.dataset.session, 'loading');

  f = fixture({ failLoad: true }); await vm.runInContext('startApp()', f.context);
  assert.equal(f.context.document.body.dataset.session, 'loading'); assert.match(f.nodes['#session-message'].textContent, /carregar/);

  f = fixture({ rows: [{ ...row, amount: -1 }] }); await vm.runInContext('startApp()', f.context);
  assert.equal(f.context.document.body.dataset.session, 'loading');

  f = fixture({ rows: [row, { ...row, id: 'old', amount: 50, date: '2026-08-01' }] }); await vm.runInContext('startApp()', f.context);
  assert.equal(vm.runInContext('calculateBalance()', f.context), 150);
  assert.equal(vm.runInContext('calculateIncome()', f.context), 100);
  assert.match(f.month.innerHTML, /2026-08/); assert.match(f.nodes['#cash-chart'].innerHTML, /100,00/);
  const deleteButton = new Element({ delete: 'one' });
  const event = { target: { closest: selector => selector === '[data-delete]' ? deleteButton : null } };
  let resolveDelete; f.context.excluirTransacao = () => new Promise(resolve => { resolveDelete = resolve; });
  const pendingDelete = f.listeners.click(event);
  assert.equal(vm.runInContext('transactions.length', f.context), 2);
  assert.equal(deleteButton.disabled, true);
  resolveDelete(); await pendingDelete; assert.equal(vm.runInContext('transactions.length', f.context), 1);
  f.context.excluirTransacao = async () => { throw new Error('offline'); };
  const failingDelete = new Element({ delete: 'old' });
  await f.listeners.click({ target: { closest: selector => selector === '[data-delete]' ? failingDelete : null } });
  assert.equal(vm.runInContext('transactions.length', f.context), 1); assert.equal(failingDelete.disabled, false);

  f = fixture({ form: true }); await vm.runInContext('startApp()', f.context);
  assert.equal(f.formNode.elements.date.value, '2026-10-02');
  let resolveSave; let saves = 0;
  f.context.salvarTransacao = () => { saves++; return new Promise(resolve => { resolveSave = resolve; }); };
  const handler = f.formNode.handlers.submit[0];
  const pendingSave = handler({ preventDefault() {} });
  assert.equal(f.location.href, ''); assert.equal(f.submit.disabled, true);
  await handler({ preventDefault() {} }); assert.equal(saves, 1);
  resolveSave(); await pendingSave; assert.equal(f.location.href, 'transactions.html?saved=1&month=2026-10');
  f.location.href = '';
  f.context.salvarTransacao = async () => { throw new Error('offline'); };
  await handler({ preventDefault() {} }); assert.equal(f.location.href, ''); assert.equal(f.submit.disabled, false); assert.match(f.nodes['#form-error'].textContent, /nuvem/);

  await testTransactionEditing();

  f = fixture(); await vm.runInContext('startApp()', f.context);
  await f.nodes['#signout'].handlers.click[0]({ currentTarget: f.nodes['#signout'] }); assert.equal(f.location.replaced, 'login.html');

  const store = stripImports(fs.readFileSync(root + 'js/transactions-store.js', 'utf8')).replace(/\bexport /g, '');
  const calls = [];
  const auth = { currentUser: { uid: 'user-a' } };
  const context = vm.createContext({ app: {}, getAuth: () => auth, getFirestore: () => 'db', collection: (...args) => args.slice(1).join('/'), doc: (parent, id) => parent + '/' + id, getDocsFromServer: async path => { calls.push(path); return { docs: [{ id: 'server-id', data: () => ({ ...row, id: 'wrong-id' }) }] }; }, setDoc: async (path, data) => { calls.push(path); }, deleteDoc: async path => { calls.push(path); } });
  vm.runInContext(store, context);
  const loaded = await vm.runInContext('carregarTransacoes()', context); assert.equal(loaded[0].id, 'server-id');
  context.row = row; await vm.runInContext('salvarTransacao(row)', context); await vm.runInContext('excluirTransacao("one")', context);
  assert.deepEqual(calls, ['users/user-a/transactions', 'users/user-a/transactions/one', 'users/user-a/transactions/one']);
  auth.currentUser = { uid: 'user-b' }; await vm.runInContext('carregarTransacoes()', context); assert.equal(calls.at(-1), 'users/user-b/transactions');
  auth.currentUser = null; await assert.rejects(vm.runInContext('carregarTransacoes()', context), /Entre na sua conta/);

  f = fixture({ budgetPage: true, monthlyBudgets: { '2026-10': { Food: 500, Housing: 800 }, '2026-11': { Food: 250 } } });
  await vm.runInContext('startApp()', f.context);
  assert.equal(vm.runInContext('calculateBudgetUsage().limit', f.context), 1300);
  assert.match(f.nodes['#budget-categories'].innerHTML, /value="500.00"/);
  assert.equal(f.nodes['[data-active-budgets]'].textContent, '2 orçamentos ativos');
  f.month.handlers.change[0]({ target: { value: '2026-11' } });
  assert.equal(vm.runInContext('calculateBudgetUsage().limit', f.context), 250);
  f.month.handlers.change[0]({ target: { value: '2026-12' } });
  assert.equal(vm.runInContext('calculateBudgetUsage().limit', f.context), 0);
  f.month.handlers.change[0]({ target: { value: '2026-10' } });
  const errorMessage = new Element();
  const editor = new Element({ budgetCategory: 'Food' });
  editor.elements = { limit: { value: '650' } }; editor.checkValidity = () => true;
  editor.querySelector = () => errorMessage;
  const budgetSubmit = f.nodes['#budget-categories'].handlers.submit[0];
  const budgetEvent = { target: { closest: () => editor }, preventDefault() {} };
  let completeBudget; let budgetWrites = 0;
  f.context.salvarLimite = (month, category, amount) => { budgetWrites++; assert.equal(month, '2026-10'); assert.equal(category, 'Food'); assert.equal(amount, 650); return new Promise(resolve => { completeBudget = resolve; }); };
  const pendingBudget = budgetSubmit(budgetEvent);
  assert.equal(vm.runInContext('budgets.Food', f.context), 500);
  await budgetSubmit(budgetEvent); assert.equal(budgetWrites, 1);
  completeBudget(); await pendingBudget;
  assert.equal(vm.runInContext('budgets.Food', f.context), 650);
  assert.equal(vm.runInContext('budgets.Housing', f.context), 800);
  assert.equal(vm.runInContext('budgetsByMonth["2026-11"].Food', f.context), 250);
  f.context.salvarLimite = async () => { throw new Error('offline'); };
  editor.elements.limit.value = '999'; await budgetSubmit(budgetEvent);
  assert.equal(vm.runInContext('budgets.Food', f.context), 650); assert.match(errorMessage.textContent, /conexão/);
  editor.elements.limit.value = ''; await budgetSubmit(budgetEvent); assert.match(errorMessage.textContent, /válido/);
  f.context.salvarLimite = async () => {};
  editor.elements.limit.value = '0'; await budgetSubmit(budgetEvent); assert.equal(vm.runInContext('budgets.Food', f.context), 0);

  const budgetStore = stripImports(fs.readFileSync(root + 'js/budgets-store.js', 'utf8')).replace(/\bexport /g, '');
  const budgetAuth = { currentUser: { uid: 'budget-user-a' } }; const budgetCalls = [];
  const storedLimits = { Food: 500, Housing: 800 };
  const budgetContext = vm.createContext({ app: {}, getAuth: () => budgetAuth, getFirestore: () => 'db', collection: (...args) => args.slice(1).join('/'), doc: (parent, id) => parent + '/' + id, getDocsFromServer: async path => { budgetCalls.push(path); return { docs: [{ id: '2026-10', data: () => ({ limits: storedLimits }) }] }; }, setDoc: async (path, data, options) => { budgetCalls.push(path); assert.equal(options.merge, true); Object.assign(storedLimits, data.limits); } });
  vm.runInContext(budgetStore, budgetContext);
  await vm.runInContext('salvarLimite("2026-10", "Food", 650)', budgetContext);
  assert.equal(storedLimits.Food, 650); assert.equal(storedLimits.Housing, 800);
  const loadedBudget = await vm.runInContext('carregarOrcamentos()', budgetContext);
  assert.equal(loadedBudget['2026-10'].Food, 650); assert.equal(loadedBudget['2026-10'].Shopping, 0);
  assert.deepEqual(budgetCalls, ['users/budget-user-a/budgets/2026-10', 'users/budget-user-a/budgets']);
  await assert.rejects(vm.runInContext('salvarLimite("2026-13", "Food", 10)', budgetContext));
  await assert.rejects(vm.runInContext('salvarLimite("2026-10", "Food", -1)', budgetContext));
  await assert.rejects(vm.runInContext('salvarLimite("2026-10", "Wrong", 10)', budgetContext));
  budgetAuth.currentUser = { uid: 'budget-user-b' }; await vm.runInContext('carregarOrcamentos()', budgetContext); assert.equal(budgetCalls.at(-1), 'users/budget-user-b/budgets');
  budgetAuth.currentUser = null; await assert.rejects(vm.runInContext('carregarOrcamentos()', budgetContext), /Entre na sua conta/);
  console.log('PASS: monthly budget switching, empty months, save acknowledgement, zero removal, failure recovery, input validation, category preservation and UID-scoped storage.');
  console.log('PASS: auth gate, account swap/logout, empty accounts, current/future/history months, real totals/charts, language switching, load errors, save/delete acknowledgement and failure, duplicate-submit prevention, and UID-scoped store. Firebase calls were simulated; live acceptance remains to be checked in the browser.');
}

async function testTransactionEditing() {
  const expense = { ...row, id: 'edit-one', name: 'Teste <edição>', type: 'expense', category: 'Food', amount: 10, notes: 'Observação original', paymentMethod: 'Debit Card' };
  let f = fixture({ rows: [expense], form: true, search: '?edit=edit-one&month=2026-10' });
  await vm.runInContext('startApp()', f.context);
  assert.equal(f.context.document.title, 'Edit Transaction | Money+');
  assert.equal(f.fields.get('amount'), '10.00');
  for (const [field, key] of [['description','name'], ['type','type'], ['category','category'], ['date','date'], ['paymentMethod','paymentMethod'], ['notes','notes']]) {
    assert.equal(f.fields.get(field), expense[key]);
  }
  const markup = vm.runInContext('transactionRow(transactions[0], true)', f.context);
  assert.match(markup, /\?edit=edit-one&amp;month=2026-10/);
  assert.match(markup, /aria-label="Editar Teste &lt;edição&gt;"/);
  assert.doesNotMatch(vm.runInContext('transactionRow(transactions[0])', f.context), /edit-button/);

  // Changing language preserves every unsaved field and the selected category.
  f.fields.set('amount', '25');
  f.fields.set('description', 'Changed');
  for (const callback of f.language.handlers.change) callback({ target: { value: 'en' } });
  assert.equal(f.fields.get('category'), 'Food');
  assert.equal(f.fields.get('amount'), '25');
  assert.equal(f.fields.get('description'), 'Changed');
  f.formNode.handlers.reset[0]({ preventDefault() {} });
  assert.equal(f.fields.get('amount'), '10.00');
  assert.equal(f.fields.get('description'), expense.name);
  assert.equal(f.fields.get('notes'), expense.notes);

  let resolveUpdate; let writes = 0;
  f.context.atualizarTransacao = (value, uid) => {
    writes++;
    assert.equal(value.id, 'edit-one');
    assert.equal(uid, 'account-a');
    return new Promise(resolve => { resolveUpdate = resolve; });
  };
  f.fields.set('amount', '25');
  const submit = f.formNode.handlers.submit[0];
  const pending = submit({ preventDefault() {} });
  assert.equal(f.submit.disabled, true);
  assert.equal(f.formNode.elements.amount.disabled, true);
  assert.equal(vm.runInContext('calculateExpenses()', f.context), 10);
  assert.equal(f.location.href, '');
  await submit({ preventDefault() {} });
  assert.equal(writes, 1);
  resolveUpdate(); await pending;
  assert.equal(f.state.saves.length, 0);
  assert.equal(vm.runInContext('transactions.length', f.context), 1);
  assert.equal(vm.runInContext('calculateExpenses()', f.context), 25);
  assert.equal(vm.runInContext('calculateBalance()', f.context), -25);
  assert.equal(f.location.href, 'transactions.html?saved=updated&month=2026-10');

  // Reload with server data keeps the same ID, values and transaction count.
  const updated = vm.runInContext('transactions[0]', f.context);
  f = fixture({ rows: [updated] }); await vm.runInContext('startApp()', f.context);
  assert.equal(vm.runInContext('transactions.length', f.context), 1);
  assert.equal(vm.runInContext('calculateExpenses()', f.context), 25);

  // An expense can become income in another month, without leaving a duplicate.
  f = fixture({ rows: [expense], form: true, search: '?edit=edit-one' });
  await vm.runInContext('startApp()', f.context);
  f.fields.set('type', 'income');
  f.formNode.handlers.change[0]({ target: { name: 'type', value: 'income' } });
  assert.equal(f.fields.get('category'), 'Income');
  f.fields.set('date', '2026-11-03');
  f.fields.set('amount', '25.50');
  await f.formNode.handlers.submit[0]({ preventDefault() {} });
  assert.equal(f.state.updates.length, 1);
  assert.equal(f.state.updates[0].value.id, 'edit-one');
  assert.equal(f.location.href, 'transactions.html?saved=updated&month=2026-11');
  assert.equal(vm.runInContext('monthlyTransactions().length', f.context), 0);
  vm.runInContext('selectedMonth = "2026-11"', f.context);
  assert.equal(vm.runInContext('calculateIncome()', f.context), 25.5);
  assert.equal(vm.runInContext('calculateExpenses()', f.context), 0);
  assert.equal(vm.runInContext('calculateBalance()', f.context), 25.5);

  // Rejected writes preserve the input, old totals and retry controls.
  f = fixture({ rows: [expense], form: true, search: '?edit=edit-one' });
  await vm.runInContext('startApp()', f.context);
  f.fields.set('amount', '25');
  f.context.atualizarTransacao = async () => { throw new Error('offline'); };
  await f.formNode.handlers.submit[0]({ preventDefault() {} });
  assert.equal(f.fields.get('amount'), '25');
  assert.equal(f.submit.disabled, false);
  assert.equal(f.location.href, '');
  assert.equal(vm.runInContext('calculateExpenses()', f.context), 10);
  assert.match(f.nodes['#form-error'].textContent, /nuvem/);
  f.context.atualizarTransacao = async () => { throw Object.assign(new Error('deleted'), { code: 'not-found' }); };
  await f.formNode.handlers.submit[0]({ preventDefault() {} });
  assert.match(f.nodes['#form-error'].textContent, /não existe mais/);
  assert.equal(f.state.saves.length, 0);

  // URL IDs absent from this account cannot be submitted as new transactions.
  f = fixture({ rows: [], form: true, search: '?edit=another-account-id' });
  await vm.runInContext('startApp()', f.context);
  assert.equal(f.submit.disabled, true);
  assert.match(f.nodes['#form-error'].textContent, /não encontrada/);
  await f.formNode.handlers.submit[0]({ preventDefault() {} });
  assert.equal(f.state.saves.length + f.state.updates.length, 0);

  // Invalid values cannot reach Firestore even if native form validation is bypassed.
  for (const [key, value] of [['amount','-1'], ['amount','NaN'], ['date','2026-02-30'], ['date','2026-13-01'], ['type','other'], ['category','Income'], ['paymentMethod','unknown'], ['description',' '], ['description','x'.repeat(101)], ['notes','x'.repeat(501)]]) {
    f = fixture({ rows: [expense], form: true, search: '?edit=edit-one' });
    await vm.runInContext('startApp()', f.context);
    f.fields.set(key, value);
    await f.formNode.handlers.submit[0]({ preventDefault() {} });
    assert.equal(f.state.updates.length, 0, `${key}: ${value}`);
    assert.equal(f.location.href, '');
  }

  // Switching account while a request is pending must not resume the old UI.
  f = fixture({ rows: [expense], form: true, search: '?edit=edit-one' });
  await vm.runInContext('startApp()', f.context);
  let complete;
  f.context.atualizarTransacao = () => new Promise(resolve => { complete = resolve; });
  const request = f.formNode.handlers.submit[0]({ preventDefault() {} });
  f.changeUser({ uid: 'account-b' }); complete(); await request;
  assert.equal(f.location.replaced, 'login.html');
  assert.equal(f.location.href, '');
  assert.equal(vm.runInContext('transactions.length', f.context), 0);

  // The real store uses updateDoc on the original UID path; it does not call setDoc.
  const store = stripImports(fs.readFileSync(root + 'js/transactions-store.js', 'utf8')).replace(/\bexport /g, '');
  const auth = { currentUser: { uid: 'account-a' } };
  const stored = new Map([['users/account-a/transactions/edit-one', { ...expense, extra: 'preserved' }]]);
  let updateCalls = 0;
  const context = vm.createContext({
    app: {}, getAuth: () => auth, getFirestore: () => 'db',
    collection: (...args) => args.slice(1).join('/'), doc: (parent, id) => parent + '/' + id,
    updateDoc: async (target, data) => {
      updateCalls++;
      if (!stored.has(target)) throw Object.assign(new Error('missing'), { code: 'not-found' });
      stored.set(target, { ...stored.get(target), ...data });
    },
    setDoc: () => { throw new Error('Editing must not recreate a document'); }
  });
  vm.runInContext(store, context); context.row = { ...expense, amount: 25 };
  await vm.runInContext('atualizarTransacao(row, "account-a")', context);
  assert.equal(stored.get('users/account-a/transactions/edit-one').amount, 25);
  assert.equal(stored.get('users/account-a/transactions/edit-one').extra, 'preserved');
  stored.clear(); await assert.rejects(vm.runInContext('atualizarTransacao(row, "account-a")', context), /missing/);
  assert.equal(stored.size, 0);
  auth.currentUser = { uid: 'account-b' };
  await assert.rejects(vm.runInContext('atualizarTransacao(row, "account-a")', context), /conta mudou/);
  assert.equal(updateCalls, 2);
  console.log('PASS: transaction edit prefill/reset, PT/EN preservation, same ID, server acknowledgement, duplicate prevention, month/type changes, reload, failed/missing writes, validation and account changes. Firestore simulated.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });

(async () => {
 const f = fixture({ rows: [row, {...row, id:'older', amount:50, date:'2026-10-01'}, {...row, id:'later', amount:20, date:'2026-11-01'}] });
 await vm.runInContext('startApp()', f.context);
 vm.runInContext('opening = {openingBalance: -10, openingDate: "2026-10-02"}', f.context);
 assert.equal(vm.runInContext('calculateBalance()', f.context), 90);
 assert.equal(vm.runInContext('calculateIncome()', f.context), 150);
 vm.runInContext('selectedMonth = "2026-11"', f.context);
 assert.equal(vm.runInContext('calculateBalance()', f.context), 110);
 vm.runInContext('selectedMonth = "2026-09"', f.context);
 assert.equal(vm.runInContext('calculateBalance()', f.context), null);
 const source = stripImports(fs.readFileSync(root+'js/settings-store.js','utf8')).replace(/\bexport /g,'');
 const paths=[]; let stored=null;
 const c=vm.createContext({ app:{}, getAuth:()=>({currentUser:{uid:'private-user'}}), getFirestore:()=>({}), doc:(_, ...args)=>{paths.push(args);return args;}, getDocFromServer:async()=>({exists:()=>stored!==null,data:()=>stored}), setDoc:async(_,v)=>{stored=v;} });
 vm.runInContext(source,c);
 assert.equal(vm.runInContext('validOpening({openingBalance:0, openingDate:"2026-02-30"})',c),false);
 assert.equal(vm.runInContext('validOpening({openingBalance:0, openingDate:"2026-99-99"})',c),false);
 await vm.runInContext('salvarSaldoInicial({openingBalance:-20.125,openingDate:"2026-10-02"})',c);
 assert.equal(stored.openingBalance,-20.12);
 const loaded=await vm.runInContext('carregarSaldoInicial()',c);
 assert.equal(loaded.openingDate,'2026-10-02');
 assert.equal(paths.every(p=>p.join('/')==='users/private-user/settings/finance'),true);
 console.log('PASS: dated opening balance, same-day inclusion, prior transaction exclusion, future carry, negative values, invalid dates, UID storage and reload.');
})().catch(error=>{console.error(error);process.exitCode=1;});

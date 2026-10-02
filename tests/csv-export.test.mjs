import assert from "node:assert/strict";
import { transactionsCSV } from "../js/csv-export.js";

const rows = [
  { id: "b", date: "2026-10-02", name: 'Almoço; "família"', type: "expense", category: "Food", paymentMethod: "Pix", amount: 12.34, notes: "Linha 1\nLinha 2, detalhe" },
  { id: "a", date: "2026-10-01", name: '=HYPERLINK("test")', type: "income", category: "Income", paymentMethod: "Pix", amount: 1000, notes: "  +formula" },
  { id: "c", date: "2026-11-01", name: "Outro mês", type: "income", category: "Income", paymentMethod: "Pix", amount: 5 },
];
const translate = text => ({ Food: "Alimentação", Income: "Receita", Expenses: "Despesas" }[text] || text);
const pt = transactionsCSV(rows, "2026-10", "pt", translate);
const en = transactionsCSV(rows, "2026-10", "en");
assert.equal(pt.charCodeAt(0), 0xfeff);
assert.ok(pt.includes('"Almoço; ""família"""'));
assert.ok(pt.includes('"Linha 1\nLinha 2, detalhe"'));
assert.ok(pt.includes('"-12,34"'));
assert.ok(en.includes('"-12.34"'));
assert.ok(pt.includes('"Alimentação"'));
assert.ok(pt.indexOf('"01/10/2026"') < pt.indexOf('"02/10/2026"'));
assert.ok(en.includes('"2026-10-01"'));
assert.ok(pt.includes('"\'=HYPERLINK(""test"")"'));
assert.ok(pt.includes('"\'  +formula"'));
assert.equal(pt.includes("Outro mês"), false);
assert.equal(rows[0].id, "b", "export must not reorder the app's array");
for (const name of ["@SUM(1)", "-1+1", "\t=2+2", "\r+cmd"]) {
  assert.ok(transactionsCSV([{ ...rows[0], name }], "2026-10").includes(`"'${name}"`));
}
assert.equal(transactionsCSV([], "2026-10").split("\r\n").length, 2);
console.log("CSV tests passed.");

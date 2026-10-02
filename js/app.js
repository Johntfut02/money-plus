import { carregarSaldoInicial, salvarSaldoInicial, validOpening } from "./settings-store.js";
/* Money+ — calculations and page interactions, with private Firestore data. */
import { app } from "./firebase-config.js";
import { carregarTransacoes, salvarTransacao, excluirTransacao } from "./transactions-store.js";
import { carregarOrcamentos, salvarLimite } from "./budgets-store.js";
import { language, t, locale, setupLanguage } from "./i18n.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const auth = getAuth(app);
let currentUser = null;
let saving = false;
let savingBudget = false;
let budgetsByMonth = {};
let opening = { openingBalance: 0, openingDate: null };
const hoje = new Date();

const DEFAULT_MONTH =
  `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
const budgets = {
  Housing: 0,
  Food: 0,
  Transportation: 0,
  Entertainment: 0,
  Subscriptions: 0,
  Shopping: 0,
};
const categoryDetails = {
  Housing: { label: "Housing", icon: "home", color: "#d5a641" },
  Food: { label: "Food & Groceries", icon: "food", color: "#21c76b" },
  Transportation: { label: "Transportation", icon: "car", color: "#619cf5" },
  Entertainment: { label: "Entertainment", icon: "play", color: "#f0a200" },
  Subscriptions: { label: "Subscriptions", icon: "receipt", color: "#a34ef0" },
  Shopping: { label: "Shopping & Personal", icon: "bag", color: "#85858d" },
  Income: { label: "Income", icon: "bank", color: "#26d797" },
};
const icons = {
  home: '<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/>',
  receipt: '<path d="M6 3h13v18l-3-2-3 2-3-2-4 2zM9 7h7M9 11h7M9 15h5"/>',
  wallet:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 9h5v6h-5zM6 7h10"/><path d="M18 12h.01"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-10 4h5m-5 3h3"/>',
  flag: '<path d="M5 22V3l14 2v9L5 12"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-14 5h4"/>',
  trend: '<path d="m3 18 6-6 4 3 8-10m-6 0h6v6"/>',
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
  settings:
    '<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  bell: '<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zm5 3h4"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  up: '<path d="M12 20V4m-6 6 6-6 6 6"/>',
  down: '<path d="M12 4v16m-6-6 6 6 6-6"/>',
  pig: '<path d="M5 7h9l3-3v5l4 2v6h-3v4h-3v-3H9v3H6v-4l-3-3V9l2-2zm3-3h5m3 8h.01"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4m-2-2h4"/>',
  wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10 4a5 5 0 0 1 6 0m-3 4h.01"/>',
  play: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="m10 9 6 4-6 4zm-3-8 2 4m3-4 2 4"/>',
  bank: '<path d="m3 8 9-5 9 5H3zm2 3v7m5-7v7m4-7v7m5-7v7M3 21h18"/>',
  food: '<path d="M5 3v6m3-6v6M2 3v6a3 3 0 0 0 6 0m-3 3v9m12 0V3c-4 3-4 9 0 10"/>',
  car: '<path d="m5 5-2 6v8h3v-3h12v3h3v-8l-2-6zm-2 6h18M6 13h2m8 0h2"/>',
  bag: '<rect x="4" y="7" width="16" height="15" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>',
  trash: '<path d="M3 6h18M9 3h6m-9 3 1 15h10l1-15M10 10v7m4-7v7"/>',
  reset: '<path d="M3 10a9 9 0 1 1 1 8M3 4v6h6m3-4v6l4 3"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
  left: '<path d="m15 4-8 8 8 8"/>',
};
const icon = (name) =>
  `<i data-icon="${name}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.receipt}</svg></i>`;
const money = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character],
  );
const sumAmounts = (rows) =>
  rows.reduce((total, row) => total + Math.round(row.amount * 100), 0) / 100;
let transactions = [];
let selectedMonth = DEFAULT_MONTH;
let activeFilter = "all";
let searchTerm = "";
let toastTimer;

function isValidTransaction(row) {
  return (
    row &&
    typeof row.id === "string" &&
    typeof row.name === "string" &&
    ["income", "expense"].includes(row.type) &&
    Number.isFinite(row.amount) &&
    row.amount > 0 &&
    typeof row.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(row.date) &&
    row.category in categoryDetails &&
    typeof row.paymentMethod === "string" &&
    (row.notes === undefined || typeof row.notes === "string")
  );
}
function applyMonthlyBudget() {
  const limits = budgetsByMonth[selectedMonth] || {};
  Object.keys(budgets).forEach((category) => { budgets[category] = limits[category] || 0; });
}

function monthlyTransactions(month = selectedMonth) {
  return transactions.filter((row) => row.date.startsWith(month));
}
function calculateIncome(rows = monthlyTransactions()) {
  return sumAmounts(rows.filter((row) => row.type === "income"));
}
function calculateExpenses(rows = monthlyTransactions()) {
  return sumAmounts(rows.filter((row) => row.type === "expense"));
}
function calculateSavings(rows = monthlyTransactions()) {
  return Math.round((calculateIncome(rows) - calculateExpenses(rows)) * 100) / 100;
}
// The opening amount is the balance at the beginning of its date.
function calculateBalance() {
  if (opening.openingDate && selectedMonth < opening.openingDate.slice(0, 7)) return null;
  return Math.round((opening.openingBalance + calculateSavings(transactions.filter(row =>
    row.date.slice(0, 7) <= selectedMonth && (!opening.openingDate || row.date >= opening.openingDate)
  ))) * 100) / 100;
}
function calculateCategorySpending(rows = monthlyTransactions()) {
  return rows
    .filter((row) => row.type === "expense")
    .reduce((totals, row) => {
      totals[row.category] = Math.round(((totals[row.category] || 0) + row.amount) * 100) / 100;
      return totals;
    }, {});
}
function calculateBudgetUsage() {
  const limit = Object.values(budgets).reduce((total, amount) => total + amount, 0);
  const spent = calculateExpenses();
  return {
    limit,
    spent,
    remaining: limit > 0 ? Math.round((limit - spent) * 100) / 100 : 0,
    percentage: limit > 0 ? (spent / limit) * 100 : 0,
  };
}
function getInsights() {
  const spending = calculateCategorySpending();
  const income = calculateIncome();
  const expenses = calculateExpenses();
  const messages = [];
  if (expenses > income) messages.push(t("Your expenses are currently higher than your income."));
  Object.entries(budgets).forEach(([category, limit]) => {
    const spent = spending[category] || 0;
    if (limit <= 0) return;
    if (spent > limit)
      messages.push(
        language === "pt"
          ? `${t(categoryDetails[category].label)} está ${money(spent - limit)} acima do orçamento.`
          : `${categoryDetails[category].label} is ${money(spent - limit)} over budget.`,
      );
    else if (spent / limit >= 0.8)
      messages.push(
        language === "pt"
          ? `Seu orçamento de ${t(categoryDetails[category].label)} atingiu ${Math.round((spent / limit) * 100)}%.`
          : `Your ${categoryDetails[category].label} budget has reached ${Math.round((spent / limit) * 100)}%.`,
      );
  });
  if (income > 0 && calculateSavings() / income >= 0.2)
    messages.push(
      language === "pt"
        ? `Você economizou ${((calculateSavings() / income) * 100).toFixed(1)}% da sua receita neste mês.`
        : `You've saved ${((calculateSavings() / income) * 100).toFixed(1)}% of your income this month.`,
    );
  if (!messages.length)
    messages.push(
      t(
        expenses === 0
          ? "No expenses recorded for this month yet."
          : Object.values(budgets).some((limit) => limit > 0)
            ? "Your spending is currently within your monthly budget."
            : "Set category limits to track your budget.",
      ),
    );
  return messages.slice(0, 2);
}
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 4000);
}
function monthLabel(month) {
  return new Date(month + "-01T12:00:00").toLocaleDateString(locale(), {
    month: "long",
    year: "numeric",
  });
}
function shortDate(date) {
  return new Date(date + "T12:00:00").toLocaleDateString(locale(), {
    day: "2-digit",
    month: "short",
  });
}
function updateMonthOptions() {
  const mesesDisponiveis = [];

  // Inclui o mês atual e os próximos 12 meses.
  for (let i = 0; i <= 12; i++) {
    const data = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + i,
      1
    );

    mesesDisponiveis.push(
      `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`
    );
  }

  // Preserva também os meses que têm transações.
  const months = [
    ...new Set([
      ...mesesDisponiveis,
      selectedMonth,
      ...Object.keys(budgetsByMonth),
      ...transactions.map((row) => row.date.slice(0, 7))
    ])
  ].sort();
  document.querySelectorAll(".month-control").forEach((select) => {
    select.innerHTML = months
      .map((month) =>
        `<option value="${month}">${monthLabel(month)}</option>`
      )
      .join("");

    select.value = selectedMonth;
  });
}
function fillIcons() {
  document.querySelectorAll("i[data-icon]:empty").forEach((element) => {
    element.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[element.dataset.icon] || icons.receipt}</svg>`;
  });
}
function renderTotals() {
  const openingLabel = document.querySelector("#opening-summary");
  if (openingLabel) openingLabel.textContent = `${money(opening.openingBalance)}${opening.openingDate ? " · " + opening.openingDate.split("-").reverse().join("/") : ""}`;
  const note = document.querySelector("#opening-note");
  if (note) note.textContent = calculateBalance() === null ? t("Balance unavailable before the opening date.") : "";
  const income = calculateIncome();
  const usage = calculateBudgetUsage();
  const totals = {
    income,
    expenses: usage.spent,
    savings: calculateSavings(),
    balance: calculateBalance(),
    donut: usage.spent,
  };
  document.querySelectorAll("[data-total]").forEach((element) => {
    element.textContent = totals[element.dataset.total] === null ? "—" : money(totals[element.dataset.total]);
  });
  document.querySelectorAll(".selected-month").forEach((element) => {
    element.textContent = monthLabel(selectedMonth);
  });
  document.querySelectorAll("[data-deposits]").forEach((element) => {
    element.textContent = monthlyTransactions().filter((row) => row.type === "income").length;
  });
  document.querySelectorAll("[data-usage]").forEach((element) => {
    element.textContent = usage.limit > 0 ? `${usage.percentage.toFixed(1)}% ${language === "pt" ? "utilizado" : "used"}` : t("No budget set");
  });
  document.querySelectorAll("[data-rate]").forEach((element) => {
    element.textContent = `${income > 0 ? ((calculateSavings() / income) * 100).toFixed(1) : "0.0"}% ${language === "pt" ? "de economia" : "rate"}`;
  });
  document.querySelectorAll("[data-budget-limit]").forEach((element) => {
    element.textContent = money(usage.limit);
  });
  document.querySelectorAll("[data-remaining]").forEach((element) => {
    element.textContent = money(usage.remaining);
    element.classList.toggle("negative", usage.remaining < 0);
  });
  document.querySelectorAll("[data-budget-progress]").forEach((element) => {
    element.style.width = Math.min(100, usage.percentage) + "%";
    element.parentElement.classList.toggle("over", usage.percentage > 100);
  });
  document.querySelectorAll("[data-budget-status]").forEach((element) => {
    element.textContent = t(
      usage.limit <= 0 ? "No budget set" : usage.percentage > 100 ? "Over Budget" : usage.percentage >= 80 ? "Near Limit" : "On Track",
    );
  });
  document.querySelectorAll("[data-insights]").forEach((element) => {
    element.innerHTML = getInsights()
      .map((message) => `<p>${escapeHTML(message)}</p>`)
      .join("");
  });
  document.querySelectorAll("[data-transaction-count]").forEach((element) => {
    element.textContent = monthlyTransactions().length;
  });
  document.querySelectorAll("[data-flow-status]").forEach((element) => {
    element.textContent = t(calculateSavings() >= 0 ? "Balanced" : "Deficit");
  });
}
function transactionRow(row, allowDelete = false) {
  const category = categoryDetails[row.category];
  return `<div class="transaction-row"><span class="transaction-icon ${row.type}">${icon(category.icon)}</span><div class="transaction-info"><strong title="${escapeHTML(row.id.startsWith("demo-") ? t(row.name) : row.name)}">${escapeHTML(row.id.startsWith("demo-") ? t(row.name) : row.name)}</strong><small>${escapeHTML(t(category.label))} · ${allowDelete ? escapeHTML(t(row.paymentMethod)) : shortDate(row.date)}</small></div><div class="transaction-amount ${row.type === "income" ? "positive" : allowDelete ? "negative" : ""}">${row.type === "income" ? "+" : "-"} ${money(row.amount)}<small class="muted">${allowDelete ? "" : escapeHTML(t(row.paymentMethod))}</small></div>${allowDelete ? `<button class="delete-button" data-delete="${escapeHTML(row.id)}" aria-label="${language === "pt" ? "Excluir" : "Delete"} ${escapeHTML(row.id.startsWith("demo-") ? t(row.name) : row.name)}">${icon("trash")}</button>` : ""}</div>`;
}
function sortedTransactions(rows) {
  return [...rows].sort((a, b) => b.date.localeCompare(a.date));
}
function renderRecent() {
  const element = document.querySelector("#recent-transactions");
  if (!element) return;
  const rows = sortedTransactions(monthlyTransactions());
  element.innerHTML = rows.length
    ? rows
        .slice(0, 5)
        .map((row) => transactionRow(row))
        .join("")
    : `<p class="empty-state">${t("No transactions this month.")}</p>`;
  document.querySelector("[data-recent-count]").textContent =
    language === "pt"
      ? `Exibindo ${Math.min(5, rows.length)} de ${rows.length} transações`
      : `Showing ${Math.min(5, rows.length)} of ${rows.length} transactions`;
}
function renderTransactions() {
  const element = document.querySelector("#transaction-list");
  if (!element) return;
  const rows = sortedTransactions(
    monthlyTransactions().filter(
      (row) =>
        (activeFilter === "all" || row.type === activeFilter) &&
        `${row.name} ${row.id.startsWith("demo-") ? t(row.name) : ""} ${row.category} ${t(row.category)} ${row.notes || ""} ${row.paymentMethod} ${t(row.paymentMethod)}`
          .toLowerCase()
          .includes(searchTerm),
    ),
  );
  const groups = rows.reduce((result, row) => {
    (result[row.date] ||= []).push(row);
    return result;
  }, {});
  element.innerHTML = rows.length
    ? Object.entries(groups)
        .map(([date, group]) => {
          const net = calculateSavings(group);
          return `<section><div class="date-heading"><span>${new Date(date + "T12:00:00").toLocaleDateString(locale(), { day: "numeric", month: "long", year: "numeric" })}</span><span class="badge ${net >= 0 ? "positive" : "negative"}">${net >= 0 ? "+" : "-"} ${money(Math.abs(net))}</span></div><div class="transaction-group">${group.map((row) => transactionRow(row, true)).join("")}</div></section>`;
        })
        .join("")
    : `<div class="empty-state">${t("No transactions found. Try another search or add an entry.")}</div>`;
  document.querySelector("#results-count").textContent =
    language === "pt"
      ? `Exibindo ${rows.length} de ${monthlyTransactions().length} transações`
      : `Showing ${rows.length} of ${monthlyTransactions().length} transactions`;
}
function renderCategories() {
  const spending = calculateCategorySpending();
  const total = calculateExpenses();
  const entries = Object.entries(budgets);
  const donut = document.querySelector(".donut");
  if (donut) {
    let angle = 0;
    const stops = entries.map(([category]) => {
      const start = angle;
      angle += total ? ((spending[category] || 0) / total) * 360 : 0;
      return `${categoryDetails[category].color} ${start}deg ${angle}deg`;
    });
    donut.style.background = total ? `conic-gradient(${stops.join(",")})` : "#343438";
    document.querySelector("[data-category-count]").textContent =
      `${Object.keys(spending).length} ${language === "pt" ? "categorias" : "Categories"}`;
    document.querySelector("#category-legend").innerHTML = entries
      .map(
        ([category]) =>
          `<div class="legend-row"><b style="background:${categoryDetails[category].color}"></b><span>${t(category)}<small> (${total ? Math.round(((spending[category] || 0) / total) * 100) : 0}%)</small></span><strong>${money(spending[category] || 0)}</strong></div>`,
      )
      .join("");
  }
  const budgetList = document.querySelector("#budget-categories");
  if (budgetList) {
    const activeCount = document.querySelector("[data-active-budgets]");
    if (activeCount) activeCount.textContent = `${entries.filter(([, limit]) => limit > 0).length} ${t("active budgets")}`;
    budgetList.innerHTML = entries
      .map(([category, limit]) => {
        const spent = spending[category] || 0;
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;
        const over = limit > 0 && spent > limit;
        const near = percentage >= 80;
        return `<article class="card budget-category ${over ? "over-budget" : ""}"><div class="budget-category-header"><span class="category-symbol">${icon(categoryDetails[category].icon)}</span><div><h2>${t(categoryDetails[category].label)}</h2><small>${language === "pt" ? "Limite" : "Target"}: ${money(limit)}</small></div><div><span class="badge ${over ? "negative" : near ? "" : "positive"}">${t(limit <= 0 ? "No budget set" : over ? "⚠ Over Budget" : near ? "Near Limit" : "Normal Pace")}</span><strong class="${over ? "negative" : ""}">${money(spent)}</strong></div></div><div class="progress ${over ? "over" : ""}"><span style="width:${Math.min(100, percentage)}%"></span></div><div class="budget-foot ${over ? "negative" : ""}"><span>${limit > 0 ? `${Math.round(percentage)}% ${language === "pt" ? "utilizado" : "spent"}` : t("No budget set")}</span><span>${money(limit > 0 ? Math.abs(limit - spent) : 0)} ${language === "pt" ? (over ? "excedidos" : "restantes") : over ? "overrun" : "left"}</span></div><form class="budget-editor" data-budget-category="${category}"><label for="limit-${category}">${t("Monthly limit (R$)")}</label><div class="budget-editor-controls"><input id="limit-${category}" name="limit" type="number" min="0" max="999999999" step="0.01" value="${limit.toFixed(2)}" required inputmode="decimal"><button class="button primary" type="submit">${t("Save limit")}</button></div><p class="budget-error" role="status" aria-live="polite"></p></form></article>`;
      })
      .join("");
    const days = new Date(
      Number(selectedMonth.slice(0, 4)),
      Number(selectedMonth.slice(5, 7)),
      0,
    ).getDate();
    document.querySelector("[data-daily-average]").textContent = money(total / days);
  }
}
let chartPeriod = 6;
function renderCashChart() {
  const chart = document.querySelector("#cash-chart");
  if (!chart) return;
  // All bars use real transactions, including months with no entries.
  const endDate = new Date(selectedMonth + "-01T12:00:00");
  const rows = Array.from({ length: chartPeriod }, (_, index) => {
    const date = new Date(endDate.getFullYear(), endDate.getMonth() - chartPeriod + 1 + index, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const entries = monthlyTransactions(month);
    return {
      label: date.toLocaleDateString(locale(), { month: "short", year: "2-digit" }),
      income: calculateIncome(entries),
      expenses: calculateExpenses(entries)
    };
  });
  const max = Math.max(1, ...rows.flatMap((row) => [row.income, row.expenses])) * 1.15;
  chart.innerHTML = `<div class="bar-chart">${rows.map((row) => `<div class="bar-group"><div class="chart-bar" style="height:${(row.income / max) * 100}%" title="${t(row.label)} ${t("Income")}: ${money(row.income)}"></div><div class="chart-bar expense" style="height:${(row.expenses / max) * 100}%" title="${t(row.label)} ${t("Expenses")}: ${money(row.expenses)}"></div></div>`).join("")}</div><div class="chart-labels">${rows.map((row) => `<span>${t(row.label)}</span>`).join("")}</div>`;
  chart.setAttribute(
    "aria-label",
    rows
      .map(
        (row) =>
          `${t(row.label)}: ${t("Income")} ${money(row.income)}, ${t("Expenses")} ${money(row.expenses)}`,
      )
      .join("; "),
  );
}
function renderPage() {
  applyMonthlyBudget();
  renderTotals();
  renderRecent();
  renderTransactions();
  renderCategories();
  renderCashChart();
  fillIcons();
}
function renderCategoryOptions(type) {
  const categories = type === "income" ? ["Income"] : Object.keys(budgets);
  document.querySelector("#category-options").innerHTML = categories
    .map(
      (category, index) =>
        `<label class="category-option"><input type="radio" name="category" value="${category}" ${index === 0 ? "checked" : ""} required><span>${icon(categoryDetails[category].icon)}${t(category === "Transportation" ? "Transport" : category)}</span></label>`,
    )
    .join("");
  document.querySelector("#category-selected").textContent = t(
    categoryDetails[categories[0]].label,
  );
}
function setupForm() {
  const form = document.querySelector("#transaction-form");
  if (!form) return;
  const initialType =
    new URLSearchParams(location.search).get("type") === "income" ? "income" : "expense";
  form.elements.type.value = initialType;
  const today = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
  form.elements.date.defaultValue = today;
  form.elements.date.value = today;
  renderCategoryOptions(initialType);
  form.addEventListener("change", (event) => {
    if (event.target.name === "type") renderCategoryOptions(event.target.value);
    if (event.target.name === "category")
      document.querySelector("#category-selected").textContent = t(
        categoryDetails[event.target.value].label,
      );
  });
  form.addEventListener("reset", () => {
    setTimeout(() => {
      renderCategoryOptions("expense");
      document.querySelector("#form-error").textContent = "";
    }, 0);
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (saving) return;
    const fields = new FormData(form);
    const amount = Number(fields.get("amount"));
    const name = fields.get("description").trim();
    const date = fields.get("date");
    const type = fields.get("type");
    const category = fields.get("category");
    if (
      !name ||
      !Number.isFinite(amount) ||
      amount < 0.01 ||
      amount > 999999999 ||
      !date ||
      !(category in categoryDetails) ||
      (type === "income" && category !== "Income") ||
      (type === "expense" && category === "Income")
    ) {
      document.querySelector("#form-error").textContent = t(
        "Enter a description, valid amount, category and date.",
      );
      return;
    }
    const row = {
      id:
        globalThis.crypto?.randomUUID?.() ||
        `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      type,
      amount: Math.round(amount * 100) / 100,
      category,
      date,
      paymentMethod: fields.get("paymentMethod"),
      notes: fields.get("notes").trim(),
    };
    const submitButtons = form.querySelectorAll('[type="submit"]');
    saving = true;
    submitButtons.forEach((button) => { button.disabled = true; });
    document.querySelector("#form-error").textContent = "";
    try {
      // Navigate only after the server confirms this individual transaction.
      await salvarTransacao(row);
      location.href = `transactions.html?saved=1&month=${encodeURIComponent(date.slice(0, 7))}`;
    } catch (error) {
      console.error(error);
      document.querySelector("#form-error").textContent = t("Could not save to the cloud. Check your connection and try again.");
    } finally {
      saving = false;
      submitButtons.forEach((button) => { button.disabled = false; });
    }
  });
}
function setupBudgetEditor() {
  document.querySelector("#budget-categories")?.addEventListener("submit", async (event) => {
    const form = event.target.closest("[data-budget-category]");
    if (!form) return;
    event.preventDefault();
    if (savingBudget) return;
    const category = form.dataset.budgetCategory;
    const input = form.elements.limit;
    const amount = input.value.trim() === "" ? NaN : Number(input.value);
    const errorMessage = form.querySelector(".budget-error");
    if (!form.checkValidity() || !Number.isFinite(amount) || amount < 0 || amount > 999999999) {
      errorMessage.textContent = t("Enter a valid limit. Use zero for no budget.");
      return;
    }
    const month = selectedMonth;
    const uid = auth.currentUser?.uid;
    const controls = document.querySelectorAll("#budget-categories input, #budget-categories button, .month-control, .language-control");
    savingBudget = true;
    controls.forEach((control) => { control.disabled = true; });
    errorMessage.textContent = t("Saving…");
    try {
      await salvarLimite(month, category, amount);
      if (auth.currentUser?.uid !== uid) return;
      budgetsByMonth[month] ||= {};
      budgetsByMonth[month][category] = Math.round(amount * 100) / 100;
      updateMonthOptions();
      renderPage();
      showToast(t("Budget saved successfully."));
    } catch (error) {
      console.error(error);
      errorMessage.textContent = t("Could not save the budget. Check your connection and try again.");
    } finally {
      savingBudget = false;
      controls.forEach((control) => { control.disabled = false; });
    }
  });
}

function setupOpeningEditor() {
  const form = document.querySelector("#opening-form");
  if (!form) return;
  form.elements.openingBalance.value = opening.openingBalance.toFixed(2);
  form.elements.openingDate.value = opening.openingDate || `${DEFAULT_MONTH}-${String(hoje.getDate()).padStart(2, "0")}`;
  let pending = false;
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (pending) return;
    const value = { openingBalance: Number(form.elements.openingBalance.value), openingDate: form.elements.openingDate.value };
    const status = document.querySelector("#opening-status");
    if (!form.elements.openingBalance.value.trim() || !validOpening(value)) { status.textContent = t("Enter a valid balance and date."); return; }
    const uid = auth.currentUser?.uid;
    const controls = form.querySelectorAll("input, button");
    pending = true;
    controls.forEach(control => { control.disabled = true; });
    status.textContent = t("Saving…");
    try {
      await salvarSaldoInicial(value);
      if (auth.currentUser?.uid !== uid) return;
      opening = { ...value, openingBalance: Math.round(value.openingBalance * 100) / 100 };
      renderPage();
      status.textContent = t("Opening balance saved.");
    } catch (error) {
      console.error(error);
      status.textContent = t("Could not save the opening balance. Try again.");
    } finally {
      pending = false;
      controls.forEach(control => { control.disabled = false; });
    }
  });
}
function setupInteractions() {
  updateMonthOptions();
  renderPage();
  setupForm();
  setupBudgetEditor();
  setupOpeningEditor();
  setupLanguage({ updateMonthOptions, renderPage, renderCategoryOptions, categoryDetails });
  document.querySelectorAll(".month-control").forEach((select) =>
    select.addEventListener("change", (event) => {
      selectedMonth = event.target.value;
      updateMonthOptions();
      renderPage();
    }),
  );
  document.querySelector("#search")?.addEventListener("input", (event) => {
    searchTerm = event.target.value.toLowerCase().trim();
    renderTransactions();
  });
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.filter === activeFilter);
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", active);
      });
      renderTransactions();
    });
  });
  document.querySelectorAll("[data-period]").forEach((button) => {
    button.setAttribute("aria-pressed", Number(button.dataset.period) === chartPeriod);
    button.addEventListener("click", () => {
      chartPeriod = Number(button.dataset.period);
      document.querySelectorAll("[data-period]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", active);
      });
      renderCashChart();
    });
  });
  document.addEventListener("click", async (event) => {
    const soon = event.target.closest("[data-soon]");
    if (soon) {
      event.preventDefault();
      showToast(t("Coming soon — planned for a future version."));
    }
    const deleteButton = event.target.closest("[data-delete]");
    if (!deleteButton || deleteButton.disabled) return;
    const row = transactions.find((item) => item.id === deleteButton.dataset.delete);
    if (!row || !window.confirm(`${language === "pt" ? "Excluir" : "Delete"} "${row.name}" (${money(row.amount)})?`)) return;
    deleteButton.disabled = true;
    try {
      await excluirTransacao(row.id);
      transactions = transactions.filter((item) => item.id !== row.id);
      renderPage();
      showToast(t("Transaction deleted."));
    } catch (error) {
      console.error(error);
      showToast(t("Could not delete. Check your connection and try again."));
      deleteButton.disabled = false;
    }
  });
  document.querySelector("#signout")?.addEventListener("click", async (event) => {
    event.currentTarget.disabled = true;
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      showToast(t("Could not sign out. Try again."));
      document.querySelector("#signout").disabled = false;
    }
  });
  if (new URLSearchParams(location.search).has("saved")) {
    showToast(t("Transaction saved successfully."));
    history.replaceState(null, "", location.pathname);
  }
}

function renderAccount() {
  document.querySelectorAll(".user-name").forEach((element) => {
    element.textContent = currentUser.displayName || t("Your account");
  });
  document.querySelectorAll(".avatar").forEach((element) => {
    element.textContent = (currentUser.displayName || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((name) => name[0]).join("");
  });
  const greeting = document.querySelector("[data-greeting]");
  if (greeting) greeting.textContent = `${t("Hello")}, ${currentUser.displayName?.split(" ")[0] || t("Your account")}!`;
}

async function startApp() {
  try {
    // Firebase restores the session before any financial data is requested.
    await auth.authStateReady();
    currentUser = auth.currentUser;
    if (!currentUser) {
      location.replace("login.html");
      return;
    }
    const uid = currentUser.uid;
    onAuthStateChanged(auth, (user) => {
      if (user?.uid === uid) return;
      transactions = [];
      budgetsByMonth = {};
      document.body.dataset.session = "loading";
      location.replace("login.html");
    });
    const [loaded, loadedBudgets, loadedOpening] = await Promise.all([carregarTransacoes(), carregarOrcamentos(), carregarSaldoInicial()]);
    if (auth.currentUser?.uid !== uid) return;
    if (!loaded.every(isValidTransaction)) {
      throw new Error("Invalid transaction data in Firestore");
    }
    transactions = loaded;
    budgetsByMonth = loadedBudgets;
    opening = loadedOpening;
    const requestedMonth = new URLSearchParams(location.search).get("month");
    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(requestedMonth || "")) selectedMonth = requestedMonth;
    setupInteractions();
    renderAccount();
    document.querySelectorAll(".language-control").forEach((select) => select.addEventListener("change", renderAccount));
    document.body.dataset.session = "ready";
    document.body.setAttribute("aria-busy", "false");
  } catch (error) {
    console.error(error);
    document.querySelector("#session-message").textContent = t("Could not load your data. Check your connection and reload the page.");
    document.body.setAttribute("aria-busy", "false");
  }
}

startApp();

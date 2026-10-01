/* Money+ — shared data, calculations and page interactions. No dependencies. */
const STORAGE_KEY = "money-plus-transactions-v1";
const MONTH_KEY = "money-plus-month-v1";
const OPENING_BALANCE = 1285;
const DEFAULT_MONTH = "2026-09";
const budgets = {
  Housing: 800,
  Food: 700,
  Transportation: 500,
  Entertainment: 300,
  Subscriptions: 250,
  Shopping: 450,
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
const defaultTransactions = [
  {
    id: "demo-1",
    name: "Salary Deposit",
    category: "Income",
    type: "income",
    amount: 1400,
    date: "2026-09-15",
    paymentMethod: "Bank Transfer",
    notes: "",
  },
  {
    id: "demo-2",
    name: "Monthly Allowance",
    category: "Income",
    type: "income",
    amount: 680,
    date: "2026-09-15",
    paymentMethod: "Pix",
    notes: "",
  },
  {
    id: "demo-3",
    name: "Freelance Web Design",
    category: "Income",
    type: "income",
    amount: 450,
    date: "2026-09-23",
    paymentMethod: "Pix",
    notes: "",
  },
  {
    id: "demo-4",
    name: "English Lessons",
    category: "Income",
    type: "income",
    amount: 750,
    date: "2026-09-10",
    paymentMethod: "Pix",
    notes: "",
  },
  {
    id: "demo-5",
    name: "Rent Contribution",
    category: "Housing",
    type: "expense",
    amount: 700,
    date: "2026-09-05",
    paymentMethod: "Pix",
    notes: "",
  },
  {
    id: "demo-6",
    name: "Supermarket Pão de Açúcar",
    category: "Food",
    type: "expense",
    amount: 187.42,
    date: "2026-09-18",
    paymentMethod: "Credit Card",
    notes: "",
  },
  {
    id: "demo-7",
    name: "Weekly Groceries",
    category: "Food",
    type: "expense",
    amount: 227.58,
    date: "2026-09-12",
    paymentMethod: "Debit Card",
    notes: "",
  },
  {
    id: "demo-8",
    name: "Pizza Night",
    category: "Food",
    type: "expense",
    amount: 100,
    date: "2026-09-07",
    paymentMethod: "Pix",
    notes: "",
  },
  {
    id: "demo-9",
    name: "Fuel Posto Ipiranga",
    category: "Transportation",
    type: "expense",
    amount: 120,
    date: "2026-09-20",
    paymentMethod: "Debit Card",
    notes: "",
  },
  {
    id: "demo-10",
    name: "Fuel & Parking",
    category: "Transportation",
    type: "expense",
    amount: 230,
    date: "2026-09-08",
    paymentMethod: "Credit Card",
    notes: "",
  },
  {
    id: "demo-11",
    name: "Cinema & Games",
    category: "Entertainment",
    type: "expense",
    amount: 245,
    date: "2026-09-14",
    paymentMethod: "Credit Card",
    notes: "",
  },
  {
    id: "demo-12",
    name: "Netflix Subscription",
    category: "Subscriptions",
    type: "expense",
    amount: 49.9,
    date: "2026-09-21",
    paymentMethod: "Credit Card",
    notes: "",
  },
  {
    id: "demo-13",
    name: "Fiber Internet",
    category: "Subscriptions",
    type: "expense",
    amount: 100,
    date: "2026-09-15",
    paymentMethod: "Pix",
    notes: "",
  },
  {
    id: "demo-14",
    name: "Music Subscription",
    category: "Subscriptions",
    type: "expense",
    amount: 44.8,
    date: "2026-09-03",
    paymentMethod: "Credit Card",
    notes: "",
  },
  {
    id: "demo-15",
    name: "Personal Shopping",
    category: "Shopping",
    type: "expense",
    amount: 140.3,
    date: "2026-09-06",
    paymentMethod: "Debit Card",
    notes: "",
  },
];
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
let storageAvailable = true;
let transactions = loadTransactions();
let selectedMonth = DEFAULT_MONTH;
try {
  selectedMonth = localStorage.getItem(MONTH_KEY) || DEFAULT_MONTH;
} catch {
  storageAvailable = false;
}
if (!/^\d{4}-\d{2}$/.test(selectedMonth)) selectedMonth = DEFAULT_MONTH;
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
function loadTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every(isValidTransaction)) return parsed;
    }
    const initial = defaultTransactions.map((row) => ({ ...row }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    storageAvailable = false;
    return defaultTransactions.map((row) => ({ ...row }));
  }
}
function saveTransactions(nextTransactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTransactions));
    transactions = nextTransactions;
    return true;
  } catch {
    storageAvailable = false;
    showToast(t("Could not save. Browser storage is unavailable or full."));
    return false;
  }
}
function resetTransactions() {
  if (
    !window.confirm(
      t("Reset all transactions to the September 2026 demo? This removes your changes."),
    )
  )
    return;
  if (!saveTransactions(defaultTransactions.map((row) => ({ ...row })))) return;
  selectedMonth = DEFAULT_MONTH;
  try {
    localStorage.setItem(MONTH_KEY, selectedMonth);
  } catch {
    /* The page still renders this month. */
  }
  activeFilter = "all";
  searchTerm = "";
  const search = document.querySelector("#search");
  if (search) search.value = "";
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const active = button.dataset.filter === "all";
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active);
  });
  updateMonthOptions();
  renderPage();
  showToast(t("Demo data restored."));
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
// Available balance includes the opening balance and all entries through this month.
function calculateBalance() {
  return (
    Math.round(
      (OPENING_BALANCE +
        calculateSavings(transactions.filter((row) => row.date.slice(0, 7) <= selectedMonth))) *
        100,
    ) / 100
  );
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
    remaining: Math.round((limit - spent) * 100) / 100,
    percentage: (spent / limit) * 100,
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
          : "Your spending is currently within your monthly budget.",
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
  const months = [
    ...new Set([DEFAULT_MONTH, selectedMonth, ...transactions.map((row) => row.date.slice(0, 7))]),
  ]
    .sort()
    .reverse();
  document.querySelectorAll(".month-control").forEach((select) => {
    select.innerHTML = months
      .map((month) => `<option value="${month}">${monthLabel(month)}</option>`)
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
    element.textContent = money(totals[element.dataset.total]);
  });
  document.querySelectorAll(".selected-month").forEach((element) => {
    element.textContent = monthLabel(selectedMonth);
  });
  document.querySelectorAll("[data-deposits]").forEach((element) => {
    element.textContent = monthlyTransactions().filter((row) => row.type === "income").length;
  });
  document.querySelectorAll("[data-usage]").forEach((element) => {
    element.textContent = `${usage.percentage.toFixed(1)}% ${language === "pt" ? "utilizado" : "used"}`;
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
      usage.percentage > 100 ? "Over Budget" : usage.percentage >= 80 ? "Near Limit" : "On Track",
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
    budgetList.innerHTML = entries
      .map(([category, limit]) => {
        const spent = spending[category] || 0;
        const percentage = (spent / limit) * 100;
        const over = spent > limit;
        const near = percentage >= 80;
        return `<article class="card budget-category ${over ? "over-budget" : ""}"><div class="budget-category-header"><span class="category-symbol">${icon(categoryDetails[category].icon)}</span><div><h2>${t(categoryDetails[category].label)}</h2><small>${language === "pt" ? "Limite" : "Target"}: ${money(limit)}</small></div><div><span class="badge ${over ? "negative" : near ? "" : "positive"}">${t(over ? "⚠ Over Budget" : near ? "Near Limit" : "Normal Pace")}</span><strong class="${over ? "negative" : ""}">${money(spent)}</strong></div></div><div class="progress ${over ? "over" : ""}"><span style="width:${Math.min(100, percentage)}%"></span></div><div class="budget-foot ${over ? "negative" : ""}"><span>${Math.round(percentage)}% ${language === "pt" ? "utilizado" : "spent"}</span><span>${money(Math.abs(limit - spent))} ${language === "pt" ? (over ? "excedidos" : "restantes") : over ? "overrun" : "left"}</span></div></article>`;
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
const previousCashFlow = [
  { label: "Oct", income: 2600, expenses: 1750 },
  { label: "Nov", income: 2800, expenses: 1900 },
  { label: "Dec", income: 3150, expenses: 2600 },
  { label: "Jan", income: 2900, expenses: 2100 },
  { label: "Feb", income: 3050, expenses: 2250 },
  { label: "Mar", income: 2700, expenses: 2300 },
  { label: "Apr", income: 2600, expenses: 2000 },
  { label: "May", income: 2850, expenses: 2200 },
  { label: "Jun", income: 3050, expenses: 1750 },
  { label: "Jul", income: 2400, expenses: 2500 },
  { label: "Aug", income: 2900, expenses: 2050 },
];
let chartPeriod = 6;
function renderCashChart() {
  const chart = document.querySelector("#cash-chart");
  if (!chart) return;
  const current = {
    label: new Date(selectedMonth + "-01T12:00:00").toLocaleDateString(locale(), {
      month: "short",
    }),
    income: calculateIncome(),
    expenses: calculateExpenses(),
  };
  // Historical bars are illustrative; the last bar always uses the selected month's real totals.
  const rows =
    selectedMonth === DEFAULT_MONTH
      ? [...previousCashFlow, current].slice(-chartPeriod)
      : [current];
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
  form.addEventListener("submit", (event) => {
    event.preventDefault();
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
    if (!saveTransactions([...transactions, row])) {
      document.querySelector("#form-error").textContent = t(
        "Your transaction could not be saved. Allow browser storage and try again.",
      );
      return;
    }
    try {
      localStorage.setItem(MONTH_KEY, date.slice(0, 7));
    } catch {
      /* Transaction storage has already succeeded. */
    }
    location.href = "transactions.html?saved=1";
  });
}
updateMonthOptions();
renderPage();
setupForm();
setupLanguage();
document.querySelectorAll(".month-control").forEach((select) =>
  select.addEventListener("change", (event) => {
    selectedMonth = event.target.value;
    try {
      localStorage.setItem(MONTH_KEY, selectedMonth);
    } catch {
      showToast(t("Month selection cannot be saved in this browser."));
    }
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
document.addEventListener("click", (event) => {
  const soon = event.target.closest("[data-soon]");
  if (soon) {
    event.preventDefault();
    showToast(t("Coming soon — planned for a future version."));
  }
  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) {
    const row = transactions.find((item) => item.id === deleteButton.dataset.delete);
    if (
      row &&
      window.confirm(
        `${language === "pt" ? "Excluir" : "Delete"} "${row.name}" (${money(row.amount)})?`,
      ) &&
      saveTransactions(transactions.filter((item) => item.id !== row.id))
    ) {
      renderPage();
      showToast(t("Transaction deleted."));
    }
  }
});
document.querySelector("#reset-demo")?.addEventListener("click", resetTransactions);
if (new URLSearchParams(location.search).has("saved")) {
  showToast(t("Transaction saved successfully."));
  history.replaceState(null, "", location.pathname);
}
if (!storageAvailable)
  showToast(
    t("Browser storage is unavailable. Demo data is shown; saving requires storage access."),
  );

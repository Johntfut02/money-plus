/* Native language preference and small, explicit translation dictionary. */
const LANGUAGE_KEY = "money-plus-language-v1";
export let language = navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
try {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  if (["pt", "en"].includes(savedLanguage)) language = savedLanguage;
} catch {
  /* Use the browser language when storage is unavailable. */
}
const portuguese = {
  "Export CSV": "Exportar CSV",
  "Export includes all transactions from the selected month, regardless of search or type filters.": "A exportação inclui todas as transações do mês selecionado, independentemente da busca ou dos filtros de tipo.",
  "No transactions to export for this month.": "Não há transações para exportar neste mês.",
  "CSV download started.": "Download do CSV iniciado.",
  "Could not export. Try again.": "Não foi possível exportar. Tente novamente.",
"Set opening balance": "Definir saldo inicial",
"Opening balance (R$)": "Saldo inicial (R$)",
"Start date": "Data de início",
"Save opening balance": "Salvar saldo inicial",
"Use the balance at the beginning of this date. Transactions from this date onward are added to it.": "Informe o saldo no início desta data. Os lançamentos a partir dela serão somados a esse valor.",
"Balance unavailable before the opening date.": "Saldo indisponível antes da data de início.",
"Enter a valid balance and date.": "Informe um saldo e uma data válidos.",
"Opening balance saved.": "Saldo inicial salvo.",
"Could not save the opening balance. Try again.": "Não foi possível salvar o saldo inicial. Tente novamente.",
  "Monthly limit (R$)": "Limite mensal (R$)",
  "Save limit": "Salvar limite",
  "active budgets": "orçamentos ativos",
  "Enter a valid limit. Use zero for no budget.": "Informe um limite válido. Use zero para deixar sem orçamento.",
  "Saving…": "Salvando…",
  "Budget saved successfully.": "Orçamento salvo com sucesso.",
  "Could not save the budget. Check your connection and try again.": "Não foi possível salvar o orçamento. Verifique a conexão e tente novamente.",
  "Limits apply to the selected month. Zero means no budget set.": "Os limites valem para o mês selecionado. Zero significa orçamento não definido.",
  "Set category limits to track your budget.": "Defina limites por categoria para acompanhar seu orçamento.",
  "No budget set": "Orçamento não definido",
  "Hello": "Olá",
  "Your account": "Sua conta",
  "Sign out": "Sair",
  "Could not save to the cloud. Check your connection and try again.": "Não foi possível salvar na nuvem. Verifique sua conexão e tente novamente.",
  "Could not delete. Check your connection and try again.": "Não foi possível excluir. Verifique sua conexão e tente novamente.",
  "Could not sign out. Try again.": "Não foi possível sair. Tente novamente.",
  "Could not load your data. Check your connection and reload the page.": "Não foi possível carregar seus dados. Verifique a conexão e recarregue a página.",
  "Upcoming payments will be available in a future update.": "As contas a pagar estarão disponíveis em uma atualização futura.",
  Apr: "abr",
  May: "mai",
  Jun: "jun",
  Jul: "jul",
  Aug: "ago",
  Sep: "set",
  Oct: "out",
  Nov: "nov",
  Dec: "dez",
  Jan: "jan",
  Feb: "fev",
  Mar: "mar",
  Dashboard: "Painel",
  Transactions: "Transações",
  Budgets: "Orçamentos",
  "Bills & Recurring": "Contas e recorrências",
  Goals: "Metas",
  Cards: "Cartões",
  Insights: "Análises",
  Settings: "Configurações",
  Home: "Início",
  Budget: "Orçamento",
  More: "Mais",
  HOME: "INÍCIO",
  BUDGET: "ORÇAMENTO",
  TRANSACTIONS: "TRANSAÇÕES",
  "NEW TRANSACTION": "NOVA TRANSAÇÃO",
  "PERSONAL FINANCE": "FINANÇAS PESSOAIS",
  "Add Transaction": "Adicionar transação",
  Add: "Adicionar",
  "Good morning, João": "Bom dia, João",
  "Here's your comprehensive financial overview and cash trajectory for September.":
    "Confira seu panorama financeiro e o fluxo de caixa do mês.",
  "Here's your financial overview.": "Confira seu panorama financeiro.",
  "● UPDATED TODAY": "● ATUALIZADO HOJE",
  "● Updated today": "● Atualizado hoje",
  "AVAILABLE BALANCE": "SALDO DISPONÍVEL",
  "MONTHLY INCOME": "RECEITAS DO MÊS",
  "MONTHLY EXPENSES": "DESPESAS DO MÊS",
  "NET SAVINGS": "ECONOMIA LÍQUIDA",
  "Opening balance": "Saldo inicial",
  "+ Income": "+ Receita",
  "- Expense": "- Despesa",
  "+ Bill": "+ Conta",
  "+ Goal": "+ Meta",
  Income: "Receita",
  Expenses: "Despesas",
  "Cash Flow Analysis": "Análise do fluxo de caixa",
  "Income vs. expenditures over past periods": "Receitas e despesas nos últimos meses",
  "1Y": "1A",
  "Spending by Category": "Gastos por categoria",
  "View All": "Ver tudo",
  SPENT: "GASTO",
  "Monthly Budget": "Orçamento mensal",
  "View Budget": "Ver orçamento",
  "Manage Budget": "Gerenciar orçamento",
  "Remaining:": "Restante:",
  Remaining: "Restante",
  spent: "gastos",
  of: "de",
  limit: "de limite",
  "Money+ Insight": "Análise Money+",
  "RULE BASED": "POR REGRAS",
  "View Insights": "Ver análises",
  "Recent Transactions": "Transações recentes",
  "Last 5 entries recorded this cycle": "Últimos 5 lançamentos deste mês",
  "Upcoming Payments & Bills": "Próximos pagamentos e contas",
  "Preview · future feature": "Prévia · recurso futuro",
  "Fiber Internet": "Internet fibra",
  "Utilities · Due Oct 28": "Serviços · Venc. 28 out.",
  "Subscriptions · Due Oct 05": "Assinaturas · Venc. 05 out.",
  "Example · Due Oct 05": "Exemplo · Venc. 05 out.",
  UPCOMING: "A VENCER",
  "Credit Card Statement": "Fatura do cartão",
  "View all bills & recurring": "Ver contas e recorrências",
  "Search transactions, budgets, cards...": "Buscar transações, orçamentos, cartões...",
  "● Money+ · Personal Finance Tracker": "● Money+ · Controle financeiro pessoal",
  deposits: "recebimentos",
  "· This month": "· Neste mês",
  TOTAL: "NO TOTAL",
  "● All": "● Todas",
  "MONTHLY FLOW CADENCE": "FLUXO FINANCEIRO DO MÊS",
  "↗ Inflow": "↗ Entradas",
  "↙ Outflow": "↙ Saídas",
  "▣ Net Total": "▣ Saldo líquido",
  "Reset demo data": "Restaurar dados de demonstração",
  "30-DAY BILLING CYCLE": "CICLO MENSAL DE 30 DIAS",
  "● TOTAL ALLOCATION": "● ORÇAMENTO TOTAL",
  "Spent of": "Gastos do limite de",
  "Daily Avg": "Média diária",
  "Net Savings": "Economia líquida",
  "Savings Rate": "Taxa de economia",
  "Category Breakdown": "Detalhes por categoria",
  "6 Active Budgets": "6 orçamentos ativos",
  "Category limits are fixed for this demo.":
    "Os limites por categoria são fixos nesta demonstração.",
  "New Transaction": "Nova transação",
  "LEDGER ENTRY": "LANÇAMENTO FINANCEIRO",
  Reset: "Limpar",
  "Transaction type": "Tipo de transação",
  "↗ Expense": "↗ Despesa",
  "↙ Income": "↙ Receita",
  "TOTAL AMOUNT": "VALOR TOTAL",
  DESCRIPTION: "DESCRIÇÃO",
  CATEGORY: "CATEGORIA",
  DATE: "DATA",
  "PAYMENT METHOD": "FORMA DE PAGAMENTO",
  NOTES: "OBSERVAÇÕES",
  Optional: "Opcional",
  "Save Transaction": "Salvar transação",
  Cancel: "Cancelar",
  "Bank Transfer": "Transferência bancária",
  "Credit Card": "Cartão de crédito",
  "Debit Card": "Cartão de débito",
  Cash: "Dinheiro",
  Housing: "Moradia",
  Food: "Alimentação",
  "Food & Groceries": "Alimentação e mercado",
  Transportation: "Transporte",
  Transport: "Transporte",
  Entertainment: "Lazer",
  Subscriptions: "Assinaturas",
  Shopping: "Compras",
  "Shopping & Personal": "Compras pessoais",
  "On Track": "Dentro do limite",
  "Near Limit": "Perto do limite",
  "Over Budget": "Acima do orçamento",
  "⚠ Over Budget": "⚠ Acima do orçamento",
  "Normal Pace": "Dentro do limite",
  Balanced: "Positivo",
  Deficit: "Negativo",
  "Salary Deposit": "Salário",
  "Monthly Allowance": "Recebimento adicional",
  "Freelance Web Design": "Freelance de web design",
  "English Lessons": "Aulas de inglês",
  "Rent Contribution": "Contribuição de aluguel",
  "Supermarket Pão de Açúcar": "Supermercado Pão de Açúcar",
  "Weekly Groceries": "Compras da semana",
  "Pizza Night": "Noite de pizza",
  "Fuel Posto Ipiranga": "Combustível Posto Ipiranga",
  "Fuel & Parking": "Combustível e estacionamento",
  "Cinema & Games": "Cinema e jogos",
  "Netflix Subscription": "Assinatura Netflix",
  "Music Subscription": "Assinatura de música",
  "Personal Shopping": "Compras pessoais",
  "No transactions this month.": "Nenhuma transação neste mês.",
  "No transactions found. Try another search or add an entry.":
    "Nenhuma transação encontrada. Tente outra busca ou adicione um lançamento.",
  "Your expenses are currently higher than your income.":
    "Suas despesas estão maiores que suas receitas.",
  "Your spending is currently within your monthly budget.":
    "Seus gastos estão dentro do orçamento mensal.",
  "No expenses recorded for this month yet.": "Nenhuma despesa registrada neste mês.",
  "Demo data restored.": "Dados de demonstração restaurados.",
  "Transaction deleted.": "Transação excluída.",
  "Transaction saved successfully.": "Transação salva com sucesso.",
  "Coming soon — planned for a future version.": "Em breve — previsto para uma versão futura.",
  "Could not save. Browser storage is unavailable or full.":
    "Não foi possível salvar. O armazenamento do navegador está indisponível ou cheio.",
  "Enter a description, valid amount, category and date.":
    "Informe uma descrição, um valor válido, a categoria e a data.",
  "Your transaction could not be saved. Allow browser storage and try again.":
    "Não foi possível salvar a transação. Permita o armazenamento no navegador e tente novamente.",
  "Month selection cannot be saved in this browser.":
    "Não foi possível salvar o mês selecionado neste navegador.",
  "Browser storage is unavailable. Demo data is shown; saving requires storage access.":
    "O armazenamento está indisponível. Os dados exibidos são de demonstração; permita o armazenamento para salvar.",
  "Reset all transactions to the September 2026 demo? This removes your changes.":
    "Restaurar as transações de demonstração de setembro de 2026? Isso remove suas alterações.",
  "Search transactions, notes, payees...": "Buscar transações, observações, favorecidos...",
  "e.g. Supermarket Pão de Açúcar": "Ex.: Supermercado Pão de Açúcar",
  "Add a note...": "Adicione uma observação...",
  "Main navigation": "Navegação principal",
  "Mobile navigation": "Navegação do celular",
  Notifications: "Notificações",
  "Select month": "Selecionar mês",
  "Dashboard month": "Mês do painel",
  "Transaction month": "Mês das transações",
  "Budget month": "Mês do orçamento",
  "Search transactions": "Buscar transações",
  "Chart period": "Período do gráfico",
  "Back to Transactions": "Voltar para transações",
  "Add bill": "Adicionar conta",
  "Monthly income and expenses": "Receitas e despesas mensais",
};
export function t(text) {
  return language === "pt" ? portuguese[text] || text : text;
}
export function locale() {
  return language === "pt" ? "pt-BR" : "en-GB";
}
function applyLanguage() {
  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  ["placeholder", "aria-label"].forEach((attribute) => {
    document.querySelectorAll("[data-i18n-" + attribute + "]").forEach((element) => {
      element.setAttribute(attribute, t(element.getAttribute("data-i18n-" + attribute)));
    });
  });
  document.querySelectorAll(".language-control").forEach((select) => {
    select.value = language;
  });
}
export function setupLanguage({ updateMonthOptions, renderPage, renderCategoryOptions, categoryDetails }) {
  applyLanguage();
  document.querySelectorAll(".language-control").forEach((select) =>
    select.addEventListener("change", (event) => {
      language = event.target.value;
      try {
        localStorage.setItem(LANGUAGE_KEY, language);
      } catch {
        /* Switching still works for this page. */
      }
      applyLanguage();
      updateMonthOptions();
      renderPage();
      const form = document.querySelector("#transaction-form");
      if (form) {
        const selectedCategory = form.elements.category.value;
        renderCategoryOptions(form.elements.type.value);
        form.elements.category.value = selectedCategory;
        document.querySelector("#category-selected").textContent = t(
          categoryDetails[selectedCategory].label,
        );
        document.querySelector("#form-error").textContent = "";
      }
    }),
  );
}

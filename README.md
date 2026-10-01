# Money+

Money+ is a responsive personal finance tracker built with HTML, CSS and Vanilla JavaScript.

## Run

Open `index.html` or use VS Code Live Server. No installation, framework or build step is needed. A local server is recommended: browsers may isolate localStorage between `file://` pages. Google Fonts is optional; offline fonts fall back to Arial.

## Portfolio Project

Money+ was created as a front-end portfolio project focused on responsive interface development, DOM manipulation, financial calculations, localStorage persistence and accessible UI using Vanilla JavaScript.

## Features

- Native Portuguese/English selector with a saved browser preference
- Responsive dashboard with desktop sidebar and mobile bottom navigation
- Transaction tracking: search, income/expense filters, add and delete with confirmation
- Income, expense, balance and savings calculations
- Category budgets and explicit over-budget labels
- localStorage persistence and resettable September 2026 demo
- Rule-based financial insights
- CSS cash flow chart and calculated category donut

## Tech

HTML5 · CSS3 · JavaScript ES6+ · localStorage

## Structure

```
index.html
transactions.html
add-transaction.html
budget.html
css/style.css
js/app.js
js/i18n.js
assets/favicon.svg
```

`app.js` contains the shared dataset, named calculation functions, rendering functions and form handlers. CSS is organized into design tokens, page styles and responsive rules.

## Demo data and calculations

September 2026: income R$ 3.280,00; expenses R$ 2.145,00; net savings R$ 1.135,00; opening balance R$ 1.285,00; available balance R$ 2.420,00. Budget allocation totals R$ 3.000,00 across six categories. The approved conceptual screens contain conflicting category totals, so this MVP uses one consistent dataset.

All values use Brazilian currency. Selected-month income and expenses feed the charts, budgets and insights. Available balance includes the opening balance and transactions through the selected month. Historical cash flow values are illustrative. Upcoming payments are static examples, explicitly labeled as a future feature. Category limits are fixed. Insights are deterministic rules, not AI.

Data stays in this browser and origin; there is no cloud sync. Clearing browser storage removes saved data. Storage failures produce an error instead of reporting a successful save. Transactions use local calendar dates; default form date is September 30, 2026 to match the demo.

## Live Demo

https://johntfut02.github.io/money-plus/

## Screenshots

### Desktop Dashboard
![Money+ Desktop Dashboard](assets/screenshots/dashboard-desktop.png)

### Transactions
![Money+ Transactions](assets/screenshots/transactions-desktop.png)

### Budget
![Money+ Budget](assets/screenshots/budget-desktop.png)

## Future Improvements

- Goals
- Credit cards
- Recurring payments
- Backend/database
- Authentication
- React version

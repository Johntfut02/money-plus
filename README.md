# Money+

Money+ is a responsive personal finance tracker built with HTML, CSS and Vanilla JavaScript.

## Run

Use VS Code Live Server and open `login.html`. ES modules require an HTTP server. No framework or build step is needed. Internet access is required for Firebase login and financial data.

## Portfolio Project

Money+ was created as a front-end portfolio project focused on responsive interface development, DOM manipulation, financial calculations, localStorage persistence and accessible UI using Vanilla JavaScript.

## Features

- Native Portuguese/English selector with a saved browser preference
- Responsive dashboard with desktop sidebar and mobile bottom navigation
- Transaction tracking: search, income/expense filters, add and delete with confirmation
- Income, expense, balance and savings calculations
- Category budgets and explicit over-budget labels
- Google login and private Firestore transactions per UID
- Empty new accounts, zero opening balance, current month and next 12 months
- Rule-based financial insights
- CSS cash flow chart and calculated category donut

## Tech

HTML5 · CSS3 · Vanilla JavaScript modules · Firebase Authentication · Cloud Firestore

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

## Account data and calculations

Transactions are stored under `users/{uid}/transactions/{transactionId}`. Pages wait for authentication and a server read before displaying financial data. Save and delete success is shown only after server acknowledgement. Existing browser demo data is not imported or erased.

New accounts start with no transactions and an opening balance of zero. Months include the current local month, the next 12 months and months with saved transactions. Charts use real data. Currency is BRL. Monthly category budget limits start at zero and can be edited on the Budget page. They are stored privately under `users/{uid}/budgets/{YYYY-MM}`, with category amounts in `limits`. Zero means no limit is configured; saving one category preserves the others. Upcoming payments are a future feature. Language preference alone is saved in localStorage.

The Firebase project must enable Google sign-in and authorize the host (localhost/127.0.0.1 for local testing and johntfut02.github.io for the published site). Firestore rules must require `request.auth != null && request.auth.uid == userId` for documents and subcollections under `users/{userId}`. Client validation does not replace server-side field validation in future rules.

These local changes have not been published to GitHub Pages.

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
- Recurring payments and customizable opening balance
- React version

// CSV stays local to the browser: no upload or extra database write.
export function transactionsCSV(rows, month, language = "pt", translate = text => text) {
  const portuguese = language === "pt";
  const separator = portuguese ? ";" : ",";
  const quote = value => `"${String(value).replace(/"/g, '""')}"`;
  // Keep user text as text when a spreadsheet opens the file.
  const textCell = value => {
    const text = String(value ?? "");
    return quote(/^[\s\u0000-\u001f]*[=+\-@]/.test(text) ? "'" + text : text);
  };
  const headers = portuguese
    ? ["Data", "Descrição", "Tipo", "Categoria", "Forma de pagamento", "Valor (R$)", "Observações"]
    : ["Date", "Description", "Type", "Category", "Payment method", "Amount (BRL)", "Notes"];
  const entries = rows.filter(row => row.date.slice(0, 7) === month)
    .slice().sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const lines = [headers.map(quote).join(separator)];
  for (const row of entries) {
    const amount = (row.type === "expense" ? -row.amount : row.amount).toFixed(2);
    lines.push([
      quote(portuguese ? row.date.split("-").reverse().join("/") : row.date),
      textCell(row.name),
      textCell(translate(row.type === "income" ? "Income" : "Expenses")),
      textCell(translate(row.category)),
      textCell(translate(row.paymentMethod)),
      quote(portuguese ? amount.replace(".", ",") : amount),
      textCell(row.notes),
    ].join(separator));
  }
  // BOM preserves accents in Excel; CRLF and quoting preserve multiline notes.
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

export function downloadCSV(content, month, language = "pt") {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `money-plus-${month}-${language}.csv`;
  link.hidden = true;
  document.body.append(link);
  try {
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

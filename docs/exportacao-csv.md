# Exportação CSV do Money+

Na página Transações, escolha o mês e clique em **Exportar CSV**. O arquivo contém todas as transações daquele mês, mesmo quando a busca ou o filtro de receitas/despesas esconde parte da lista. Um mês sem transações mostra uma mensagem e não inicia download.

As colunas são data, descrição, tipo, categoria, forma de pagamento, valor em reais e observações. Receitas têm valor positivo e despesas têm valor negativo. O saldo inicial não é uma transação e não entra no CSV.

O arquivo se chama, por exemplo, `money-plus-2026-10-pt.csv`. Em português, usa ponto e vírgula entre colunas e vírgula decimal. Em inglês, usa vírgula entre colunas e ponto decimal. A língua selecionada no site determina o formato.

## Como o código funciona

1. `transactions.html` contém o botão e explica o que será exportado.
2. `app.js` responde ao clique, confirma a sessão e usa as transações já carregadas da conta. Não faz nova gravação no Firestore.
3. `transactionsCSV()` em `js/csv-export.js` seleciona o mês, ordena por data e monta o texto. Colocar as células entre aspas permite preservar separadores e quebras de linha nas observações. Aspas dentro de uma célula são duplicadas, conforme o formato CSV.
4. O início do arquivo inclui uma marca de UTF-8 para preservar os acentos no Excel. Campos de texto que começam como uma fórmula recebem um apóstrofo para serem tratados como texto. Valores numéricos de despesas continuam negativos.
5. `downloadCSV()` transforma o texto em um `Blob`, cria um endereço temporário e aciona o download. Depois remove o link e libera esse endereço.

O arquivo é gerado no navegador. Nenhuma cópia é enviada a outro serviço. Ele reúne somente os dados carregados para a conta conectada. Como usa esses dados já carregados, alterações feitas em outro dispositivo precisam de uma atualização da página antes de exportar.

## Conferência

Os testes conferem seleção do mês, ordenação, valores negativos, decimais, acentos, aspas, observações com várias linhas e proteção de campos de texto. Também foi usada uma leitura independente de CSV para conferir as sete colunas em português e inglês. A prévia local verificou o botão, a mensagem para mês vazio e a tela mobile de 320 pixels. O Excel não foi aberto durante essa verificação.

Para repetir o teste de geração, execute `node tests/csv-export.test.mjs` na pasta do projeto.

Se o Excel abrir tudo em uma coluna devido às configurações regionais do computador, importe pelo menu **Dados → De Texto/CSV**, com codificação UTF-8 e separador ponto e vírgula para a versão portuguesa.

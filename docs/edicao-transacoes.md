# Edição de transações — Parte 1 da V1

Implementação de 8 de outubro de 2026. Mantém Vanilla JavaScript, Firebase e o formulário existente.

## Como usar

1. Em Transações, selecione o lápis do lançamento.
2. Altere descrição, valor, tipo, categoria, data, forma de pagamento ou observação.
3. Clique em **Salvar alterações**. Após confirmação do servidor, a lista abre no mês da data salva.

**Restaurar original** repõe os valores carregados quando a página abriu; não grava nada. **Cancelar** retorna ao mês de origem sem gravar. Um ID que não está na conta conectada bloqueia o formulário.

## Entendendo o código

- `transactionRow()` em `js/app.js` cria o link com `?edit=ID&month=AAAA-MM`.
- `setupForm()` encontra o documento entre as transações carregadas do usuário e preenche os campos. `restoreOriginal()` também atende o botão de restauração.
- No evento `submit`, `FormData` lê os campos, a validação confere os valores e o objeto mantém o ID original.
- `atualizarTransacao()` em `js/transactions-store.js` verifica o UID e usa `updateDoc` no documento existente. Atualiza somente os campos editáveis; não recria um documento excluído.
- `await` aguarda confirmação antes de voltar à lista. Falhas mantêm os campos para uma nova tentativa. Os controles ficam bloqueados durante o envio.
- Cálculos usam os valores salvos quando a página seguinte carrega do servidor. Uma alteração de data pode mover o lançamento para outro mês. As fórmulas de saldo, orçamentos e centavos foram preservadas.

## Testes

`node tests/account-flows.test.cjs` cobre preenchimento, restauração, idioma, ID preservado, gravação confirmada, falhas, envio repetido, mudança de tipo/mês, recarga simulada, validação e troca de conta. `node tests/csv-export.test.mjs` cobre a exportação existente. Essas chamadas ao Firebase são simuladas; não exercitam as regras publicadas.

## Conferência no site com Firebase real

- [x] Editar a despesa fictícia **Teste de edição** de R$ 10,00 para R$ 15,00 (valor escolhido por João).
- [x] Conferir que permanece apenas um lançamento e os dados continuam após atualizar.
- [x] Conferir despesas +R$ 5,00 e saldo −R$ 5,00 no mês correspondente.
- [x] Alterar categoria e conferir a distribuição do gasto.
- [x] Alterar a data para outro mês e conferir as duas listas, sem duplicação, retornando ao mês original.
- [x] Cancelar uma edição de R$ 15,00 para R$ 99,00 e conferir que nada mudou.
- [ ] Abrir a mesma conta no celular e conferir o lançamento atualizado.

João confirmou esses testes no site publicado em 8/10/2026. A publicação do commit `5eb2715` foi conferida no GitHub Pages. A edição foi aceita nessa rodada; uma conferência separada no celular ainda não foi relatada. Esta aceitação não equivale a testar todas as datas ou regras do servidor. A candidata da Parte 2 está documentada em [protecao-dados.md](protecao-dados.md).

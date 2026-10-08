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

- [ ] Editar a despesa fictícia **Teste de edição** de R$ 10,00 para R$ 25,00.
- [ ] Conferir que permanece apenas um lançamento e os dados continuam após atualizar.
- [ ] Conferir despesas +R$ 15,00 e saldo −R$ 15,00 no mês correspondente, se a data estiver dentro do período do saldo inicial.
- [ ] Alterar categoria e conferir a distribuição do gasto.
- [ ] Alterar a data para outro mês e conferir as duas listas.
- [ ] Cancelar uma edição e conferir que nada mudou.
- [ ] Abrir a mesma conta no celular e conferir o lançamento atualizado.

A aceitação no Firebase real ainda depende dessa conferência. Esta entrega conclui o item de edição; a revisão completa de cálculos e datas da Parte 1 continua pendente. Regras reforçadas, sincronização contínua, recorrências e análises ampliadas pertencem às próximas etapas propostas.

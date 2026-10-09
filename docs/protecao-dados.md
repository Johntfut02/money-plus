# Proteção dos dados — Parte 2 da V1

Preparada em 8 de outubro de 2026. **Ainda não aplicada ao Firebase real.**

## Arquivos e situação

- `firestore.rules`: referência anterior de isolamento por UID, preservada. A cópia não comprova a versão efetiva no Console.
- `firestore-v1.rules`: candidata que valida o formato dos documentos e permite somente os caminhos usados pelo aplicativo.
- `firebase.test.json`: configuração exclusiva dos testes locais.
- `tests/firestore-rules.test.mjs`: teste de integração com o emulador real. Não simula a linguagem de regras em JavaScript.
- `.github/workflows/firestore-rules.yml`: executa o emulador no GitHub Actions, sem credenciais e sem deploy.

O Java/emulador não está disponível no ambiente atual. Foram conferidas a sintaxe JavaScript do script e a configuração JSON; os testes das regras **não rodaram ainda**. O GitHub Actions poderá compilar a candidata e testar acesso permitido/negado assim que este commit for enviado. Um resultado verde do GitHub Pages não substitui o resultado de **Firestore rules tests**.

## O que a candidata valida

- Autenticação e UID do dono para ler, listar, criar, editar ou excluir.
- Transações: campos previstos, ID igual ao documento, descrição com 1–100 caracteres e não vazia após trim, valor positivo limitado e em centavos, receita/categoria e despesa/categoria consistentes, data de calendário válida, forma de pagamento conhecida e observação com até 500 caracteres.
- Orçamentos: mês `AAAA-MM`, mapa somente com as seis categorias atuais, limites não negativos e em centavos. Campos ausentes equivalem a zero. Atualizar uma categoria continua preservando as demais.
- Saldo inicial: valor em centavos, inclusive negativo, com limite de magnitude e data válida a partir de 1900.
- Caminhos não usados, documentos raiz de usuários e subcoleções adicionais permanecem negados.

As leituras do dono continuam permitidas mesmo para documentos antigos inválidos. As novas gravações precisam obedecer à candidata. Se existir um documento legado com campos extras ou ID divergente, conferir sua compatibilidade antes de aplicar: não apagar nem migrar dados automaticamente. Isso não é uma auditoria completa de segurança.

## Testes antes da aplicação

No GitHub, após enviar o commit, conferir o resultado do workflow **Firestore rules tests**. Ele usa o projeto fictício `demo-money-plus-v1`, um emulador local e tokens de teste; não usa o banco `money-plus-ddce6`.

Alternativa em uma máquina com Node, npm e Java 21:

```sh
npx --yes firebase-tools@15.33.0 emulators:exec --config firebase.test.json --only firestore --project demo-money-plus-v1 "node tests/firestore-rules.test.mjs"
```

O teste exige `FIRESTORE_EMULATOR_HOST` de loopback. Verifica gravações válidas primeiro, para não aceitar como sucesso um emulador que simplesmente negue tudo. Depois cobre acesso de outra conta, ausência de login, valores inválidos, campos ausentes/extras, categoria incompatível, datas impossíveis e anos bissextos, edição parcial, preservação de outras categorias, saldo negativo e caminhos não previstos.

## Aplicação no Firebase real

1. Obter o conteúdo atual de **Firestore Database → Regras** no projeto `money-plus-ddce6`; preservar uma cópia antes de trocar.
2. Comparar com a referência antiga e confirmar a compatibilidade dos dados existentes.
3. Aguardar o resultado verde de **Firestore rules tests** e corrigir quaisquer falhas.
4. Aplicar o conteúdo de `firestore-v1.rules` no Console. O editor deve compilar sem erros.
5. Conferir com conta própria: carregar dados, adicionar/editar/excluir transação, salvar limite mensal e saldo inicial.
6. Conferir negação de leitura/gravação em outro UID e sem login pelo simulador de regras ou um teste controlado. Conta vazia, sozinha, não comprova esse isolamento.
7. Somente depois registrar a versão efetiva e atualizar a referência `firestore.rules`.

GitHub Pages e este workflow não publicam regras no Firebase. O estado desta etapa é **candidata preparada; compilação, testes no emulador e aplicação real pendentes**.

Referências oficiais: [validação de campos](https://firebase.google.com/docs/firestore/security/rules-fields), [linguagem String](https://firebase.google.com/docs/reference/rules/rules.String), [math](https://firebase.google.com/docs/reference/rules/rules.math), [emulador](https://firebase.google.com/docs/emulator-suite/connect_firestore).

# Money+ — documento completo de continuidade

Atualizado em **8 de outubro de 2026**, horário de São Paulo. Este documento permite continuar o projeto em uma conversa nova, sem acesso à conversa local anterior. Ele registra implementação, decisões, preferências do usuário, referências e pendências. Não é uma solicitação para implementar tudo de uma vez: confirme o escopo da próxima etapa com João.

## 1. Objetivo e modo de colaboração

João está aprendendo HTML, CSS e JavaScript. Entende melhor HTML/CSS e conhece o básico de JavaScript. Precisa acelerar a preparação para conseguir trabalho e usar o Money+ como projeto de portfólio, além de permitir que Tainá, familiares e amigos usem suas próprias contas.

**Preferência mais recente:** o assistente implementa o trabalho repetitivo e as partes de JavaScript necessárias para entregar uma aplicação funcional rapidamente; depois explica usando o próprio código como material de estudo. Não exigir que João escreva tudo manualmente antes de ter uma versão utilizável. Explicar em português, com passos curtos e exemplos concretos. Não presumir conhecimento de Git, VS Code ou Firebase Console. Registrar as decisões para facilitar a revisão e a preparação para entrevistas.

Preservar HTML/CSS/JavaScript puro, a identidade escura/dourada, a logo aprovada e a responsividade desktop/mobile. React foi uma ideia antiga de melhoria, **não uma mudança aprovada para agora**. Usar Git e GitHub para preservar o trabalho. João autorizou preparar e publicar esta continuidade. Autorizações operacionais futuras devem respeitar o pedido da sessão e as permissões realmente disponíveis.

João pediu esta transferência porque os chats locais “Money+ development” e “Dev Profile” não aparecem na lista normal dos outros dispositivos. Parear o celular não converte o histórico local em uma conversa em nuvem. Uma conversa nova acessível em outros dispositivos poderá usar este documento e o repositório. Acesso ao histórico e acesso aos arquivos do computador são coisas distintas.

## 2. Links principais — começar por aqui

| Recurso | Link |
| --- | --- |
| Repositório e código atual | [Johntfut02/money-plus](https://github.com/Johntfut02/money-plus) |
| Site publicado | [Money+](https://johntfut02.github.io/money-plus/) |
| Login publicado | [Entrar](https://johntfut02.github.io/money-plus/login.html) |
| Documento de continuidade | [CONTINUIDADE.md](https://github.com/Johntfut02/money-plus/blob/main/docs/CONTINUIDADE.md) |
| Texto direto deste documento | [Raw Markdown](https://raw.githubusercontent.com/Johntfut02/money-plus/main/docs/CONTINUIDADE.md) |
| Arquivos completos para download | [ZIP da branch main](https://github.com/Johntfut02/money-plus/archive/refs/heads/main.zip) |
| README | [README.md](https://github.com/Johntfut02/money-plus/blob/main/README.md) |
| Explicação da exportação CSV | [exportacao-csv.md](https://github.com/Johntfut02/money-plus/blob/main/docs/exportacao-csv.md) |
| Histórico de alterações | [Commits](https://github.com/Johntfut02/money-plus/commits/main/) |
| Publicações do site | [GitHub Actions](https://github.com/Johntfut02/money-plus/actions) |
| Firebase Console do projeto | [money-plus-ddce6](https://console.firebase.google.com/project/money-plus-ddce6/overview) |
| Authentication | [Provedores de login](https://console.firebase.google.com/project/money-plus-ddce6/authentication/providers) |
| Firestore | [Banco de dados](https://console.firebase.google.com/project/money-plus-ddce6/firestore) |
| Conversa original de referência | [Dev project](https://chatgpt.com/c/6abd30db-4f0c-83e9-bdd5-284af3839afe) |

O Firebase Console e a conversa original exigem acesso da conta correspondente. O GitHub contém o código e os materiais públicos, **não os dados financeiros privados do Firestore**.

## 3. Estado publicado e histórico

Última implementação antes deste documento: commit [85aa94b](https://github.com/Johntfut02/money-plus/commit/85aa94b74ea0b2b19e3e77f72d461727a4e5ee79), exportação CSV. A publicação do GitHub Pages terminou com sucesso em 2 de outubro. O novo commit de continuidade acrescenta documentação, imagens e testes; não altera o comportamento da aplicação.

Marcos:

- [113d493](https://github.com/Johntfut02/money-plus/commit/113d493456bb220b9a83ca1ae8e80215320dfaba): login Google, dados privados no Firestore, transações e orçamentos mensais.
- [bf02bdf](https://github.com/Johntfut02/money-plus/commit/bf02bdf5e1f4cdee3ebb1fd424b638d8bbe0a97f): saldo inicial com data de início.
- [85aa94b](https://github.com/Johntfut02/money-plus/commit/85aa94b74ea0b2b19e3e77f72d461727a4e5ee79): CSV mensal em português/inglês.

Ao retomar, consultar a versão atual de `main`, o estado do Git e os commits recentes. O código atual prevalece sobre capturas antigas e sobre qualquer descrição que tenha ficado desatualizada.

## 4. O que funciona hoje

- Login Google com Firebase Authentication, restauração da sessão e botão Sair.
- Páginas financeiras exigem login. O conteúdo aguarda a sessão e a leitura dos dados; falha de carregamento apresenta mensagem e opção de tentar novamente.
- Nova conta começa vazia, sem importar dados demonstrativos do navegador.
- Transações: adicionar receita/despesa, listar, buscar, filtrar, agrupar por data, editar pelo lápis e excluir com confirmação. A edição mantém o ID, retorna ao mês salvo e preserva a entrada em caso de falha. Veja [edicao-transacoes.md](edicao-transacoes.md).
- Gravação/exclusão só mostra sucesso após confirmação do Firebase. Falhas preservam a entrada ou a transação; controles evitam envio duplicado.
- Painel com receitas, despesas, economia e saldo disponível calculados. Gráfico de fluxo de caixa e distribuição por categoria usam os lançamentos reais.
- Mês atual automático conforme a data local do dispositivo; próximos 12 meses disponíveis. Meses históricos com transações/orçamentos e o mês selecionado também são preservados.
- Orçamentos por mês e categoria, editáveis e salvos. Zero significa limite não definido; guardar uma categoria preserva as demais.
- Saldo inicial editável, incluindo negativo, com data de início e armazenamento na conta.
- Exportação CSV do mês inteiro, independentemente da busca/filtro de tipo. Receitas positivas, despesas negativas, sete colunas, PT/EN, acentos e observações com várias linhas.
- Idioma PT/EN nas páginas internas, com preferência salva no navegador. O login atual está em português.
- Logo aprovada aplicada ao login, à navegação e aos favicons. Layout responsivo.
- Insights por regras no código existente. Não há serviço de IA generativa conectado.

## 5. O que ainda não está pronto

Não apresentar todos os itens do menu como implementados. Contas/recorrências, metas, cartões, a área dedicada de análises, notificações e configurações gerais ainda têm links/controles de funcionalidade futura (`data-soon`). Há cálculos e insights no painel/orçamentos, mas não uma página completa de análises.

A edição foi implementada e validada por João no site publicado em 8/10 (valor de R$ 10 para R$ 15, persistência, totais, categoria, data e cancelamento). Não há integração bancária, pagamento de contas, análise com IA, importação CSV, anexo de comprovantes, PWA/offline ou sincronização contínua em tempo real. Os dados são carregados do servidor ao abrir a página; alterações em outro dispositivo precisam de atualização da página para aparecer.

A proteção atual das regras restringe acesso por UID, mas não valida completamente o formato de cada documento no servidor. A validação de campos e valores no JavaScript não substitui essa validação nas regras. Revisar isso antes de ampliar o uso. Não afirmar que existe auditoria de segurança completa.

## 6. Arquitetura e mapa dos arquivos

Sem framework, bundler ou compilação. Módulos ES no navegador e Firebase SDK modular **12.19.0**, importado pelo CDN `www.gstatic.com`. Não misturar importações do Authentication com as do Firestore; houve essa dificuldade durante a montagem inicial.

| Arquivo | Responsabilidade |
| --- | --- |
| [login.html](https://github.com/Johntfut02/money-plus/blob/main/login.html) | Tela de entrada |
| [index.html](https://github.com/Johntfut02/money-plus/blob/main/index.html) | Painel e editor do saldo inicial |
| [transactions.html](https://github.com/Johntfut02/money-plus/blob/main/transactions.html) | Lista, busca, filtros e exportação |
| [add-transaction.html](https://github.com/Johntfut02/money-plus/blob/main/add-transaction.html) | Formulário de lançamento |
| [budget.html](https://github.com/Johntfut02/money-plus/blob/main/budget.html) | Orçamentos mensais |
| [css/style.css](https://github.com/Johntfut02/money-plus/blob/main/css/style.css) | Visual compartilhado e responsividade |
| [css/login.css](https://github.com/Johntfut02/money-plus/blob/main/css/login.css) | Visual da entrada |
| [js/firebase-config.js](https://github.com/Johntfut02/money-plus/blob/main/js/firebase-config.js) | Inicialização e configuração web do Firebase |
| [js/login.js](https://github.com/Johntfut02/money-plus/blob/main/js/login.js) | Popup Google e redirecionamento ao detectar sessão |
| [js/app.js](https://github.com/Johntfut02/money-plus/blob/main/js/app.js) | Sessão, estado, cálculos, renderização e eventos das páginas |
| [js/transactions-store.js](https://github.com/Johntfut02/money-plus/blob/main/js/transactions-store.js) | Leitura/gravação/exclusão de transações da conta |
| [js/budgets-store.js](https://github.com/Johntfut02/money-plus/blob/main/js/budgets-store.js) | Limites por categoria e mês |
| [js/settings-store.js](https://github.com/Johntfut02/money-plus/blob/main/js/settings-store.js) | Saldo inicial e data |
| [js/i18n.js](https://github.com/Johntfut02/money-plus/blob/main/js/i18n.js) | Dicionário, idioma e tradução da interface |
| [js/csv-export.js](https://github.com/Johntfut02/money-plus/blob/main/js/csv-export.js) | Montagem do CSV e download local |
| [firestore.rules](https://github.com/Johntfut02/money-plus/blob/main/firestore.rules) | Cópia de referência das regras de isolamento usadas |

`startApp()` aguarda `authStateReady()`, confirma usuário, instala observador de sessão e carrega transações, orçamentos e saldo inicial com `Promise.all`. Verifica se o UID continua o mesmo antes de renderizar. A troca de conta limpa o estado e redireciona ao login.

Em `app.js`, começar estudando `monthlyTransactions()`, `calculateIncome()`, `calculateExpenses()`, `calculateSavings()` e `calculateBalance()`. Depois acompanhar `setupForm()`, `setupBudgetEditor()`, `setupOpeningEditor()` e a renderização. `setupLanguage()` recebe callbacks; as funções não dependem de globais implícitas entre módulos.

## 7. Banco de dados e cálculos

Projeto Firebase: **money-plus-ddce6**. Firestore Standard, banco **(default)**, região **southamerica-east1 (São Paulo)**, conforme configurado e mostrado por João durante a sessão. Login Google habilitado. Domínios autorizados confirmados durante os testes: `localhost`, `127.0.0.1`, `johntfut02.github.io`, além dos domínios padrão do Firebase. Conferir no Console antes de alterar domínio/provedor.

Configuração web já está em `js/firebase-config.js`; reutilizar o projeto existente. Não criar outro banco sem discutir a migração. Não colocar credenciais de administrador/service account no frontend.

Modelo:

```text
users/{uid}/transactions/{transactionId}
  id, name, type: income|expense, amount: número positivo,
  category, date: YYYY-MM-DD, paymentMethod, notes

users/{uid}/budgets/{YYYY-MM}
  limits: {Housing, Food, Transportation, Entertainment, Subscriptions, Shopping}

users/{uid}/settings/finance
  openingBalance: número (pode ser negativo)
  openingDate: YYYY-MM-DD
```

`Income` é a categoria de receita. Despesas usam as seis categorias do orçamento. Valores são em BRL. Cálculos somam centavos para reduzir problemas de ponto flutuante. O ID retornado da leitura é o ID real do documento, prevalecendo sobre eventual campo `id` armazenado.

**Saldo disponível:** saldo inicial + receitas − despesas desde a data de início, incluindo o próprio dia, até o final do mês selecionado. É um saldo calculado até aquele mês, não uma consulta bancária em tempo real. Antes do mês da data de início, mostrar traço e mensagem de saldo indisponível. Sem configuração salva, assumir zero e considerar todas as transações até o mês. Totais de receitas/despesas mensais e gráficos continuam considerando os lançamentos do mês, mesmo os anteriores à data de início do saldo.

**CSV:** exporta transações, não o saldo inicial. Em PT usa `;`, vírgula decimal e data DD/MM/AAAA; em EN usa `,`, ponto decimal e data ISO. Inclui marca UTF-8, aspas escapadas e tratamento de texto que poderia ser interpretado como fórmula. Arquivo `money-plus-YYYY-MM-pt.csv` ou `...-en.csv`. Gera o arquivo no navegador, sem enviar uma cópia a outro serviço.

`firestore.rules` é uma referência da regra mostrada/configurada na sessão: somente usuário autenticado cujo UID coincide com `{userId}` pode ler/escrever o documento e suas subcoleções. **Commitar esse arquivo não publica regras no Firebase.** Não há configuração de deploy automático das regras neste repositório; verificar a versão efetiva no Console. Não alterar as regras para modo de teste aberto.

## 8. Identidade visual e imagens preservadas

Preto/grafite, cartões escuros e dourado. Tokens atuais incluem fundo `#0a0a0c`, superfície `#16161c`, dourado `#d5a641`, texto `#f5f5f8`, positivo `#26d797` e negativo `#f29289`. A logo oficial é o ícone dourado de M/barras com símbolo + sobre quadrado preto arredondado. **Reutilizar o arquivo aprovado; não gerar outra logo por conta própria.**

| Material | Link direto | Situação |
| --- | --- | --- |
| Logo oficial | [money-plus.png](https://raw.githubusercontent.com/Johntfut02/money-plus/main/assets/money-plus.png) | Usada no código atual |
| Login mobile publicado | [login-mobile-live.png](https://raw.githubusercontent.com/Johntfut02/money-plus/main/assets/screenshots/login-mobile-live.png) | Captura do login publicado em 2/10 |
| Login mobile em prévia | [login-mobile-preview.png](https://raw.githubusercontent.com/Johntfut02/money-plus/main/assets/screenshots/login-mobile-preview.png) | Referência local, não um segundo produto |
| Transações/CSV mobile | [transactions-csv-mobile-preview.png](https://raw.githubusercontent.com/Johntfut02/money-plus/main/assets/screenshots/transactions-csv-mobile-preview.png) | Prévia com dados fictícios, largura 320 px |
| Painel desktop anterior | [dashboard-desktop.png](https://raw.githubusercontent.com/Johntfut02/money-plus/main/assets/screenshots/dashboard-desktop.png) | Histórico; pode conter visual/dados da fase demonstrativa |
| Transações desktop anteriores | [transactions-desktop.png](https://raw.githubusercontent.com/Johntfut02/money-plus/main/assets/screenshots/transactions-desktop.png) | Histórico; consultar código para estado atual |
| Orçamento desktop anterior | [budget-desktop.png](https://raw.githubusercontent.com/Johntfut02/money-plus/main/assets/screenshots/budget-desktop.png) | Histórico; consultar código para estado atual |

`assets/favicon.svg` é o ícone antigo preservado; não usá-lo como logo aprovada. Os ZIPs Stitch citados originalmente foram `stitch_money_personal_finance_tracker (2).zip` e `(3).zip`, em Downloads. Não estavam disponíveis nessa pasta ao preparar a continuidade. Não existe link público confirmado para eles ou para o projeto Stitch. As imagens antigas anexadas ao chat não foram exportadas integralmente. Este documento não inventa links nem afirma que esses ZIPs foram auditados. Se for necessário recuperar o design original, João precisa fornecer os ZIPs ou o link; o código e a logo atuais já estão preservados no GitHub.

## 9. Execução, Git e publicação

Clonar `https://github.com/Johntfut02/money-plus.git`, abrir a pasta no VS Code e servir por Live Server. Abrir `login.html`. Módulos ES precisam de HTTP; não testar apenas por duplo clique em arquivo `file://`. Precisa de internet para importar o Firebase SDK, entrar e carregar dados. Não precisa instalar React/npm para rodar o site.

No computador anterior, o repositório usado nesta fase está dentro de `C:/Users/Joao/.codex/.chatgpt-projects/g-p-6abd30b873ac81918698fd76677e9a0a/money-plus/`. Havia outra cópia anterior em `C:/Users/Joao/Desktop/money-plus/`; não assumir que ela é a cópia atual. O novo ambiente deve usar o GitHub e não depender desses caminhos locais.

Branch publicada: `main`. GitHub Pages está publicando com sucesso. Antes de mudar arquivos, verificar o estado local e buscar alterações remotas; não sobrescrever trabalho não commitado. `pull` traz mudanças do GitHub; `commit` registra localmente; `push` envia. Após publicar, conferir o Actions correspondente ao novo commit. Atualizar o navegador com Ctrl+F5 se necessário. Não confundir uma publicação anterior bem-sucedida com a publicação do commit atual.

Os scripts temporários antigos de integração e a pasta de prévia com Authentication falso ficaram fora do repositório. Não são necessários para continuar e não devem ser publicados como implementação real. O site verdadeiro usa Firebase. Não transferir dados financeiros reais para o GitHub.

## 10. Testes e limites da evidência

### Confirmado pelo usuário na sessão anterior

- Login Google e carregamento no Firebase real.
- Leitura/gravação no próprio UID e negação de acesso ao outro UID durante testes temporários; esses testes foram retirados do login final.
- Transação de teste permaneceu após atualizar e desapareceu somente após excluir; totais acompanharam.
- Limite de alimentação de R$ 500 permaneceu após atualizar; outro mês iniciou sem limite e o mês original manteve seu valor.
- Segunda conta iniciou vazia, sem trazer dados da primeira.
- Teste desktop/mobile e site publicado funcionando.
- Saldo inicial salvo e mantido depois de atualizar.

### Testes preservados no repositório

```text
node tests/account-flows.test.cjs
node tests/csv-export.test.mjs
```

O teste de contas também cobre edição (preenchimento, restauração, mesmo ID, mudança de tipo/mês, falhas, envio repetido e troca de conta). A implementação de 8/10 foi conferida por João no site; a conferência separada em celular e os testes de regras no servidor continuam pendentes.

O teste de contas simula Firebase e DOM com Node VM: sessão, troca de conta, carregamento com erro, cálculos/mês, idioma, confirmação de salvar/excluir, falha e envio duplicado, orçamentos, saldo com data e caminhos por UID. Não é um teste das regras reais no servidor e não substitui navegador/dispositivos reais.

O teste CSV cobre mês, ordem, acentos, aspas, quebras de linha, decimais, despesas negativas e texto que parece fórmula. Também houve conferência das sete colunas por um parser independente de CSV. Na prévia local o botão acionou a geração, houve mensagem de download iniciado e o mês vazio apresentou mensagem adequada. A captura automática do arquivo baixado no navegador integrado não concluiu dentro do tempo de espera. **Não afirmar que o arquivo foi aberto e validado no Microsoft Excel ou que João confirmou o CSV real**; esse teste manual ainda é útil ao retomar.

As capturas da prévia usam dados fictícios. A confirmação de UID em simulação e o teste pontual no Console não equivalem a uma revisão completa de segurança, concorrência e regras.

## 11. Próximos passos: recomendação, não escopo já aprovado

João considera acelerar a implementação com o assistente e depois revisar/aprender. Ele pediu opinião sobre fechar o projeto para portfólio, funcionalidades de análise e custo de hospedagem. A recomendação apresentada foi:

1. Fechar uma V1 com escopo limitado: revisar fluxos, validar a edição implementada de transações, tratar erros e estados vazios e deixar claro o que ainda está em desenvolvimento.
2. Revisar validação no servidor e isolamento antes de ampliar testadores.
3. Usar análises por regras e números na V1; adiar IA generativa. Isso facilita explicação e previsibilidade. A escolha final precisa ser discutida.
4. Atualizar README/apresentação, imagens recentes e uma demonstração curta. Ser transparente sobre ajuda de IA; aprender a explicar a arquitetura e modificar pequenos trechos sozinho.
5. Reservar estudo regular e iniciar candidaturas sem esperar implementar todo o menu. Não prometer emprego nem um prazo garantido para todo o produto.

Não há serviço de IA no produto, plano pago novo, domínio comprado, servidor contratado nem migração de framework aprovados. GitHub Pages + Firebase é a arquitetura atual. O Firebase Spark oferece cotas gratuitas; para poucos testadores a expectativa discutida é permanecer nelas, mas acompanhar uso e conferir preços vigentes antes de decidir. Não garantir custo zero para qualquer volume. Serviços adicionais/IA podem mudar custos e arquitetura.

Fontes úteis: [preços Firebase](https://firebase.google.com/pricing), [SDK Web](https://firebase.google.com/docs/web/setup), [Google Auth](https://firebase.google.com/docs/auth/web/google-signin), [regras com Authentication](https://firebase.google.com/docs/firestore/security/rules-conditions), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages). Consultar documentação atual quando implementar algo novo.

## 12. Roteiro para ensinar com o código existente

Explicar por fluxo, não despejar todo o JavaScript de uma vez:

1. Formulário → evento → valores → validação → objeto da transação.
2. `await` → gravação no Firestore → resposta → atualização da tela.
3. Usuário autenticado → UID → caminho dos dados → regra de acesso.
4. Arrays, `filter`, `map`, `reduce`, centavos e cálculos mensais.
5. DOM, funções de renderização, eventos e módulos ES.
6. Saldo inicial/data, limites mensais e exportação.
7. Git, publicação e o que acontece quando a conexão falha.

Para entrevistas, João deve conseguir explicar o problema resolvido, a estrutura dos dados, como cada conta é isolada, o comportamento em falhas, o que fez com ajuda e o que já consegue alterar. Pequenos exercícios práticos devem verificar compreensão sem atrasar desnecessariamente a entrega.

## 13. Mensagem para começar o novo chat

> Quero continuar o Money+ com base no repositório https://github.com/Johntfut02/money-plus e no documento completo https://raw.githubusercontent.com/Johntfut02/money-plus/main/docs/CONTINUIDADE.md. Leia o documento e o código atual antes de sugerir mudanças. Preserve Vanilla HTML/CSS/JS, Firebase e o visual escuro/dourado. Preciso acelerar a V1 para uso e portfólio: você implementa as partes repetitivas e o JavaScript necessário e depois me ensina usando o código, em português e em etapas pequenas. Primeiro confirme o estado do projeto, o que falta e o acesso real que você tem para editar/publicar. Não trate itens futuros como prontos, não recrie o projeto e não prometa acesso aos arquivos do meu computador sem verificar. Vamos definir o escopo restante da V1 antes de implementar novas funcionalidades.

Se o novo chat não conseguir ler o GitHub, baixar o [ZIP de main](https://github.com/Johntfut02/money-plus/archive/refs/heads/main.zip) e anexá-lo. Esse ZIP inclui o documento, o código, a logo, capturas e testes, mas não configura automaticamente ferramentas de edição/publicação nem transfere o Firebase privado.


## 14. Retomada de 8/10/2026: edição aceita e candidata de regras

- Commit `5eb2715`: edição com o formulário existente. Enviado pelo usuário; a publicação desse commit no GitHub Pages terminou com sucesso.
- João confirmou edição de R$ 10 para R$ 15, permanência após atualizar, ausência de duplicação, diferenças de R$ 5 nos totais, categoria Alimentação/Transporte, ida e volta entre outubro/novembro e cancelamento sem gravar R$ 99. Não foi relatada uma rodada separada no celular.
- Ver [edicao-transacoes.md](edicao-transacoes.md) para a aceitação registrada.
- A Parte 2 está preparada em `firestore-v1.rules`, com schema, limites, centavos, datas válidas e caminhos explícitos. `firestore.rules` conserva a referência anterior. A candidata não foi aplicada no Firebase.
- `firebase.test.json`, `tests/firestore-rules.test.mjs` e o workflow **Firestore rules tests** permitem compilar/testar a candidata em um emulador real com projeto fictício. Java/emulador indisponíveis no ambiente atual; essa suíte não rodou aqui. Testes anteriores da aplicação continuam passando.
- Enviar o commit preparado para disparar o workflow. Conferir o resultado correspondente ao novo SHA; se falhar, corrigir antes de aplicação. Antes do Console, obter/preservar as regras efetivas e conferir compatibilidade dos dados existentes.
- A integração GitHub recusou gravações com 403, apesar do campo de permissão de escrita; o terminal do assistente não tinha rede externa. O usuário conseguiu enviar o commit de edição pelo próprio terminal. Não prometer push automático sem revalidar o acesso.
- Não há deploy automático de regras nem credencial Firebase de administrador. Próximo passo detalhado em [protecao-dados.md](protecao-dados.md).

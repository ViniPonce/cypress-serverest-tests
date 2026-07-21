# Cypress + ServeRest

Automação E2E (frontend) e API do [ServeRest](https://serverest.dev/) com Cypress e JavaScript.

- Frontend: https://front.serverest.dev/
- API (Swagger): https://serverest.dev/

## O que tem aqui

- **3+ cenários** de frontend e **3+** de API (CRUD, auth negativa, sessão)
- Page Objects, custom commands, factory com Faker
- Teardown automático: massa criada via API é limpa no `afterEach`
- Validação de schema (AJV) nas respostas principais
- CI no GitHub Actions (lint + API e frontend em paralelo)

## Pré-requisitos

- Node.js 18+ (recomendado 20)
- npm

## Instalação

```bash
git clone https://github.com/ViniPonce/cypress-serverest-tests.git
cd cypress-serverest-tests
npm install
cp cypress.env.example.json cypress.env.json
```

O `cypress.env.json` já aponta para os ambientes públicos. Ajuste só se precisar.

## Como rodar

```bash
# tudo (API + frontend)
npm run test:all

# só API
npm run test:api

# só frontend
npm run test:frontend

# modo interativo
npm run cy:open

# lint
npm run lint
```

Relatórios Mochawesome ficam em `cypress/reports/`.

## Estrutura

```
cypress/
  e2e/
    api/           # login, usuarios, produtos
    frontend/      # cadastro, login, lista + sessão
  fixtures/        # mensagens e schemas JSON
  pages/           # Page Objects
  support/
    api/           # camada HTTP
    commands.js    # custom commands + cleanup
    e2e.js         # hooks beforeEach/afterEach
  utils/           # factory, massa, schema
```

## Teardown (limpeza de massa)

Cada teste que cria usuário/produto via API registra o `_id` em memória. No `afterEach`, `cy.limparMassaCriada()`:

1. cancela carrinho aberto (se houver)
2. deleta produtos criados (com token admin temporário)
3. deleta usuários criados

Assim a suíte não deixa lixo no ambiente compartilhado e os specs rodam de forma independente.

## Cenários cobertos

### API

| Spec | O que valida |
|------|----------------|
| `usuarios` | criar, email duplicado, GET por id, PUT, DELETE |
| `login` | sucesso, senha errada, usuário inexistente, body vazio |
| `produtos` | listar, criar + duplicado, GET por id, PUT, DELETE |

### Frontend

| Spec | O que valida |
|------|----------------|
| `cadastro` | sucesso + redirect, email duplicado |
| `login` | sucesso, senha errada, inexistente, campos vazios |
| `lista-compras` | adicionar, limpar lista, logout, rota protegida sem token |

## Observações sobre o app

- Depois do cadastro, o front demora ~2–3s para redirecionar à home (comportamento do app, não flakiness do teste).
- A rota `/home` **não** redireciona sem token no carregamento; a proteção efetiva aparece em rotas como `/minhaListaDeProdutos` — por isso o cenário de rota protegida usa essa URL.

## CI

Push/PR em `main` dispara:

1. `npm run lint`
2. em paralelo: `test:api` e `test:frontend`
3. upload de reports/screenshots/videos como artefatos

## Autor

Vinicius Ponce

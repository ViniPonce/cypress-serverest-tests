# Cypress + ServeRest

[![CI](https://github.com/ViniPonce/cypress-serverest-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/ViniPonce/cypress-serverest-tests/actions/workflows/ci.yml)

Automação E2E (frontend) e API do [ServeRest](https://serverest.dev/) com **Cypress + JavaScript**.

- Frontend: https://front.serverest.dev/
- API (Swagger): https://serverest.dev/

## O que tem aqui

- Cenários de frontend e API além do mínimo pedido (CRUD, auth negativa, sessão)
- Page Objects, custom commands, factory com Faker
- Teardown automático: massa criada via API é limpa no `afterEach`
- Validação de schema (AJV) nas respostas principais
- CI no GitHub Actions (lint como gate + API/frontend em paralelo + artefatos)

## Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm

## Instalação

```bash
git clone https://github.com/ViniPonce/cypress-serverest-tests.git
cd cypress-serverest-tests
npm install
cp cypress.env.example.json cypress.env.json
```

O `cypress.env.json` aponta para os ambientes públicos. Ajuste só se precisar.

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

Cada teste que cria usuário/produto via API registra o `_id` (e credenciais quando fizer sentido). No `afterEach`, `cy.limparMassaCriada()`:

1. autentica os usuários criados e cancela carrinho aberto
2. deleta produtos criados (com token admin temporário)
3. deleta usuários criados

Assim a suíte não deixa lixo no ambiente compartilhado e os specs rodam de forma independente.

## Cenários cobertos

### API

| Spec | O que valida |
|------|----------------|
| `usuarios` | criar, email duplicado, GET por id, PUT, DELETE, id inexistente |
| `login` | sucesso, senha errada, usuário inexistente, body vazio, só email, só senha |
| `produtos` | listar, criar + duplicado, GET por id, PUT, DELETE, sem token, id inexistente |

### Frontend

| Spec | O que valida |
|------|----------------|
| `cadastro` | sucesso + redirect, email duplicado, campos vazios |
| `login` | sucesso, senha errada, inexistente, campos vazios |
| `lista-compras` | adicionar, limpar lista, logout, rota protegida sem/com sessão |

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

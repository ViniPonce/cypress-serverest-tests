# Cypress ServeRest — Automação E2E + API

[![CI](https://github.com/ViniPonce/cypress-serverest-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/ViniPonce/cypress-serverest-tests/actions/workflows/ci.yml)
[![Nightly Regression](https://github.com/ViniPonce/cypress-serverest-tests/actions/workflows/nightly.yml/badge.svg)](https://github.com/ViniPonce/cypress-serverest-tests/actions/workflows/nightly.yml)

Suíte de testes automatizados para o [ServeRest](https://serverest.dev/) com **Cypress** e **JavaScript**, cobrindo frontend e API com foco em estabilidade, isolamento de massa e feedback rápido no CI.

| Ambiente | URL |
|----------|-----|
| Frontend | https://front.serverest.dev/ |
| API (Swagger) | https://serverest.dev/ |

---

## Quick start

```bash
git clone https://github.com/ViniPonce/cypress-serverest-tests.git
cd cypress-serverest-tests
npm install
cp cypress.env.example.json cypress.env.json
```

```bash
# smoke (caminho crítico — o mesmo do CI em push/PR)
npm run test:smoke

# regressão completa
npm run test:regression

# por camada
npm run test:api
npm run test:frontend

# interativo
npm run cy:open

# lint
npm run lint
```

---

## Estratégia de teste

A suíte foi desenhada como **produto de automação**, não como lista de scripts soltos.

| Camada | Objetivo | Como roda |
|--------|----------|-----------|
| **API** | Contrato, CRUD, auth e autorização | `cy.request` + schemas AJV |
| **Frontend (E2E)** | Jornada real do usuário | Page Objects + asserts de UI/sessão |
| **Setup de massa** | Velocidade e estabilidade | Criação via API (Faker), não pela UI |
| **Teardown** | Ambiente compartilhado limpo | `afterEach` → `cy.limparMassaCriada()` |

### O que entra no smoke vs regressão

| Tag | Quando | Conteúdo |
|-----|--------|----------|
| `@smoke` | **Todo push/PR** (CI) | Login, cadastro, listagem, criar produto, authz, lista de compras, logout, rota protegida |
| `@regression` | **Nightly + manual** | Suíte completa (CRUD, negativos, sessão, edge cases) |

```bash
npm run test:smoke              # só @smoke
npm run test:regression         # suíte completa
npm run test:smoke:api          # smoke só API
npm run test:smoke:frontend     # smoke só frontend
```

No CI:

- **CI (push/PR):** lint → smoke API + smoke frontend (paralelo) → artefatos
- **Nightly Regression:** lint → suíte completa API + frontend (paralelo) → artefatos  
  Também pode ser disparada manualmente em *Actions → Nightly Regression → Run workflow*.

---

## Decisões de arquitetura

| Decisão | Motivo |
|---------|--------|
| **Page Objects** no frontend | Selectors e fluxos de UI centralizados; specs legíveis |
| **Camada `support/api`** | HTTP isolado da UI; reuso entre API specs e setup E2E |
| **Custom commands** | Setup idiomático (`criarUsuarioViaAPI`, `login`, teardown) |
| **Factory + Faker** | Massa única por execução; evita colisão de e-mail/nome |
| **Teardown no `afterEach`** | ServeRest é compartilhado; DELETE conectado ao fluxo (não só helper solto) |
| **AJV schemas** | Valida estrutura além de status/mensagem |
| **Tags `@smoke` / `@regression`** | Feedback rápido no PR sem abrir mão da cobertura ampla |
| **Massa via API no E2E** | UI só onde o comportamento de interface importa |

---

## Riscos, quirks e mitigações

| Observação | Impacto | Mitigação |
|------------|---------|-----------|
| Após cadastro, o front demora ~2–3s para ir à home | Falso flaky se timeout curto | Timeout de URL em 15s; tratado como comportamento do app |
| `/home` **não** valida token no carregamento | Teste de “rota protegida” em `/home` daria falso positivo | Usamos `/minhaListaDeProdutos`, que realmente redireciona sem sessão |
| Ambiente público compartilhado | Lixo de usuários/produtos entre runs | Teardown cancela carrinho → deleta produtos → deleta usuários |
| Lista de produtos pode estar poluída | Dificulta achar item na UI | Criamos produto com nome único via API e buscamos pelo nome |

---

## Observabilidade e relatórios

Após a execução, o HTML consolidado fica em:

`cypress/reports/html/index.html`

```bash
npm run test:smoke
npm run report:build
```

O `report:build` usa os JSONs mesclados quando disponíveis; senão, promove o HTML gerado pelo `cypress-mochawesome-reporter`.

### Como ver o report no CI

1. Abra a run em [Actions](https://github.com/ViniPonce/cypress-serverest-tests/actions)
2. Selecione o job (`Smoke API`, `Smoke Frontend`, ou regression)
3. Em **Artifacts**, baixe o pacote nomeado por run, por exemplo:
   - `smoke-api-<run_id>`
   - `smoke-frontend-<run_id>`
   - `regression-api-<run_id>`
   - `regression-frontend-<run_id>`
4. Extraia e abra `cypress/reports/html/index.html` (ou `cypress/reports/mochawesome/report.html`) no navegador

Cada artifact também pode incluir screenshots e videos para debug.

---

## Estrutura do projeto

```
cypress/
  e2e/
    api/              # login, usuarios, produtos (+ authz)
    frontend/         # cadastro, login, lista + sessão
  fixtures/           # mensagens e schemas JSON
  pages/              # Page Objects
  support/
    api/              # client HTTP
    commands.js       # custom commands + teardown
    tags.js           # filtro @smoke / @regression
    e2e.js            # hooks globais
  utils/              # factory, massa, schema validator
.github/workflows/
  ci.yml              # smoke em push/PR
  nightly.yml         # regressão completa (cron + manual)
```

---

## Cenários cobertos (visão geral)

### API
- **Usuários:** criar, duplicado, GET por id, PUT, DELETE, id inexistente  
- **Login:** sucesso, senha errada, inexistente, body vazio, só email, só senha  
- **Produtos:** listar, criar + duplicado, GET/PUT/DELETE, sem token, **não-admin (403)**, **token inválido (401)**, id inexistente  

### Frontend
- **Cadastro:** sucesso, e-mail duplicado, campos vazios  
- **Login:** sucesso, senha errada, inexistente, campos vazios  
- **Lista / sessão:** adicionar, limpar, logout, rota protegida sem token, rota protegida com sessão  

---

## Configuração

| Arquivo | Função |
|---------|--------|
| `cypress.env.example.json` | Modelo de `apiUrl` / `frontUrl` |
| `cypress.env.json` | Local (gitignored) |
| CI env | `CYPRESS_apiUrl` / `CYPRESS_frontUrl` |

---

## Autor

Vinicius Ponce

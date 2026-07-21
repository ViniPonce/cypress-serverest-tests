const dataFactory = require('../utils/dataFactory');
const massa = require('../utils/massa');
const api = require('./api/requests');

Cypress.Commands.add('criarUsuarioViaAPI', (overrides = {}) => {
  const usuario = dataFactory.gerarUsuario(overrides);
  return api.post('/usuarios', usuario).then((response) => {
    expect(response.status).to.eq(201);
    expect(response.body).to.have.property('_id');
    massa.registrarUsuario(response.body._id, {
      email: usuario.email,
      password: usuario.password,
    });
    return { ...usuario, _id: response.body._id };
  });
});

Cypress.Commands.add('loginViaAPI', (email, password) => {
  return api.post('/login', { email, password }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('authorization');
    massa.registrarToken(response.body.authorization);
    return response.body.authorization;
  });
});

Cypress.Commands.add('criarProdutoViaAPI', (overrides = {}) => {
  return cy.criarUsuarioViaAPI({ administrador: 'true' }).then((admin) => {
    return cy.loginViaAPI(admin.email, admin.password).then((token) => {
      const produto = dataFactory.gerarProduto(overrides);
      return api.post('/produtos', produto, { headers: api.comAuth(token) }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('_id');
        massa.registrarProduto(response.body._id);
        return { ...produto, _id: response.body._id, tokenAdmin: token, admin };
      });
    });
  });
});

Cypress.Commands.add('login', (email, password) => {
  const LoginPage = require('../pages/LoginPage');
  LoginPage.visitar();
  LoginPage.preencherCredenciais(email, password);
  LoginPage.submeter();
  cy.url({ timeout: 15000 }).should('include', '/home');
  cy.window().then((win) => {
    massa.registrarToken(win.localStorage.getItem('serverest/userToken'));
  });
});

Cypress.Commands.add('limparMassaCriada', () => {
  const tokens = [...(massa.tokens() || [])];
  const produtos = [...(massa.produtos() || [])];
  const usuarios = [...(massa.usuarios() || [])];
  massa.reset();

  function coletarTokensExtras(index = 0) {
    if (index >= usuarios.length) return cancelarCarrinhos();
    const user = usuarios[index];
    if (!user.email || !user.password) return coletarTokensExtras(index + 1);
    return api.post('/login', { email: user.email, password: user.password }).then((res) => {
      if (res.status === 200 && res.body.authorization) {
        tokens.push(res.body.authorization);
      }
      return coletarTokensExtras(index + 1);
    });
  }

  function cancelarCarrinhos(index = 0) {
    if (index >= tokens.length) return deletarProdutos();
    return api
      .delete('/carrinhos/cancelar-compra', { headers: api.comAuth(tokens[index]) })
      .then(() => cancelarCarrinhos(index + 1));
  }

  function deletarProdutos() {
    if (!produtos.length) return deletarUsuarios();
    const admin = dataFactory.gerarUsuario({ administrador: 'true' });
    return api.post('/usuarios', admin).then((adminRes) => {
      const adminId = adminRes.body && adminRes.body._id;
      return api.post('/login', { email: admin.email, password: admin.password }).then((loginRes) => {
        const token = loginRes.body && loginRes.body.authorization;
        const apagar = (i = 0) => {
          if (i >= produtos.length) {
            if (!adminId) return deletarUsuarios();
            return api.delete(`/usuarios/${adminId}`).then(() => deletarUsuarios());
          }
          return api
            .delete(`/produtos/${produtos[i]}`, { headers: api.comAuth(token) })
            .then(() => apagar(i + 1));
        };
        return apagar();
      });
    });
  }

  function deletarUsuarios(index = 0) {
    if (index >= usuarios.length) return cy.wrap(null);
    const id = usuarios[index].id || usuarios[index];
    return api.delete(`/usuarios/${id}`).then(() => deletarUsuarios(index + 1));
  }

  return coletarTokensExtras();
});

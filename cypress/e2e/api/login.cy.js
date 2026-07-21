const dataFactory = require('../../utils/dataFactory');
const { validarSchema } = require('../../utils/schemaValidator');
const api = require('../../support/api/requests');

describe('API login', () => {
  beforeEach(() => {
    cy.fixture('usuarios').as('dados');
    cy.fixture('schemas/login.schema.json').as('schemaLogin');
  });

  it('autentica e devolve bearer', function () {
    cy.criarUsuarioViaAPI().then((usuario) => {
      api.post('/login', { email: usuario.email, password: usuario.password }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq(this.dados.mensagens.loginSucesso);
        expect(response.body.authorization).to.match(/^Bearer\s.+/);
        validarSchema(this.schemaLogin, response.body);
      });
    });
  });

  it('rejeita senha errada', function () {
    cy.criarUsuarioViaAPI().then((usuario) => {
      api.post('/login', { email: usuario.email, password: 'senhaErrada123' }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.eq(this.dados.mensagens.credenciaisInvalidas);
      });
    });
  });

  it('rejeita usuario inexistente', function () {
    const credenciais = dataFactory.credenciaisInvalidas();
    api.post('/login', credenciais).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq(this.dados.mensagens.credenciaisInvalidas);
    });
  });

  it('rejeita body vazio', function () {
    api.post('/login', {}).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.email).to.eq(this.dados.mensagens.emailObrigatorio);
      expect(response.body.password).to.eq(this.dados.mensagens.passwordObrigatorio);
    });
  });

  it('rejeita login so com email', function () {
    api.post('/login', { email: 'qa.parcial@teste.com.br' }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.password).to.eq(this.dados.mensagens.passwordObrigatorio);
    });
  });

  it('rejeita login so com senha', function () {
    api.post('/login', { password: 'senhaQualquer' }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.email).to.eq(this.dados.mensagens.emailObrigatorio);
    });
  });
});

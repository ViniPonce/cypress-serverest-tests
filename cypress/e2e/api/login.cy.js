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
      expect(response.status).to.be.oneOf([400, 401]);
      expect(response.body).to.exist;
      expect(JSON.stringify(response.body)).to.match(/email|password|inválid/i);
    });
  });
});

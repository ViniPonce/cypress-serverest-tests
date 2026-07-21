const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const dataFactory = require('../../utils/dataFactory');

describe('Login', () => {
  beforeEach(() => {
    cy.fixture('usuarios').as('dados');
  });

  it('loga com sucesso', function () {
    cy.criarUsuarioViaAPI({ administrador: 'false' }).then((usuario) => {
      cy.login(usuario.email, usuario.password);
      HomePage.validarPaginaCarregada();
      cy.window().then((win) => {
        expect(win.localStorage.getItem('serverest/userEmail')).to.eq(usuario.email);
        expect(win.localStorage.getItem('serverest/userToken')).to.match(/^Bearer\s.+/);
      });
    });
  });

  it('mostra erro com senha errada', function () {
    cy.criarUsuarioViaAPI({ administrador: 'false' }).then((usuario) => {
      LoginPage.visitar();
      LoginPage.preencherCredenciais(usuario.email, 'senhaErrada123');
      LoginPage.submeter();
      LoginPage.validarUrlLogin();
      LoginPage.validarMensagemErro(this.dados.mensagens.credenciaisInvalidas);
    });
  });

  it('mostra erro pra usuario inexistente', function () {
    const credenciais = dataFactory.credenciaisInvalidas();
    LoginPage.visitar();
    LoginPage.preencherCredenciais(credenciais.email, credenciais.password);
    LoginPage.submeter();
    LoginPage.validarUrlLogin();
    LoginPage.validarMensagemErro(this.dados.mensagens.credenciaisInvalidas);
  });

  it('nao loga com campos vazios', function () {
    LoginPage.visitar();
    LoginPage.preencherCredenciais('', '');
    LoginPage.submeter();
    LoginPage.validarUrlLogin();
    cy.url().should('not.include', '/home');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('serverest/userToken')).to.not.match(/^Bearer\s.+/);
    });
  });
});

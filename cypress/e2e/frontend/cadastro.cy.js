const CadastroPage = require('../../pages/CadastroPage');
const HomePage = require('../../pages/HomePage');
const dataFactory = require('../../utils/dataFactory');
const massa = require('../../utils/massa');
const api = require('../../support/api/requests');

describe('Cadastro', () => {
  beforeEach(() => {
    cy.fixture('usuarios').as('dados');
  });

  it('cadastra usuario e vai pra home @smoke @regression', { tags: ['@smoke', '@regression'] }, function () {
    const usuario = dataFactory.gerarUsuario({ administrador: 'false' });
    CadastroPage.visitar();
    CadastroPage.preencherFormulario(usuario, false);
    CadastroPage.submeter();
    CadastroPage.validarMensagemSucesso(this.dados.mensagens.cadastroSucesso);
    HomePage.validarPaginaCarregada();
    api.get(`/usuarios?email=${encodeURIComponent(usuario.email)}`).then((res) => {
      const criado = res.body.usuarios && res.body.usuarios[0];
      if (criado && criado._id) {
        massa.registrarUsuario(criado._id, {
          email: usuario.email,
          password: usuario.password,
        });
      }
    });
  });

  it('nao deixa cadastrar email duplicado @regression', { tags: ['@regression'] }, function () {
    cy.criarUsuarioViaAPI({ administrador: 'false' }).then((usuario) => {
      CadastroPage.visitar();
      CadastroPage.preencherFormulario(usuario, false);
      CadastroPage.submeter();
      CadastroPage.validarMensagemErro(this.dados.mensagens.emailDuplicado);
      cy.url().should('include', '/cadastrarusuarios');
    });
  });

  it('nao cadastra com campos vazios @regression', { tags: ['@regression'] }, function () {
    CadastroPage.visitar();
    CadastroPage.preencherFormulario({ nome: '', email: '', password: '' }, false);
    CadastroPage.submeter();
    cy.url().should('include', '/cadastrarusuarios');
    cy.url().should('not.include', '/home');
  });
});

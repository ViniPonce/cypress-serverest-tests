const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const ListaComprasPage = require('../../pages/ListaComprasPage');

describe('Lista de compras e sessao', () => {
  it('adiciona produto na lista', () => {
    cy.criarProdutoViaAPI().then((produto) => {
      cy.criarUsuarioViaAPI({ administrador: 'false' }).then((usuario) => {
        cy.login(usuario.email, usuario.password);
        HomePage.validarPaginaCarregada();
        HomePage.adicionarProdutoNaListaPorNome(produto.nome);
        ListaComprasPage.validarPaginaCarregada();
        ListaComprasPage.validarProdutoNaLista(produto.nome);
      });
    });
  });

  it('limpa a lista de compras', () => {
    cy.criarProdutoViaAPI().then((produto) => {
      cy.criarUsuarioViaAPI({ administrador: 'false' }).then((usuario) => {
        cy.login(usuario.email, usuario.password);
        HomePage.validarPaginaCarregada();
        HomePage.adicionarProdutoNaListaPorNome(produto.nome);
        ListaComprasPage.validarPaginaCarregada();
        ListaComprasPage.limparLista();
        ListaComprasPage.validarListaVazia();
      });
    });
  });

  it('faz logout e limpa a sessao', () => {
    cy.criarUsuarioViaAPI({ administrador: 'false' }).then((usuario) => {
      cy.login(usuario.email, usuario.password);
      HomePage.validarPaginaCarregada();
      HomePage.logout();
      LoginPage.validarUrlLogin();

      cy.window().then((win) => {
        expect(win.localStorage.getItem('serverest/userToken')).to.be.oneOf([null, '']);
        expect(win.localStorage.getItem('serverest/userEmail')).to.be.oneOf([null, '']);
      });
    });
  });

  it('bloqueia acesso a rota protegida sem token', () => {
    cy.clearLocalStorage();
    // /home do cliente nao valida token; a lista de compras sim
    cy.visit('/minhaListaDeProdutos');
    LoginPage.validarUrlLogin();
  });
});

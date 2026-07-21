class LoginPage {
  elements = {
    email: () => cy.get('[data-testid="email"]'),
    senha: () => cy.get('[data-testid="senha"]'),
    botaoEntrar: () => cy.get('[data-testid="entrar"]'),
    alertaErro: () => cy.get('.alert-dismissible'),
  };
  visitar() { cy.visit('/login'); return this; }
  preencherCredenciais(email, password) {
    if (email) this.elements.email().clear().type(email);
    else this.elements.email().clear();
    if (password) this.elements.senha().clear().type(password, { log: false });
    else this.elements.senha().clear();
    return this;
  }
  submeter() { this.elements.botaoEntrar().click(); return this; }
  validarMensagemErro(mensagem) {
    this.elements.alertaErro().should('be.visible').and('contain.text', mensagem);
    return this;
  }
  validarUrlLogin() { cy.url().should('include', '/login'); return this; }
}
module.exports = new LoginPage();

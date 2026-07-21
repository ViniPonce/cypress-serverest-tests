class CadastroPage {
  elements = {
    nome: () => cy.get('[data-testid="nome"]'),
    email: () => cy.get('[data-testid="email"]'),
    password: () => cy.get('[data-testid="password"]'),
    checkboxAdmin: () => cy.get('[data-testid="checkbox"]'),
    botaoCadastrar: () => cy.get('[data-testid="cadastrar"]'),
    alertaSucesso: () => cy.get('.alert-primary'),
    alertaErro: () => cy.get('.alert-dismissible'),
  };
  visitar() { cy.visit('/cadastrarusuarios'); return this; }
  preencherFormulario({ nome, email, password }, comoAdmin = false) {
    this.elements.nome().clear().type(nome);
    this.elements.email().clear().type(email);
    this.elements.password().clear().type(password, { log: false });
    if (comoAdmin) this.elements.checkboxAdmin().check({ force: true });
    return this;
  }
  submeter() { this.elements.botaoCadastrar().click(); return this; }
  validarMensagemSucesso(mensagem) {
    this.elements.alertaSucesso().should('be.visible').and('contain.text', mensagem);
    return this;
  }
  validarMensagemErro(mensagem) {
    this.elements.alertaErro().should('be.visible').and('contain.text', mensagem);
    return this;
  }
}
module.exports = new CadastroPage();

class HomePage {
  elements = {
    tituloLoja: () => cy.contains('h1', 'Serverest Store'),
    cardProduto: () => cy.get('.card'),
    botaoLogout: () => cy.get('[data-testid="logout"]'),
  };
  validarPaginaCarregada() {
    cy.url({ timeout: 15000 }).should('include', '/home');
    this.elements.tituloLoja().should('be.visible');
    return this;
  }
  adicionarProdutoNaListaPorNome(nomeProduto) {
    this.elements.cardProduto().should('have.length.at.least', 1);
    this.elements.cardProduto().contains('.card-title', nomeProduto)
      .parents('.card').find('[data-testid="adicionarNaLista"]').click();
    return this;
  }
  logout() { this.elements.botaoLogout().click(); return this; }
}
module.exports = new HomePage();

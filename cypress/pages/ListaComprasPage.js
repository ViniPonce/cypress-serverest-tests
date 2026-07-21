class ListaComprasPage {
  elements = {
    titulo: () => cy.contains('h1', 'Lista de Compras'),
    nomeProduto: () => cy.get('[data-testid="shopping-cart-product-name"]'),
    quantidadeProduto: () => cy.get('[data-testid="shopping-cart-product-quantity"]'),
    mensagemVazia: () => cy.get('[data-testid="shopping-cart-empty-message"]'),
    botaoLimparLista: () => cy.get('[data-testid="limparLista"]'),
  };
  validarPaginaCarregada() {
    cy.url().should('include', '/minhaListaDeProdutos');
    this.elements.titulo().should('be.visible');
    return this;
  }
  validarProdutoNaLista(nomeProduto) {
    this.elements.nomeProduto().should('be.visible').and('contain.text', nomeProduto);
    this.elements.quantidadeProduto().should('contain.text', '1');
    return this;
  }
  limparLista() { this.elements.botaoLimparLista().click(); return this; }
  validarListaVazia() {
    this.elements.mensagemVazia().should('be.visible').and('contain.text', 'Seu carrinho está vazio');
    return this;
  }
}
module.exports = new ListaComprasPage();

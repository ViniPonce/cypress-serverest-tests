const massa = {
  reset() {
    Cypress.env('massaUsuarios', []);
    Cypress.env('massaProdutos', []);
    Cypress.env('massaTokens', []);
  },

  registrarUsuario(id, credenciais = null) {
    const atual = Cypress.env('massaUsuarios') || [];
    atual.push({
      id,
      email: credenciais && credenciais.email,
      password: credenciais && credenciais.password,
    });
    Cypress.env('massaUsuarios', atual);
  },

  registrarProduto(id) {
    const atual = Cypress.env('massaProdutos') || [];
    atual.push(id);
    Cypress.env('massaProdutos', atual);
  },

  registrarToken(token) {
    if (!token) return;
    const atual = Cypress.env('massaTokens') || [];
    atual.push(token);
    Cypress.env('massaTokens', atual);
  },

  usuarios() {
    return Cypress.env('massaUsuarios') || [];
  },

  produtos() {
    return Cypress.env('massaProdutos') || [];
  },

  tokens() {
    return Cypress.env('massaTokens') || [];
  },
};

module.exports = massa;

const { faker } = require('@faker-js/faker');

const dataFactory = {
  gerarUsuario(overrides = {}) {
    const unique = faker.string.alphanumeric(8).toLowerCase();
    return {
      nome: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: `qa.${unique}.${Date.now()}@teste.com.br`,
      password: faker.internet.password({ length: 10, memorable: false }),
      administrador: 'false',
      ...overrides,
    };
  },
  gerarProduto(overrides = {}) {
    const unique = faker.string.alphanumeric(6);
    return {
      nome: `Produto QA ${unique} ${Date.now()}`,
      preco: faker.number.int({ min: 10, max: 5000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 100 }),
      ...overrides,
    };
  },
  credenciaisInvalidas() {
    return {
      email: `invalido.${Date.now()}@naoexiste.com`,
      password: 'senhaInvalida123',
    };
  },
};

module.exports = dataFactory;

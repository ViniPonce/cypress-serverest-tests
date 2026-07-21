const dataFactory = require('../../utils/dataFactory');
const { validarSchema } = require('../../utils/schemaValidator');
const api = require('../../support/api/requests');
const massa = require('../../utils/massa');

describe('API produtos', () => {
  beforeEach(() => {
    cy.fixture('usuarios').as('dados');
    cy.fixture('schemas/produtos.schema.json').as('schemaProdutos');
    cy.fixture('schemas/usuario-criado.schema.json').as('schemaCriado');
  });

  it('lista produtos', function () {
    api.get('/produtos').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.quantidade).to.eq(response.body.produtos.length);
      validarSchema(this.schemaProdutos, response.body);
    });
  });

  it('admin cria produto e bloqueia nome duplicado', function () {
    cy.criarUsuarioViaAPI({ administrador: 'true' }).then((admin) => {
      cy.loginViaAPI(admin.email, admin.password).then((token) => {
        const produto = dataFactory.gerarProduto();
        api.post('/produtos', produto, { headers: api.comAuth(token) }).then((criado) => {
          expect(criado.status).to.eq(201);
          validarSchema(this.schemaCriado, criado.body);
          massa.registrarProduto(criado.body._id);
          api.post('/produtos', produto, { headers: api.comAuth(token) }).then((duplicado) => {
            expect(duplicado.status).to.eq(400);
            expect(duplicado.body.message).to.eq(this.dados.mensagens.produtoDuplicado);
          });
        });
      });
    });
  });

  it('busca produto por id', function () {
    cy.criarProdutoViaAPI().then((produto) => {
      api.get(`/produtos/${produto._id}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body._id).to.eq(produto._id);
        expect(response.body.nome).to.eq(produto.nome);
      });
    });
  });

  it('atualiza produto', function () {
    cy.criarProdutoViaAPI().then((produto) => {
      const atualizado = {
        nome: `${produto.nome} Editado`,
        preco: produto.preco + 10,
        descricao: produto.descricao,
        quantidade: produto.quantidade,
      };
      api.put(`/produtos/${produto._id}`, atualizado, { headers: api.comAuth(produto.tokenAdmin) }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq(this.dados.mensagens.alteradoSucesso);
        api.get(`/produtos/${produto._id}`).then((busca) => {
          expect(busca.body.nome).to.eq(atualizado.nome);
        });
      });
    });
  });

  it('exclui produto', function () {
    cy.criarProdutoViaAPI().then((produto) => {
      api.delete(`/produtos/${produto._id}`, { headers: api.comAuth(produto.tokenAdmin) }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.include('excluído');
        api.get(`/produtos/${produto._id}`).then((busca) => {
          expect(busca.status).to.eq(400);
          expect(busca.body.message).to.eq(this.dados.mensagens.produtoNaoEncontrado);
        });
      });
    });
  });

  it('bloqueia criar produto sem token', function () {
    const produto = dataFactory.gerarProduto();
    api.post('/produtos', produto).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq(this.dados.mensagens.tokenAusente);
    });
  });

  it('retorna erro ao buscar id inexistente', function () {
    cy.criarProdutoViaAPI().then((produto) => {
      api.delete(`/produtos/${produto._id}`, { headers: api.comAuth(produto.tokenAdmin) }).then(() => {
        api.get(`/produtos/${produto._id}`).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq(this.dados.mensagens.produtoNaoEncontrado);
        });
      });
    });
  });
});

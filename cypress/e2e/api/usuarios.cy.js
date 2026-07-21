const dataFactory = require('../../utils/dataFactory');
const { validarSchema } = require('../../utils/schemaValidator');
const api = require('../../support/api/requests');
const massa = require('../../utils/massa');

describe('API usuarios', () => {
  beforeEach(() => {
    cy.fixture('usuarios').as('dados');
    cy.fixture('schemas/usuario-criado.schema.json').as('schemaUsuario');
    cy.fixture('schemas/usuario-por-id.schema.json').as('schemaUsuarioId');
  });

  it('cria usuario com sucesso', function () {
    const usuario = dataFactory.gerarUsuario();
    api.post('/usuarios', usuario).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq(this.dados.mensagens.cadastroSucesso);
      expect(response.body._id).to.be.a('string').and.not.be.empty;
      validarSchema(this.schemaUsuario, response.body);
      massa.registrarUsuario(response.body._id, {
        email: usuario.email,
        password: usuario.password,
      });
    });
  });

  it('nao deixa email duplicado', function () {
    cy.criarUsuarioViaAPI().then((usuario) => {
      const payload = {
        nome: usuario.nome,
        email: usuario.email,
        password: usuario.password,
        administrador: usuario.administrador,
      };
      api.post('/usuarios', payload).then((duplicado) => {
        expect(duplicado.status).to.eq(400);
        expect(duplicado.body.message).to.eq(this.dados.mensagens.emailDuplicado);
      });
    });
  });

  it('busca usuario por id', function () {
    cy.criarUsuarioViaAPI().then((usuario) => {
      api.get(`/usuarios/${usuario._id}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body._id).to.eq(usuario._id);
        expect(response.body.email).to.eq(usuario.email);
        validarSchema(this.schemaUsuarioId, response.body);
      });
    });
  });

  it('atualiza usuario', function () {
    cy.criarUsuarioViaAPI().then((usuario) => {
      const atualizado = {
        nome: `${usuario.nome} Editado`,
        email: usuario.email,
        password: usuario.password,
        administrador: 'false',
      };
      api.put(`/usuarios/${usuario._id}`, atualizado).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq(this.dados.mensagens.alteradoSucesso);
        api.get(`/usuarios/${usuario._id}`).then((busca) => {
          expect(busca.body.nome).to.eq(atualizado.nome);
        });
      });
    });
  });

  it('exclui usuario', function () {
    cy.criarUsuarioViaAPI().then((usuario) => {
      api.delete(`/usuarios/${usuario._id}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.include('excluído');
        api.get(`/usuarios/${usuario._id}`).then((busca) => {
          expect(busca.status).to.eq(400);
          expect(busca.body.message).to.eq(this.dados.mensagens.usuarioNaoEncontrado);
        });
      });
    });
  });
});

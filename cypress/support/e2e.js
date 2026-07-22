import 'cypress-mochawesome-reporter/register';
import './commands';
import './tags';

const massa = require('../utils/massa');

beforeEach(() => {
  massa.reset();
});

afterEach(() => {
  cy.limparMassaCriada();
});

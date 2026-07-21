import 'cypress-mochawesome-reporter/register';
import './commands';

const massa = require('../utils/massa');

beforeEach(() => {
  massa.reset();
});

afterEach(() => {
  cy.limparMassaCriada();
});

const apiUrl = () => Cypress.env('apiUrl');

const api = {
  request(method, path, options = {}) {
    return cy.request({
      method,
      url: `${apiUrl()}${path}`,
      failOnStatusCode: false,
      ...options,
    });
  },
  post(path, body, options = {}) {
    return this.request('POST', path, { body, ...options });
  },
  get(path, options = {}) {
    return this.request('GET', path, options);
  },
  put(path, body, options = {}) {
    return this.request('PUT', path, { body, ...options });
  },
  delete(path, options = {}) {
    return this.request('DELETE', path, options);
  },
  comAuth(token) {
    return { Authorization: token };
  },
};

module.exports = api;

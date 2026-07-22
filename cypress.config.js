const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    video: true,
    screenshotOnRunFailure: true,
    retries: { runMode: 1, openMode: 0 },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome',
      reportFilename: 'report',
      overwrite: false,
      html: true,
      json: true,
      saveJson: true,
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      reportPageTitle: 'ServeRest — Cypress Report',
    },
    setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require
      require('cypress-mochawesome-reporter/plugin')(on);
      const apiUrl = config.env.apiUrl || 'https://serverest.dev';
      const frontUrl = config.env.frontUrl || 'https://front.serverest.dev';
      config.env.apiUrl = apiUrl;
      config.env.frontUrl = frontUrl;
      config.baseUrl = frontUrl;
      return config;
    },
  },
});

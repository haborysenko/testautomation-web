const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'tests/**/*.spec.js',
    supportFile: 'support/index.js',
    fixturesFolder: 'fixtures',
    downloadsFolder: 'downloads',
    screenshotsFolder: 'reports/screenshots',
    videosFolder: 'reports/videos',
    allowCypressEnv: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 6000,
    retries: { runMode: 1, openMode: 0 },
    reporter: require.resolve('cypress-mochawesome-reporter'),
    reporterOptions: {
      reportDir: 'reports/html',
      charts: true,
      reportPageTitle: 'Cypress results',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      autoOpen: false,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
});

import 'cypress-axe';
import 'cypress-real-events';
import 'cypress-mochawesome-reporter/register';

before(() => {
  cy.task('resetCoverage', { isInteractive: Cypress.config('isInteractive') }, { log: false });
});

afterEach(() => {
  cy.window().then((win) => {
    if (win.__coverage__) {
      cy.task('combineCoverage', JSON.stringify(win.__coverage__), { log: false });
    }
  });
});

after(() => {
  cy.task('coverageReport', null, { timeout: 180_000, log: false });
});

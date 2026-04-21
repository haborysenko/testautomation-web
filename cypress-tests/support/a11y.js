export function checkA11y(scope = 'body') {
  cy.injectAxe();
  cy.checkA11y(scope, { includedImpacts: ['serious', 'critical'] });
}

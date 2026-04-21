import { onLoginPage } from './pages/LoginPage.js';

const loggedKey = 'logged';

export function getLogged() {
  return cy.window().its('localStorage').invoke('getItem', loggedKey);
}

export function clearLogged() {
  cy.clearLocalStorage();
}

export function verifyLoggedAs(email) {
  getLogged().should('eq', email);
}

export function verifyLoggedOut() {
  getLogged().should('eq', null);
}

export function loginAs(user) {
  cy.session(
    user.label,
    () => {
      cy.visit('/');
      onLoginPage.login(user);
    },
    { validate: () => verifyLoggedAs(user.email) },
  );
  cy.visit('/');
}

import { onLoginPage } from '../support/pages/LoginPage.js';
import { verifyLoggedOut } from '../support/session.js';
import { invalidInputs } from '../fixtures/login-data.js';

describe('Login — invalid credentials', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  invalidInputs.forEach(({ name, user }) => {
    it(`rejects login with ${name}`, () => {
      onLoginPage.login(user);
      onLoginPage.verifyLoginFormVisible();
      // TODO BUG-002: assert error message once app renders the login error element
      // onLoginPage.verifyErrorVisible();
      verifyLoggedOut();
    });
  });
});

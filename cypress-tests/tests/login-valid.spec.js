import { onLoginPage } from '../support/pages/LoginPage.js';
import { onHomePage } from '../support/pages/HomePage.js';
import { verifyLoggedOut, verifyLoggedAs } from '../support/session.js';
import { defaultUser, validInputs } from '../fixtures/login-data.js';

describe('Login — valid credentials', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  validInputs.forEach((user) => {
    it(`logs in as "${user.label}"`, () => {
      verifyLoggedOut();

      onLoginPage.login(user);

      onHomePage.verifyNavVisible();
      onHomePage.verifyAvatarVisible();
      onHomePage.verifyUserMenuClosed();
      onHomePage.verifyContentVisible();
      verifyLoggedAs(user.email);
    });
  });

  it('session persists after page reload', () => {
    onLoginPage.login(defaultUser);
    onHomePage.verifyNavVisible();

    cy.reload();

    onHomePage.verifyNavVisible();
    onHomePage.verifyContentVisible();
    verifyLoggedAs(defaultUser.email);
  });

  it('session persists across tab close and reopen (localStorage survives, sessionStorage would not)', () => {
    onLoginPage.login(defaultUser);
    verifyLoggedAs(defaultUser.email);

    // Simulate tab close: browser clears sessionStorage but keeps localStorage
    cy.clearAllSessionStorage();
    cy.visit('/');

    onHomePage.verifyNavVisible();
    onHomePage.verifyContentVisible();
    verifyLoggedAs(defaultUser.email);
  });

  // TODO BUG-007: uncomment once app implements session expiry
  // it('session expires after prolonged inactivity', () => {
  //   cy.clock();
  //   onLoginPage.login(defaultUser);
  //   cy.tick(8 * 60 * 60 * 1000); // Fast-forward 8 hours
  //   cy.visit('/');
  //   onLoginPage.verifyLoginFormVisible();
  // });
});

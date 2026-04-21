import { onLoginPage } from '../support/pages/LoginPage.js';
import { onHomePage } from '../support/pages/HomePage.js';
import { defaultUser } from '../fixtures/login-data.js';
import { viewPorts } from '../fixtures/viewPorts.js';

viewPorts.forEach(({ label, width, height }) => {
  describe.skip(`Responsive — ${label} (${width}x${height})`, () => {
    beforeEach(() => {
      cy.viewport(width, height);
      cy.clearLocalStorage();
      cy.visit('/');
    });

    it('completes full login, navigation, and logout flow', () => {
      onLoginPage.verifyLoginFormVisible();
      onLoginPage.login(defaultUser);

      onHomePage.verifyNavVisible();
      onHomePage.verifyContentVisible();
      onHomePage.verifyParagraphsExist();
      onHomePage.verifyAvatarVisible();
      onHomePage.openUserMenu();
      onHomePage.closeUserMenu();

      onHomePage.logout();
      onLoginPage.verifyLoginFormVisible();
    });
  });
});

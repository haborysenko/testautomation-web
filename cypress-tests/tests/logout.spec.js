import { onLoginPage } from '../support/pages/LoginPage.js';
import { onHomePage } from '../support/pages/HomePage.js';
import { loginAs, verifyLoggedOut } from '../support/session.js';
import { defaultUser } from '../fixtures/login-data.js';

describe('Logout — user menu and session', () => {
  beforeEach(() => loginAs(defaultUser));

  // TODO BUG-012: uncomment once app constrains dropdown within the nav bar boundaries
  // it('user menu dropdown stays within the nav bar', () => {
  //   onHomePage.openUserMenu();
  //   onHomePage.verifyDropdownWithinNav();
  // });

  it('dropdown toggles open and closed', () => {
    onHomePage.openUserMenu();
    onHomePage.closeUserMenu();
  });

  // TODO BUG-008: uncomment once app adds a document-level click handler to close the dropdown
  // it('dropdown closes when clicking outside', () => {
  //   onHomePage.openUserMenu();
  //   onHomePage.clickOutside();
  //   onHomePage.verifyUserMenuClosed();
  // });

  it('logout clears session and returns to login view', () => {
    onHomePage.logout();
    onLoginPage.verifyLoginFormVisible();
    onLoginPage.verifyEmailEmpty();
    onLoginPage.verifyPasswordEmpty();
    onHomePage.verifyNavHidden();
    verifyLoggedOut();
  });
});

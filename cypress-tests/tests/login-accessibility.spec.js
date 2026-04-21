import { onLoginPage } from '../support/pages/LoginPage.js';
import { onHomePage } from '../support/pages/HomePage.js';
import { verifyLoggedAs } from '../support/session.js';
import { defaultUser } from '../fixtures/login-data.js';
import { checkA11y } from '../support/a11y.js';

describe('Login — accessibility', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('login form has no serious or critical accessibility violations', () => {
    checkA11y('main');
  });

  // TODO BUG-013: uncomment once autofocus works reliably outside of iframe environments
  // it('email field receives focus on page load', () => {
  //   onLoginPage.verifyEmailFocused();
  // });

  // TODO BUG-004, BUG-010, BUG-011: uncomment once app adds required, type="email", placeholders and copy protection
  it('login form fields have correct HTML constraints', () => {
    // onLoginPage.verifyEmailFieldAttributes();
    onLoginPage.verifyEmailHasPlaceholder();
    // onLoginPage.verifyPasswordFieldAttributes();
    // onLoginPage.verifyPasswordHasPlaceholder();
    // onLoginPage.verifyPasswordNoCopy();
  });

  // TODO BUG-009: login button does not respond to Enter key — form submission is mouse-only
  // it('submits login form with Enter key instead of button click', () => {
  //   onLoginPage.typeEmail(defaultUser.email);
  //   onLoginPage.typePassword(defaultUser.password);
  //   onLoginPage.submitWithEnter();
  //   onHomePage.verifyNavVisible();
  //   onHomePage.verifyContentVisible();
  //   verifyLoggedAs(defaultUser.email);
  // });
});

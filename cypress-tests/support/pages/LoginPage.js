export class LoginPage {
  typeEmail(email) {
    cy.get('#email').type(email);
  }

  typePassword(password) {
    cy.get('#password').type(password);
  }

  submitLogin() {
    cy.get('input.btn-login').click();
  }

  login(user) {
    // Skip typing when value is empty for invalid input tests
    if (user.email) this.typeEmail(user.email);
    if (user.password) this.typePassword(user.password);
    this.submitLogin();
  }

  submitWithEnter() {
    // Intentionally tests keyboard submit with Enter
    cy.get('#password').type('{enter}');
  }

  verifyLoginFormVisible() {
    cy.get('#login').should('be.visible');
  }

  verifyEmailEmpty() {
    cy.get('#email').should('have.value', '');
  }

  verifyPasswordEmpty() {
    cy.get('#password').should('have.value', '');
  }

  verifyEmailFocused() {
    cy.focused().should('have.attr', 'id', 'email');
  }

  verifyErrorVisible() {
    cy.get('#login-error').should('be.visible');
  }

  verifyEmailFieldAttributes() {
    cy.get('#email').should('have.attr', 'type', 'email').and('have.attr', 'required');
  }

  verifyEmailHasPlaceholder() {
    cy.get('#email').should('have.attr', 'placeholder');
  }

  verifyPasswordFieldAttributes() {
    cy.get('#password').should('have.attr', 'required');
  }

  verifyPasswordHasPlaceholder() {
    cy.get('#password').should('have.attr', 'placeholder');
  }

  verifyPasswordNoCopy() {
    cy.get('#password').should('have.attr', 'oncopy', 'return false');
  }
}

export const onLoginPage = new LoginPage();

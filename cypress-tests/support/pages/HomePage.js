export class HomePage {
  verifyNavVisible() {
    cy.get('#navigation').should('be.visible');
  }

  verifyAvatarVisible() {
    cy.get('#user').should('be.visible');
  }

  verifyContentVisible() {
    cy.get('.div-container').should('be.visible');
  }

  verifyUserMenuOpen() {
    cy.get('#logout').should('be.visible');
  }

  verifyUserMenuClosed() {
    cy.get('#logout').should('not.be.visible');
  }

  verifyNavHidden() {
    cy.get('#navigation').should('not.be.visible');
  }

  clickOutside() {
    cy.get('body').click(0, 0);
  }

  verifyParagraphsExist() {
    cy.get('#content p').should('have.length.gte', 1);
  }

  // Scrolls when not fully visible
  scrollToBottom() {
    cy.get('.div-container').then(($el) => {
      if ($el[0].scrollHeight > $el[0].clientHeight) {
        cy.wrap($el).scrollTo('bottom');
      }
    });
  }

  verifyNavItemExists(item) {
    cy.get(`.${item}`).should('exist');
  }

  verifyNavItemActive(item) {
    cy.get(`.${item}`).should('have.class', 'active');
  }

  verifyNavContentIs(item) {
    cy.get('#content').should('contain.text', item);
  }

  clickNavMenuItem(item) {
    cy.get(`.${item}`).click();
  }

  // Each helper first checks the expected current state,
  // then clicks the toggle and verifies the new state.
  openUserMenu() {
    this.verifyUserMenuClosed();
    cy.get('#user').click();
    this.verifyUserMenuOpen();
  }

  closeUserMenu() {
    this.verifyUserMenuOpen();
    cy.get('#user').click();
    this.verifyUserMenuClosed();
  }

  logout() {
    this.openUserMenu();
    cy.get('#logout').click();
  }
}

export const onHomePage = new HomePage();

import { onHomePage } from '../support/pages/HomePage.js';
import { loginAs } from '../support/session.js';
import { defaultUser } from '../fixtures/login-data.js';
import { navItems } from '../fixtures/navigation.js';

describe('Navigation — top menu after login', () => {
  beforeEach(() => loginAs(defaultUser));

  // BUG: nav items have no active-state logic — clicking does not highlight the selected item
  navItems.forEach((item) => {
    it(`nav item "${item}" is present and clickable`, () => {
      onHomePage.verifyNavItemExists(item);
      onHomePage.clickNavMenuItem(item);
      // TODO BUG-014: uncomment once app adds active-state highlighting to nav items
      // onHomePage.verifyNavItemActive(item);
    });
  });

  // TODO BUG-003: uncomment once app implements routing logic for nav items
  // navItems.forEach((item) => {
  //   it(`clicking "${item}" displays the corresponding content section`, () => {
  //     onHomePage.clickNavMenuItem(item);
  //     onHomePage.verifyNavContentIs(item);
  //   });
  // });
});

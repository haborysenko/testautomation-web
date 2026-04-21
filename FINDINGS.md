# Quality Engineering Findings & Recommendations

> **Scope:** Black-box testing of the SPA at `app/` — application code was not modified.  
> **Stack:** Plain HTML/CSS/JS · single file · no build step · `localStorage`-backed auth.

---

## Contents

- [1. Recommendations](#1-recommendations)
  - [Authentication](#authentication)
  - [Input handling](#input-handling)
  - [Testability](#testability)
- [2. Bug Findings](#2-bug-findings)
  - [BUG-001 — Credentials stored in plaintext client-side JavaScript](#bug-001--credentials-stored-in-plaintext-client-side-javascript)
  - [BUG-002 — No error feedback on failed login](#bug-002--no-error-feedback-on-failed-login)
  - [BUG-003 — Navigation items do not change content](#bug-003--navigation-items-do-not-change-content)
  - [BUG-004 — No input validation on login form](#bug-004--no-input-validation-on-login-form)
  - [BUG-005 — Password comparison uses loose equality](#bug-005--password-comparison-uses-loose-equality)
  - [BUG-006 — Email comparison is case-sensitive](#bug-006--email-comparison-is-case-sensitive)
  - [BUG-007 — No session expiry or timeout](#bug-007--no-session-expiry-or-timeout)
  - [BUG-008 — User dropdown does not close on outside click](#bug-008--user-dropdown-does-not-close-on-outside-click)
  - [BUG-009 — Login form cannot be submitted with the Enter key](#bug-009--login-form-cannot-be-submitted-with-the-enter-key)
  - [BUG-010 — Password field has no placeholder text](#bug-010--password-field-has-no-placeholder-text)
  - [BUG-011 — Password field value can be copied to clipboard](#bug-011--password-field-value-can-be-copied-to-clipboard)
  - [BUG-012 — User dropdown overlaps content area below the nav bar](#bug-012--user-dropdown-overlaps-content-area-below-the-nav-bar)
  - [BUG-013 — Email field does not receive focus on page load](#bug-013--email-field-does-not-receive-focus-on-page-load)
  - [BUG-014 — Clicked nav item is not highlighted as active](#bug-014--clicked-nav-item-is-not-highlighted-as-active)
  - [BUG-015 — Page heading has a hard-coded dark background colour](#bug-015--page-heading-has-a-hard-coded-dark-background-colour)
  - [BUG-016 — Content area overflows its frame on viewport resize](#bug-016--content-area-overflows-its-frame-on-viewport-resize)

---

## 1. Recommendations

### Authentication
- Move auth server-side — never send credentials to the browser.
- Replace `localStorage` state with token-based sessions that include expiry.

### Input handling
- Add `required`, `type="email"`, and `maxlength` to form fields.
- Trim and lowercase email before comparison.
- Replace `==` with `===` for all credential checks.
- Reject whitespace-only values as empty.

### Testability
- Add `data-testid` attributes to key controls so selectors survive markup changes.

---

## 2. Bug Findings

| ID | Title | Severity | Spec |
|---|---|---|---|
| BUG-001 | Credentials stored in plaintext client-side JavaScript | Critical | — code review only |
| BUG-002 | No error feedback on failed login | High | `login-invalid.spec.js` |
| BUG-003 | Navigation items do not change content | High | `navigation-menu.spec.js` |
| BUG-004 | No input validation on login form | Medium | `login-accessibility.spec.js` |
| BUG-005 | Password comparison uses loose equality | Medium | — code review only |
| BUG-006 | Email comparison is case-sensitive | Medium | — not yet implemented |
| BUG-007 | No session expiry or timeout | Medium | `login-valid.spec.js` |
| BUG-008 | User dropdown does not close on outside click | Low | `logout.spec.js` |
| BUG-009 | Login form cannot be submitted with the Enter key | Medium | `login-accessibility.spec.js` |
| BUG-010 | Password field has no placeholder text | Low | `login-accessibility.spec.js` |
| BUG-011 | Password field value can be copied to clipboard | Low | `login-accessibility.spec.js` |
| BUG-012 | User dropdown overlaps content area below the nav bar | Low | `logout.spec.js` |
| BUG-013 | Email field does not receive focus on page load | Low | `login-accessibility.spec.js` |
| BUG-014 | Clicked nav item is not highlighted as active | Low | `navigation-menu.spec.js` |
| BUG-015 | Page heading has a hard-coded dark background colour | Low | — visual / manual |
| BUG-016 | Content area overflows its frame on viewport resize | Low | — visual / manual |

---

### BUG-001 — Credentials stored in plaintext client-side JavaScript
**Severity:** Critical · Security  
**Details:** `app/js/users.js` ships all email/password pairs as a plain JS array. Any visitor can read every credential via DevTools or View Source.  
**Expected:** Authentication must be server-side. Credentials must never reach the browser.  
**Test:** Not automatable via E2E — requires code review or static analysis.

---

### BUG-002 — No error feedback on failed login
**Severity:** High · UX  
**Reproduce:** Enter any invalid email/password and click LOGIN.  
**Actual:** The form does nothing — no message, no visual change.  
**Expected:** A visible error (e.g. "Invalid credentials") so the user knows the attempt failed.  
**Root cause:** `logIn()` finds no match and silently calls `checklogged()`, which keeps the login form visible.  
**Test:** `login-invalid.spec.js` — TODO assertion inside `rejects login with *` tests

---

### BUG-003 — Navigation items do not change content
**Severity:** High · Functionality  
**Reproduce:** Log in, click Home, Products, or Contact.  
**Actual:** The content area never changes regardless of which item is clicked.  
**Expected:** Each nav item should reveal its corresponding content section.  
**Root cause:** No routing logic exists in the app.  
**Test:** `navigation-menu.spec.js` — TODO `it` block (whole forEach commented out)

---

### BUG-004 — No input validation on login form
**Severity:** Medium · Security / UX  
**Details:** `#email` and `#password` have no HTML constraints — no `required`, no `type="email"`, no `maxlength` or `minlength`. Empty and malformed input submits silently.  
**Expected:** `required` on both fields, `type="email"` on the email field, and `maxlength` to bound input.  
**Test:** `login-accessibility.spec.js` — TODO `it` "login form fields have correct HTML constraints"

---

### BUG-005 — Password comparison uses loose equality
**Severity:** Medium · Security  
**Details:** `index.js` uses `user.password == password.value`. Type coercion means a numeric-looking password like `2020` could match the number `2020` instead of the string `"2020"`.  
**Expected:** All credential comparisons must use strict equality (`===`).  
**Test:** Not automatable via black-box E2E — browser inputs are always strings; requires code review.

---

### BUG-006 — Email comparison is case-sensitive
**Severity:** Medium · UX  
**Details:** `user.email == email.value` is a direct string match — `Admin@admin.com` fails even though it refers to the same address as `admin@admin.com`.  
**Expected:** Email should be normalised to lowercase before comparison.  
**Test:** Not yet implemented. Test data prepared in `validInputs` fixture (TODO comment).

---

### BUG-007 — No session expiry or timeout
**Severity:** Medium · Security  
**Details:** `localStorage['logged']` persists indefinitely — across browser restarts, for years — until the user explicitly logs out.  
**Expected:** Sessions should expire after a reasonable inactivity period.  
**Test:** `login-valid.spec.js` — TODO `it` "session expires after prolonged inactivity"

---

### BUG-008 — User dropdown does not close on outside click
**Severity:** Low · UX  
**Reproduce:** Open the user dropdown, then click anywhere else on the page.  
**Actual:** The dropdown stays open.  
**Expected:** Clicking outside should close it.  
**Root cause:** No document-level click handler in `app/js/index.js`.  
**Test:** `logout.spec.js` — TODO `it` "dropdown closes when clicking outside"

---

### BUG-009 — Login form cannot be submitted with the Enter key
**Severity:** Medium · Accessibility  
**Reproduce:** Type valid credentials, press Enter on the password field.  
**Actual:** The form does not submit — the user must click the LOGIN button.  
**Expected:** Pressing Enter should submit the form. Keyboard-only users cannot log in without mouse access.  
**Root cause:** LOGIN button uses `type="button"` with `onclick` — Enter does not trigger it.  
**Fix:** Replace with `type="submit"` inside a `<form>` element.  
**Test:** `login-accessibility.spec.js` — TODO `it` "submits login form with Enter key"

---

### BUG-010 — Password field has no placeholder text
**Severity:** Low · UX  
**Details:** The email field has `placeholder="E-mail address"` but the password field has no placeholder.  
**Expected:** A placeholder such as "Password" for consistency.  
**Test:** `login-accessibility.spec.js` — TODO `it` "login form fields have correct HTML constraints"

---

### BUG-011 — Password field value can be copied to clipboard
**Severity:** Low · Security  
**Details:** The password field uses `type="password"` so the value is masked visually, but selecting all and copying transfers the plain text to the clipboard. There is no `oncopy` handler to prevent this.  
**Expected:** Copy action on the password field should be blocked to prevent accidental clipboard exposure.  
**Test:** `login-accessibility.spec.js` — TODO `it` "login form fields have correct HTML constraints"

---

### BUG-012 — User dropdown overlaps content area below the nav bar
**Severity:** Low · UX  
**Reproduce:** Log in and click the user avatar to open the dropdown.  
**Actual:** The dropdown extends below the bottom edge of the nav bar and overlaps the page content.  
**Expected:** The dropdown should be contained within the nav bar boundaries.  
**Test:** `logout.spec.js` — TODO `it` "user menu dropdown stays within the nav bar"

---

### BUG-013 — Email field does not receive focus on page load
**Severity:** Low · Accessibility  
**Details:** The email field has the `autofocus` attribute but focus is not applied in practice — browsers block `autofocus` inside iframes, which includes the Cypress test runner.  
**Expected:** The email field should receive focus automatically so keyboard users can start typing immediately.  
**Test:** `login-accessibility.spec.js` — TODO `it` "email field receives focus on page load"

---

### BUG-014 — Clicked nav item is not highlighted as active
**Severity:** Low · UX  
**Reproduce:** Log in and click any nav item (Home, Products, Contact).  
**Actual:** The clicked item has no active-state styling — all items look the same after clicking.  
**Expected:** The selected nav item should be visually highlighted to show the current location.  
**Test:** `navigation-menu.spec.js` — TODO assertion inside `nav item * is present and clickable` tests

---

### BUG-015 — Page heading has a hard-coded dark background colour
**Severity:** Low · UI  
**Details:** The `<h1>` heading inside the login section uses `style="background-color:darkolivegreen;"` inline. The colour is not transparent, clashes with the page background, and cannot be overridden by a stylesheet.  
**Expected:** Background should be transparent or theme-consistent; styling should come from CSS, not inline attributes.  
**Test:** Visual / manual — not automated.

---

### BUG-016 — Content area overflows its frame on viewport resize
**Severity:** Low · Responsive  
**Details:** The `.div-container` holding the Lorem ipsum paragraphs is scrollable at default size, but when the viewport is resized to a narrower width the content breaks out of its container frame.  
**Expected:** Content should reflow and remain within the container at all supported viewport widths.  
**Test:** Visual / manual — covered partially by `responsive.spec.js` (checks visibility, not overflow).


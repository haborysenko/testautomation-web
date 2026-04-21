# Automation framework

**Cypress + JavaScript** framework that tests the SPA in [app/](app/).

## Quick start

```bash
git clone <repo-url>   # or download ZIP from GitHub
cd testautomation-web
npm install

# All commands below automatically start the app on http://localhost:8080,
# wait for it to be ready, run Cypress, then shut the server down.
npm test                     # runs Cypress headless (Electron)
npm run test:chrome          # same, Chrome
npm run test:firefox         # same, Firefox
npm run test:open            # interactive runner (cypress open)

SPEC="**/logout.spec.js" npm run test:spec  # run a single spec
npm run coverage      # print coverage summary from the last run
```

### Running Cypress locally in headed mode

The tests live in [cypress-tests/](cypress-tests/), so `npx cypress open` alone won't work from the repo root. Use:

```bash
npm run test:open                            # ← recommended: starts the app and opens Cypress
npx cypress open --project cypress-tests     # ← if the app is already running
```

## Layout

```
app/                  ← SPA under test (static HTML/CSS/JS)
cypress-tests/
  tests/              ← spec files
  fixtures/           ← test data
  support/pages/      ← Page Objects (LoginPage, HomePage)
  support/            ← shared helpers (session, a11y)
FINDINGS.md           ← bug findings + QE recommendations
.github/workflows/    ← CI
```

## Design choices

- **Page Object Model** — selectors live in [LoginPage.js](cypress-tests/support/pages/LoginPage.js) and [HomePage.js](cypress-tests/support/pages/HomePage.js), never in specs. Exported as singletons (`onLoginPage`, `onHomePage`) so tests read like plain English.
- **Session reuse** — [session.js](cypress-tests/support/session.js) uses `cy.session()` so tests that need a logged-in user don't repeat the login UI flow every time.
- **Data-driven tests** — valid and invalid inputs are defined once in [login-data.js](cypress-tests/fixtures/login-data.js) and looped over. Adding a test case means editing the fixture, not the spec.
- **Security inputs** — the invalid-login spec covers SQL injection, XSS, unicode, whitespace, and 500-char strings.
- **Accessibility** — `cypress-axe` checks for serious and critical violations on the login page and home page.
- **Coverage** — each run instruments the app with `nyc` and prints a summary to the terminal.
- **HTML report** — `cypress-mochawesome-reporter` generates a self-contained report with screenshots embedded after each run.
- **No over-engineering** — no Cucumber, no custom runner, just Cypress and a few small helpers.


## CI

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs automatically on every push to `main` and on pull requests — no manual steps needed. It installs dependencies, instruments the app, runs all Cypress tests on Chrome, prints a coverage summary, and uploads the HTML report as a downloadable artifact.

## Known coupling

The test credentials in [login-data.js](cypress-tests/fixtures/login-data.js) mirror the hardcoded users in [app/js/users.js](app/js/users.js). If the app's users change, the fixture needs to be updated too. This is flagged as a known issue in [FINDINGS.md](FINDINGS.md).

## Findings

[FINDINGS.md](FINDINGS.md) documents bugs found during black-box testing — including one critical security issue — along with recommendations for improvement.

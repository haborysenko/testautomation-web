# Automation framework

**Cypress + JavaScript** framework that tests the SPA in [app/](app/). App and tests live in one repo — clone once, `npm test`.

## Quick start

```bash
npm install
npm test              # serves the app + runs Cypress headless (Electron)
npm run test:chrome   # same, Chrome
npm run test:firefox  # same, Firefox
npm run test:open     # interactive runner (cypress open)
```

`start-server-and-test` boots `http-server ./app` on port 8080, waits for it, runs Cypress, then tears it down.

### Running Cypress directly

The Cypress project root is [cypress-tests/](cypress-tests/), so bare `npx cypress open` from the repo root won't find the config. Use either:

```bash
npm run test:open                            # ← recommended (serves app + opens runner)
cd cypress-tests && npx cypress open         # ← if you already have the app running
npx cypress open --project cypress-tests     # ← from repo root
```

## Layout

Everything test-related is under [cypress-tests/](cypress-tests/) so the project has a clean separation between the SUT and the automation framework.

```
app/                              ← SPA under test (static HTML/CSS/JS)
cypress-tests/
  cypress.config.js               ← Cypress config (project root for --project cypress-tests)
  .eslintrc.json, .prettierrc     ← lint/format config scoped to tests
  FINDINGS.md                     ← black-box bug findings + QE recommendations
  tests/                          ← *.spec.js only
    login-valid.spec.js           ← data-driven valid login, session persistence, keyboard login
    login-invalid.spec.js         ← data-driven invalid inputs (incl. XSS/SQLi/unicode)
    logout.spec.js                ← user-menu toggle + logout
    menu.spec.js                  ← top navigation
    responsive.spec.js            ← login and home view at mobile and tablet viewports
  fixtures/
    loginData.js                  ← valid + invalid user datasets
  support/
    index.js                      ← global hooks, cypress-axe, coverage tasks
    session.js                    ← cy.session-backed loginAs() + assertions
    a11y.js                       ← checkA11y wrapper (serious/critical only)
    pages/
      LoginPage.js                ← Page Object for login form
      HomePage.js                 ← Page Object for nav, user menu, content
  reports/                        ← mochawesome HTML, screenshots, videos (gitignored)
  .nyc_output/                    ← raw coverage data (gitignored)
.github/workflows/ci.yml          ← lint + Cypress matrix (Chrome + Firefox)
.nycrc.json                       ← coverage config (spans app + tests, lives at root)
package.json, .gitignore          ← stay at root (npm/git requirement)
```

## Design choices

- **Page Object Model**: [LoginPage.js](cypress-tests/support/pages/LoginPage.js) and [HomePage.js](cypress-tests/support/pages/HomePage.js) expose intent-named actions; specs never touch selectors directly. Each file exports a singleton (`onLoginPage`, `onHomePage`) so specs read as prose.
- **DRY auth**: [session.js](cypress-tests/support/session.js) wraps `cy.session(...)` with a `validate` that reads `localStorage['logged']`. Post-login specs call `loginAs(user)` — no UI re-login per test.
- **Data-driven**: `validInputs` and `invalidInputs` in [loginData.js](cypress-tests/fixtures/loginData.js) are iterated with `.forEach`. Adding a case = editing the fixture only.
- **Negative/security inputs**: SQL injection, two flavours of XSS, unicode, whitespace-only, 500-char strings, case-sensitivity — all wired through the same invalid-login spec.
- **Accessibility**: `cypress-axe` with the impact filter set to `serious`/`critical` on login, home, open-dropdown, and a full keyboard-only auth flow.
- **Coverage**: every run instruments `app/js` with `nyc` and prints a text summary to the terminal after Cypress exits.
- **HTML report**: `cypress-mochawesome-reporter` emits a self-contained HTML report to `cypress-tests/reports/html/index.html` after each run (screenshots embedded inline).
- **KISS**: no DI, no custom runner, no Cucumber. Just Cypress + a few helpers.

## Scripts

| Script | What it does |
|---|---|
| `npm test` | Instrument `app/js`, serve, run Cypress (Electron), print coverage |
| `npm run test:chrome` / `test:firefox` | Same, specific browser |
| `npm run test:spec` | Run a single spec headless with coverage — set `SPEC` env var |
| `npm run test:open` | Launch the interactive runner |
| `npm run coverage` | Print coverage summary from the last run |
| `npm run lint` | ESLint over `cypress-tests/{tests,support,fixtures}/**/*.js` |
| `npm run format` | Prettier write |

### Running a single spec with coverage

```bash
SPEC="**/logout.spec.js*" npm run test:spec
```

Coverage summary is printed to the terminal after the spec finishes.

### Coverage in open mode

When running `npm run test:open`, coverage is collected automatically after each spec. The summary table is printed to the terminal but can be hard to spot in Cypress's verbose log output. To read it cleanly, open a second terminal tab and run after the spec finishes:

```bash
npm run coverage
```

This reads the already-captured data from `cypress-tests/.nyc_output/` — no need to re-run tests.

## CI

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on push to `main` and on every PR:

1. `npm install` with npm cache keyed on `package-lock.json`
2. `npm run lint`
3. Cypress in a Chrome + Firefox matrix via `cypress-io/github-action@v6`
4. `cypress-tests/reports/` uploaded as an artifact (screenshots + videos on failure)

## Source-of-truth coupling

[cypress-tests/fixtures/loginData.js](cypress-tests/fixtures/loginData.js) mirrors credentials from [app/js/users.js](app/js/users.js). If the app's users change, update both — or add `data-testid` attributes and import the file directly. Flagged in [FINDINGS.md](cypress-tests/FINDINGS.md).

## Findings & recommendations

[FINDINGS.md](cypress-tests/FINDINGS.md) captures what black-box testing surfaced: nine bugs (one critical security issue), coverage gaps, CI/CD recommendations, and broader quality-engineering notes. Treat it as the QE deliverable alongside the automation code.

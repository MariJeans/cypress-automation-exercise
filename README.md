# Cypress Automation Exercise — E2E Test Automation

Personal practice project automating end-to-end (E2E) tests for [Automation Exercise](https://automationexercise.com/), a demo e-commerce site built specifically for practicing test automation. The site publishes an [official regression suite](https://automationexercise.com/test_cases) of 26 test cases, which this project automates in full. Built with Cypress and JavaScript, with a planned migration to Playwright as a later phase.

**Progress: 26 / 26 official test cases automated (TC01–TC26) — 27 tests, all passing.**

## What's covered

Test titles follow the official test case names, so each test can be traced back to its source scenario.

| Module | Test case | What it verifies |
|---|---|---|
| **Authentication** | TC01 — Register User | Full signup form (personal info, address, dropdowns), account creation, logged-in state, and account deletion as cleanup |
| | TC02 — Login with correct credentials | Login with a permanent test account; credentials read from environment variables |
| | TC03 — Login with incorrect credentials | Error message, and the user is not logged in |
| | TC04 — Logout User | Login → logout → redirect back to the login page |
| | TC05 — Register with existing email | Validation error when signing up with an already registered email |
| **Contact & Pages** | TC06 — Contact Us form | Form submission with and without a file attachment (`selectFile`) |
| | TC07 — Test Cases page | Navigation to the Test Cases page |
| **Products** | TC08 — All products and product detail | Product detail page: name, category, price, availability, condition, brand |
| | TC09 — Search product | Search by keyword and verify the results |
| | TC18 — View category products | Women > Dress and Men > Tshirts category pages |
| | TC19 — View brand products | Polo and H&M brand pages |
| | TC20 — Search and verify cart after login | Add all search results to the cart as a guest, log in, and verify the same products are still there |
| | TC21 — Add review on product | Submit a review and verify the confirmation message |
| **Newsletter** | TC10 — Subscription on Home page | Footer subscription with a unique email and success message |
| | TC11 — Subscription on Cart page | Same subscription flow from the cart page |
| **Cart** | TC12 — Add products in cart | Two products in the cart, each with quantity 1 and total = price × quantity |
| | TC13 — Product quantity in cart | Set quantity 4 on the product detail page and verify quantity and total in the cart |
| | TC17 — Remove products from cart | Delete a product with the "X" and verify the cart is empty |
| | TC22 — Add from Recommended items | Add a product from the Recommended items carousel and find it in the cart by product ID |
| **Checkout** | TC14 — Register while checkout | Add to cart → register during checkout → verify address and order review → pay → order confirmation → delete account |
| | TC15 — Register before checkout | Register first, then the same purchase flow |
| | TC16 — Login before checkout | Same purchase flow with the permanent test account |
| | TC23 — Verify address details | Delivery and billing addresses match the data used at registration |
| | TC24 — Download invoice | Full purchase, then download the invoice and check its content with `cy.readFile` |
| **Scroll** | TC25 — Scroll up with arrow button | Scroll to the footer, go back up with the arrow button, and check the banner is inside the viewport |
| | TC26 — Scroll up without arrow button | Same as TC25, scrolling back up manually |

## Practices applied

- **Reusable custom commands** for repeated flows (register, login, add to cart, address check, payment, account cleanup) in `cypress/support/commands.js`, each documented with what it does and what it yields. Helpers used by a single spec stay inside that spec.
- **Given / When / Then structure** inside each test for readability.
- **Stable selectors** — `data-qa` attributes, IDs and `href`s preferred over text matches and CSS paths that break on layout changes.
- **Independent, repeatable tests** — unique emails generated with `Date.now()`, and every account created by a test is deleted at the end. Tests that need a cart of their own (e.g. TC20) create their own user instead of touching the shared account.
- **No secrets in the repo** — credentials come from a gitignored `cypress.env.json`; passwords and card data are typed with `{ log: false }` so they don't show in the runner.
- **Test data in fixtures** — user and payment data live in `cypress/fixtures`, not hardcoded in tests.
- **Handling a noisy real-world site** — third-party ad domains blocked via `blockHosts`, a single `defaultCommandTimeout` for a slow public site instead of scattered timeouts, and uncaught exceptions from external scripts ignored only in the spec where they cause false failures (`cy.on`, scoped per test).
- **Assertions on data, not just visibility** — address content on checkout, price × quantity = total in the cart, product names in search results and cart, invoice file content, and real viewport position for scroll tests (`be.visible` alone doesn't check that).
- **Avoiding flaky assertions** — asserting on stable end states (e.g. the order confirmation page) instead of transient messages that disappear on redirect.

## Why this project

This is where I practice and reinforce automation skills with Cypress, using AI as a support tool in the process (e.g. reviewing test structure, explaining new Cypress APIs, and thinking through edge cases) — and, for part of the suite, as a co-author:

- **TC01–TC16** were originally written by me.
- **TC17–TC26**, the shared custom commands, and a later refactor of the whole suite to use those commands and follow the official test case names were done with Claude Code, building on the conventions I set in the earlier tests.

All 27 tests pass, but my line-by-line review of the AI-written code is still pending.

It's a learning project, not a client deliverable, but it reflects the same attention to clear, stable, secure test code that I aim to apply professionally.

## Tech stack

- Cypress 15
- JavaScript
- cypress-real-events

## Setup

Test credentials are kept out of version control. Before running the tests, create a `cypress.env.json` file in the **project root** (already listed in `.gitignore`):

```json
{
  "TEST_USER_EMAIL": "your-test-user@example.com",
  "TEST_USER_PASSWORD": "your-password"
}
```

> **Note:** TC02, TC04, TC05 and TC16 rely on a pre-existing, permanent test account registered manually on the site with these exact credentials — it isn't created by the automated tests themselves. TC16 also checks the delivery address, so the account must be registered with the data in `cypress/fixtures/user.json`.

## Running the tests

```bash
npm install
npm run cy:open    # interactive mode
npm test           # headless mode (runs the full suite)
```

Run a single spec:

```bash
npx cypress run --spec cypress/e2e/checkout/Checkout.cy.js
```

> **Running from the VS Code integrated terminal:** if Cypress fails with `bad option: --smoke-test`, the `ELECTRON_RUN_AS_NODE` variable set by VS Code is interfering. Unset it first (`Remove-Item Env:ELECTRON_RUN_AS_NODE` in PowerShell, `unset ELECTRON_RUN_AS_NODE` in bash).

## Structure

```
cypress/
  e2e/
    auth/
      Authentication_Flow.cy.js   # TC01–TC05
    contact/
      Contact_And_Pages.cy.js     # TC06–TC07
    products/
      Products.cy.js              # TC08, TC09, TC18–TC21
    newsletter/
      Newsletter.cy.js            # TC10–TC11
    cart/
      Cart.cy.js                  # TC12, TC13, TC17, TC22
    checkout/
      Checkout.cy.js              # TC14–TC16, TC23, TC24
    scroll/
      Scroll.cy.js                # TC25–TC26
  fixtures/
    user.json                     # registration data (also matches the permanent account)
    payment.json                  # test card data
    example.json                  # file used as attachment in TC06
  support/
    commands.js                   # custom commands: auth, navigation, cart, checkout
    e2e.js
cypress.config.js                 # baseUrl, timeouts, blocked ad hosts
cypress.env.json                  # gitignored — local credentials, not committed
```

## Roadmap

- [x] Authentication module (TC01–TC05)
- [x] Contact form, Products, Newsletter, Cart and first Checkout flow (TC06–TC14)
- [x] Remaining official test cases (TC15–TC26)
- [x] Custom commands for repeated flows (signup, login, add to cart, checkout)
- [ ] Line-by-line review of the AI-written code
- [ ] CI with GitHub Actions
- [ ] Refactor to Page Object Model
- [ ] Migrate to Playwright

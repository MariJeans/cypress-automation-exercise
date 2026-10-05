# Cypress Automation Exercise — E2E Test Automation

Personal practice project automating end-to-end (E2E) tests for [Automation Exercise](https://automationexercise.com/), a demo e-commerce site built specifically for practicing test automation. The site publishes an [official regression suite](https://automationexercise.com/test_cases) of 26 test cases, which this project tracks and automates incrementally. Built with Cypress and JavaScript, with a planned migration to Playwright as a later phase.

**Progress: 14 / 26 official test cases automated (TC01–TC14).**

## What's covered

| Module | Test case | What it verifies |
|---|---|---|
| **Authentication** | TC01 — Register new user | Full signup form (personal info, address, dropdowns), account creation, logged-in state, and account deletion as cleanup |
| | TC02 — Login with valid credentials | Login with a permanent test account; credentials read from environment variables |
| | TC03 — Login with invalid credentials | Error message for wrong email/password |
| | TC04 — Logout | Login → logout → redirect back to the login page |
| | TC05 — Register with existing email | Validation error when signing up with an already registered email |
| **Contact & Pages** | TC06 — Contact Us form | Form submission with and without a file attachment (`selectFile`) |
| | TC07 — Test Cases page | Navigation to the Test Cases page |
| **Products** | TC08 — Product list and detail | Product detail page: name, category, price, availability, condition, brand |
| | TC09 — Search product | Search by keyword and verify the results |
| **Newsletter** | TC10 — Subscription on Home page | Footer subscription with a unique email and success message |
| | TC11 — Subscription on Products page | Same flow from a different page |
| **Cart** | TC12 — Add products to cart | Add two products via the confirmation modal, verify rows and product IDs in the cart |
| | TC13 — Verify product quantity in cart | Update quantity from the product detail page and assert the cart total quantity |
| **Checkout** | TC14 — Register while checkout | End-to-end purchase: add to cart → register during checkout → verify delivery address and order review → payment → order confirmation → account deletion |

## Practices applied

- **Given / When / Then structure** inside each test for readability.
- **Stable selectors** — `data-qa` attributes and IDs preferred over fragile CSS paths.
- **Independent, repeatable tests** — unique emails generated with `Date.now()`, and accounts created during a test are deleted at the end (cleanup).
- **No secrets in the repo** — credentials come from a gitignored `cypress.env.json` and are typed with `{ log: false }` so they don't show in the runner.
- **Handling a noisy real-world site** — third-party ad domains blocked via `blockHosts` in `cypress.config.js`, and uncaught exceptions from external scripts ignored where they caused false failures.
- **Assertions on data, not just visibility** — e.g. delivery address content on checkout, row count and product IDs in the cart.

## Why this project

This is where I practice and reinforce automation skills with Cypress, using AI as a support tool in the process (e.g. reviewing test structure, explaining new Cypress APIs, and thinking through edge cases) — while writing all the code myself. It's a learning project, not a client deliverable, but it reflects the same attention to clear, stable, secure test code that I aim to apply professionally.

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

> **Note:** TC02, TC04 and TC05 rely on a pre-existing, permanent test account registered manually on the site with these exact credentials — it isn't created by the automated tests themselves.

## Running the tests

```bash
npm install
npx cypress open   # interactive mode
npx cypress run    # headless mode
```

Run a single spec:

```bash
npx cypress run --spec cypress/e2e/auth/Checkout.cy.js
```

## Structure

```
cypress/
  e2e/
    auth/
      Authentication_Flow.cy.js   # TC01–TC05
      Contact_And_Pages.cy.js     # TC06–TC07
      Products.cy.js              # TC08–TC09
      Newsletter.cy.js            # TC10–TC11
      Cart.cy.js                  # TC12–TC13
      Checkout.cy.js              # TC14
  fixtures/
    example.json                  # file used as attachment in TC06
  support/
    commands.js
    e2e.js
cypress.config.js                 # blocked ad hosts, e2e config
cypress.env.json                  # gitignored — local credentials, not committed
```

## Roadmap

- [x] Authentication module (TC01–TC05)
- [x] Contact form, Products, Newsletter, Cart and first Checkout flow (TC06–TC14)
- [ ] Remaining official test cases (TC15–TC26): checkout variants, categories, brands, reviews, scroll
- [ ] Custom commands for repeated flows (signup, login, add to cart)
- [ ] Refactor to Page Object Model
- [ ] CI with GitHub Actions
- [ ] Migrate to Playwright

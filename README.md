# Cypress Automation Exercise — E2E Test Automation

Personal practice project automating end-to-end (E2E) tests for [Automation Exercise](https://automationexercise.com/), a demo e-commerce site built specifically for practicing test automation. The site publishes an [official regression suite](https://automationexercise.com/test_cases) of 26 test cases, which this project tracks and automates incrementally. Built with Cypress and JavaScript, with a planned migration to Playwright as a later phase.

## What's covered

Currently automating the **Authentication** module:

- **TC01** — Register a new user (full signup flow, login verification, and account cleanup)
- **TC02** — Login with valid credentials
- **TC03** — Login with invalid credentials

More test cases (Products, Cart, Checkout, etc.) are in progress, tracked against the project's full regression suite.

## Why this project

This is where I practice and reinforce automation skills with Cypress, using AI as a support tool in the process (e.g. reviewing test structure, explaining new Cypress APIs, and thinking through edge cases) — while writing all the code myself. It's a learning project, not a client deliverable, but it reflects the same attention to clear, stable, secure test code (`data-qa` selectors, credentials kept out of version control) that I aim to apply professionally.

## Tech stack

- Cypress
- JavaScript

## Setup

Test credentials are kept out of version control. Before running the tests, create a `cypress.env.json` file in the **project root** (already listed in `.gitignore`):

```json
{
  "TEST_USER_EMAIL": "your-test-user@example.com",
  "TEST_USER_PASSWORD": "your-password"
}
```

> **Note:** TC02 relies on a pre-existing, permanent test account registered manually on the site with these exact credentials — it isn't created by the automated tests themselves.

## Running the tests

```bash
npm install
npx cypress open   # interactive mode
npx cypress run    # headless mode
```

## Structure

```
cypress/
  e2e/
    auth/
      TC01_Register_New_User.cy.js
      TC02_Valid_Login.cy.js
      TC03_InvalidLogin.cy.js
cypress.env.json     # gitignored — local credentials, not committed
```

## Roadmap

- [ ] Finish Authentication module (logout, duplicate email registration)
- [ ] Products, Cart, and Checkout modules
- [ ] Refactor to Page Object Model
- [ ] CI with GitHub Actions
- [ ] Migrate to Playwright

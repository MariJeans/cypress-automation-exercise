# Cypress SauceDemo — E2E Test Automation

Personal practice project automating end-to-end (E2E) tests for [SauceDemo](https://www.saucedemo.com), a demo e-commerce site commonly used to practice test automation. Built with **Cypress** and **JavaScript**.

## What's covered

- **Login** — login flow with valid credentials.
- **Cart** — adding and removing products, validating the cart badge count updates correctly.
- **Checkout** — completing the purchase flow.

## Why this project

This is where I practice and reinforce automation skills with Cypress, using AI as a support tool in the process (e.g. reviewing test structure and exploring edge cases). It's a learning project, not a client deliverable — but it reflects the same attention to clear, stable test code (like using `data-test` selectors) that I apply professionally.

## Tech stack

- Cypress
- JavaScript

## Running the tests

\`\`\`bash
npm install
npx cypress open   # interactive mode
npx cypress run    # headless mode
\`\`\`

## Structure

\`\`\`
cypress/
  e2e/
    login/
      login.cy.js
    carrito/
      carrito.cy.js
    checkout/
      checkout.cy.js
\`\`\`
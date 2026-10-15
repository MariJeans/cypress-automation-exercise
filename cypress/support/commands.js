// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })


import userData from '../fixtures/user.json'

Cypress.Commands.add('registerUser', (overrides = {}) => {
  const user = {
    ...userData,
    email: `maria.test.${Date.now()}@ejemplo.com`,
    ...overrides,
  }

    cy.visit('/login')
    cy.get('[data-qa="signup-name"]').type(user.name)
    cy.get('[data-qa="signup-email"]').type(user.email)
    cy.contains('button', 'Signup').click()
    cy.get('#id_gender2').check()
    cy.get('#password').type(user.password, { log: false })
    cy.get('#days').select(user.birthDay)
    cy.get('#months').select(user.birthMonth)
    cy.get('#years').select(user.birthYear)
    cy.get('#first_name').type(user.firstName)
    cy.get('#last_name').type(user.lastName)
    cy.get('#address1').type(user.address)
    cy.get('#country').select(user.country)
    cy.get('#state').type(user.state)
    cy.get('#city').type(user.city)
    cy.get('#zipcode').type(user.zipcode)
    cy.get('#mobile_number').type(user.mobile)
    cy.contains('button', 'Create Account').click()
    
    // guardas: confirman que la precondición se cumplió (si no, falla acá con un mensaje claro)      // Then
    cy.contains('Account Created!').should('be.visible')
    cy.contains('[data-qa="continue-button"]', 'Continue').click()
    cy.contains('Logged in as').should('be.visible')

  cy.wrap(user)
})
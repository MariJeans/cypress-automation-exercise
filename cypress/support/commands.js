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
    cy.contains('Logged in as', { timeout: 5000 }).should('be.visible')

  cy.wrap(user, { log: false }).as('registeredUser') // guardas el usuario registrado para usarlo en los tests
})

Cypress.Commands.add('loginSinAssert', (email, password) => {
    cy.visit('/login')
    cy.get('[data-qa="login-email"]').type(email)
    cy.get('[data-qa="login-password"]').type(password, { log: false })
    cy.contains('button', 'Login').click()
    
})




// Agrega al carrito el producto en la posición `index` del listado principal y espera el modal de confirmación
Cypress.Commands.add('addProductToCart', (index = 0) => {
  cy.get('.features_items .product-image-wrapper')
    .eq(index)
    .find('.productinfo .add-to-cart')
    .click({ force: true }) // force: true porque el botón real está oculto
  cy.get('.modal-content', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'Your product has been added to cart.')
})

// Verifica que un bloque de dirección (delivery o invoice) contenga los datos del usuario registrado
Cypress.Commands.add('verifyAddress', (selector, user) => {
  cy.get(selector).should(($address) => {
    const texto = $address.text()
    expect(texto).to.include(`${user.firstName} ${user.lastName}`)
    expect(texto).to.include(user.address)
    expect(texto).to.include(user.country)
    expect(texto).to.include(user.city)
    expect(texto).to.include(user.zipcode)
    expect(texto).to.include(user.mobile)
  })
})

// Completa el formulario de pago y verifica la página de confirmación de la orden
Cypress.Commands.add('payAndConfirmOrder', (user) => {
  cy.contains('Payment').should('be.visible')
  cy.get('[data-qa="name-on-card"]').type(`${user.firstName} ${user.lastName}`)
  cy.get('[data-qa="card-number"]').type('1234 5678 9012 3456')
  cy.get('[data-qa="cvc"]').type('123')
  cy.get('[data-qa="expiry-month"]').type('12')
  cy.get('[data-qa="expiry-year"]').type('2028')
  cy.get('[data-qa="pay-button"]').click()
  // El mensaje "Your order has been placed successfully!" es transitorio, verificamos la página final
  cy.url().should('include', '/payment_done')
  cy.contains('Order Placed!').should('be.visible')
  cy.contains('Congratulations! Your order has been confirmed!').should('be.visible')
})

// Elimina la cuenta del usuario logueado (cleanup)
Cypress.Commands.add('deleteAccount', () => {
  cy.contains('a', 'Delete Account').click({ force: true })
  cy.contains('Account Deleted!').should('be.visible')
})

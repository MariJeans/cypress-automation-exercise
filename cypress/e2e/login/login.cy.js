describe('SauceDemo - E2E Tests', () => {

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com')
    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
  })

  it('Login exitoso con usuario válido', () => {
    cy.url().should('include', '/inventory')
  })

  it('Login fallido con usuario bloqueado', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('#user-name').type('locked_out_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.get('[data-test="error"]').should('be.visible')
  })

  it('Agregar productos al carrito', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-onesie"]').click()
    cy.get('.shopping_cart_badge').should('have.text', '2')
  })

  it('Checkout completo', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('.shopping_cart_link').click()
    cy.get('[data-test="checkout"]').click()
    cy.get('[data-test="firstName"]').type('Maria')
    cy.get('[data-test="lastName"]').type('Test')
    cy.get('[data-test="postalCode"]').type('5000')
    cy.get('[data-test="continue"]').click()
    cy.get('[data-test="finish"]').click()
    cy.get('.complete-header').should('have.text', 'Thank you for your order!')
  })

})
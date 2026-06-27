describe('SauceDemo - Carrito ', () => {

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com')
    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
  })

  it('Eliminar 1 producto del carrito', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('.shopping_cart_badge').click()
    cy.get('[data-test="remove-sauce-labs-backpack"]').click()
    cy.get('.shopping_cart_badge').should('not.exist')
  })

    it('Agregar productos al carrito', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-onesie"]').click()
    cy.get('.shopping_cart_badge').click()
    cy.get('.cart_item').should('have.length', '2')
  })
})
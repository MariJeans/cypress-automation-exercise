describe('Newsletter subscription', () => {

  beforeEach(() => {
    // Los scripts de terceros de la página (anuncios) tiran excepciones que no son del sitio.
    // cy.on se limita a cada test, a diferencia de Cypress.on que aplicaría a todo el spec.
    cy.on('uncaught:exception', () => false)

    // Given: usuario en la home
    cy.visit('/')
  })

  const subscribe = () => {
    cy.contains('footer h2', 'Subscription').should('be.visible')
    cy.get('#susbscribe_email').type(`maria.test.${Date.now()}@ejemplo.com`)
    cy.get('#subscribe').click()
    cy.contains('You have been successfully subscribed!').should('be.visible')
  }

  it('TC10 - Verify Subscription in home page', () => {
    // When / Then
    subscribe()
  })

  it('TC11 - Verify Subscription in Cart page', () => {
    // Given: usuario en el carrito
    cy.goToCart()

    // When / Then
    subscribe()
  })

})

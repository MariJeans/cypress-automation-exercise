
// Captura y anula los errores internos de la página web (como los anuncios de Google)
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Flujo Newsletter', () => {

  beforeEach(() => {
    // Given: usuario en la home
    cy.visit('https://automationexercise.com/')
  })

  it('TC10 - Subscribe in the home page', () => {
    const emailHome = `maria.test.${Date.now()}@ejemplo.com`

    // When: ingresa email en el footer → click en el botón de flecha
    cy.get('#susbscribe_email').type(emailHome)    
    cy.get('#subscribe').click()

    // Then: usuario ve un mensaje de éxito indicando que la suscripción fue exitosa
    cy.contains('You have been successfully subscribed!').should('be.visible')
  })

  it('TC11 - Subscribe in the Product Page ', () => {
    const emailCart = `maria.test.${Date.now()}@ejemplo.com`

    // Given: usuario va a la página de carrito haciendo clic en el menú
    // Usamos el contenedor de navegación de la web para no confundir el botón del menú con otros textos
    cy.contains('Product').click()

    // When: ingresa email en el footer del carrito → click en el botón de flecha
    cy.get('#susbscribe_email').type(emailCart,{ force: true })    
    cy.get('#subscribe').click()

    // Then: usuario ve un mensaje de éxito indicando que la suscripción fue exitosa
    cy.contains('You have been successfully subscribed!').should('be.visible')
  })

})

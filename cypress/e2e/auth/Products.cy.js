describe('Flujo de Lista de Productos ', () => {

  beforeEach(() => {
    // Given: usuario en la home, navega a la pantalla de login/signup
    cy.visit('https://automationexercise.com/')
  })

  it('TC08 - See List and Details of Products', () => {
    cy.contains('Products').click()
    cy.contains('View Product').click()
    cy.get('.product-information').contains('Blue Top').should('be.visible')
    cy.get('.product-information').contains('Category: Women > Tops').should('be.visible')
    cy.contains('Rs. 500').should('be.visible')
    cy.contains('Availability: In Stock').should('be.visible')
    cy.contains('Condition: New').should('be.visible')
    cy.contains('Brand: Polo').should('be.visible')

  })

  it('TC09 - Search for a Product', () => {
    cy.contains('Products').click()
    cy.get('#search_product').type('White Top')
    cy.get('#submit_search').click()
    cy.contains('Searched Products').should('be.visible')
    cy.get('.productinfo').contains('Summer White Top').should('be.visible')

  })

})

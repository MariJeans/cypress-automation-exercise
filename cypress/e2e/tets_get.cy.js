describe('use_get', () => {
  it('validate_button', () => {
    cy.visit('https://www.google.com/')
    cy.get('.RNmpXc').should('be.enabled')
  })
  it.only('find_element_barrabusqueda', () => {
    cy.visit('https://www.google.com/')
    cy.get('.RNNXgb').should('be.visible')
  })

})
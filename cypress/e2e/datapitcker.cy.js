/// <reference types="cypress" />

describe('Date picker', () => {
  it('2.Should check date picker', () => {
    cy.visit('https://jqueryui.com/resources/demos/datepicker/default.html')
    cy.get('#datepicker').click()

    //damos click hasta mes siguiente
    cy.get('.ui-datepicker-next.ui-corner-all').click()
    cy.get('.ui-state-default').contains('30').click()
    cy.get('.ui-datepicker-prev.ui-corner-all').click()
    cy.get('.ui-state-default').contains('22').click()
    //ingresamos fecha manualmente
    cy.get('#datepicker').clear().type('12/16/2026')
    cy.get('#datepicker').should('have.value', '12/16/2026')
  })
})

/// <reference types="cypress" />

describe('CheckBox Test', () => {
  it('1.Should check and uncheck the checkbox', () => {
    cy.visit('https://getbootstrap.com/docs/5.3/forms/checks-radios/')
  
    cy.get('#checkDefault').click({ force: true }).should('be.checked')      
    cy.get('#checkChecked').uncheck().should('not.be.checked')

    //verificar que el checkbox está deshabilitado
    cy.get('#checkIndeterminateDisabled').should('be.disabled')

  })

  it.only('should check the radiobutton', () => {
    cy.visit('https://getbootstrap.com/docs/5.3/forms/checks-radios/')

    cy.get('#radioDefault1').check({ force: true })
    cy.get('#radioDefault2').should('not.be.checked')
    cy.get('#radioCheckedDisabled').should('be.disabled')
  })

})

/// <reference types="cypress" />

describe('localizadores', () => {
  it('passes', () => {
    cy.visit('https://www.google.com/')

    //localizar por id - SON UNICOS
    cy.get('#APjFqb').should('be.visible')

    //localizar por className
    cy.get('.gLFyf').should('be.enabled')

    //localizar por atributo
    cy.get('[maxlength="2048"]').should('be.enabled')

    //localizar por tagname
    cy.get('textarea').should('be.enabled')

    //combinar localizadores
    cy.get('textarea[maxlength="2048"].gLFyf').should('be.enabled')
  })




})


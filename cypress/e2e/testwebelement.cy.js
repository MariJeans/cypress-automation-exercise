/// <reference types="cypress" />

describe('testwebelement', () => {

  it('test1', () => {
    cy.visit('https://www.google.com/') 
    //contains - busca de forma especifica un texto o atributo dentro de un elemento
    //1-localizador y 2-texto
    cy.contains('.plsC5e', 'Google')
    cy.contains('Buscar con Google')

    //get - busca de forma global un text, element, localizador.
    cy.get('.ESTs9d')
    cy.contains('Buscar con Google').get('.gNO89b')
  })

  it('test2', () => {
    cy.visit('https://www.amazon.com/')
    cy.get('.a-button-text').contains('Descartar').should('be.visible')

    cy.get('[for="twotabsearchtextbox"]').then (label =>{
      const labelText = label.text()
      expect(labelText).to.equal('Buscar en Amazon')
      cy.wrap(label).should('contain', 'Amazon')
    })
  })


})

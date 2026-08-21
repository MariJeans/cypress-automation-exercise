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


})

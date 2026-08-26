/// <reference types="cypress" />


describe('Test Dropdown', () => {
    it('1.Should check dropdown', () => {   
        //cy.visit('https://jqueryui.com/resources/demos/selectmenu/default.html')
        //el elemento no es visible, por eso se debe hacer un force true dentro de select
        //cy.get('#speed').select('Slow', { force: true }).should('have.value', 'Slow')
        cy.visit('https://bstackdemo.com/')
        //es el unico select que tiene el sitio, por eso se hace un get select
        //el invoke se mete a ese elemento y obtiene el valor, luego se hace un should para validar que sea igual a lowestprice
        cy.get('select').select('lowestprice').invoke('val').should('eq', 'lowestprice')
        cy.get('select').select('highestprice').invoke('val').should('eq', 'highestprice')
   })
})
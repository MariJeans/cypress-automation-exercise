describe('Checkout', () => {

  beforeEach(() => {
    cy.visit('/products');
  })

  it('TC14 - Register while checkout', () => {

      // --- Producto 1 ---
    cy.contains('Home').should('be.visible');
    cy.get('.product-image-wrapper')
      .eq(0)
      //junto 2 clases
      .find('.productinfo .add-to-cart')
      .click({ force: true }); // force: true porque el botón real está oculto

    // Esta vez vamos directo al carrito desde el modal
    cy.get('.modal-content').contains('View Cart').click();

    // --- Verificación en el carrito ---
    cy.url().should('include', '/view_cart');

    // Deben existir exactamente 1 fila de producto en el carrito
    cy.get('#cart_info_table tbody tr').should('have.length', 1);

    
    cy.contains('Proceed To Checkout').click();
    cy.get('.modal-content').should('be.visible');
    cy.get('.text-center').eq(1).should('contain.text', 'Register / Login').click();

    // When: Se registra durante el checkout
    cy.registerUser().then((user) => {
      cy.contains('Cart').click()
      cy.contains('Proceed To Checkout').click()
      cy.get('.checkout-information').should('be.visible')
      cy.get('#address_delivery').should(($lista) => {
        const texto = $lista.text()
        expect(texto).to.include(`${user.firstName} ${user.lastName}`)
        expect(texto).to.include(user.address)
        expect(texto).to.include(user.country)
        expect(texto).to.include(user.city)
        expect(texto).to.include(user.zipcode)
        expect(texto).to.include(user.mobile)
      })
    
    

    cy.contains('Cart').click()
    cy.contains('Proceed To Checkout').click()
    cy.get('.checkout-information').should('be.visible')
    cy.get('#address_delivery').should(($lista) => {
        const texto = $lista.text()
  
        expect(texto).to.include(`${user.firstName} ${user.lastName}`)
        expect(texto).to.include(user.address)
        expect(texto).to.include(user.country)
        expect(texto).to.include(user.city)
        expect(texto).to.include(user.zipcode)
        expect(texto).to.include(user.mobile)
    })

    // Verificamos que sea 1 producto (por data-product-id)
    cy.get('#cart_info tbody tr').eq(0)
      .should('have.attr', 'id', 'product-1');

    cy.contains('Place Order').click()
    cy.contains('Payment').should('be.visible');
    cy.get('[data-qa="name-on-card"]').type(`${user.firstName} ${user.lastName}`)
    cy.get('[data-qa="card-number"]').type('1234 5678 9012 3456')
    cy.get('[data-qa="cvc"]').type('123')
    cy.get('[data-qa="expiry-month"]').type('12')
    cy.get('[data-qa="expiry-year"]').type('2028')
    cy.get('[data-qa="pay-button"]').click()
    // El mensaje "Your order has been placed successfully!" es transitorio (desaparece al redirigir),
    // así que verificamos la página de confirmación final
    cy.url().should('include', '/payment_done')
    cy.contains('Order Placed!').should('be.visible')
    cy.contains('Congratulations! Your order has been confirmed!').should('be.visible')
    })

  })

  afterEach(() => {
    // Cleanup: Eliminar la cuenta si existe
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Delete Account")').length > 0) {
        cy.contains('Delete Account').click({ force: true });
        cy.contains('Account Deleted!').should('be.visible');
      }
    });
  })

}) 
  

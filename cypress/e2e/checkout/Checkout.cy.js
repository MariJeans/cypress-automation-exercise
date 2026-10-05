describe('Checkout', () => {

  beforeEach(() => {
    cy.visit('https://automationexercise.com/products');
  })

  it('TC14 - Register while checkout', () => {
    const email = `maria.test.${Date.now()}@ejemplo.com`
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

    // When: completa el signup
    cy.get('[data-qa="signup-name"]').type('María Test')
    cy.get('[data-qa="signup-email"]').type(email)
    cy.contains('button', 'Signup').click()
    cy.get('#id_gender2').check()
    cy.get('#password').type('Test1234', { log: false })
    cy.get('#days').select('16')
    cy.get('#months').select('December')
    cy.get('#years').select('1998')
    cy.get('#first_name').type('María')
    cy.get('#last_name').type('Acuna')
    cy.get('#address1').type('Test 1234')
    cy.get('#country').select('Canada')
    cy.get('#state').type('Ontario')
    cy.get('#city').type('Toronto')
    cy.get('#zipcode').type('M5V 2T6')
    cy.get('#mobile_number').type('4161234567')
    cy.contains('button', 'Create Account').click()

    
    cy.contains('Account Created!').should('be.visible')
    cy.contains('[data-qa="continue-button"]', 'Continue').click()
    cy.contains('Logged in as').should('be.visible')

    cy.contains('Cart').click()
    cy.contains('Proceed To Checkout').click()
    cy.get('.checkout-information').should('be.visible')
    cy.get('#address_delivery').should(($lista) => {
        const texto = $lista.text()
  
        expect(texto).to.include('María Acuna')
        expect(texto).to.include('Test 1234')
        expect(texto).to.include('Canada')
        expect(texto).to.include('Toronto')
        expect(texto).to.include('M5V 2T6')
        expect(texto).to.include('4161234567')
    })

    // Verificamos que sea 1 producto (por data-product-id)
    cy.get('#cart_info tbody tr').eq(0)
      .should('have.attr', 'id', 'product-1');

    cy.contains('Place Order').click()
    cy.contains('Payment').should('be.visible');
    cy.get('[data-qa="name-on-card"]').type('María Acuna')
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

    // Cleanup
    cy.contains('Delete Account').click({ force: true })
    cy.contains('Account Deleted!').should('be.visible')

    })


})
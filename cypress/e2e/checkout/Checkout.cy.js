import userData from '../../fixtures/user.json'
describe('Checkout', () => {


  it('TC14 - Register while checkout', () => {

      // --- Producto 1 ---
    cy.visit('/products');
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
    cy.get('body').then(($body) => {
     if ($body.find('a:contains("Delete Account")').length > 0) {
       cy.contains('Delete Account').click({ force: true });
       cy.contains('Account Deleted!').should('be.visible');
      }
    });
  })

  it('TC15 - Register while checkout with existing email', () => {
    cy.visit('/login')
    cy.contains('Home').should('be.visible');

    //Registro usuario
    cy.registerUser().then((user) => {
      cy.contains('Products').click()
      // force: true porque el botón real está oculto
      cy.get('.product-image-wrapper').eq(0).find('.productinfo .add-to-cart').click({ force: true })
      
      //Esta vez vamos directo al carrito desde el modal
      cy.contains('Cart').click()

      //Deben existir exactamente 1 fila de producto en el carrito
      cy.get('#cart_info_table tbody tr').should('have.length', 1)
      
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
    
      //Enter description in comment text area and click "Place Order"
      cy.get('#ordermsg').type('Comentario de prueba')
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
       //Cleanup: Eliminar la cuenta si existe
    cy.get('body').then(($body) => {
     if ($body.find('a:contains("Delete Account")').length > 0) {
       cy.contains('Delete Account').click({ force: true });
       cy.contains('Account Deleted!').should('be.visible');
      }
    });
  })

  it('TC16 - Complete order with logged-in user', () => {
    cy.visit('/login')
    cy.contains('Home').should('be.visible');

    //Iniciamos sesión con un usuario con credenciales validas
    cy.env(['TEST_USER_EMAIL', 'TEST_USER_PASSWORD']).then(({ TEST_USER_EMAIL, TEST_USER_PASSWORD }) => {
      cy.loginSinAssert(TEST_USER_EMAIL, TEST_USER_PASSWORD)
        cy.contains('Logged in as ' + userData.name, { timeout: 10000 }).should('be.visible')
        cy.contains('Products').click()
        // force: true porque el botón real está oculto
        cy.get('.product-image-wrapper').eq(0).find('.productinfo .add-to-cart').click({ force: true })
      
      //Esta vez vamos directo al carrito desde el modal
      cy.contains('Cart').click()

      //Deben existir exactamente 1 fila de producto en el carrito
      cy.get('#cart_info_table tbody tr').should('have.length', 1)
      
      cy.contains('Proceed To Checkout').click()
      cy.get('.checkout-information').should('be.visible')
      cy.get('#address_delivery').should(($lista) => {
        const texto = $lista.text()
        expect(texto).to.include(userData.firstName)
        expect(texto).to.include(userData.lastName)
        expect(texto).to.include(userData.address)
        expect(texto).to.include(userData.country)
        expect(texto).to.include(userData.city)
        expect(texto).to.include(userData.zipcode)
        expect(texto).to.include(userData.mobile)
      })
      // Verificamos que sea 1 producto (por data-product-id)
      cy.get('#cart_info tbody tr').eq(0)
       .should('have.attr', 'id', 'product-1');
    
      //Enter description in comment text area and click "Place Order"
      cy.get('#ordermsg').type('Test order comment')
      cy.contains('Place Order').click()

      cy.contains('Payment').should('be.visible');
      cy.get('[data-qa="name-on-card"]').type(`${userData.firstName} ${userData.lastName}`)
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

  it('TC23 - Verify address details in checkout page', () => {
    // Given: usuario recién registrado con un producto en el carrito
    cy.registerUser().then((user) => {
      cy.visit('/products')
      cy.addProductToCart(0)
      cy.get('.modal-content').contains('View Cart').click()
      cy.url().should('include', '/view_cart')

      // When: va al checkout
      cy.contains('Proceed To Checkout').click()

      // Then: las direcciones de entrega y facturación coinciden con las del registro
      cy.verifyAddress('#address_delivery', user)
      cy.verifyAddress('#address_invoice', user)

      // Cleanup
      cy.deleteAccount()
    })
  })

  it('TC24 - Download Invoice after purchase order', () => {
    // Given: producto en el carrito sin estar logueado
    cy.visit('/products')
    cy.addProductToCart(0)
    cy.get('.modal-content').contains('View Cart').click()
    cy.url().should('include', '/view_cart')
    cy.contains('Proceed To Checkout').click()
    cy.get('.modal-content a[href="/login"]').should('be.visible')

    // When: se registra durante el checkout y completa la compra
    cy.registerUser().then((user) => {
      cy.get('.shop-menu a[href="/view_cart"]').click()
      cy.contains('Proceed To Checkout').click()
      cy.verifyAddress('#address_delivery', user)
      cy.get('#ordermsg').type('Test order comment')
      cy.contains('Place Order').click()
      cy.payAndConfirmOrder(user)

      // Then: descarga la factura y su contenido es correcto
      cy.contains('a', 'Download Invoice').click()
      cy.readFile(`${Cypress.config('downloadsFolder')}/invoice.txt`, { timeout: 15000 })
        .should('contain', `${user.firstName} ${user.lastName}`)
        .and('contain', 'Your total purchase amount is')

      cy.get('[data-qa="continue-button"]').click()

      // Cleanup
      cy.deleteAccount()
    })
  })

})

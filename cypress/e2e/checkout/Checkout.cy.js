import testUser from '../../fixtures/user.json'

describe('Checkout', () => {

  it('TC14 - Place Order: Register while Checkout', () => {
    // Given: un producto en el carrito sin estar logueado
    cy.visit('/products')
    cy.addProductToCart(0)
    cy.viewCartFromModal()
    cy.get('#cart_info_table tbody tr').should('have.length', 1)

    // When: al ir al checkout le pide registrarse
    cy.contains('Proceed To Checkout').click()
    cy.get('#checkoutModal a[href="/login"]').click()

    cy.registerUser().then((user) => {
      cy.goToCart()
      cy.contains('Proceed To Checkout').click()

      // Then: ve sus datos y el producto en la revisión de la orden
      cy.verifyAddress('#address_delivery', user)
      cy.get('#product-1').should('be.visible')

      // When / Then: confirma y paga
      cy.placeOrder('Test order comment')
      cy.payAndConfirmOrder(user)

      // Cleanup
      cy.deleteAccount()
    })
  })

  it('TC15 - Place Order: Register before Checkout', () => {
    // Given: usuario registrado y logueado
    cy.registerUser().then((user) => {
      // When: agrega un producto y va al checkout
      cy.get('.shop-menu a[href="/products"]').click()
      cy.addProductToCart(0)
      cy.viewCartFromModal()
      cy.get('#cart_info_table tbody tr').should('have.length', 1)
      cy.contains('Proceed To Checkout').click()

      // Then: ve sus datos y el producto en la revisión de la orden
      cy.verifyAddress('#address_delivery', user)
      cy.get('#product-1').should('be.visible')

      // When / Then: confirma y paga
      cy.placeOrder('Test order comment')
      cy.payAndConfirmOrder(user)

      // Cleanup
      cy.deleteAccount()
    })
  })

  it('TC16 - Place Order: Login before Checkout', () => {
    // Given: cuenta permanente logueada (no se elimina al final)
    cy.loginAsTestUser()

    // When: agrega un producto y va al checkout
    cy.get('.shop-menu a[href="/products"]').click()
    cy.addProductToCart(0)
    cy.viewCartFromModal()
    cy.get('#cart_info_table tbody tr').should('have.length', 1)
    cy.contains('Proceed To Checkout').click()

    // Then: la dirección es la de la cuenta permanente
    cy.verifyAddress('#address_delivery', testUser)
    cy.get('#product-1').should('be.visible')

    // When / Then: confirma y paga
    cy.placeOrder('Test order comment')
    cy.payAndConfirmOrder(testUser)
  })

  it('TC23 - Verify address details in checkout page', () => {
    // Given: usuario recién registrado con un producto en el carrito
    cy.registerUser().then((user) => {
      cy.visit('/products')
      cy.addProductToCart(0)
      cy.viewCartFromModal()

      // When
      cy.contains('Proceed To Checkout').click()

      // Then: entrega y facturación coinciden con los datos del registro
      cy.verifyAddress('#address_delivery', user)
      cy.verifyAddress('#address_invoice', user)

      // Cleanup
      cy.deleteAccount()
    })
  })

  it('TC24 - Download Invoice after purchase order', () => {
    // Given: un producto en el carrito sin estar logueado
    cy.visit('/products')
    cy.addProductToCart(0)
    cy.viewCartFromModal()
    cy.contains('Proceed To Checkout').click()
    cy.get('#checkoutModal a[href="/login"]').click()

    // When: se registra durante el checkout y completa la compra
    cy.registerUser().then((user) => {
      cy.goToCart()
      cy.contains('Proceed To Checkout').click()
      cy.verifyAddress('#address_delivery', user)
      cy.placeOrder('Test order comment')
      cy.payAndConfirmOrder(user)

      // Then: la factura descargada tiene el nombre del usuario y el total
      cy.contains('a', 'Download Invoice').click()
      cy.readFile(`${Cypress.config('downloadsFolder')}/invoice.txt`)
        .should('contain', `${user.firstName} ${user.lastName}`)
        .and('contain', 'Your total purchase amount is')

      cy.get('[data-qa="continue-button"]').click()

      // Cleanup
      cy.deleteAccount()
    })
  })

})

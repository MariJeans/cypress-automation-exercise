describe('Cart ', () => {

  beforeEach(() => {
    cy.visit('https://automationexercise.com/products');
  })

  it('TC12 - Add products to cart', () => {
      // --- Producto 1 ---
    cy.get('.product-image-wrapper')
      .eq(0)
      //junto 2 clases
      .find('.productinfo .add-to-cart')
      .click({ force: true }); // force: true porque el botón real está oculto

    // Se abre el modal de confirmación
    cy.get('.modal-content', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Your product has been added to cart.');

    // Seguimos comprando (cerramos el modal) en vez de ir al carrito todavía
    cy.get('.modal-content .close-modal').click();
    cy.get('.modal-content').should('not.be.visible');

     // --- Producto 2 ---
    cy.get('.product-image-wrapper')
      .eq(1)
      .find('.productinfo .add-to-cart')
      .click({ force: true });

    cy.get('.modal-content', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Your product has been added to cart.');

    // Esta vez vamos directo al carrito desde el modal
    cy.get('.modal-content').contains('View Cart').click();

    // --- Verificación en el carrito ---
    cy.url().should('include', '/view_cart');

    // Deben existir exactamente 2 filas de producto en el carrito
    cy.get('#cart_info_table tbody tr').should('have.length', 2);

    // Verificamos que sean los productos 1 y 2 (por data-product-id)
    cy.get('#cart_info_table tbody tr').eq(0)
      .should('have.attr', 'id', 'product-1');

    cy.get('#cart_info_table tbody tr').eq(1)
      .should('have.attr', 'id', 'product-2');
})

  it('TC13 - Verify quantity in cart', () => {
      // --- Producto 1 ---
    cy.get('.product-image-wrapper')
      .eq(0)
      //junto 2 clases
      .find('.productinfo .add-to-cart')
      .click({ force: true }); // force: true porque el botón real está oculto

    // Esta vez vamos directo al carrito desde el modal
    cy.get('.modal-content').contains('View Cart').click();

    // --- Verificación en el carrito ---
    cy.url().should('include', '/view_cart');

    // Deben existir exactamente 1 filas de producto en el carrito
    cy.get('#cart_info_table tbody tr').should('have.length', 1);

    //Agregamos 4 unidades del producto 1
    cy.get('.cart_description').click()
    cy.get('#quantity').clear().type('4')
    cy.contains('Add to cart').click()
    cy.get('.modal-content').contains('View Cart').click();

    // Verificamos que el producto 1 tenga cantidad 5 (1 inicial + 4 agregadas)
    cy.get('#cart_info_table tbody tr').eq(0)
      .find('td.cart_quantity button.disabled')
      .should('contain.text', '5');

})

  it('TC17 - Remove products from cart', () => {
    // Given: un producto en el carrito
    cy.addProductToCart(0)
    cy.get('.modal-content').contains('View Cart').click()
    cy.url().should('include', '/view_cart')
    cy.get('#cart_info_table tbody tr').should('have.length', 1)

    // When: elimina el producto con la "X"
    cy.get('#product-1 .cart_quantity_delete').click()

    // Then: el producto desaparece y el carrito queda vacío
    cy.get('#product-1').should('not.exist')
    cy.get('#empty_cart').should('be.visible').and('contain.text', 'Cart is empty!')
  })

  it('TC22 - Add to cart from Recommended items', () => {
    // Given: usuario en la home, baja hasta "Recommended items"
    cy.visit('/')
    cy.get('.recommended_items').scrollIntoView()
    cy.contains('.recommended_items h2', /recommended items/i).should('be.visible')

    // When: agrega el primer producto visible del carrusel
    cy.get('.recommended_items .item.active .add-to-cart')
      .first()
      .then(($btn) => {
        const productId = $btn.attr('data-product-id')
        cy.wrap($btn).click({ force: true }) // el carrusel rota solo, force evita fallos por animación

        cy.get('.modal-content', { timeout: 10000 }).should('be.visible')
        cy.get('.modal-content').contains('View Cart').click()

        // Then: el producto está en el carrito
        cy.url().should('include', '/view_cart')
        cy.get(`#product-${productId}`).should('be.visible')
      })
  })

})



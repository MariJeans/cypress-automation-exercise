describe('Carritos ', () => {

  beforeEach(() => {
    cy.visit('https://automationexercise.com/products');
  })

  it.only('TC12 - Agregar productos al carrito', () => {
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


})



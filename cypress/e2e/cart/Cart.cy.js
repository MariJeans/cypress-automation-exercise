// Verifica una fila del carrito: cantidad esperada y total = precio x cantidad
const verifyCartRow = (productId, expectedQuantity) => {
  cy.get(`#product-${productId}`).should(($row) => {
    const toNumber = (text) => Number(text.replace(/[^\d]/g, ''))
    const price = toNumber($row.find('.cart_price p').text())
    const quantity = toNumber($row.find('.cart_quantity button').text())
    const total = toNumber($row.find('.cart_total_price').text())

    expect(quantity, 'quantity').to.equal(expectedQuantity)
    expect(total, 'total').to.equal(price * quantity)
  })
}

describe('Cart', () => {

  beforeEach(() => {
    // Given: usuario en la página de productos
    cy.visit('/products')
  })

  it('TC12 - Add Products in Cart', () => {
    // When: agrega dos productos
    cy.addProductToCart(0)
    cy.continueShopping()
    cy.addProductToCart(1)
    cy.viewCartFromModal()

    // Then: ambos están en el carrito con precio, cantidad y total correctos
    cy.get('#cart_info_table tbody tr').should('have.length', 2)
    verifyCartRow(1, 1)
    verifyCartRow(2, 1)
  })

  it('TC13 - Verify Product quantity in Cart', () => {
    // When: abre el detalle del producto, sube la cantidad a 4 y lo agrega
    cy.get('a[href="/product_details/1"]').click()
    cy.url().should('include', '/product_details/1')
    cy.get('#quantity').clear().type('4')
    cy.contains('button', 'Add to cart').click()
    cy.viewCartFromModal()

    // Then: el producto aparece con cantidad 4
    cy.get('#cart_info_table tbody tr').should('have.length', 1)
    verifyCartRow(1, 4)
  })

  it('TC17 - Remove Products From Cart', () => {
    // Given: un producto en el carrito
    cy.addProductToCart(0)
    cy.viewCartFromModal()
    cy.get('#cart_info_table tbody tr').should('have.length', 1)

    // When: lo elimina con la "X"
    cy.get('#product-1 .cart_quantity_delete').click()

    // Then: el carrito queda vacío
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
        cy.wrap($btn).click({ force: true }) // el carrusel rota solo; force evita fallos por la animación
        cy.viewCartFromModal()

        // Then: el producto está en el carrito
        cy.get(`#product-${productId}`).should('be.visible')
      })
  })

})

const goToProducts = () => {
  cy.get('.shop-menu a[href="/products"]').click()
  cy.url().should('include', '/products')
  cy.contains('.features_items .title', 'All Products').should('be.visible')
}

const searchProduct = (term) => {
  cy.get('#search_product').type(term)
  cy.get('#submit_search').click()
  cy.contains('.features_items .title', 'Searched Products').should('be.visible')
}

describe('Products', () => {

  beforeEach(() => {
    // Given: usuario en la home
    cy.visit('/')
  })

  it('TC08 - Verify All Products and product detail page', () => {
    // When
    goToProducts()
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)
    cy.get('a[href="/product_details/1"]').click()

    // Then: se muestra el detalle completo del producto
    cy.url().should('include', '/product_details/1')
    cy.get('.product-information').within(() => {
      cy.contains('h2', 'Blue Top').should('be.visible')
      cy.contains('Category: Women > Tops').should('be.visible')
      cy.contains('Rs. 500').should('be.visible')
      cy.contains('Availability: In Stock').should('be.visible')
      cy.contains('Condition: New').should('be.visible')
      cy.contains('Brand: Polo').should('be.visible')
    })
  })

  it('TC09 - Search Product', () => {
    // When
    goToProducts()
    searchProduct('White Top')

    // Then
    cy.contains('.features_items .productinfo p', 'Summer White Top').should('be.visible')
  })

  it('TC18 - View Category Products', () => {
    // Given: las categorías se ven en la barra lateral
    cy.contains('.left-sidebar h2', 'Category').should('be.visible')

    // When: abre Women > Dress
    cy.get('a[href="#Women"]').click()
    cy.get('#Women').contains('a', 'Dress').click()

    // Then
    cy.url().should('include', '/category_products/1')
    cy.contains('.features_items .title', 'Women - Dress Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)

    // When: abre Men > Tshirts
    cy.get('a[href="#Men"]').click()
    cy.get('#Men').contains('a', 'Tshirts').click()

    // Then
    cy.url().should('include', '/category_products/3')
    cy.contains('.features_items .title', 'Men - Tshirts Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)
  })

  it('TC19 - View & Cart Brand Products', () => {
    // Given: las marcas se ven en la página de productos
    goToProducts()
    cy.contains('.brands_products h2', 'Brands').should('be.visible')

    // When: elige Polo
    cy.get('.brands-name a[href="/brand_products/Polo"]').click()

    // Then
    cy.url().should('include', '/brand_products/Polo')
    cy.contains('.features_items .title', 'Brand - Polo Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)

    // When: cambia a H&M
    cy.get('.brands-name a[href="/brand_products/H&M"]').click()

    // Then
    cy.url().should('include', '/brand_products/H&M')
    cy.contains('.features_items .title', 'Brand - H&M Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)
  })

  it('TC20 - Search Products and Verify Cart After Login', () => {
    // Given: un usuario propio del test (no ensucia el carrito de la cuenta permanente), deslogueado
    cy.registerUser().then((user) => {
      cy.get('.shop-menu a[href="/logout"]').click()

      // When: busca y agrega todos los resultados al carrito
      goToProducts()
      searchProduct('Jeans')

      cy.get('.features_items .productinfo p').then(($names) => {
        const searchedNames = $names.toArray().map((el) => el.innerText.trim())
        expect(searchedNames).to.have.length.greaterThan(0)
        searchedNames.forEach((name) => expect(name.toLowerCase()).to.include('jeans'))

        cy.get('.features_items .productinfo .add-to-cart').each(($btn) => {
          cy.wrap($btn).click({ force: true })
          cy.get('#cartModal .modal-content').should('be.visible')
          cy.continueShopping()
        })

        const verifyCartProducts = () => {
          cy.goToCart()
          cy.get('#cart_info_table tbody tr').should('have.length', searchedNames.length)
          cy.get('.cart_description h4 a').should(($links) => {
            const cartNames = $links.toArray().map((el) => el.innerText.trim())
            expect(cartNames).to.have.members(searchedNames)
          })
        }

        // Then: los productos están en el carrito
        verifyCartProducts()

        // When: inicia sesión
        cy.login(user.email, user.password)
        cy.contains('Logged in as').should('be.visible')

        // Then: los productos siguen en el carrito
        verifyCartProducts()
      })

      // Cleanup
      cy.deleteAccount()
    })
  })

  it('TC21 - Add review on product', () => {
    // Given: detalle del primer producto
    goToProducts()
    cy.get('a[href="/product_details/1"]').click()
    cy.contains('Write Your Review').should('be.visible')

    // When: envía una reseña
    cy.get('#name').type('María Test')
    cy.get('#email').type(`maria.review.${Date.now()}@ejemplo.com`)
    cy.get('#review').type('Muy buen producto, la calidad es excelente.')
    cy.get('#button-review').click()

    // Then
    cy.contains('#review-section', 'Thank you for your review.').should('be.visible')
  })

})

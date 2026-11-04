describe('Flujo de Lista de Productos ', () => {

  beforeEach(() => {
    // Given: usuario en la home, navega a la pantalla de login/signup
    cy.visit('https://automationexercise.com/')
  })

  it('TC08 - See List and Details of Products', () => {
    cy.contains('Products').click()
    cy.contains('View Product').click()
    cy.get('.product-information').within(() => {
      cy.contains('Blue Top').should('be.visible')
      cy.contains('Category: Women > Tops').should('be.visible')
      cy.contains('Rs. 500').should('be.visible')
      cy.contains('Availability: In Stock').should('be.visible')
      cy.contains('Condition: New').should('be.visible')
      cy.contains('Brand: Polo').should('be.visible')
    })
    
  })

  it('TC09 - Search for a Product', () => {
    cy.contains('Products').click()
    cy.get('#search_product').type('White Top')
    cy.get('#submit_search').click()
    cy.contains('Searched Products').should('be.visible')
    cy.get('.productinfo').contains('Summer White Top').should('be.visible')

  })

  it('TC18 - View Category Products', () => {
    // Given: las categorías se ven en la barra lateral
    cy.contains('.left-sidebar h2', 'Category').should('be.visible')

    // When: abre Women > Dress
    cy.get('a[href="#Women"]').click()
    cy.get('#Women').contains('a', 'Dress').click()

    // Then: se muestra la página de la categoría
    cy.url().should('include', '/category_products/1')
    cy.contains('.features_items .title', 'Women - Dress Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)

    // When: abre una subcategoría de Men
    cy.get('a[href="#Men"]').click()
    cy.get('#Men').contains('a', 'Tshirts').click()

    // Then: se muestra la página de la subcategoría de Men
    cy.url().should('include', '/category_products/3')
    cy.contains('.features_items .title', 'Men - Tshirts Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)
  })

  it('TC19 - View & Cart Brand Products', () => {
    // Given: las marcas se ven en la página de productos
    cy.contains('Products').click()
    cy.contains('.brands_products h2', 'Brands').should('be.visible')

    // When: elige la marca Polo
    cy.get('.brands-name a[href="/brand_products/Polo"]').click()

    // Then: se muestran los productos de Polo
    cy.url().should('include', '/brand_products/Polo')
    cy.contains('.features_items .title', 'Brand - Polo Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)

    // When: cambia a otra marca desde la barra lateral
    cy.get('.brands-name a[href="/brand_products/H&M"]').click()

    // Then: se muestran los productos de H&M
    cy.url().should('include', '/brand_products/H&M')
    cy.contains('.features_items .title', 'Brand - H&M Products').should('be.visible')
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0)
  })

  it('TC20 - Search Products and Verify Cart After Login', () => {
    // Given: un usuario propio del test (evita ensuciar el carrito de la cuenta permanente), deslogueado
    cy.registerUser().then((user) => {
      cy.contains('a', 'Logout').click()

      // When: busca productos y agrega todos los resultados al carrito
      cy.visit('/products')
      cy.get('#search_product').type('Jeans')
      cy.get('#submit_search').click()
      cy.contains('.features_items .title', 'Searched Products').should('be.visible')

      cy.get('.features_items .productinfo p').then(($names) => {
        const searchedNames = $names.toArray().map((el) => el.innerText.trim())
        expect(searchedNames).to.have.length.greaterThan(0)
        searchedNames.forEach((name) => expect(name.toLowerCase()).to.include('jeans'))

        cy.get('.features_items .productinfo .add-to-cart').each(($btn) => {
          cy.wrap($btn).click({ force: true })
          cy.get('.modal-content').should('be.visible')
          cy.get('.modal-content .close-modal').click()
          cy.get('.modal-content').should('not.be.visible')
        })

        // Then: los productos están en el carrito
        const verifyCartProducts = () => {
          cy.get('.shop-menu a[href="/view_cart"]').click()
          cy.get('#cart_info_table tbody tr').should('have.length', searchedNames.length)
          cy.get('.cart_description h4 a').should(($links) => {
            const cartNames = $links.toArray().map((el) => el.innerText.trim())
            expect(cartNames).to.have.members(searchedNames)
          })
        }
        verifyCartProducts()

        // When: inicia sesión
        cy.get('.shop-menu a[href="/login"]').click()
        cy.loginSinAssert(user.email, user.password)
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
    cy.contains('Products').click()
    cy.contains('.features_items .title', 'All Products').should('be.visible')
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

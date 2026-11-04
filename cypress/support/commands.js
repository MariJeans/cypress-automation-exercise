import userData from '../fixtures/user.json'
import card from '../fixtures/payment.json'

// ============================================================
// Auth
// ============================================================

/**
 * Registra un usuario nuevo (email único) y lo deja logueado.
 * Yields el objeto usuario; también queda disponible como alias @registeredUser.
 * @example cy.registerUser().then((user) => { ... })
 */
Cypress.Commands.add('registerUser', (overrides = {}) => {
  const user = {
    ...userData,
    email: `maria.test.${Date.now()}@ejemplo.com`,
    ...overrides,
  }

  cy.visit('/login')
  cy.get('[data-qa="signup-name"]').type(user.name)
  cy.get('[data-qa="signup-email"]').type(user.email)
  cy.get('[data-qa="signup-button"]').click()

  cy.get('#id_gender2').check()
  cy.get('[data-qa="password"]').type(user.password, { log: false })
  cy.get('[data-qa="days"]').select(user.birthDay)
  cy.get('[data-qa="months"]').select(user.birthMonth)
  cy.get('[data-qa="years"]').select(user.birthYear)
  cy.get('[data-qa="first_name"]').type(user.firstName)
  cy.get('[data-qa="last_name"]').type(user.lastName)
  cy.get('[data-qa="address"]').type(user.address)
  cy.get('[data-qa="country"]').select(user.country)
  cy.get('[data-qa="state"]').type(user.state)
  cy.get('[data-qa="city"]').type(user.city)
  cy.get('[data-qa="zipcode"]').type(user.zipcode)
  cy.get('[data-qa="mobile_number"]').type(user.mobile)
  cy.get('[data-qa="create-account"]').click()

  // Guardas: si la precondición no se cumple, falla acá con un mensaje claro
  cy.get('[data-qa="account-created"]').should('be.visible')
  cy.get('[data-qa="continue-button"]').click()
  cy.contains('Logged in as').should('be.visible')

  cy.wrap(user, { log: false }).as('registeredUser')
})

/**
 * Envía el formulario de login. No valida el resultado: cada test decide qué esperar
 * (login exitoso, mensaje de error, etc.).
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-qa="login-email"]').type(email)
  cy.get('[data-qa="login-password"]').type(password, { log: false })
  cy.get('[data-qa="login-button"]').click()
})

/**
 * Inicia sesión con la cuenta permanente de cypress.env.json y valida que quedó logueado.
 * Usar como precondición, no para testear el login en sí.
 */
Cypress.Commands.add('loginAsTestUser', () => {
  cy.env(['TEST_USER_EMAIL', 'TEST_USER_PASSWORD']).then(({ TEST_USER_EMAIL, TEST_USER_PASSWORD }) => {
    cy.login(TEST_USER_EMAIL, TEST_USER_PASSWORD)
  })
  cy.contains('Logged in as').should('be.visible')
})

/** Elimina la cuenta del usuario logueado (cleanup). */
Cypress.Commands.add('deleteAccount', () => {
  cy.get('.shop-menu a[href="/delete_account"]').click()
  cy.get('[data-qa="account-deleted"]').should('be.visible')
})

// ============================================================
// Navegación
// ============================================================

/** Abre el carrito desde el menú del header. */
Cypress.Commands.add('goToCart', () => {
  cy.get('.shop-menu a[href="/view_cart"]').click()
  cy.url().should('include', '/view_cart')
})

// ============================================================
// Carrito
// ============================================================

/**
 * Agrega al carrito el producto en la posición `index` del listado principal
 * y espera el modal de confirmación.
 */
Cypress.Commands.add('addProductToCart', (index = 0) => {
  cy.get('.features_items .product-image-wrapper')
    .eq(index)
    .find('.productinfo .add-to-cart')
    .click({ force: true }) // el botón real queda tapado por el overlay del hover
  cy.get('#cartModal .modal-content')
    .should('be.visible')
    .and('contain.text', 'Your product has been added to cart.')
})

/** Cierra el modal de "Added!" y sigue comprando. */
Cypress.Commands.add('continueShopping', () => {
  cy.get('#cartModal .close-modal').click()
  cy.get('#cartModal').should('not.be.visible')
})

/** Va al carrito desde el modal de "Added!". */
Cypress.Commands.add('viewCartFromModal', () => {
  cy.get('#cartModal').contains('a', 'View Cart').click()
  cy.url().should('include', '/view_cart')
})

// ============================================================
// Checkout
// ============================================================

/** Verifica que un bloque de dirección (#address_delivery / #address_invoice) tenga los datos del usuario. */
Cypress.Commands.add('verifyAddress', (selector, user) => {
  cy.get(selector).should(($address) => {
    const text = $address.text()
    expect(text).to.include(`${user.firstName} ${user.lastName}`)
    expect(text).to.include(user.address)
    expect(text).to.include(user.country)
    expect(text).to.include(user.city)
    expect(text).to.include(user.zipcode)
    expect(text).to.include(user.mobile)
  })
})

/** En la página de checkout: escribe el comentario (opcional) y confirma con "Place Order". */
Cypress.Commands.add('placeOrder', (comment) => {
  if (comment) {
    cy.get('#ordermsg textarea').type(comment)
  }
  cy.contains('a', 'Place Order').click()
  cy.url().should('include', '/payment')
})

/** Completa el pago con la tarjeta de prueba y verifica la página de confirmación. */
Cypress.Commands.add('payAndConfirmOrder', (user) => {
  cy.get('[data-qa="name-on-card"]').type(`${user.firstName} ${user.lastName}`)
  cy.get('[data-qa="card-number"]').type(card.cardNumber, { log: false })
  cy.get('[data-qa="cvc"]').type(card.cvc, { log: false })
  cy.get('[data-qa="expiry-month"]').type(card.expiryMonth)
  cy.get('[data-qa="expiry-year"]').type(card.expiryYear)
  cy.get('[data-qa="pay-button"]').click()

  // "Your order has been placed successfully!" es transitorio: validamos la página final
  cy.url().should('include', '/payment_done')
  cy.get('[data-qa="order-placed"]').should('be.visible')
  cy.contains('Congratulations! Your order has been confirmed!').should('be.visible')
})

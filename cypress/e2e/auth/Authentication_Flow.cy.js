describe('Authentication', () => {

  beforeEach(() => {
    // Given: usuario en la home navega a Signup / Login
    cy.visit('/')
    cy.get('.shop-menu a[href="/login"]').click()
    cy.url().should('include', '/login')
  })

  it('TC01 - Register User', () => {
    // When / Then: el comando valida "Account Created!" y el estado logueado
    cy.registerUser()

    // Cleanup
    cy.deleteAccount()
  })

  it('TC02 - Login User with correct email and password', () => {
    // When
    cy.env(['TEST_USER_EMAIL', 'TEST_USER_PASSWORD']).then(({ TEST_USER_EMAIL, TEST_USER_PASSWORD }) => {
      cy.login(TEST_USER_EMAIL, TEST_USER_PASSWORD)
    })

    // Then
    cy.contains('Logged in as').should('be.visible')
    cy.get('.shop-menu a[href="/logout"]').should('be.visible')
  })

  it('TC03 - Login User with incorrect email and password', () => {
    // When
    cy.login('invalid@ejemplo.com', 'Test1234')

    // Then
    cy.contains('Your email or password is incorrect!').should('be.visible')
    cy.get('.shop-menu a[href="/logout"]').should('not.exist')
  })

  it('TC04 - Logout User', () => {
    // Given
    cy.loginAsTestUser()

    // When
    cy.get('.shop-menu a[href="/logout"]').click()

    // Then: vuelve a la pantalla de login
    cy.url().should('include', '/login')
    cy.contains('Login to your account').should('be.visible')
  })

  it('TC05 - Register User with existing email', () => {
    // When: intenta registrarse con un email ya usado
    cy.env(['TEST_USER_EMAIL']).then(({ TEST_USER_EMAIL }) => {
      cy.get('[data-qa="signup-name"]').type('Usuario de Prueba')
      cy.get('[data-qa="signup-email"]').type(TEST_USER_EMAIL)
      cy.get('[data-qa="signup-button"]').click()
    })

    // Then
    cy.contains('Email Address already exist!').should('be.visible')
  })

})

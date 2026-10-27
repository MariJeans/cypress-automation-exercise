describe('Flujo de Autenticación', () => {

  beforeEach(() => {
    // usuario en la home, navega a la pantalla de login/signup
    cy.visit('https://automationexercise.com/')
    cy.contains('Signup / Login').click()
  })

  it('TC01 - Register new user', () => {
    cy.registerUser() // usa el comando custom para registrar un usuario

    // Cleanup
    cy.contains('Delete Account').click({ force: true })
    cy.contains('Account Deleted!').should('be.visible')
  })

  it('TC02 - Login with valid credentials', () => {
    // Inicia sesión con credenciales válidas
    cy.env(['TEST_USER_EMAIL', 'TEST_USER_PASSWORD']).then(({ TEST_USER_EMAIL, TEST_USER_PASSWORD }) => {
      cy.loginSinAssert(TEST_USER_EMAIL, TEST_USER_PASSWORD)
      cy.contains('Logged in as', { timeout: 10000 }).should('be.visible')
    })
    // Then
    cy.contains('Logout', { timeout: 10000 }).should('be.visible')
  })



  it('TC03 - Login with invalid credentials', () => {
    // When: intenta loguearse con credenciales inválidas
    cy.loginSinAssert('invalid@ejemplo.com', 'Test1234')
    // Then
    cy.contains('Your email or password is incorrect!').should('be.visible')
  })

  it('TC04 - Logout de usuario', () => {
    // login con usuario válido
    cy.env(['TEST_USER_EMAIL', 'TEST_USER_PASSWORD']).then(({ TEST_USER_EMAIL, TEST_USER_PASSWORD }) => {
      cy.loginSinAssert(TEST_USER_EMAIL, TEST_USER_PASSWORD)
      cy.contains('Logged in as', { timeout: 10000 }).should('be.visible')

    })
    // hace logout 
    cy.contains('Logout', { timeout: 10000 }).should('be.visible')
    cy.contains('Logout').click()

    // valida que se redirige a la pantalla de login
    cy.url().should('include', '/login')
    cy.contains('Login to your account').should('be.visible')
  })

  it('TC05 - Register with an email that already exists', () => {
    // When: intenta registrarse con un email ya usado
    cy.env(['TEST_USER_EMAIL']).then(({ TEST_USER_EMAIL }) => {
      cy.get('[data-qa="signup-name"]').type('Usuario de Prueba')
      cy.get('[data-qa="signup-email"]').type(TEST_USER_EMAIL)
      cy.contains('button', 'Signup').click()
    })

    // Then
    cy.contains('Email Address already exist!').should('be.visible')
  })

})
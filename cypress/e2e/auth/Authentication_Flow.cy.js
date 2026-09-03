describe('Flujo de Autenticación', () => {

  beforeEach(() => {
    // Given: usuario en la home, navega a la pantalla de login/signup
    cy.visit('https://automationexercise.com/')
    cy.contains('Signup / Login').click()
  })

  it('TC01 - Register new user', () => {
    const email = `maria.test.${Date.now()}@ejemplo.com`

    // When: completa el signup
    cy.get('[data-qa="signup-name"]').type('María Test')
    cy.get('[data-qa="signup-email"]').type(email)
    cy.contains('button', 'Signup').click()
    cy.get('#id_gender2').check()
    cy.get('#password').type('Test1234', { log: false })
    cy.get('#days').select('16')
    cy.get('#months').select('December')
    cy.get('#years').select('1998')
    cy.get('#first_name').type('María')
    cy.get('#last_name').type('Acuna')
    cy.get('#address1').type('Tets 1234')
    cy.get('#country').select('Canada')
    cy.get('#state').type('Ontario')
    cy.get('#city').type('Toronto')
    cy.get('#zipcode').type('M5V 2T6')
    cy.get('#mobile_number').type('4161234567')
    cy.contains('button', 'Create Account').click()

    // Then
    cy.contains('Account Created!').should('be.visible')
    cy.contains('[data-qa="continue-button"]', 'Continue').click()
    cy.contains('Logged in as').should('be.visible')

    // Cleanup
    cy.contains('Delete Account').click({ force: true })
    cy.contains('Account Deleted!').should('be.visible')
  })

  it('TC02 - Login with valid credentials', () => {
    // When: inicia sesión con credenciales válidas
    cy.env(['TEST_USER_EMAIL', 'TEST_USER_PASSWORD']).then(({ TEST_USER_EMAIL, TEST_USER_PASSWORD }) => {
      cy.get('[data-qa="login-email"]').type(TEST_USER_EMAIL)
      cy.get('[data-qa="login-password"]').type(TEST_USER_PASSWORD, { log: false })
      cy.contains('button', 'Login').click()
    })

    // Then
    cy.contains('Logout', { timeout: 10000 }).should('be.visible')
  })

  it('TC03 - Login with invalid credentials', () => {
    // When: intenta loguearse con credenciales inválidas
    cy.get('[data-qa="login-email"]').type('marta@ejemplo.com')
    cy.get('[data-qa="login-password"]').type('Test1234', { log: false })
    cy.contains('button', 'Login').click()

    // Then
    cy.contains('Your email or password is incorrect!').should('be.visible')
  })

  it('TC04 - Logout de usuario', () => {
    // When: se loguea y luego cierra sesión
    cy.env(['TEST_USER_EMAIL', 'TEST_USER_PASSWORD']).then(({ TEST_USER_EMAIL, TEST_USER_PASSWORD }) => {
      cy.get('[data-qa="login-email"]').type(TEST_USER_EMAIL)
      cy.get('[data-qa="login-password"]').type(TEST_USER_PASSWORD, { log: false })
      cy.contains('button', 'Login').click()
    })
    cy.contains('Logout', { timeout: 10000 }).should('be.visible')
    cy.contains('Logout').click()

    // Then
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
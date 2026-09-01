describe('Flujo de Login', () => {

  it('TC02 - Login with valid credentials', () => {

    // Given: la usuaria no tiene cuenta, está en la home

    cy.visit('https://automationexercise.com/')

    // When: inicia el login
    cy.contains('Signup / Login').click()

    cy.env(['TEST_USER_EMAIL', 'TEST_USER_PASSWORD']).then(({ TEST_USER_EMAIL, TEST_USER_PASSWORD }) => {
      cy.get('[data-qa="login-email"]').type(TEST_USER_EMAIL)
      cy.get('[data-qa="login-password"]').type(TEST_USER_PASSWORD, { log: false })
      cy.contains('button', 'Login').click()
    })


    // Then: la usuaria ve el mensaje de cuenta creada
    cy.contains('Logout', { timeout: 10000 }).should('be.visible')

    })

})

describe('Flujo de Login', () => {

  it('TC03 - Login with invalid credentials', () => {

    // Given: la usuaria no tiene cuenta, está en la home

    cy.visit('https://automationexercise.com/')

    // When: inicia el login
    cy.contains('Signup / Login').click()
    cy.get('[data-qa="login-email"]').type('marta@ejemplo.com')
    cy.get('[data-qa="login-password"]').type('Test1234', { log: false })
    cy.contains('button', 'Login').click()

    // Then: la usuaria ve el mensaje de error
    cy.contains('Your email or password is incorrect!').should('be.visible')

    })

})

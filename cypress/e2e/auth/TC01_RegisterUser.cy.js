describe('Flujo de Autenticación', () => {

  it('TC01 - Register new user', () => {
    // Given: la usuaria no tiene cuenta, está en la home
    const email = `maria.test.${Date.now()}@ejemplo.com`

    cy.visit('https://automationexercise.com/')

    // When: inicia el signup
    cy.contains('Signup / Login').click()
    cy.get('[data-qa="signup-name"]').type('María Test')
    cy.get('[data-qa="signup-email"]').type(email)
    cy.contains('button', 'Signup').click()
    //Completar el formulario de registro
    cy.get('#id_gender2').check()
    //log false para que en la salida de logs no se vea la contraseña
    cy.get('#password').type('Test1234', { log: false })
    cy.get('#days').select('16')
    cy.get('#months').select('December')
    cy.get('#years').select('1998')
    //adress information
    cy.get('#first_name').type('María')
    cy.get('#last_name').type('Acuna')
    cy.get('#address1').type('Tets 1234')
    cy.get('#country').select('Canada')
    cy.get('#state').type('Ontario')
    cy.get('#city').type('Toronto')
    cy.get('#zipcode').type('M5V 2T6')
    cy.get('#mobile_number').type('4161234567')
    cy.contains('button', 'Create Account').click()

    // Then: la usuaria ve el mensaje de cuenta creada
    cy.contains('Account Created!').should('be.visible')
    cy.contains('[data-qa="continue-button"]', 'Continue').click()
    cy.contains('Logged in as').should('be.visible')

    // Cleanup: borramos la cuenta para no dejar basura
    cy.contains('Delete Account').click({ force: true })
    cy.contains('Account Deleted!').should('be.visible')

    })

})
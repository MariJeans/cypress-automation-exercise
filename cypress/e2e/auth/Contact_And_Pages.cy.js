describe('Form Contact and Pages access ', () => {

  beforeEach(() => {
    // Given: usuario en la home, navega a la pantalla de login/signup
    cy.visit('https://automationexercise.com/')
  })

  it('TC06.1- Send contact form successfully whithout an attachment ', () => {
    // When: usuario completa el formulario de contacto y lo envía
    cy.contains('Contact us').click()
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type('johndoe@example.com')
    cy.get('input[name="subject"]').type('Test Subject')
    cy.get('textarea[name="message"]').type('Test Message')
    cy.get('.btn.btn-primary.pull-left.submit_form').click()
    //Then: usuario ve un mensaje de éxito indicando que el formulario se envió correctamente
    cy.contains('Success! Your details have been submitted successfully.').should('be.visible') 
  })

   it.only('TC06.2- Send contact form successfully with an attachment ', () => {
    //When: usuario completa el formulario de contacto y lo envía con un archivo adjunto
    cy.contains('Contact us').click()
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type('johndoe@example.com')
    cy.get('input[name="subject"]').type('Test Subject')
    cy.get('textarea[name="message"]').type('Test Message')
    cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json')
    cy.get('.btn.btn-primary.pull-left.submit_form').click()
    //Then: usuario ve un mensaje de éxito indicando que el formulario se envió correctamente
    cy.contains('Success! Your details have been submitted successfully.').should('be.visible') 
  })


  it('TC07 - Should access the test cases page', () => {
    // When: usuario hace clic en el enlace "Test Cases"
    cy.contains('Test Cases').click()
    // Then: usuario ve la página de casos de prueba con el mensaje correspondiente
    cy.contains('Below is the list of test Cases for you to practice the Automation. Click on the scenario for detailed Test Steps:').should('be.visible') 
  })

})
describe('Form Contact and Pages access ', () => {

  beforeEach(() => {
    // Given: usuario en la home, navega a la pantalla de login/signup
    cy.visit('https://automationexercise.com/')
  })

  it('TC06 - Should submit the contact form successfully', () => {
    cy.contains('Contact us').click()
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type('johndoe@example.com')
    cy.get('input[name="subject"]').type('Test Subject')
    cy.get('textarea[name="message"]').type('Test Message')
    cy.get('.btn.btn-primary.pull-left.submit_form').click()
    cy.contains('Success! Your details have been submitted successfully.').should('be.visible') 
  })

  it('TC07 - Should access the test cases page', () => {
    cy.contains('Test Cases').click()
    cy.contains('Below is the list of test Cases for you to practice the Automation. Click on the scenario for detailed Test Steps:').should('be.visible') 
  })

})
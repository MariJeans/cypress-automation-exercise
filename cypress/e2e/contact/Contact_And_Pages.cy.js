const fillContactForm = ({ attachment } = {}) => {
  cy.get('[data-qa="name"]').type('John Doe')
  cy.get('[data-qa="email"]').type('johndoe@example.com')
  cy.get('[data-qa="subject"]').type('Test Subject')
  cy.get('[data-qa="message"]').type('Test Message')
  if (attachment) {
    cy.get('input[name="upload_file"]').selectFile(attachment)
  }
}

describe('Contact Us & Test Cases page', () => {

  beforeEach(() => {
    // Given: usuario en la home
    cy.visit('/')
  })

  it('TC06.1 - Contact Us Form without attachment', () => {
    // When: completa el formulario y lo envía (Cypress acepta el confirm() automáticamente)
    cy.get('.shop-menu a[href="/contact_us"]').click()
    cy.contains('Get In Touch').should('be.visible')
    fillContactForm()
    cy.get('[data-qa="submit-button"]').click()

    // Then
    cy.contains('.status', 'Success! Your details have been submitted successfully.').should('be.visible')
  })

  it('TC06.2 - Contact Us Form with attachment', () => {
    // When: completa el formulario con un archivo adjunto y lo envía
    cy.get('.shop-menu a[href="/contact_us"]').click()
    cy.contains('Get In Touch').should('be.visible')
    fillContactForm({ attachment: 'cypress/fixtures/example.json' })
    cy.get('[data-qa="submit-button"]').click()

    // Then
    cy.contains('.status', 'Success! Your details have been submitted successfully.').should('be.visible')
  })

  it('TC07 - Verify Test Cases Page', () => {
    // When
    cy.get('.shop-menu a[href="/test_cases"]').click()

    // Then
    cy.url().should('include', '/test_cases')
    cy.contains('Below is the list of test Cases for you to practice the Automation.').should('be.visible')
  })

})

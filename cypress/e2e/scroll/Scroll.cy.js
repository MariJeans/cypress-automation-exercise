// Verifica que el elemento esté dentro del área visible de la ventana.
// `be.visible` de Cypress no alcanza: solo revisa CSS, no si el elemento está en pantalla.
const shouldBeInViewport = (selector, text) => {
  cy.window().then((win) => {
    cy.contains(selector, text).should(($el) => {
      const rect = $el[0].getBoundingClientRect()
      expect(rect.top, 'top').to.be.at.least(0)
      expect(rect.bottom, 'bottom').to.be.at.most(win.innerHeight)
    })
  })
}

const HERO_TEXT = 'Full-Fledged practice website for Automation Engineers'

describe('Scroll Up / Scroll Down', () => {

  beforeEach(() => {
    // Given: usuario en la home
    cy.visit('/')
    cy.get('#slider-carousel').should('be.visible')

    // When: baja hasta el final de la página
    cy.scrollTo('bottom')

    // Then: la sección Subscription está en pantalla
    shouldBeInViewport('.footer-widget h2', 'Subscription')
  })

  it('TC25 - Verify Scroll Up using Arrow button and Scroll Down functionality', () => {
    // When: hace click en la flecha de "scroll up"
    cy.get('#scrollUp').should('be.visible').click()

    // Then: la página vuelve arriba y se ve el texto del banner
    cy.window().its('scrollY').should('equal', 0)
    shouldBeInViewport('#slider-carousel .item.active h2', HERO_TEXT)
  })

  it('TC26 - Verify Scroll Up without Arrow button and Scroll Down functionality', () => {
    // When: sube manualmente hasta arriba
    cy.scrollTo('top')

    // Then: se ve el texto del banner
    cy.window().its('scrollY').should('equal', 0)
    shouldBeInViewport('#slider-carousel .item.active h2', HERO_TEXT)
  })

})

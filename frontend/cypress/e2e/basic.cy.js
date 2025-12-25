describe('App basic smoke', () => {
  it('visits the home page and checks body', () => {
    cy.visit('/')
    cy.get('body').should('exist')
  })
})

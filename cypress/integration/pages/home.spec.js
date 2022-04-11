/// <reference types="cypress" />

//const BASE_URL = 'http://frontend:4200';
const BASE_URL = Cypress.env('CYPRESS_BASE_URL');

context('Home page', () => {

  it('has a link to proposicoes', () => {
    cy.visit(BASE_URL)

    cy.get('.nav-link')
      .eq(0)
      .should('have.text', 'Proposições')
      .should('have.attr', 'href')
      .and('include', '/paineis');

    cy.get('.nav-link')
      .eq(0)
      .click();

    cy.url().should('eq', BASE_URL + '/paineis');
  })

  it('has a link to parlamentares', () => {
    cy.visit(BASE_URL)

    cy.get('.nav-link')
      .eq(1)
      .should('have.text', 'Parlamentares')
      .should('have.attr', 'href')
      .and('include', '/parlamentares');

    cy.get('.nav-link')
      .eq(1)
      .click();

    cy.url().should('eq', BASE_URL + '/parlamentares');
  })
})

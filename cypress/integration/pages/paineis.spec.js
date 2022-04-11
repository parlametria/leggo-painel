/// <reference types="cypress" />

const BASE_URL = Cypress.env('CYPRESS_BASE_URL');

context('Paineis page', () => {

  it('has 8 panels', () => {
    cy.visit(BASE_URL + '/paineis')

    cy.get('.container .row .col-sm-6.col-md-3.mb-4')
      .should('have.length', 8)
  });

});

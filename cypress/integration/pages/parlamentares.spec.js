/// <reference types="cypress" />

const BASE_URL = Cypress.env('CYPRESS_BASE_URL');

context('Parlamentares page', () => {

  beforeEach(() => {
    cy.visit(BASE_URL + '/parlamentares');
  });

  it('orders by Governismos [maior]', () => {
    cy.get('.card .card-body .card-progress span')
      .eq(1) // eq(0) --> progress bar
      .should('not.contain', '100%');

    cy.get('span.governismo-maior')
      .click();

    cy.get('.card .card-body .card-progress span')
      .eq(1) // eq(0) --> progress bar
      .should('contain', '100%');
  });

  it('orders by Governismos [menor]', () => {
    cy.get('.card .card-body .card-progress span')
      .eq(1) // eq(0) --> progress bar
      .should('not.contain', '0%');

    cy.get('span.governismo-menor')
      .click();

    cy.get('.card .card-body .card-progress span')
      .eq(1) // eq(0) --> progress bar
      .should('contain', '0%');
  });

  it('orders by Disciplina Partidária [maior]', () => {
    cy.get('.card .card-body .card-progress span')
      .eq(3)
      .should('not.contain', '100%');

    cy.get('span.disciplina-partidaria-maior')
      .click();

    cy.get('.card .card-body .card-progress span')
      .eq(3)
      .should('contain', '100%');
  });

  it('switches between Senado and Camara', () => {
    const TEXT = {
      senado: { count: 80, desc: 'Total de parlamentares no Senado' },
      camara: { count: 513, desc: 'Total de parlamentares na Câmara' },
    }

    cy.get('.filtro-wrapper .total-count h2')
      .should('contain', TEXT.senado.count);

    cy.get('.filtro-wrapper .total-subtitle')
      .should('contain', TEXT.senado.desc);

    cy.get('.selector-camara')
      .click();

    cy.get('.filtro-wrapper .total-count h2')
      .should('contain', TEXT.camara.count);

    cy.get('.filtro-wrapper .total-subtitle')
      .should('contain', TEXT.camara.desc);

    cy.get('.selector-senado')
      .click();

    cy.get('.filtro-wrapper .total-count h2')
      .should('contain', TEXT.senado.count);

    cy.get('.filtro-wrapper .total-subtitle')
      .should('contain', TEXT.senado.desc);
  });

  it('filters by party', () => {
    cy.get(':nth-child(2) > #local').select('CIDADANIA');
    cy.get('.card-partido').should('contain', 'CIDADANIA');

    cy.get(':nth-child(2) > #local').select('DEM');
    cy.get('.card-partido').should('contain', 'DEM');
    cy.get('.card-partido').should('not.contain', 'CIDADANIA');
  });

  it('filters by state', () => {
    cy.get(':nth-child(4) > #local').select('AC');
    cy.get('.card-partido').should('contain', 'AC');

    cy.get(':nth-child(4) > #local').select('RJ')
    cy.get('.card-partido').should('contain', 'RJ');
    cy.get('.card-partido').should('not.contain', 'AC');
  });

  it('Cargo em comissões is only visible when Comissões is selected', () => {
    // Cargo em comissões
    cy.get(':nth-child(7) > .filter-label > h6').should('not.exist');
    cy.get(':nth-child(7) > .form-group > #local').should('not.exist');

    cy.get(':nth-child(6) > #local').select('Cpi Da Pandemia');

    cy.get(':nth-child(7) > .filter-label > h6').should('exist');
    cy.get(':nth-child(7) > .filter-label > h6').should('contain', 'Cargo em comissões');
    cy.get(':nth-child(7) > .form-group > #local').should('exist');
  });

  it('clear filters', () => {
    cy.get('span.governismo-maior')
      .click();

    cy.get('.card .card-body .card-progress span')
      .eq(1)
      .should('contain', '100%');

    cy.get('.clear-filter > .btn').click();

    cy.get('.card .card-body .card-progress span')
      .eq(1)
      .should('not.contain', '100%');
  });
});

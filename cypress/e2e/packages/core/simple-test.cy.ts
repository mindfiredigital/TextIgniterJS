/// <reference types="cypress" />

describe('Simple Core Test', () => {
  it('should load the page', () => {
    cy.visit('/core/index.html');
    cy.get('#editor-container').should('exist');
    cy.get('#editor').should('exist');
    cy.get('#toolbar').should('exist');
  });
});

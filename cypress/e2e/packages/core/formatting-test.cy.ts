/// <reference types="cypress" />

describe('Core Formatting Test', () => {
  beforeEach(() => {
    cy.visit('/core/index.html');
    cy.wait(1000);
  });

  it('should apply bold formatting', () => {
    cy.get('#editor').focus();
    cy.get('#editor').clear();
    cy.get('#editor').type('Test bold text');

    // Wait for initialization
    cy.wait(500);

    // Select all text using keyboard shortcut
    cy.get('#editor').type('{ctrl+a}');

    // Click bold button
    cy.get('#bold').should('be.visible').click();

    // Give it time to apply formatting
    cy.wait(500);

    // Check if bold formatting is applied by looking for elements with bold styling
    cy.get('#editor').within(() => {
      // Look for any element that has bold styling applied
      cy.get('[data-id]')
        .should('exist')
        .and($el => {
          const fontWeight = $el.css('font-weight');
          const weightNum = parseInt(fontWeight, 10);
          expect(
            fontWeight === 'bold' || fontWeight === '700' || weightNum >= 700
          ).to.be.true;
        });
    });
  });

  it('should apply italic formatting', () => {
    cy.get('#editor').focus();
    cy.get('#editor').clear();
    cy.get('#editor').type('Test italic text');
    cy.get('#editor').type('{ctrl+a}');

    cy.get('#italic').click();

    cy.get('#editor').within(() => {
      cy.get('*').should('have.css', 'font-style', 'italic');
    });
  });

  it('should apply underline formatting', () => {
    cy.get('#editor').focus();
    cy.get('#editor').clear();
    cy.get('#editor').type('Test underline text');
    cy.get('#editor').type('{ctrl+a}');

    cy.get('#underline').click();

    cy.get('#editor').within(() => {
      cy.get('*')
        .should('have.css', 'text-decoration')
        .and('include', 'underline');
    });
  });
});

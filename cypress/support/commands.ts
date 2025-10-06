/* eslint-disable no-unused-vars */
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to wait for TextIgniter component to be initialized
       */
      waitForTextIgniter(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('dataCy', value => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('waitForTextIgniter', () => {
  cy.get('text-igniter').should('exist');
  cy.get('#editor-container').should('exist');
  // Wait for the component to be fully initialized
  cy.wait(1000);
});

export {};

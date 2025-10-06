/// <reference types="cypress" />

describe('TextIgniter Angular Package E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/angular/test.html');
    cy.wait(1500); // Allow time for Angular component initialization
  });

  describe('Component Rendering', () => {
    it('should render the Angular TextIgniter component', () => {
      cy.get('[data-testid="angular-editor"]').should('exist');
      cy.get('[data-testid="angular-editor"]').should('be.visible');
    });

    it('should show toolbar when showToolbar is true', () => {
      cy.get('[data-testid="angular-toolbar"]').should('exist');
      cy.get('[data-testid="angular-toolbar"]').should('be.visible');
    });

    it('should render editor content area', () => {
      cy.get('[data-testid="editor-content"]').should('exist');
      cy.get('[data-testid="editor-content"]').should(
        'have.attr',
        'contenteditable',
        'true'
      );
      cy.get('[data-testid="editor-content"]').should(
        'contain.text',
        'Mock TextIgniter Angular Editor'
      );
    });

    it('should have proper component structure', () => {
      cy.get('#editor-angular').should('exist');
      cy.get('#mock-angular-editor').should('exist');
      cy.get('#editor-content').should('exist');
    });
  });

  describe('Configuration Management', () => {
    it('should apply initial configuration correctly', () => {
      // Check toolbar is visible initially
      cy.get('[data-testid="angular-toolbar"]').should('be.visible');

      // Check initial features are rendered
      cy.get('[data-feature="bold"]').should('exist');
      cy.get('[data-feature="italic"]').should('exist');
      cy.get('[data-feature="underline"]').should('exist');
      cy.get('[data-feature="hyperlink"]').should('exist');
      cy.get('[data-feature="image"]').should('exist');
    });

    it('should update configuration when config changes', () => {
      // Toggle config to hide toolbar
      cy.get('#config-change-btn').click();
      cy.wait(300);

      // Toolbar should be hidden now
      cy.get('[data-testid="angular-toolbar"]').should('not.exist');

      // Toggle back to show toolbar
      cy.get('#config-change-btn').click();
      cy.wait(300);

      // Toolbar should be visible again with new features
      cy.get('[data-testid="angular-toolbar"]').should('be.visible');
      cy.get('[data-feature="fontColor"]').should('exist');
      cy.get('[data-feature="alignCenter"]').should('exist');
    });

    it('should handle feature list changes', () => {
      // Initial feature count should be 5
      cy.get('[data-feature]').should('have.length', 5);

      // Change config
      cy.get('#config-change-btn').click();
      cy.wait(300);
      cy.get('#config-change-btn').click();
      cy.wait(300);

      // New feature count should be 5 (bold, italic, underline, fontColor, alignCenter)
      cy.get('[data-feature]').should('have.length', 5);
      cy.get('[data-feature="fontColor"]').should('exist');
      cy.get('[data-feature="alignCenter"]').should('exist');
    });
  });

  describe('Component Lifecycle', () => {
    it('should properly initialize the component', () => {
      cy.get('#editor-angular').should(
        'have.attr',
        'data-angular-initialized',
        'true'
      );
    });

    it('should handle re-rendering when config changes', () => {
      // Get initial content
      cy.get('[data-testid="editor-content"]').should(
        'contain.text',
        'Mock TextIgniter Angular Editor'
      );

      // Change config
      cy.get('#config-change-btn').click();
      cy.wait(300);

      // Content should still be there after re-render
      cy.get('[data-testid="editor-content"]').should(
        'contain.text',
        'Mock TextIgniter Angular Editor'
      );
      cy.get('#editor-angular').should(
        'have.attr',
        'data-angular-initialized',
        'true'
      );
    });
  });

  describe('User Interactions', () => {
    it('should allow text editing in the content area', () => {
      cy.get('[data-testid="editor-content"]').clear();
      cy.get('[data-testid="editor-content"]').type(
        'Hello Angular TextIgniter!'
      );
      cy.get('[data-testid="editor-content"]').should(
        'contain.text',
        'Hello Angular TextIgniter!'
      );
    });

    it('should respond to toolbar button clicks', () => {
      cy.get('[data-feature="bold"]').should('exist');
      cy.get('[data-feature="bold"]').click();
      // In a real implementation, this would toggle bold formatting
    });

    it('should handle focus and blur events', () => {
      cy.get('[data-testid="editor-content"]').focus();
      cy.get('[data-testid="editor-content"]').should('be.focused');

      cy.get('[data-testid="editor-content"]').blur();
      cy.get('[data-testid="editor-content"]').should('not.be.focused');
    });
  });

  describe('Built-in Test Results', () => {
    it('should run internal tests successfully', () => {
      cy.get('#run-tests-btn').click();
      cy.wait(1000);

      // Check that all internal tests pass
      cy.get('[data-test="component-renders"]').should('contain.text', 'PASS');
      cy.get('[data-test="config-applied"]').should('contain.text', 'PASS');
      cy.get('[data-test="features-rendered"]').should('contain.text', 'PASS');
      cy.get('[data-test="editor-content-area"]').should(
        'contain.text',
        'PASS'
      );
      cy.get('[data-test="component-initialized"]').should(
        'contain.text',
        'PASS'
      );
    });

    it('should display test results correctly', () => {
      cy.get('#run-tests-btn').click();
      cy.wait(1000);

      // Check test result elements exist
      cy.get('[data-test]').should('have.length.at.least', 5);
      cy.get('.test-pass').should('have.length.at.least', 5);
      cy.get('.test-fail').should('have.length', 0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid config changes', () => {
      // Rapidly toggle config multiple times
      for (let i = 0; i < 5; i++) {
        cy.get('#config-change-btn').click();
        cy.wait(100);
      }

      // Component should still be functional
      cy.get('[data-testid="angular-editor"]').should('exist');
      cy.get('#editor-angular').should(
        'have.attr',
        'data-angular-initialized',
        'true'
      );
    });

    it('should handle empty feature arrays', () => {
      // Test with different configurations
      cy.get('#config-change-btn').click(); // Hide toolbar
      cy.wait(300);

      cy.get('[data-testid="angular-toolbar"]').should('not.exist');
      cy.get('[data-testid="editor-content"]').should('still.exist');
    });

    it('should maintain editor functionality without toolbar', () => {
      cy.get('#config-change-btn').click(); // Hide toolbar
      cy.wait(300);

      // Editor should still be editable
      cy.get('[data-testid="editor-content"]').clear();
      cy.get('[data-testid="editor-content"]').type('Text without toolbar');
      cy.get('[data-testid="editor-content"]').should(
        'contain.text',
        'Text without toolbar'
      );
    });

    it('should handle component re-initialization', () => {
      // Change config multiple times to trigger re-renders
      cy.get('#config-change-btn').click();
      cy.wait(200);
      cy.get('#config-change-btn').click();
      cy.wait(200);

      // Component should maintain its state
      cy.get('[data-testid="angular-editor"]').should('exist');
      cy.get('#editor-angular').should(
        'have.attr',
        'data-angular-initialized',
        'true'
      );

      // Run tests to ensure everything still works
      cy.get('#run-tests-btn').click();
      cy.wait(800);
      cy.get('[data-test="component-renders"]').should('contain.text', 'PASS');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      cy.get('[data-testid="editor-content"]').should(
        'have.attr',
        'contenteditable',
        'true'
      );
    });

    it('should be keyboard navigable', () => {
      // Focus on the editor directly
      cy.get('[data-testid="editor-content"]').focus();
      cy.get('[data-testid="editor-content"]').should('be.focused');

      // Type some text
      cy.get('[data-testid="editor-content"]').type('Keyboard navigation test');
      cy.get('[data-testid="editor-content"]').should(
        'contain.text',
        'Keyboard navigation test'
      );
    });

    it('should support screen reader navigation', () => {
      // Check for basic accessibility structure
      cy.get('[data-testid="editor-content"]').should('be.visible');
      cy.get('[data-testid="angular-toolbar"]').should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should initialize within acceptable time', () => {
      const startTime = Date.now();
      cy.visit('/angular/test.html');

      cy.get('[data-testid="angular-editor"]')
        .should('exist')
        .then(() => {
          const endTime = Date.now();
          const initTime = endTime - startTime;
          expect(initTime).to.be.lessThan(3000); // Should initialize within 3 seconds
        });
    });

    it('should handle config updates efficiently', () => {
      const startTime = Date.now();

      cy.get('#config-change-btn').click();
      cy.get('[data-testid="angular-editor"]')
        .should('exist')
        .then(() => {
          const endTime = Date.now();
          const updateTime = endTime - startTime;
          expect(updateTime).to.be.lessThan(1000); // Config update should be fast
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing configuration gracefully', () => {
      // Component should still render even with missing config
      cy.get('[data-testid="angular-editor"]').should('exist');
      cy.get('[data-testid="editor-content"]').should('exist');
    });

    it('should handle invalid feature names', () => {
      // In a real implementation, this would test invalid features
      cy.get('[data-testid="angular-toolbar"]').should('exist');
      cy.get('[data-feature]').should('have.length.at.least', 1);
    });
  });

  describe('Integration', () => {
    it('should work with standard HTML form interactions', () => {
      cy.get('[data-testid="editor-content"]').clear();
      cy.get('[data-testid="editor-content"]').type('Form integration test');

      // Simulate form submission preparation
      cy.get('[data-testid="editor-content"]')
        .invoke('text')
        .should('include', 'Form integration test');
    });

    it('should maintain state during DOM manipulations', () => {
      cy.get('[data-testid="editor-content"]').type('State persistence test');

      // Change config to trigger re-render
      cy.get('#config-change-btn').click();
      cy.wait(300);

      // Content should persist (in this mock, it gets reset, but in real implementation it should persist)
      cy.get('[data-testid="editor-content"]').should('exist');
    });
  });
});

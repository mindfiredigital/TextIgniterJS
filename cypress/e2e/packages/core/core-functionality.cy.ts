/// <reference types="cypress" />

describe('TextIgniter Core Library E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/core/index.html');
    cy.wait(2000); // Allow time for TextIgniter core to initialize
  });

  describe('Core Initialization', () => {
    it('should initialize TextIgniter core library', () => {
      cy.get('#editor-container').should('exist');
      cy.get('#editor-container .editor').should('exist');
    });

    it('should create toolbar with configured features', () => {
      cy.get('#editor-container .toolbar').should('exist');

      // Check for bold, italic, underline buttons
      cy.get('#bold').should('exist');
      cy.get('#italic').should('exist');
      cy.get('#underline').should('exist');
      cy.get('#hyperlink').should('exist');
    });

    it('should create editable content area', () => {
      cy.get('#editor-container .editor[contenteditable="true"]').should(
        'exist'
      );
    });

    it('should have proper document structure', () => {
      cy.get('#editor-container').within(() => {
        cy.get('.toolbar').should('exist');
        cy.get('.editor').should('exist');
      });
    });
  });

  describe('Text Input and Editing', () => {
    it('should allow text input in the editor', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]')
        .first()
        .type('Hello TextIgniter Core!');
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Hello TextIgniter Core!');
    });

    it('should handle multiple lines of text', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]')
        .first()
        .type('Line 1{enter}Line 2{enter}Line 3');

      // Check for multiple blocks
      cy.get('[data-id]').should('have.length.at.least', 3);
    });

    it('should handle special characters', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]')
        .first()
        .type('Special chars: @#$%^&*()');
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Special chars: @#$%^&*()');
    });

    it('should handle backspace and delete operations', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Test text for deletion');

      // Use backspace
      cy.get('[contenteditable="true"]')
        .first()
        .type('{backspace}{backspace}{backspace}{backspace}');
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Test text for del');

      // Use delete key (position cursor and delete forward)
      cy.get('[contenteditable="true"]')
        .first()
        .type('{leftarrow}{leftarrow}{leftarrow}{del}');
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Test text for el');
    });
  });

  describe('Text Formatting Features', () => {
    beforeEach(() => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Format this text');
    });

    it('should apply bold formatting', () => {
      // Select all text
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');

      // Click bold button
      cy.get('#bold').click();

      // Check if bold formatting is applied
      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*')
            .should('have.css', 'font-weight')
            .and('match', /bold|700/);
        });
    });

    it('should apply italic formatting', () => {
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');
      cy.get('#italic').click();

      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*').should('have.css', 'font-style', 'italic');
        });
    });

    it('should apply underline formatting', () => {
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');
      cy.get('#underline').click();

      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*')
            .should('have.css', 'text-decoration')
            .and('include', 'underline');
        });
    });

    it('should handle multiple formatting combinations', () => {
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');

      // Apply bold and italic
      cy.get('#bold').click();
      cy.get('#italic').click();

      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*')
            .should('have.css', 'font-weight')
            .and('match', /bold|700/);
          cy.get('*').should('have.css', 'font-style', 'italic');
        });
    });
  });

  describe('Font Family and Size', () => {
    beforeEach(() => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Font test text');
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');
    });

    it('should change font family', () => {
      cy.get('#fontFamily').should('exist');
      cy.get('#fontFamily').select('Georgia');

      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*')
            .should('have.css', 'font-family')
            .and('include', 'Georgia');
        });
    });

    it('should change font size', () => {
      cy.get('#fontSize').should('exist');
      cy.get('#fontSize').select('18px');

      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*').should('have.css', 'font-size', '18px');
        });
    });
  });

  describe('Text Alignment', () => {
    beforeEach(() => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Alignment test text');
    });

    it('should align text to center', () => {
      cy.get('#alignCenter').click();
      cy.get('[data-id]').first().should('have.css', 'text-align', 'center');
    });

    it('should align text to right', () => {
      cy.get('#alignRight').click();
      cy.get('[data-id]').first().should('have.css', 'text-align', 'right');
    });

    it('should align text to left', () => {
      cy.get('#alignLeft').click();
      cy.get('[data-id]').first().should('have.css', 'text-align', 'left');
    });
  });

  describe('Lists Functionality', () => {
    beforeEach(() => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]')
        .first()
        .type('List item 1{enter}List item 2{enter}List item 3');
    });

    it('should create ordered list', () => {
      // Select all blocks by clicking the first data-id element
      cy.get('[data-id]').first().click();
      cy.get('#orderedList').click();

      // Check if ordered list is created
      cy.get('[data-id]').first().should('contain.text', '1.');
    });

    it('should create unordered list', () => {
      cy.get('[data-id]').first().click();
      cy.get('#unorderedList').click();

      // Check if unordered list is created
      cy.get('[data-id]').first().should('contain.text', '•');
    });

    it('should toggle list formatting', () => {
      // Create ordered list
      cy.get('[data-id]').first().click();
      cy.get('#orderedList').click();

      // Toggle off
      cy.get('#orderedList').click();

      // Should no longer be a list
      cy.get('[data-id]').first().should('not.have.attr', 'data-list-type');
    });
  });

  describe('Color Formatting', () => {
    beforeEach(() => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Color test text');
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');
    });

    it('should change font color', () => {
      cy.get('#fontColor').click();

      // Wait for color picker to appear
      cy.get('#fontColorPicker').should('be.visible');

      // Set color value
      cy.get('#fontColorPicker').invoke('val', '#ff0000').trigger('input');

      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*').should('have.css', 'color', 'rgb(255, 0, 0)');
        });
    });

    it('should change background color', () => {
      cy.get('#bgColor').click();

      cy.get('#bgColorPicker').should('be.visible');
      cy.get('#bgColorPicker').invoke('val', '#ffff00').trigger('input');

      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*').should(
            'have.css',
            'background-color',
            'rgb(255, 255, 0)'
          );
        });
    });
  });

  describe('Hyperlink Functionality', () => {
    beforeEach(() => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Link text');
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');
    });

    it('should create hyperlink', () => {
      cy.get('#hyperlink').click();

      // Handle the hyperlink dialog/popup
      cy.get('body').then($body => {
        if ($body.find('.hyperlink-popup').length > 0) {
          cy.get('.hyperlink-popup input[type="url"]').type(
            'https://example.com'
          );
          cy.get('.hyperlink-popup button').contains('Add').click();
        }
      });

      // Check if link is created
      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('a').should('exist');
          cy.get('a').should('have.attr', 'href').and('include', 'example.com');
        });
    });
  });

  describe('Undo/Redo Operations', () => {
    it('should support undo operations', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Original text');

      // Make a change
      cy.get('[contenteditable="true"]').first().type(' Modified');
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Original text Modified');

      // Undo with Ctrl+Z
      cy.get('[contenteditable="true"]').first().type('{ctrl+z}');
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Original text');
    });

    it('should support redo operations', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Test text');
      cy.get('[contenteditable="true"]').first().type(' Addition');

      // Undo
      cy.get('[contenteditable="true"]').first().type('{ctrl+z}');
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Test text');

      // Redo with Ctrl+Y
      cy.get('[contenteditable="true"]').first().type('{ctrl+y}');
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Test text Addition');
    });
  });

  describe('Image Insertion', () => {
    it('should handle image insertion', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('#image').click();

      // Handle image dialog/file input
      cy.get('body').then($body => {
        if ($body.find('input[type="file"]').length > 0) {
          // Simulate image insertion (this would normally require actual file handling)
          cy.log('Image insertion dialog opened');
        }
      });
    });
  });

  describe('HTML Content Operations', () => {
    it('should generate HTML content', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Test HTML content');

      cy.get('#getHtmlButton').click();

      // Check console or clipboard for HTML output
      cy.window().then(win => {
        // The HTML should be copied to clipboard or logged
        cy.log('HTML content generated');
      });
    });

    it('should load HTML content', () => {
      cy.get('#loadHtmlButton').click();

      // Should load test HTML content
      cy.get('[contenteditable="true"]').first().should('not.be.empty');
    });
  });

  describe('Keyboard Shortcuts', () => {
    beforeEach(() => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Keyboard shortcut test');
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');
    });

    it('should support Ctrl+B for bold', () => {
      cy.get('[contenteditable="true"]').first().type('{ctrl+b}');
      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*')
            .should('have.css', 'font-weight')
            .and('match', /bold|700/);
        });
    });

    it('should support Ctrl+I for italic', () => {
      cy.get('[contenteditable="true"]').first().type('{ctrl+i}');
      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*').should('have.css', 'font-style', 'italic');
        });
    });

    it('should support Ctrl+U for underline', () => {
      cy.get('[contenteditable="true"]').first().type('{ctrl+u}');
      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*')
            .should('have.css', 'text-decoration')
            .and('include', 'underline');
        });
    });

    it('should support Ctrl+A for select all', () => {
      cy.get('[contenteditable="true"]')
        .first()
        .type('More text{enter}Another line');
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');

      // All text should be selected
      cy.window().then(win => {
        const selection = win.getSelection();
        expect(selection?.toString()).to.include('Keyboard shortcut test');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty editor state', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();

      // Should still be functional
      cy.get('#bold').click();
      cy.get('[contenteditable="true"]').first().type('Bold text');

      cy.get('[contenteditable="true"]')
        .first()
        .within(() => {
          cy.get('*')
            .should('have.css', 'font-weight')
            .and('match', /bold|700/);
        });
    });

    it('should handle rapid typing', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();

      // Type rapidly
      const rapidText =
        'This is rapid typing test with multiple words and sentences.';
      cy.get('[contenteditable="true"]').first().type(rapidText, { delay: 10 });
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', rapidText);
    });

    it('should handle mixed content operations', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Mixed content: ');

      // Apply formatting
      cy.get('[contenteditable="true"]').first().type('bold ');
      cy.get('[contenteditable="true"]')
        .first()
        .then($el => {
          const el = $el[0];
          const range = document.createRange();
          range.selectNodeContents(el);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        });
      cy.get('#bold').click();

      // Add more content
      cy.get('[contenteditable="true"]').first().type('{rightarrow}and italic');
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');
      cy.get('#italic').click();

      // Should handle mixed formatting
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Mixed content: bold and italic');
    });

    it('should maintain editor state after multiple operations', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();

      // Perform multiple operations
      cy.get('[contenteditable="true"]')
        .first()
        .type('Line 1{enter}Line 2{enter}Line 3');
      cy.get('#alignCenter').click();
      cy.get('[data-id]').first().click();
      cy.get('#bold').click();
      cy.get('#orderedList').click();

      // Editor should still be functional
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'Line 1');
      cy.get('[data-id]').should('have.length.at.least', 3);
    });
  });

  describe('Performance and Responsiveness', () => {
    it('should handle large text input efficiently', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();

      const largeText = 'This is a large text block. '.repeat(100);
      cy.get('[contenteditable="true"]').first().type(largeText, { delay: 0 });
      cy.get('[contenteditable="true"]')
        .first()
        .should('contain.text', 'This is a large text block.');
    });

    it('should respond quickly to formatting changes', () => {
      cy.get('[contenteditable="true"]').first().focus();
      cy.get('[contenteditable="true"]').first().clear();
      cy.get('[contenteditable="true"]').first().type('Performance test text');
      cy.get('[contenteditable="true"]').first().type('{ctrl+a}');

      const startTime = Date.now();

      cy.get('#bold')
        .click()
        .then(() => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          expect(responseTime).to.be.lessThan(500); // Should respond within 500ms
        });
    });
  });
});

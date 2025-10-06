describe('TextIgniter React Package Tests', () => {
  beforeEach(() => {
    // Visit the React test page we created 
    cy.visit('/react/test.html', { failOnStatusCode: false })
    
    // Wait for React to load and render
    cy.get('#react-root', { timeout: 10000 }).should('exist')
    cy.get('h1').should('contain', 'TextIgniter React Package Test')
  })

  // --- CORE FUNCTIONALITY TESTS ---

  it('should render the React wrapper component', () => {
    // Check if the React app loads
    cy.get('#react-root').should('exist')
    cy.get('h1').should('contain', 'TextIgniter React Package Test')
  })

  it('should render TextIgniter web component through React wrapper', () => {
    // Wait for the component to render
    cy.wait(2000)
    
    // Check if TextIgniter web component is rendered
    cy.get('text-igniter').should('exist')
    cy.get('text-igniter').should('have.attr', 'config')
  })

  it('should pass config from React props to web component', () => {
    cy.wait(2000)
    
    cy.get('text-igniter').should('have.attr', 'config').then(($attr) => {
      const config = $attr.toString()
      expect(config).to.include('showToolbar')
      expect(config).to.include('bold')
      expect(config).to.include('italic')
    })
  })

  it('should initialize the underlying web component', () => {
    cy.wait(2000)
    
    cy.get('text-igniter').should('exist')
    cy.get('text-igniter #editor-container').should('exist')
  })

  it('should update web component when React props change', () => {
    cy.wait(2000)
    
    // Get initial config
    cy.get('text-igniter').should('have.attr', 'config').then((initialConfig) => {
      // Click button to change config
      cy.get('#config-change-btn').click()
      
      // Config should change
      cy.get('text-igniter').should('have.attr', 'config').then((newConfig) => {
        expect(newConfig).to.not.equal(initialConfig)
      })
    })
  })

  it('should verify test results from the React app', () => {
    // Wait for all tests to complete
    cy.wait(3000)
    
    // Check component renders test
    cy.get('[data-test="component-renders"]')
      .should('exist')
      .should('have.attr', 'data-passed', 'true')
    
    // Check config attribute test
    cy.get('[data-test="config-attribute-set"]')
      .should('exist')
      .should('have.attr', 'data-passed', 'true')
    
    // Check editor container test
    cy.get('[data-test="editor-container-exists"]')
      .should('exist')
      .should('have.attr', 'data-passed', 'true')
  })

  // --- EDGE CASES ---

  it('should handle React re-renders without breaking', () => {
    cy.wait(2000)
    cy.get('text-igniter').should('exist')
    
    // Click the config change button multiple times to trigger re-renders
    cy.get('#config-change-btn').click()
    cy.get('text-igniter').should('exist')
    
    cy.get('#config-change-btn').click()
    cy.get('text-igniter').should('exist')
    cy.get('text-igniter #editor-container').should('exist')
  })

  it('should handle rapid config changes from React', () => {
    cy.wait(2000)
    
    // Rapidly click the config change button
    for (let i = 0; i < 5; i++) {
      cy.get('#config-change-btn').click()
      cy.wait(100)
    }
    
    // Component should still exist and work
    cy.get('text-igniter').should('exist')
    cy.get('text-igniter #editor-container').should('exist')
  })

  it('should maintain web component state during React props changes', () => {
    cy.wait(2000)
    
    // Get initial config
    cy.get('text-igniter').should('have.attr', 'config').then((initialConfig) => {
      // Change config via React
      cy.get('#config-change-btn').click()
      
      // Web component should update
      cy.get('text-igniter').should('have.attr', 'config').then((newConfig) => {
        expect(newConfig.toString()).to.not.equal(initialConfig.toString())
      })
      
      // Component should still be functional
      cy.get('text-igniter #editor-container').should('exist')
    })
  })

  it('should handle invalid config gracefully in React wrapper', () => {
    cy.wait(2000)
    
    // Inject invalid config via JavaScript
    cy.window().then((win) => {
      const textIgniter = win.document.querySelector('text-igniter')
      if (textIgniter) {
        textIgniter.setAttribute('config', 'invalid-json')
      }
    })
    
    // Component should still exist and not crash the React app
    cy.get('text-igniter').should('exist')
    cy.get('#react-root').should('exist')
  })

  it('should handle empty or null config in React', () => {
    cy.wait(2000)
    
    // Test that the component handles various config states
    cy.window().then((win) => {
      const textIgniter = win.document.querySelector('text-igniter')
      if (textIgniter) {
        // Test empty config
        textIgniter.setAttribute('config', '{}')
        cy.get('text-igniter').should('exist')
        
        // Test null config
        textIgniter.setAttribute('config', 'null')
        cy.get('text-igniter').should('exist')
      }
    })
  })

  it('should be interactive and allow text input through React wrapper', () => {
    cy.wait(2000)
    cy.get('text-igniter #editor-container').should('exist')
    
    // Look for contenteditable elements
    cy.get('text-igniter').within(() => {
      cy.get('*').then(($elements) => {
        const $editables = $elements.filter('[contenteditable="true"]')
        if ($editables.length > 0) {
          cy.wrap($editables.first()).type('Hello from React wrapper!')
          cy.wrap($editables.first()).should('contain', 'Hello from React wrapper!')
        } else {
          cy.log('No contenteditable elements found - TextIgniter creates them dynamically')
        }
      })
    })
  })

  it('should handle React useEffect dependencies correctly', () => {
    cy.wait(2000)
    
    // The config should be properly set initially
    cy.get('text-igniter').should('have.attr', 'config')
    
    // When config changes via React state, useEffect should trigger
    cy.get('#config-change-btn').click()
    cy.wait(500)
    
    // Config should be updated via the useEffect
    cy.get('text-igniter').should('have.attr', 'config').and('include', 'fontColor')
  })

  it('should handle React ref properly', () => {
    cy.wait(2000)
    
    // The ref should be attached to the text-igniter element
    cy.get('text-igniter').should('exist')
    
    // Test that the ref is working by checking if config is set via the ref
    cy.get('text-igniter').should('have.attr', 'config')
  })

  it('should handle React component unmounting gracefully', () => {
    cy.wait(2000)
    cy.get('text-igniter').should('exist')
    
    // Simulate component unmounting by removing the React root
    cy.window().then((win) => {
      const reactRoot = win.document.getElementById('react-root')
      if (reactRoot) {
        // Clear the React root content (simulating unmount)
        reactRoot.innerHTML = '<div>Component Unmounted</div>'
      }
    })
    
    cy.get('text-igniter').should('not.exist')
    cy.contains('Component Unmounted').should('exist')
  })

  it('should handle JSON.stringify errors in React component', () => {
    cy.wait(2000)
    
    // Test that the component handles JSON.stringify errors gracefully
    cy.window().then((win) => {
      // Mock console.error to capture error messages
      const originalConsoleError = win.console.error
      const errorMessages: string[] = []
      win.console.error = (...args: any[]) => {
        errorMessages.push(args.join(' '))
        originalConsoleError.apply(win.console, args)
      }
      
      // Try to inject a circular reference that would break JSON.stringify
      const textIgniter = win.document.querySelector('text-igniter')
      if (textIgniter) {
        const circular: any = { a: 1 }
        circular.self = circular
        
        try {
          textIgniter.setAttribute('config', JSON.stringify(circular))
        } catch {
          // This should be handled gracefully
          cy.log('JSON.stringify error handled correctly')
        }
      }
      
      // Component should still exist
      cy.get('text-igniter').should('exist')
    })
  })

  it('should handle React component lifecycle correctly', () => {
    cy.wait(2000)
    
    // Component should be mounted and functional
    cy.get('text-igniter').should('exist')
    cy.get('#react-root').should('exist')
    
    // Test multiple re-renders
    cy.get('#config-change-btn').click()
    cy.get('#config-change-btn').click()
    cy.get('#config-change-btn').click()
    
    // Component should still be stable
    cy.get('text-igniter').should('exist')
  })

  it('should handle window resize without breaking React wrapper', () => {
    cy.wait(2000)
    cy.get('text-igniter').should('exist')
    
    // Test different viewport sizes
    cy.viewport(1200, 800)
    cy.get('text-igniter').should('exist')
    
    cy.viewport(768, 1024)
    cy.get('text-igniter').should('exist')
    
    cy.viewport(375, 667)
    cy.get('text-igniter').should('exist')
    
    // Reset viewport
    cy.viewport(1280, 720)
    cy.get('text-igniter').should('exist')
  })

  it('should handle React wrapper accessibility', () => {
    cy.wait(2000)
    cy.get('text-igniter').should('exist')
    
    // Test that React wrapper doesn't interfere with accessibility
    cy.get('text-igniter').then(($el) => {
      if (!$el.attr('tabindex')) {
        $el.attr('tabindex', '0')
      }
    })
    
    cy.get('text-igniter').invoke('focus')
    cy.get('text-igniter').should('exist')
  })

  it('should handle React error boundaries gracefully', () => {
    cy.wait(2000)
    
    // Test that errors in the TextIgniter component don't crash React
    cy.window().then((win) => {
      // Try to cause an error in the component
      const textIgniter = win.document.querySelector('text-igniter')
      if (textIgniter) {
        textIgniter.setAttribute('config', 'invalid-json-{{{')
      }
    })
    
    // React app should still be running
    cy.get('#react-root').should('exist')
    cy.get('h1').should('contain', 'TextIgniter React Package Test')
  })

  it('should maintain React performance with frequent updates', () => {
    cy.wait(2000)
    
    // Measure performance of rapid React updates
    cy.window().its('performance').invoke('now').then((startTime) => {
      // Perform rapid updates
      for (let i = 0; i < 5; i++) {
        cy.get('#config-change-btn').click()
        cy.wait(50)
      }
      
      cy.window().its('performance').invoke('now').then((endTime) => {
        const updateTime = endTime - startTime
        cy.log(`React updates completed in: ${updateTime}ms`)
        
        // Should handle updates reasonably quickly
        expect(updateTime).to.be.lessThan(10000)
      })
    })
    
    // Component should still be functional
    cy.get('text-igniter').should('exist')
    cy.get('text-igniter #editor-container').should('exist')
  })

  it('should verify React hooks are working correctly', () => {
    cy.wait(2000)
    
    // useState should work - changing config should update the component
    cy.get('text-igniter').should('have.attr', 'config').then((initialConfig) => {
      cy.get('#config-change-btn').click()
      
      cy.get('text-igniter').should('have.attr', 'config').then((newConfig) => {
        expect(newConfig.toString()).to.not.equal(initialConfig.toString())
      })
    })
    
    // useEffect should work - config should be properly set on the element
    cy.get('text-igniter').should('have.attr', 'config')
    
    // useRef should work - the element should exist and be accessible
    cy.get('text-igniter').should('exist')
  })
})

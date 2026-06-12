import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import "@mindfiredigital/textigniter/dist/styles/text-igniter.css";
import './style.css';

const HomePage = () => {
  const { siteConfig } = useDocusaurusContext();

  const config = {
    showToolbar: true,
    height: "280px",
    placeholder: "Start typing here... try bold, italic, or custom lists!",
    features: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "hyperlink",
      "fontFamily",
      "fontSize",
      "alignLeft",
      "alignCenter",
      "alignRight",
      "unorderedList",
      "orderedList",
      "image",
      "fontColor",
      "bgColor",
      "emoji",
      "heading"
    ],
  };

  const initialValue = `
    <h2>Modern WYSIWYG Editing</h2>
    <p>TextIgniter is a modern, lightweight HTML editor built with pure TypeScript. Create documents, templates, and rich content with a sleek, responsive interface.</p>
  `.trim();

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      noFooter={true} // Custom premium footer
      description="TextIgniter - A lightweight, powerful, and intuitive HTML editor built using TypeScript."
    >
      <div className="modern-saas-theme">
        
        {/* Ambient Glows */}
        <div className="glow-orb top-left"></div>
        <div className="glow-orb top-right"></div>
        <div className="glow-orb center-glow"></div>

        {/* Announcement Glass Pill */}
        <div className="announcement-wrapper">
          <div className="announcement-pill">
            <span className="pill-badge">NEW</span>
            <span className="pill-text">TextIgniter v1.3.2 is now live</span>
            <Link to="/docs/installation" className="pill-link">
              Read Docs &rarr;
            </Link>
          </div>
        </div>

        {/* Hero Area */}
        <header className="saas-hero">
          <h1 className="saas-hero-title">
            The rich text editor for <br />
            <span className="gradient-text">modern web applications.</span>
          </h1>
          <p className="saas-hero-subtitle">
            A lightweight, zero-dependency rich text editor built for speed, safety, and modularity. Integrates seamlessly with all modern front-end frameworks.
          </p>
          
          <div className="saas-hero-actions">
            <Link to="/docs/installation" className="action-btn btn-glow-red">
              Get Started Free
            </Link>
            <a href="https://github.com/mindfiredigital/textigniter" className="action-btn btn-outline-github" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Star on GitHub
            </a>
          </div>
        </header>

        {/* Floating SaaS Browser Window Preview */}
        <section className="showcase-section">
          <div className="preview-window">
            <div className="window-header">
              <div className="window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="window-address">editor.textigniter.com</div>
            </div>
            <div className="window-editor-body">
              <BrowserOnly fallback={<div className="editor-loading">Initializing editor components...</div>}>
                {() => {
                  // Run runtime custom element spec-compliance patch
                  if (typeof window !== 'undefined' && !window.__textIgniterPatched) {
                    window.__textIgniterPatched = true;
                    
                    const originalDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'firstElementChild');
                    let isConstructing = false;

                    Object.defineProperty(Element.prototype, 'firstElementChild', {
                      get() {
                        if (isConstructing) {
                          return {}; // Truthy dummy to prevent constructor children appending
                        }
                        return originalDescriptor ? originalDescriptor.get.call(this) : this.firstElementChild;
                      },
                      configurable: true,
                    });

                    const originalDefine = window.customElements.define;
                    window.customElements.define = function (name, constructor, options) {
                      if (name === 'text-igniter') {
                        const OriginalClass = constructor;
                        class PatchedClass extends OriginalClass {
                          constructor() {
                            isConstructing = true;
                            super();
                            isConstructing = false;
                          }
                          connectedCallback() {
                            setTimeout(() => {
                              if (!this.isConnected) return;

                              // Clean up any conflicting global IDs in the document from previous/other instances
                              if (typeof document !== 'undefined') {
                                document.querySelectorAll('#editor-container, #editor, #toolbar, #popup-toolbar').forEach(el => {
                                  if (!this.contains(el)) {
                                    el.remove();
                                  }
                                });
                              }

                              if (!this.querySelector('#editor-container')) {
                                const div = document.createElement('div');
                                div.id = 'editor-container';
                                this.appendChild(div);
                              }
                              if (super.connectedCallback) {
                                super.connectedCallback();
                              }
                            }, 50);
                          }
                          disconnectedCallback() {
                            this.innerHTML = '';
                            this.initialized = false;
                            if (super.disconnectedCallback) {
                              super.disconnectedCallback();
                            }
                          }
                        }
                        return originalDefine.call(this, name, PatchedClass, options);
                      }
                      return originalDefine.call(this, name, constructor, options);
                    };
                  }

                  const { Textigniter } = require("@mindfiredigital/textigniter-react");
                  return (
                    <Textigniter 
                      config={config} 
                      initialValue={initialValue}
                    />
                  );
                }}
              </BrowserOnly>
            </div>
          </div>
        </section>

        {/* Integration / Framework Section */}
        <section className="integrations-section">
          <div className="section-meta">INTEGRATES WITH ANY STACK</div>
          <div className="ti-integrations-grid">
            
            <div className="ti-integration-card">
              <div className="framework-icon-wrapper js-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M3 3h18v18H3V3zm12.5 12.5c0 .65-.55 1.2-1.2 1.2h-3.1c-.65 0-1.2-.55-1.2-1.2V11c0-.65.55-1.2 1.2-1.2h3.1c.65 0 1.2.55 1.2 1.2v4.5zm-5.5 0c0 .65-.55 1.2-1.2 1.2H5.7c-.65 0-1.2-.55-1.2-1.2v-1.5c0-.65.55-1.2 1.2-1.2h3.1v-1.5H5.7v-1.5h3.1c.65 0 1.2.55 1.2 1.2v4.5z" />
                </svg>
              </div>
              <h4>JavaScript</h4>
              <p>Direct bundle import with vanilla ES modules.</p>
            </div>

            <div className="ti-integration-card">
              <div className="framework-icon-wrapper react-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
                </svg>
              </div>
              <h4>React</h4>
              <p>Highly reactive props wrapper with hooks support.</p>
            </div>

            <div className="ti-integration-card">
              <div className="framework-icon-wrapper angular-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M12 2L2 5.5l1.5 13L12 22l8.5-3.5 1.5-13L12 2zM12 4.5l6.5 2.5-1 11.5L12 20.5l-5.5-2L5.5 7 12 4.5zm-1.5 3L6 14.5h2.5l1-2.5h4l1 2.5h2.5L13.5 7.5h-3zm1.5 2l1.2 3H10.8l1.2-3z" />
                </svg>
              </div>
              <h4>Angular</h4>
              <p>Fully typed module with native Angular bindings.</p>
            </div>

            <div className="ti-integration-card">
              <div className="framework-icon-wrapper wc-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                  <path d="M12 22.08V12" />
                </svg>
              </div>
              <h4>Web Component</h4>
              <p>Standard custom element running natively in any browser.</p>
            </div>

          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="features-showcase">
          <div className="section-header">
            <h2>Built for modern product teams</h2>
            <p>Every feature optimized for file size, security, and developer control.</p>
          </div>

          <div className="ti-features-grid">
            
            <div className="ti-feature-card">
              <div className="card-glow"></div>
              <h3>🚀 Under 50KB Bundle</h3>
              <p>Ensure instant page loads and 100/100 Lighthouse performance scores. Perfect for lightweight applications.</p>
            </div>

            <div className="ti-feature-card">
              <div className="card-glow"></div>
              <h3>🛡️ Zero Dependencies</h3>
              <p>Written in pure TypeScript with standard browser Web APIs. Say goodbye to third-party vulnerability audits.</p>
            </div>

            <div className="ti-feature-card">
              <div className="card-glow"></div>
              <h3>🎨 Unlimited CSS Customization</h3>
              <p>No complex theme engines. Fully configure and style the toolbar, editor, and popups using vanilla CSS rules.</p>
            </div>

            <div className="ti-feature-card">
              <div className="card-glow"></div>
              <h3>🧠 Powerful Extensions</h3>
              <p>Comes with table editors, grid layout presets, custom emoji drawers, text-to-speech, and LaTeX math builders.</p>
            </div>

          </div>
        </section>

        {/* Premium Dark SaaS Footer */}
        <footer className="saas-footer">
          <div className="footer-wrap">
            <div className="footer-brand">TextIgniter</div>
            <h2 className="footer-title">Elevate your editing experience.</h2>
            <div className="footer-actions">
              <Link to="/docs/introduction" className="footer-btn-secondary">
                DOCUMENTATION
              </Link>
              <Link to="/docs/installation" className="footer-btn-primary">
                GET STARTED NOW
              </Link>
            </div>
            <p className="copyright-label">&copy; {new Date().getFullYear()} Mindfire Digital. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </Layout>
  );
};

export default HomePage;
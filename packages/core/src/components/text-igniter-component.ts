/* eslint-disable no-unused-vars */
import { TextIgniter } from '../TextIgniter'; // Import your existing editor class
// import { TextIgniter } from "../core/textIgniter";
class TextIgniterComponent extends HTMLElement {
  static observedAttributes = ['config'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this.render();
    setTimeout(() => this.initializeEditor(), 0);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'config' && oldValue !== newValue) {
      this.connectedCallback(); // Reinitialize on attribute change
    }
  }

  initializeEditor() {
    const configAttr = this.getAttribute('config');
    let config = {};

    try {
      config = JSON.parse(configAttr || '{}');
    } catch (error) {
      console.warn('Invalid JSON format for config attribute.');
    }

    const editorContainer = this.shadowRoot?.querySelector('#editor-container');
    if (!editorContainer) {
      console.error('Editor element not found inside the shadow DOM.');
      return;
    }

    new TextIgniter(editorContainer as any, config as any);
  }

  render() {
    this.shadowRoot!.innerHTML = `
        <link rel="stylesheet" href="dist/index.css">
        <div id="editor-container"></div>
      `;
  }
}

customElements.define('text-igniter', TextIgniterComponent);

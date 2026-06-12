import { TextIgniter } from '@mindfiredigital/textigniter';
import '@mindfiredigital/textigniter/dist/styles/text-igniter.css';

export class TextIgniterComponent extends HTMLElement {
  private textIgniter!: TextIgniter;
  private initialized = false;
  private config = {};
  private template = `<div id="editor-container"></div>`;
  private initialValue = '';

  constructor() {
    super();
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
  }

  get value() {
    if (this.textIgniter) {
      return this.textIgniter.getContent();
    }
    return this.initialValue;
  }

  set value(val: string) {
    this.initialValue = val;
    if (this.textIgniter) {
      if (this.textIgniter.getContent() !== val) {
        this.textIgniter.loadHtmlContent(val);
      }
    }
  }

  static get observedAttributes() {
    return ['config', 'value'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'config' && newValue !== oldValue) {
      try {
        console.log(newValue);
        const parsedConfig = JSON.parse(newValue);
        this.config = parsedConfig;
        this.initializeEditor(); // Reinitialize Core when config changes
      } catch (e) {
        console.error('Failed to parse config: ', e);
      }
    } else if (name === 'value' && newValue !== oldValue) {
      this.value = newValue;
    }
  }

  connectedCallback() {
    if (this.initialized) {
      return;
    }
    const attrValue = this.getAttribute('value');
    if (attrValue) {
      this.initialValue = attrValue;
    }
    this.initializeEditor();
  }

  private initializeEditor() {
    if (this.initialized) {
      return;
    }

    const editorContainer = this.querySelector('#editor-container')?.id;
    if (!editorContainer) {
      console.error('Editor element not found inside the DOM.');
      return;
    }

    try {
      this.initialized = true;
      this.textIgniter = new TextIgniter(
        editorContainer as any,
        this.config as any
      );

      if (this.initialValue) {
        this.textIgniter.loadHtmlContent(this.initialValue);
      }

      // Subscribe to content changes and dispatch custom event
      this.textIgniter.onContentChange(data => {
        const event = new CustomEvent('content-change', {
          detail: data,
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(event);
      });
    } catch (error) {
      console.error('Failed to initialize TextIgniter:', error);
      this.initialized = false;
    }
  }
}

if (!customElements.get('text-igniter')) {
  customElements.define('text-igniter', TextIgniterComponent);
}

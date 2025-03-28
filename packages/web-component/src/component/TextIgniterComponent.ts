import { TextIgniter } from "@mindfiredigital/textigniterjs/dist/TextIgniter.js";

export class TextIgniterComponent extends HTMLElement {
  private textIgniter!: TextIgniter;
  private initialized = false;
  private config = {};
  private template = `<div id="editor-container"></div>`;

  constructor() {
    super();
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
  }

  static get observedAttributes() {
    return ["config"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "config" && newValue !== oldValue) {
      try {
          console.log(newValue)
        const parsedConfig = JSON.parse(newValue);
        this.config = parsedConfig;
        this.initializeEditor(); // Reinitialize Core when config changes
      } catch (e) {
        console.error("Failed to parse config: ", e);
      }
    }
  }

  connectedCallback() {
    if (this.initialized) {
      return;
    }
    this.initializeEditor();
  }

  private initializeEditor() {
    if (this.initialized) {
      return;
    }

    const editorContainer = this.querySelector("#editor-container")?.id;
    if (!editorContainer) {
      console.error("Editor element not found inside the DOM.");
      return;
    }

    try {
      this.initialized = true;
      this.textIgniter = new TextIgniter(editorContainer as any, this.config as any);
    } catch (error) {
      console.error("Failed to initialize TextIgniter:", error);
      this.initialized = false;
    }
  }
}

if (!customElements.get("text-igniter")) {
  customElements.define("text-igniter", TextIgniterComponent);
}

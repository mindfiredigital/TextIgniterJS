// src/component/TextIgniterComponent.ts
import { TextIgniter } from "@mindfiredigital/textigniterjs/dist/TextIgniter.js";
var TextIgniterComponent = class extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
    this.config = {};
    this.template = `<div id="editor-container"></div>`;
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
  }
  static get observedAttributes() {
    return ["config"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "config" && newValue !== oldValue) {
      try {
        console.log(newValue);
        const parsedConfig = JSON.parse(newValue);
        this.config = parsedConfig;
        this.initializeEditor();
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
  initializeEditor() {
    var _a;
    if (this.initialized) {
      return;
    }
    const editorContainer = (_a = this.querySelector("#editor-container")) == null ? void 0 : _a.id;
    if (!editorContainer) {
      console.error("Editor element not found inside the DOM.");
      return;
    }
    try {
      this.initialized = true;
      this.textIgniter = new TextIgniter(editorContainer, this.config);
    } catch (error) {
      console.error("Failed to initialize TextIgniter:", error);
      this.initialized = false;
    }
  }
};
if (!customElements.get("text-igniter")) {
  customElements.define("text-igniter", TextIgniterComponent);
}
export {
  TextIgniterComponent
};
//# sourceMappingURL=index.js.map
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  TextIgniterComponent: () => TextIgniterComponent
});
module.exports = __toCommonJS(index_exports);

// src/component/TextIgniterComponent.ts
var import_TextIgniter = require("@mindfiredigital/textigniter/dist/TextIgniter.js");
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
      this.textIgniter = new import_TextIgniter.TextIgniter(editorContainer, this.config);
    } catch (error) {
      console.error("Failed to initialize TextIgniter:", error);
      this.initialized = false;
    }
  }
};
if (!customElements.get("text-igniter")) {
  customElements.define("text-igniter", TextIgniterComponent);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TextIgniterComponent
});
//# sourceMappingURL=index.cjs.map
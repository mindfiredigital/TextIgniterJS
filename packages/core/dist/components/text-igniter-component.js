var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TextIgniter } from "../TextIgniter"; // Import your existing editor class
// import { TextIgniter } from "../core/textIgniter";
class TextIgniterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            this.render();
            setTimeout(() => this.initializeEditor(), 0);
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "config" && oldValue !== newValue) {
            this.connectedCallback(); // Reinitialize on attribute change
        }
    }
    initializeEditor() {
        var _a;
        const configAttr = this.getAttribute("config");
        let config = {};
        try {
            config = JSON.parse(configAttr || "{}");
        }
        catch (error) {
            console.warn("Invalid JSON format for config attribute.");
        }
        const editorContainer = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#editor-container");
        if (!editorContainer) {
            console.error("Editor element not found inside the shadow DOM.");
            return;
        }
        new TextIgniter(editorContainer, config);
    }
    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="dist/index.css">
        <div id="editor-container"></div>
      `;
    }
}
TextIgniterComponent.observedAttributes = ["config"];
customElements.define("text-igniter", TextIgniterComponent);

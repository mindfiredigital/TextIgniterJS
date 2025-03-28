declare class TextIgniterComponent extends HTMLElement {
    private textIgniter;
    private initialized;
    private config;
    private template;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    connectedCallback(): void;
    private initializeEditor;
}

export { TextIgniterComponent };

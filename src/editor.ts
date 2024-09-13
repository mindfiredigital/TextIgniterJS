class RichTextEditor {
  private editorElement: HTMLElement;

  constructor(selector: string) {
    const element = document.querySelector(selector);
    if (!element)
      throw new Error(`Element with selector ${selector} not found.`);
    this.editorElement = element as HTMLElement;
    this.initializeEditor();
  }

  private initializeEditor() {
    this.editorElement.contentEditable = "true";
    this.editorElement.classList.add("rich-text-editor");
    this.attachEventListeners();
  }

  private attachEventListeners() {
    this.editorElement.addEventListener("input", () => {
      console.log("Editor content changed:", this.getContent());
    });
  }

  public getContent(): string {
    return this.editorElement.innerHTML;
  }

  public setContent(content: string) {
    this.editorElement.innerHTML = content;
  }
}

export default RichTextEditor;

interface EditorConfig {
  features: string[];
}

class RichTextEditor {
  private editor: HTMLDivElement;
  private config: EditorConfig;

  constructor(editorId: string, config: EditorConfig) {
    const editor = document.getElementById(editorId);
    if (!editor || !(editor instanceof HTMLDivElement)) {
      throw new Error("Editor element not found or incorrect element type.");
    }
    this.editor = editor;
    this.config = config;
    this.init();
    this.createToolbar();
  }

  private init() {
    this.editor.contentEditable = "true";
    this.editor.classList.add("rich-text-editor");
    this.editor.style.border = "1px solid #ccc";
    this.editor.style.minHeight = "200px";
    this.editor.style.padding = "10px";
  }

  private createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.classList.add("toolbar");
    this.config.features.forEach((feature) => {
      const button = document.createElement("button");
      button.innerText = feature.charAt(0).toUpperCase() + feature.slice(1);
      button.onclick = () => this.format(feature);
      toolbar.appendChild(button);
    });
    document.body.insertBefore(toolbar, this.editor);
  }

  public format(command: string) {
    try {
      const commands: { [key: string]: string } = {
        bold: "bold",
        italic: "italic",
        underline: "underline",
      };
      const execCommand = commands[command];
      if (execCommand) {
        if (document.queryCommandSupported(execCommand)) {
          const success = document.execCommand(execCommand, false, "");
          if (!success) {
            console.warn(`The command '${command}' could not be executed.`);
          }
        } else {
          console.warn(`The command '${command}' is not supported.`);
        }
      } else {
        console.warn(`The command '${command}' is not recognized.`);
      }
    } catch (error) {
      console.error(`Error executing command '${command}':`, error);
    }
  }

  public getHtml(): string {
    return this.editor.innerHTML;
  }

  public getJson(): object {
    return { content: this.editor.innerHTML };
  }
}

(window as any).RichTextEditor = RichTextEditor;

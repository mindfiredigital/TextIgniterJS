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
  
    const featureIcons: { [key: string]: string } = {
      bold: '<i title="Bold" class="fa fa-bold"></i>',
      italic: '<i title="Italic" class="fa fa-italic"></i>',
      underline: '<i title="Underline" class="fa fa-underline"></i>',
      subscript: '<i title="Subscript" class="fa fa-subscript"></i>',
      superscript: '<i title="Superscript" class="fa fa-superscript"></i>',
      left_align: '<i title="Left Align" class="fa fa-align-left"></i>',
      center_align: '<i title="Center Align" class="fa fa-align-center"></i>',
      right_align: '<i title="Right Align" class="fa fa-align-right"></i>',
      justify: '<i title="Justify" class="fa fa-align-justify"></i>',
      bullet_list: '<i title="Bullet List" class="fa fa-list-ul"></i>',
      numbered_list: '<i title="Numbered List" class="fa fa-list-ol"></i>',
      insert_table: '<i title="Insert Table" class="fa fa-table"></i>',
      insert_layout: '<i title="Insert Layout" class="fa fa-columns"></i>',
      heading: '<i title="Heading" class="fa fa-header"></i>',
      hyperlink: '<i title="Hyperlink" class="fa fa-link"></i>',
      image : '<i title="Image" class="fa fa-picture-o"></i>'
    };
  
    this.config.features.forEach((feature) => {
      const button = document.createElement("button");
      button.innerHTML = featureIcons[feature]; // Use the icon instead of text
      button.setAttribute('data-command', feature); // Set the data-command attribute
      button.onclick = () => this.format(feature);
      toolbar.appendChild(button);
    });
  
    document.body.insertBefore(toolbar, this.editor);
  }

  private updateButtonState(command: string) {
    const button = document.querySelector(`button[data-command='${command}']`);
    if (button) {
      if (document.queryCommandState(command)) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    }
  }

  public format(command: string) {
    try {
      const commands: { [key: string]: string } = {
        bold: "bold",
        italic: "italic",
        underline: "underline",
        subscript: "subscript",
        superscript: "superscript",
        left_align: "justifyLeft", 
        center_align: "justifyCenter",
        right_align: "justifyRight", 
        justify: "justifyFull",
        bullet_list: "insertUnorderedList",
        numbered_list: "insertOrderedList",
        insert_table: "insertTable",
        insert_layout: "insertLayout",
        heading: "formatBlock",
        hyperlink: "createLink",
        image: "insertImage"
      };
      const execCommand = commands[command];
      if (execCommand) {
        if (document.queryCommandSupported(execCommand)) {
          const success = document.execCommand(execCommand, false, "");
          // Update button states after formatting
          this.updateButtonState(execCommand);
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

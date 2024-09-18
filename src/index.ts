import {icons} from './assets/icons'
interface EditorConfig {
  features: string[];
}

interface NodeJson {
  type: string;
  attributes: { [key: string]: string };
  children: (NodeJson | string)[];
}

class RichTextEditor {
  private editor: HTMLDivElement;
  private config: EditorConfig;
  private container!: HTMLDivElement;

  constructor(editorId: string, config: EditorConfig) {
    const editor = document.getElementById(editorId);
    if (!editor || !(editor instanceof HTMLDivElement)) {
      throw new Error("Editor element not found or incorrect element type.");
    }
    this.editor = editor;
    this.config = config;
    this.createContainer();
    this.init();
    this.createToolbar();
    this.addKeyboardShortcuts();
  }

  private createContainer() {
    this.container = document.createElement("div");
    this.container.classList.add("text-igniter");
    this.editor.parentNode!.insertBefore(this.container, this.editor);
    this.container.appendChild(this.editor);
  }

  private init() {
    this.editor.contentEditable = "true";
    this.editor.classList.add("editor");
  }

  private createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.classList.add("toolbar");

    const featureIcons: { [key: string]: string } = {
      bold: icons.bold,
      italic: icons.italic,
      underline: icons.underline,
      subscript: icons.subscript,
      superscript: icons.superscript,
      left_align: icons.left_align,
      center_align: icons.center_align,
      right_align: icons.right_align,
      justify: icons.justify,
      bullet_list: icons.bullet_list,
      numbered_list: icons.numbered_list,
      insert_table: icons.insert_table,
      insert_layout: icons.insert_layout,
      heading: icons.heading,
      hyperlink: icons.hyperlink,
      image : icons.image
    };

    this.config.features.forEach((feature) => {
      const button = document.createElement("button");
      button.innerHTML = featureIcons[feature];
      button.setAttribute("data-command", feature);
      button.onclick = () => this.format(feature);
      toolbar.appendChild(button);
    });

    this.container.insertBefore(toolbar, this.editor);
  }

  private updateButtonState(command: string) {
    const button = this.container.querySelector(
      `button[data-command='${command}']`
    );
    if (button) {
      if (document.queryCommandState(command)) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    }
  }

  private addKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        this.format("bold");
      } else if (e.ctrlKey && e.key === "i") {
        e.preventDefault();
        this.format("italic");
      } else if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        this.format("underline");
      }
    });
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
        image: "insertImage",
      };
      const execCommand = commands[command];
      if (execCommand) {
        if (document.queryCommandSupported(execCommand)) {
          const success = document.execCommand(execCommand, false, "");
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

  public getJson(): NodeJson {
    const parseNode = (node: Node): NodeJson | string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || "";
      }

      const result: NodeJson = {
        type: node.nodeName.toLowerCase(),
        attributes: {},
        children: [],
      };

      // Parse attributes
      if (node instanceof Element) {
        Array.from(node.attributes).forEach((attr) => {
          result.attributes[attr.name] = attr.value;
        });
      }

      // Parse children
      node.childNodes.forEach((child) => {
        result.children.push(parseNode(child));
      });

      return result;
    };

    return {
      type: "root",
      attributes: {},
      children: [parseNode(this.editor)],
    };
  }
}

(window as any).RichTextEditor = RichTextEditor;

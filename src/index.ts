import {icons} from './assets/icons'
import { ImageHandler } from './insertImage';
import { HyperLinkHandler } from './hyperLink';
import { TextHeadingHandler } from './textHeading';
import { InsertTableHandler } from './insertTable';
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
  private imageHandler!: ImageHandler;
  private hyperlinkHandler: HyperLinkHandler;
  private textHeadingHandler: TextHeadingHandler;
  private insertTableHandler: InsertTableHandler;

  constructor(editorId: string, config: EditorConfig) {
    const editor = document.getElementById(editorId);
    if (!editor || !(editor instanceof HTMLDivElement)) {
      throw new Error("Editor element not found or incorrect element type.");
    }
    this.editor = editor;
    this.config = config;
    this.imageHandler = new ImageHandler(this.editor);
    this.hyperlinkHandler = new HyperLinkHandler(this.editor);
    this.textHeadingHandler = new TextHeadingHandler(this.editor);
    this.insertTableHandler = new InsertTableHandler(this.editor);

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
    this.addSelectionListener();
    this.editor.focus();
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
      if (feature === "heading") {
        const button = document.createElement("button");
        button.innerHTML = icons.heading;
        button.setAttribute("data-command", feature);
        button.onclick = () => this.textHeadingHandler.openHeadingModal(); // Open modal
        toolbar.appendChild(button);
      }else if (feature === "insert_table") {
        const button = document.createElement("button");
        button.innerHTML = icons.insert_table;
        button.onclick = () => this.insertTableHandler.openTableModal(); // Open table modal
        toolbar.appendChild(button);
      }
      else{
        const button = document.createElement("button");
        button.innerHTML = featureIcons[feature];
        button.setAttribute("data-command", feature);
        button.onclick = () => this.format(feature);

        if (feature === "left_align") {
          button.classList.add("active");
        }
        
        toolbar.appendChild(button);
      }
    });

    this.container.insertBefore(toolbar, this.editor);
  }

  private deactivateAlignmentButtons() {
    const alignmentButtons = ["left_align", "center_align", "right_align", "justify"];
    
    alignmentButtons.forEach((alignment) => {
      const button = this.container.querySelector(`button[data-command='${alignment}']`);
      if (button) {
        button.classList.remove("active");
      }
    });
  }

  private addSelectionListener() {
    document.addEventListener('selectionchange', () => {
      this.updateSubSuperButtonState();
      this.updateListButtonState();
    });
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
        if (command === "image") {
          this.imageHandler.insertImage(); // Use the image handler
        }else if(command === 'hyperlink') {
          this.hyperlinkHandler.insertHyperlink(); // Call the hyperlink handler
        }
        // If the command is an alignment command, deactivate other alignment buttons
        if (["left_align", "center_align", "right_align", "justify"].includes(command)) {
          this.deactivateAlignmentButtons(); // Deactivate all alignment buttons
        }

        // Handle mutual exclusivity for subscript and superscript
        if (command === 'subscript') {
          // If superscript is currently active, remove it before applying subscript
          if (document.queryCommandState('superscript')) {
            document.execCommand('superscript', false, '');
          }
        } else if (command === 'superscript') {
          // If subscript is currently active, remove it before applying superscript
          if (document.queryCommandState('subscript')) {
            document.execCommand('subscript', false, '');
          }
        }

         // Handle mutual exclusivity for bullet and numbered lists
        if (command === 'bullet_list') {
          // If numbered list is currently active, remove it before applying bullet list
          if (document.queryCommandState('insertOrderedList')) {
            document.execCommand('insertOrderedList', false, '');
          }
        } else if (command === 'numbered_list') {
          // If bullet list is currently active, remove it before applying numbered list
          if (document.queryCommandState('insertUnorderedList')) {
            document.execCommand('insertUnorderedList', false, '');
          }
        }

        if (document.queryCommandSupported(execCommand)) {
          const success = document.execCommand(execCommand, false, "");
          if (success) {
            this.updateButtonState(command);
            this.updateSubSuperButtonState();
            this.updateListButtonState();
          }else{
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

  private updateButtonState(command: string) {
    if (["left_align", "center_align", "right_align", "justify"].includes(command)) {
      // For alignment commands, deactivate all buttons first
      this.deactivateAlignmentButtons();
    }
  
    const button = this.container.querySelector(`button[data-command='${command}']`);
    if (button) {
      let isActive = false;
  
      // Handle alignment button's states
      if (["left_align", "center_align", "right_align", "justify"].includes(command)) {
        button.classList.add("active");
      } else {
        // For non-alignment commands like bold, italic, underline etc
        isActive = document.queryCommandState(command);
        if (isActive) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      }
    }
  }  

  // New method to update both subscript and superscript
  private updateSubSuperButtonState() {
    const subscriptButton = this.container.querySelector(
      `button[data-command='subscript']`
    );
    const superscriptButton = this.container.querySelector(
      `button[data-command='superscript']`
    );
    
    // Check if subscript is active
    if (subscriptButton) {
      if (document.queryCommandState('subscript')) {
        subscriptButton.classList.add("active");
      } else {
        subscriptButton.classList.remove("active");
      }
    }

    // Check if superscript is active
    if (superscriptButton) {
      if (document.queryCommandState('superscript')) {
        superscriptButton.classList.add("active");
      } else {
        superscriptButton.classList.remove("active");
      }
    }
  }
  // New method to update both Bullet and numbered list
  private updateListButtonState() {
    const bulletListButton = this.container.querySelector(
      `button[data-command='bullet_list']`
    );
    const numberedListButton = this.container.querySelector(
      `button[data-command='numbered_list']`
    );
  
    // Check if bullet list is active
    if (bulletListButton) {
      if (document.queryCommandState('insertUnorderedList')) {
        bulletListButton.classList.add("active");
      } else {
        bulletListButton.classList.remove("active");
      }
    }
  
    // Check if numbered list is active
    if (numberedListButton) {
      if (document.queryCommandState('insertOrderedList')) {
        numberedListButton.classList.add("active");
      } else {
        numberedListButton.classList.remove("active");
      }
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
import TextDocument from "./textDocument";
import EditorView from "./view/editorView";
import ToolbarView from "./view/toolbarView";
import Piece from "./piece";
import { saveSelection } from "./utils/selectionManager";
import { parseHtmlToPieces } from "./utils/parseHtml";

type EditorConfig = {
    features : [string]
}

class TextIgniter {
    document: TextDocument;
    editorView: EditorView;
    toolbarView: ToolbarView;
    currentAttributes: { bold: boolean; italic: boolean; underline: boolean,hyperlink:boolean | string };
    manualOverride: boolean;
    lastPiece: Piece | null;
    editorContainer : HTMLElement | null;
    toolbarContainer : HTMLElement | null;

    constructor(editorId:string,config:EditorConfig) {

        this.createEditor(editorId,config);
        
        this.editorContainer = document.getElementById('editor') || null;
        this.toolbarContainer =  document.getElementById('toolbar') || null;

        if(!this.editorContainer || !this.toolbarContainer) {
            throw new Error("Editor element not found or incorrect element type.");
        }

        this.document = new TextDocument();
        this.editorView = new EditorView(this.editorContainer, this.document);
        this.toolbarView = new ToolbarView(this.toolbarContainer);
        this.currentAttributes = { bold: false, italic: false, underline: false,hyperlink:false };
        this.manualOverride = false;
        this.lastPiece = null;

        

        this.toolbarView.on('toolbarAction', (action: string) => this.handleToolbarAction(action));
        this.document.on('documentChanged', () => this.editorView.render());
        this.editorContainer.addEventListener('keydown', (e) => this.handleKeydown(e as KeyboardEvent));
        this.editorContainer.addEventListener('keyup', () => this.syncCurrentAttributesWithCursor());
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && !e.altKey) {
                const key = e.key.toLowerCase();
                if (['b', 'i', 'u'].includes(key)) {
                    e.preventDefault();
                    const action = key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'underline';
                    this.handleToolbarAction(action);
                }
            }
        });

        document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
        this.document.emit('documentChanged', this.document);

        this.editorContainer.addEventListener('paste', (e: ClipboardEvent) => {
            e.preventDefault();
            const html = e.clipboardData?.getData('text/html');
            const [start, end] = this.getSelectionRange();
            if (end > start) {
                this.document.deleteRange(start, end);
            }
        
            let piecesToInsert: Piece[] = [];
            if (html) {
                piecesToInsert = parseHtmlToPieces(html); 
            } else {
                const text = e.clipboardData?.getData('text/plain') || '';
                piecesToInsert = [new Piece(text, { ...this.currentAttributes })];
            }
        
            let offset = start;
            for (const p of piecesToInsert) {
                this.document.insertAt(p.text,{ ...p.attributes},offset,this.document.selectedBlockId);
                offset += p.text.length;
            }
            this.setCursorPosition(offset);
        });
        
        this.editorContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        this.editorContainer.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            const html = e.dataTransfer?.getData('text/html');
            const [start, end] = this.getSelectionRange();
            if (end > start) {
                this.document.deleteRange(start, end);
            }
        
            let piecesToInsert: Piece[] = [];
            if (html) {
                piecesToInsert = parseHtmlToPieces(html);
            } else {
                const text = e.dataTransfer?.getData('text/plain') || '';
                piecesToInsert = [new Piece(text, { ...this.currentAttributes })];
            }
        
            let offset = start;
            for (const p of piecesToInsert) {
                this.document.insertAt(p.text,{ ...p.attributes},offset,this.document.selectedBlockId);
                offset += p.text.length;
            }
            this.setCursorPosition(offset);
        });
        
        
    }


    createEditor(editorId:string,config:EditorConfig) {
        const container = document.getElementById(editorId);
        if(!container){
            throw new Error("Editor element not found or incorrect element type.");
        }
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        toolbar.id = 'toolbar';
        container.appendChild(toolbar);
  
        const editor = document.createElement('div');   
        editor.id = 'editor';
        editor.contentEditable = 'true';
        container.appendChild(editor);
  
        // Map features to button labels/icons
        const featureLabels : any= {
          'bold': '<strong>B</strong>',
          'italic': '<em>I</em>',
          'underline': '<u>U</u>',
          'hyperlink': '&#128279;',   // Unicode for link symbol
          'subscript': 'X<sub>2</sub>',
          'superscript': 'X<sup>2</sup>',
          'left_align': '&#8676;',    // Unicode for left arrow
          'center_align': '&#8596;',  // Unicode for left-right arrow
          'right_align': '&#8677;',   // Unicode for right arrow
          'justify': '&#8644;',       // Unicode for justify icon
          'bullet_list': '&#8226;',   // Unicode for bullet
          'numbered_list': '1.',      // Simple text representation
          'insert_table': '&#8866;',  // Unicode for table icon
          'insert_layout': '&#10064;',// Unicode for layout icon
          'heading': 'H',
          'image': '&#128247;',       // Unicode for camera symbol
          'colors': '&#127912;',      // Unicode for palette symbol
        };
  
            config.features.forEach(feature => {
          const button = document.createElement('button');
          button.dataset.action = feature;
          button.innerHTML = featureLabels[feature] || feature;
  
          // Add the title attribute for hover effect
          button.title = feature
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
  
          // Add event listeners or additional attributes as needed
          // button.addEventListener('click', handleToolbarAction);
  
          toolbar.appendChild(button);

        });

            // Create the container div
            const hyperlinkContainer = document.createElement("div");
            hyperlinkContainer.id = "hyperlink-container";
            hyperlinkContainer.style.display = "none";

            // Create the input element
            const hyperlinkInput = document.createElement("input");
            hyperlinkInput.type = "text";
            hyperlinkInput.id = "hyperlink-input";
            hyperlinkInput.placeholder = "Enter a URL...";

            // Create the Apply button
            const applyButton = document.createElement("button");
            applyButton.id = "apply-hyperlink";
            applyButton.textContent = "Link";

            // Create the Cancel button
            const cancelButton = document.createElement("button");
            cancelButton.id = "cancel-hyperlink";
            cancelButton.textContent = "Unlink";

            // Append input and buttons to the container
            hyperlinkContainer.appendChild(hyperlinkInput);
            hyperlinkContainer.appendChild(applyButton);
            hyperlinkContainer.appendChild(cancelButton);

            // Append the container to the toolbar

            toolbar.appendChild(hyperlinkContainer);
      }
    
    getSelectionRange(): [number, number] {
        const sel = saveSelection(this.editorView.container);
        if (!sel) return [0, 0];
        return [sel.start, sel.end];
    }

    handleToolbarAction(action: string): void {
        const [start, end] = this.getSelectionRange();
        if (start < end) {
            switch (action) {
                case 'bold':
                    this.document.toggleBoldRange(start, end);
                    break;
                case 'italic':
                    this.document.toggleItalicRange(start, end);
                    break;
                case 'underline':
                    this.document.toggleUnderlineRange(start, end);
                    break;
            }
        } else {
            this.currentAttributes[action as 'bold' | 'italic' | 'underline'] = !this.currentAttributes[action as 'bold' | 'italic' | 'underline'];
            this.manualOverride = true;
        }
        this.toolbarView.updateActiveStates(this.currentAttributes);
    }

    handleSelectionChange(): void {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            // this.document.selectedBlockId = null;
            return;
        }

        const range = selection.getRangeAt(0);
        const parentBlock = range.startContainer.parentElement?.closest('[data-id]');
        if (parentBlock && parentBlock instanceof HTMLElement) {
            this.document.selectedBlockId = parentBlock.getAttribute('data-id') || null;
        }
        // else {
        //     this.document.selectedBlockId = null;
        // }
    }

    handleKeydown(e: KeyboardEvent): void {
        const [start, end] = this.getSelectionRange();
        if (e.key === 'Enter') {
            e.preventDefault();
            const uniqueId = `data-id-${Date.now()}`;
            this.document.blocks.push({
                "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")]
            })
            
            this.syncCurrentAttributesWithCursor();
            this.editorView.render()
            this.setCursorPosition(end + 1, uniqueId);
            if (end > start) {
                this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
            }
            
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            if (start === end && start > 0) {
                this.document.deleteRange(start - 1, start, this.document.selectedBlockId, this.document.currentOffset);
                this.setCursorPosition(start - 1);
            } else if (end > start) {
                this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
                this.setCursorPosition(start);
            }
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            if (end > start) {
                this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
            }
            this.document.insertAt(e.key, { ...this.currentAttributes }, start, this.document.selectedBlockId, this.document.currentOffset);
            this.setCursorPosition(start + 1);
        } else if(e.key === "Delete") {
            e.preventDefault();
            if (start === end) { // just a char
                this.document.deleteRange(start, start + 1,this.document.selectedBlockId);
                this.setCursorPosition(start);
            } else if (end > start) { //Selection
                this.document.deleteRange(start, end,this.document.selectedBlockId);
                this.setCursorPosition(start);
            }
        }
    }

    syncCurrentAttributesWithCursor(): void {
        const [start, end] = this.getSelectionRange();
        if (start === end) {
            const piece = this.document.findPieceAtOffset(start, this.document.selectedBlockId);
            if (piece) {
                if (piece !== this.lastPiece) {
                    this.manualOverride = false;
                    this.lastPiece = piece;
                }
                if (!this.manualOverride) {
                    this.currentAttributes = {
                        bold: piece.attributes.bold,
                        italic: piece.attributes.italic,
                        underline: piece.attributes.underline
                    };
                    this.toolbarView.updateActiveStates(this.currentAttributes);
                }
            } else {
                if (!this.manualOverride) {
                    this.currentAttributes = { bold: false, italic: false, underline: false };
                    this.toolbarView.updateActiveStates(this.currentAttributes);
                }
                this.lastPiece = null;
            }
        }
    }

    setCursorPosition(position: number, dataId: string | null = ''): void {
        if (dataId === '')
            this.editorView.container.focus();
        else {
            const divDataid = document.querySelector('[data-id="' + dataId + '"]') as HTMLElement
            divDataid.focus();
            
        }
        const sel = window.getSelection();
        if (!sel) return;
        const range = document.createRange();
        let charIndex = 0;
        const nodeStack: Node[] = [this.editorView.container];
        let node: Node | undefined;

        while ((node = nodeStack.pop())) {
            if (node.nodeType === 3) {
                const textNode = node as Text;
                const nextCharIndex = charIndex + textNode.length;
                if (position >= charIndex && position <= nextCharIndex) {
                    range.setStart(textNode, position - charIndex);
                    range.collapse(true);
                    break;
                }
                charIndex = nextCharIndex;
            } else if ((node as HTMLElement).tagName === 'BR') {
                if (position === charIndex) {
                    range.setStartBefore(node);
                    range.collapse(true);
                    break;
                }
                charIndex++;
            } else {
                const el = node as HTMLElement;
                let i = el.childNodes.length;
                while (i--) {
                    nodeStack.push(el.childNodes[i]);
                }
            }
        }

        sel.removeAllRanges();
        sel.addRange(range);
    }
    

}


(window as any).TextIgniter = TextIgniter;
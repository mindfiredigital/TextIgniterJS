import TextDocument from "./textDocument";
import EditorView from "./view/editorView";
import ToolbarView from "./view/toolbarView";
import Piece from "./piece";
import { saveSelection,restoreSelection } from "./utils/selectionManager";
import { parseHtmlToPieces } from "./utils/parseHtml";
import {showHyperlinkViewButton,hideHyperlinkViewButton} from './attributes/hyperLink'


type EditorConfig = {
    features : [string]
}

class TextIgniter {
    document: TextDocument;
    editorView: EditorView;
    toolbarView: ToolbarView;
    currentAttributes: { bold: boolean; italic: boolean; underline: boolean,hyperlink?: string | boolean };
    manualOverride: boolean;
    lastPiece: Piece | null;
    editorContainer : HTMLElement | null;
    toolbarContainer : HTMLElement | null;
    savedSelection: { start: number; end: number } | null = null;

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
                if (['b', 'i', 'u','h'].includes(key)) {
                    e.preventDefault();
                    let action = 'b';
                    switch (key) {
                        case 'b':
                            action = 'bold';
                            break;
                        case 'i':
                            action = 'italic';
                            break;
                        case 'u':
                            action = 'underline';
                            break;
                        case 'h':
                            action = 'hyperlink';
                            break;
                    
                        default:
                            break;
                    }
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




             // Create the container div
             const viewHyperlinkContainer = document.createElement("div");
             viewHyperlinkContainer.id = "hyperlink-container-view";
             viewHyperlinkContainer.style.display = "none";
 
            //  // Create the input element
             const hyperLinkViewSpan = document.createElement("span");
             hyperLinkViewSpan.id = "hyperlink-view-span";
             hyperLinkViewSpan.innerHTML = "Visit URL : ";

             const hyperLinkAnchor = document.createElement("a");
             hyperLinkAnchor.id = "hyperlink-view-link";
             hyperLinkAnchor.href="";
             hyperLinkAnchor.target = "_blank";


            // Create the Apply button
            // const editHyperlinkButton = document.createElement("button");
            // editHyperlinkButton.id = "edit-hyperlink";
            // editHyperlinkButton.textContent = "edit |";

            // Create the Cancel button
            // const removeHyperlinkButton = document.createElement("button");
            // removeHyperlinkButton.id = "delete-hyperlink";
            // removeHyperlinkButton.textContent = "remove";

 
            //  // Append input and buttons to the container
             viewHyperlinkContainer.appendChild(hyperLinkViewSpan);
             viewHyperlinkContainer.appendChild(hyperLinkAnchor);
            //  viewHyperlinkContainer.appendChild(editHyperlinkButton);
            //  viewHyperlinkContainer.appendChild(removeHyperlinkButton);
 
            //  // Append the container to the toolbar
 
             toolbar.appendChild(viewHyperlinkContainer);
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
                case 'hyperlink':
                    if (start < end) {
                        // Get the existing hyperlink, if any
                        const existingLink = this.document.getCommonHyperlinkInRange(start, end);
        
                        // Show the hyperlink input box
                        this.showHyperlinkInput(existingLink);
                    } else {
                        // No selection
                        alert("Please select the text you want to hyperlink.");
                    }
                    break;
            }
        } else {
            this.currentAttributes[action as 'bold' | 'italic' | 'underline'] = !this.currentAttributes[action as 'bold' | 'italic' | 'underline'];
            this.manualOverride = true;
        }
        this.toolbarView.updateActiveStates(this.currentAttributes);
    }

    showHyperlinkInput(existingLink: string | null): void {
        // Get the elements
        const hyperlinkContainer = document.getElementById('hyperlink-container');
        const hyperlinkInput = document.getElementById('hyperlink-input') as HTMLInputElement;
        const applyButton = document.getElementById('apply-hyperlink');
        const cancelButton = document.getElementById('cancel-hyperlink');

        if (hyperlinkContainer && hyperlinkInput && applyButton && cancelButton) {
            hyperlinkContainer.style.display = 'block';

            // position the container near the selection or toolbar
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                hyperlinkContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
                hyperlinkContainer.style.left = `${rect.left + window.scrollX}px`;
            }

            // Set the existing link
            hyperlinkInput.value = existingLink || '';

            // Save the current selection
            this.savedSelection = saveSelection(this.editorView.container);

            // Show temporary selection 
            this.highlightSelection();

            // Ensure the hyperlink input is focused
            hyperlinkInput.focus();

            // Remove any previous event listeners
            applyButton.onclick = null;
            cancelButton.onclick = null;

            // Handle the 'Link' button
            applyButton.onclick = () => {
                const url = hyperlinkInput.value.trim();
                if (url) {
                    this.applyHyperlink(url);
                } else {
                    // alert('Please enter a valid URL.');
                }
                hyperlinkContainer.style.display = 'none';
            };

            // Handle the 'Unlink' button
            cancelButton.onclick = () => {
                this.removeHyperlink();
                hyperlinkContainer.style.display = 'none';
            };
        }
    }

    highlightSelection(): void {
        // Remove any existing temporary highlights
        this.removeHighlightSelection();

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
    
            // Create a wrapper span
            const span = document.createElement('span');
            span.className = 'temporary-selection-highlight';
    
            // Extract the selected content and wrap it
            span.appendChild(range.extractContents());
            range.insertNode(span);
    
            // Adjust the selection to encompass the new span
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(span);
            selection.addRange(newRange);
        }
    }

    removeHighlightSelection(): void {
        const highlights = this.editorContainer?.querySelectorAll('span.temporary-selection-highlight');
        highlights?.forEach((span) => {
            const parent = span.parentNode;
            if (parent) {
                while (span.firstChild) {
                    parent.insertBefore(span.firstChild, span);
                }
                parent.removeChild(span);
            }
        });
    }

    applyHyperlink(url: string): void {
        // Remove any existing temporary highlights
        this.removeHighlightSelection();

        // Restore the selection
        restoreSelection(this.editorView.container, this.savedSelection);

        const [start, end] = this.getSelectionRange();
        if (start < end) {
            this.document.applyHyperlinkRange(start, end, url);
            this.editorView.render();
            // Restore selection and focus
            restoreSelection(this.editorView.container, this.savedSelection);
            this.editorView.container.focus();
        }
        this.savedSelection = null;
    }

    removeHyperlink(): void {
        // Remove any existing temporary highlights
        this.removeHighlightSelection();

        // Restore the selection
        restoreSelection(this.editorView.container, this.savedSelection);

        const [start, end] = this.getSelectionRange();
        if (start < end) {
            this.document.removeHyperlinkRange(start, end);
            this.editorView.render();
            // Restore selection and focus
            restoreSelection(this.editorView.container, this.savedSelection);
            this.editorView.container.focus();
        }
        this.savedSelection = null;
    }
    
    handleSelectionChange(): void {
        this.syncCurrentAttributesWithCursor();
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
              // Check if the previous piece is an image
              const position = start - 1;
              this.deleteAtPosition(position);
              this.setCursorPosition(Math.max(0, position));
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
            this.deleteAtPosition(start);
            this.setCursorPosition(start);
        }
    }

    deleteAtPosition(position: number): void {
        // Delete a character or an image at the specified position
        const piece = this.document.findPieceAtOffset(position, this.document.selectedBlockId);
        if (piece && piece.attributes.image) {
          // Delete the entire image piece
          this.document.deleteRange(position, position + 1, this.document.selectedBlockId);
        } else {
          // Delete as usual
          this.document.deleteRange(position, position + 1, this.document.selectedBlockId);
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
                        underline: piece.attributes.underline,
                        hyperlink: piece.attributes.hyperlink || false
                    };
                    this.toolbarView.updateActiveStates(this.currentAttributes);
                }
                // Show below link..
                const hyperlink = piece?.attributes.hyperlink; 
                if(hyperlink && typeof hyperlink === 'string'){
                    showHyperlinkViewButton(hyperlink);
                }
                else{
                    hideHyperlinkViewButton()
                }
            } else {
                if (!this.manualOverride) {
                    this.currentAttributes = { bold: false, italic: false, underline: false,hyperlink:false };
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
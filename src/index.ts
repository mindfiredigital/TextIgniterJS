import TextDocument from "./textDocument";
import EditorView from "./view/editorView";
import ToolbarView from "./view/toolbarView";
import Piece from "./piece";
import { saveSelection,restoreSelection } from "./utils/selectionManager";
import { parseHtmlToPieces } from "./utils/parseHtml";
import {showHyperlinkViewButton,hideHyperlinkViewButton} from './attributes/hyperLink'
import "./styles/text-igniter.css"
import { icons } from "./assets/icons";

export type EditorConfig = {
    features :string[]
}

export interface CurrentAttributeDTO { bold: boolean; italic: boolean; underline: boolean; undo?: boolean; redo?: boolean,hyperlink?: string | boolean }

class TextIgniter {
    document: TextDocument;
    editorView: EditorView;
    toolbarView: ToolbarView;
    currentAttributes: CurrentAttributeDTO;
    manualOverride: boolean;
    lastPiece: Piece | null;
    editorContainer : HTMLElement | null;
    toolbarContainer : HTMLElement | null;
    savedSelection: { start: number; end: number } | null = null;

    constructor(editorId:string,config:EditorConfig) {

        this.createEditor(editorId,config);
        
        this.editorContainer = document.getElementById('editor') || null;
        this.toolbarContainer = document.getElementById('toolbar') || null;

        if(!this.editorContainer || !this.toolbarContainer) {
            throw new Error("Editor element not found or incorrect element type.");
        }

        this.document = new TextDocument();
        this.editorView = new EditorView(this.editorContainer, this.document);
        this.toolbarView = new ToolbarView(this.toolbarContainer);
        this.currentAttributes = { bold: false, italic: false, underline: false, undo: false, redo: false, hyperlink:false};
        this.manualOverride = false;
        this.lastPiece = null;
        this.toolbarView.on('toolbarAction', (action: string, dataId: string[] = []) => this.handleToolbarAction(action, dataId));
        this.document.on('documentChanged', () => this.editorView.render());
        this.editorContainer.addEventListener('keydown', (e) => this.handleKeydown(e as KeyboardEvent));
        this.editorContainer.addEventListener('keyup', () => this.syncCurrentAttributesWithCursor());
        document.addEventListener('mouseup', () => {
            const dataId = this.document.getAllSelectedDataIds();
            console.log('Selected text is inside element with data-id:', dataId);
            console.log(this.document.dataIds, "this.document.dataIds")
        });
        document.getElementById('fontFamily')?.addEventListener('change', (e) => {
            const fontFamily = (e.target as HTMLSelectElement).value;
            const [start, end] = this.getSelectionRange();
            if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach((block: any) => {
                    if (this.document.dataIds.includes(block.dataId)) {
                        console.log(document.getElementById(block.dataId))
                        console.log(block.dataId, this.document.dataIds, "attribute1")
                        this.document.selectedBlockId = block.dataId;
                        let countE = 0;
                        block.pieces.forEach((obj: any) => {
                            countE += obj.text.length;
                        })
                        let countS = start - countE
                        this.document.setFontFamily(countS, countE, fontFamily);

                    }
                })
            } else {
                this.document.setFontFamily(start, end, fontFamily);
            }
        });

        document.getElementById('fontSize')?.addEventListener('change', (e) => {
            const fontSize = (e.target as HTMLSelectElement).value;
            const [start, end] = this.getSelectionRange();
            if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach((block: any) => {
                    if (this.document.dataIds.includes(block.dataId)) {
                        this.document.selectedBlockId = block.dataId;
                        let countE = 0;
                        block.pieces.forEach((obj: any) => {
                            countE += obj.text.length;
                        })
                        let countS = start - countE;
                        this.document.setFontSize(countS, countE, fontSize);
                    }
                })
            } else {
                this.document.setFontSize(start, end, fontSize);
            }
            // this.document.setFontSize(start, end, fontSize);
        });

        document.getElementById('alignLeft')?.addEventListener('click', () => {
            this.document.dataIds.forEach(obj => this.document.setAlignment('left', obj))
            // this.document.setAlignment('left', this.document.selectedBlockId);
        });

        document.getElementById('alignCenter')?.addEventListener('click', () => {
            this.document.dataIds.forEach(obj => this.document.setAlignment('center', obj))

            // this.document.setAlignment('center', this.document.selectedBlockId);
        });

        document.getElementById('alignRight')?.addEventListener('click', () => {
            this.document.dataIds.forEach(obj => this.document.setAlignment('right', obj))
            // this.document.setAlignment('right', this.document.selectedBlockId);
        });

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

                if (key === 'z') {
                    e.preventDefault();
                    this.document.undo();
                } else if (key === 'y') {
                    e.preventDefault();
                    this.document.redo();
                }
                if (key === 'a') {
                    // e.preventDefault();
                    const dataId = this.document.getAllSelectedDataIds();
                    console.log('Selected text is inside element with data-id:', dataId);
                }

                if (e.key === 'l') {
                    e.preventDefault();
                    this.document.setAlignment('left', this.document.selectedBlockId);
                } else if (e.key === 'e') {
                    e.preventDefault();
                    this.document.setAlignment('center', this.document.selectedBlockId);
                } else if (e.key === 'r') {
                    e.preventDefault();
                    this.document.setAlignment('right', this.document.selectedBlockId);
                }
                console.log('undo', this.document.undoStack, 'redo', this.document.redoStack);
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
                this.document.insertAt(p.text, { ...p.attributes }, offset, this.document.selectedBlockId);
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
                this.document.insertAt(p.text, { ...p.attributes }, offset, this.document.selectedBlockId);
                offset += p.text.length;
            }
            this.setCursorPosition(offset);
        });


    }
    
    createEditor(editorId:string,config:EditorConfig) {
        const allowedFontFamily = [
            'Arial',
            'Times New Roman',
            'Courier New',
            'Verdana',
        ];
        const allowedFontSizes = [
            '12px',
            '14px',
            '16px',
            '18px',
            '20px',
          ];
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

          'alignLeft': '&#8676;',    // Unicode for left arrow
          'alignCenter': '&#8596;',  // Unicode for left-right arrow
          'alignRight': '&#8677;',   // Unicode for right arrow

          'unorderedList': '&#8226;',   // Unicode for bullet
          'orderedList': '1.',      // Simple text representation
          'fontFamily' : 'fontFamily',
          'fontSize': 'fontSize',

          'subscript': 'X<sub>2</sub>',
          'superscript': 'X<sup>2</sup>',
          'justify': '&#8644;',       // Unicode for justify icon
          'insert_table': '&#8866;',  // Unicode for table icon
          'insert_layout': '&#10064;',// Unicode for layout icon
          'heading': 'H',
          'image': '&#128247;',       // Unicode for camera symbol
          'colors': '&#127912;',      // Unicode for palette symbol
        };

        // Features with custom SVG icons
        const featuresWithPngIcon = [
            { feature: 'alignLeft', id: 'alignLeft', icon: icons.left_align },
            { feature: 'alignCenter', id: 'alignCenter', icon: icons.center_align },
            { feature: 'alignRight', id: 'alignRight', icon: icons.right_align },
            { feature: 'unorderedList', id: 'unorderedList', icon: icons.bullet_list },
            { feature: 'orderedList', id: 'orderedList', icon: icons.numbered_list },
          ];
  
        const createSelect = (id:string, options:string[]) => {
            const select = document.createElement('select');
            select.id = id;
            options.forEach(optionValue => {
              const option = document.createElement('option');
              option.value = optionValue;
              option.textContent = optionValue;
              select.appendChild(option);
            });
            return select;
          };

        config.features.forEach(feature => {
            if(feature === 'fontFamily'){
            const fontFamilySelect = createSelect('fontFamily', allowedFontFamily);
          toolbar.appendChild(fontFamilySelect);
            } else if(feature === 'fontSize'){
                const fontSizeSelect = createSelect('fontSize',allowedFontSizes );
                  toolbar.appendChild(fontSizeSelect);
            }else if(featuresWithPngIcon.map(item=>item.feature).indexOf(feature) !== -1){
                const featureDataArray = featuresWithPngIcon.filter(item=>item.feature === feature);
                let featureData = null;
                if(featureDataArray?.length > 0){
                    featureData = featureDataArray[0];
                }
                const button = document.createElement('button');
                button.id = feature;
                button.dataset.action = feature;
                const svg = featureData?.icon || "";
                button.innerHTML = svg; 
                toolbar.appendChild(button);

                // Commented for future use
                
                // const img = document.createElement('img');
                // img.src = featureData?.icon || "";
                // img.width = 20;
                // img.height = 20;
                // button.appendChild(img);
                toolbar.appendChild(button);
            }else {
                const button = document.createElement('button');
                button.dataset.action = feature;
                button.innerHTML = featureLabels[feature] || feature;
                button.id = feature;
                // if(['leftAlign','centerAlign','rightAlign','bulletList','numberedList'].indexOf(feature) !== -1){
                //     button.id = feature;
                // }
                // Add the title attribute for hover effect
                button.title = feature
                .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
            toolbar.appendChild(button);
        }

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

    handleToolbarAction(action: string, dataId: string[] = []): void {

        const [start, end] = this.getSelectionRange();
        console.log(action, "action---")
        switch (action) {
            case 'orderedList':
                this.document.dataIds.map((obj: string, i: number) => this.document.toggleOrderedList(obj, i + 1))
                // this.document.toggleOrderedList(this.document.selectedBlockId)

                break;
            case 'unorderedList':
                this.document.dataIds.map(obj => this.document.toggleUnorderedList(obj))

                // this.document.toggleUnorderedList(this.document.selectedBlockId);
                break;
        }
        if (start < end) {

            switch (action) {
                case 'bold':
                    // this.document.dataIds.forEach(obj => {
                    //     console.log(obj, "vicky", this.document.selectedBlockId)
                    //     this.document.selectedBlockId = obj;
                    //     this.document.toggleBoldRange(start, end)
                    // })
                    if (this.document.dataIds.length > 1) {
                        this.document.blocks.forEach((block: any) => {
                            if (this.document.dataIds.includes(block.dataId)) {
                                this.document.selectedBlockId = block.dataId;
                                let countE = 0;
                                block.pieces.forEach((obj: any) => {
                                    countE += obj.text.length;
                                })
                                let countS = start - countE;
                                this.document.toggleBoldRange(countS, countE);
                            }
                        })
                    } else {
                        this.document.toggleBoldRange(start, end);
                    }

                    break;
                case 'italic':
                    if (this.document.dataIds.length > 1) {
                        this.document.blocks.forEach((block: any) => {
                            if (this.document.dataIds.includes(block.dataId)) {
                                this.document.selectedBlockId = block.dataId;
                                let countE = 0;
                                block.pieces.forEach((obj: any) => {
                                    countE += obj.text.length;
                                })
                                let countS = start - countE;
                                this.document.toggleItalicRange(countS, countE);
                            }
                        })
                    } else {
                        this.document.toggleItalicRange(start, end);
                    }
                    // this.document.toggleItalicRange(start, end);
                    break;
                case 'underline':
                    if (this.document.dataIds.length > 1) {
                        this.document.blocks.forEach((block: any) => {
                            if (this.document.dataIds.includes(block.dataId)) {
                                this.document.selectedBlockId = block.dataId;
                                let countE = 0;
                                block.pieces.forEach((obj: any) => {
                                    countE += obj.text.length;
                                })
                                let countS = start - countE;
                                this.document.toggleUnderlineRange(countS, countE);
                            }
                        })
                    } else {
                        this.document.toggleUnderlineRange(start, end);
                    }
                    // this.document.toggleUnderlineRange(start, end);
                    break;
                // case 'orderedList':
                //     this.document.toggleOrderedList(this.document.selectedBlockId);
                //     break;
                // case 'unorderedList':
                //     this.document.toggleUnorderedList(this.document.selectedBlockId);
                //     break;
                case 'undo':
                    // this.document.toggleUndoRange(start, end);
                    this.document.undo();
                    break;
                case 'redo':
                    // this.document.toggleRedoRange(start, end);
                    this.document.redo();
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
            this.currentAttributes[action as 'bold' | 'italic' | 'underline' | 'undo' | 'redo'] = !this.currentAttributes[action as 'bold' | 'italic' | 'underline' | 'undo' | 'redo'];
            this.manualOverride = true;
        }
        console.log('undo', this.document.undoStack, 'redo', this.document.redoStack);
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
        let ending = end;
        if (e.key === 'Enter') {
            console.log('blocks', this.document.blocks)
            e.preventDefault();
            const uniqueId = `data-id-${Date.now()}`;
            if (this.document.blocks[this.document.blocks.length - 1]?.listType === 'ol' || this.document.blocks[this.document.blocks.length - 1]?.listType === 'ul') {
                const ListType = this.document.blocks[this.document.blocks.length - 1]?.listType;
                let _start = 1;
                if (ListType === 'ol') {
                    _start = this.document.blocks[this.document.blocks.length - 1]?.listStart
                    _start += 1;
                }
                this.document.blocks.push({
                    "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
                    listType: ListType, // null | 'ol' | 'ul'
                    listStart: ListType === 'ol' ? _start : '',
                })
            } else {
                console.log('vk11', this.getCurrentCursorBlock())
                if (this.getCurrentCursorBlock() !== null) {
                    const extractedContent = " " + this.extractTextFromDataId(this.getCurrentCursorBlock()!.toString())
                    console.log("vk11, ", this.getCurrentCursorBlock()!.toString(), " - ", start, end, extractedContent)
                    let updatedBlock = this.document.blocks;

                    if (extractedContent.length > 0) {
                        updatedBlock = this.addBlockAfter(this.document.blocks, this.getCurrentCursorBlock()!.toString(), {
                            "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(extractedContent)],
                            // listType: null, // null | 'ol' | 'ul'
                        });
                        ending = start + extractedContent.length - 1;
                    } else {
                        updatedBlock = this.addBlockAfter(this.document.blocks, this.getCurrentCursorBlock()!.toString(), {
                            "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
                            // listType: null, // null | 'ol' | 'ul'
                        });
                    }

                    this.document.blocks = updatedBlock
                    console.log("vk11", this.document.blocks, " updatedBlock", updatedBlock)
                } else {
                    this.document.blocks.push({
                        "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
                        // listType: null, // null | 'ol' | 'ul'
                    })
                }
            }

            this.syncCurrentAttributesWithCursor();
            this.editorView.render()
            this.setCursorPosition(ending + 1, uniqueId);
            if (ending > start) {
                this.document.deleteRange(start, ending, this.document.selectedBlockId, this.document.currentOffset);
            }

        } else if (e.key === 'Backspace') {
            e.preventDefault();
            if (this.document.dataIds.length > 1) {
                console.log(this.document.dataIds, "this.document.dataIds")
                // this.document.dataIds.forEach(obj => {
                //     this.document.deleteBlocks(obj)
                // })
                this.document.deleteBlocks();
            }

            if (start === end && start > 0) {
                // this.document.dataIds.forEach(obj => this.document.deleteRange(start - 1, start, obj, this.document.currentOffset))
                this.document.deleteRange(start - 1, start, this.document.selectedBlockId, this.document.currentOffset);
                this.setCursorPosition(start - 1);
            } else if (end > start) {
                // this.document.dataIds.forEach(obj => this.document.deleteRange(start, end, obj, this.document.currentOffset))
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
        } else if (e.key === "Delete") {
            e.preventDefault();
            if (start === end) { // just a char
                // this.document.dataIds.forEach(obj => this.document.deleteRange(start, start + 1, obj))
                this.document.deleteRange(start, start + 1, this.document.selectedBlockId);
                this.setCursorPosition(start);
            } else if (end > start) { //Selection
                // this.document.dataIds.forEach(obj => this.document.deleteRange(start, end, obj))
                this.document.deleteRange(start, end, this.document.selectedBlockId);
                this.setCursorPosition(start);
            }
        }
    }


    extractTextFromDataId(dataId: string): string {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return ''; // No valid selection
        }

        const range = selection.getRangeAt(0); // Get the current range of the cursor
        const cursorNode = range.startContainer; // The node where the cursor is placed

        // Find the element with the given data-id
        const element = document.querySelector(`[data-id="${dataId}"]`) as HTMLElement;
        if (!element) {
            console.error(`Element with data-id "${dataId}" not found.`);
            return ''; // No element with the provided data-id
        }

        // Ensure the cursor is inside the specified element
        if (!element.contains(cursorNode)) {
            console.error(`Cursor is not inside the element with data-id "${dataId}".`);
            return ''; // Cursor is outside the target element
        }

        // Get the full text content of the element
        const fullText = element.textContent || '';

        // Calculate the offset position of the cursor within the text node
        const cursorOffset = range.startOffset;

        // Extract text from the cursor position to the end
        const remainingText = fullText.slice(cursorOffset);

        // Update the DOM: Keep only the text before the cursor
        const newContent = fullText.slice(0, cursorOffset);
        element.textContent = newContent; // Update the element content with remaining text

        console.log('Extracted text:', remainingText);
        console.log('Updated element content:', newContent);

        return remainingText; // Return the extracted text
    }


    getCurrentCursorBlock(): string | null {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return null; // No selection or cursor position
        }

        const range = selection.getRangeAt(0); // Get the range of the cursor/selection
        const container = range.startContainer; // The container node of the cursor

        // Traverse to the parent element with a `data-id` attribute
        const elementWithId = (container.nodeType === Node.TEXT_NODE
            ? container.parentElement
            : container) as HTMLElement;

        const dataIdElement = elementWithId?.closest('[data-id]'); // Find closest ancestor with `data-id`
        return dataIdElement?.getAttribute('data-id') || null; // Return the `data-id` or null if not found
    }

    addBlockAfter(data: any[], targetDataId: string, newBlock: any): any[] {
        // Find the index of the block with the specified dataId
        const targetIndex = data.findIndex(block => block.dataId === targetDataId);

        if (targetIndex === -1) {
            console.error(`Block with dataId "${targetDataId}" not found.`);
            return data;
        }

        // Insert the new block after the target index
        const updatedData = [
            ...data.slice(0, targetIndex + 1),
            newBlock,
            ...data.slice(targetIndex + 1),
        ];

        return updatedData;
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
export {TextIgniter};
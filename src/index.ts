import TextDocument from "./textDocument";
import EditorView from "./view/editorView";
import ToolbarView from "./view/toolbarView";
import HyperlinkHandler from "./handlers/hyperlink";
import Piece from "./piece";
import { saveSelection, restoreSelection } from "./utils/selectionManager";
import { parseHtmlToPieces } from "./utils/parseHtml";
import { createEditor } from "./config/editorConfig";
import "./styles/text-igniter.css"
import HtmlToJsonParser from "./HtmlToJsonParser"
import { EditorConfig } from "./types/editorConfig";
import { ImageHandler } from "./handlers/image";
import EventEmitter from "./utils/events";
import { strings } from "./constants/strings";


export interface CurrentAttributeDTO { bold: boolean; italic: boolean; underline: boolean; undo?: boolean; redo?: boolean, hyperlink?: string | boolean, fontFamily?: string; fontSize?: string; fontColor?: string }

class TextIgniter {
    document: TextDocument;
    htmlToJsonParser: HtmlToJsonParser | undefined;
    editorView: EditorView;
    toolbarView: ToolbarView;
    hyperlinkHandler: HyperlinkHandler;
    imageHandler: ImageHandler;
    currentAttributes: CurrentAttributeDTO;
    manualOverride: boolean;
    lastPiece: Piece | null;
    editorContainer: HTMLElement | null;
    toolbarContainer: HTMLElement | null;
    savedSelection: { start: number; end: number } | null = null;
    debounceTimer: NodeJS.Timeout | null = null;
    constructor(editorId: string, config: EditorConfig) {

        const { mainEditorId, toolbarId } = createEditor(editorId, config);

        this.editorContainer = document.getElementById(mainEditorId) || null;
        this.toolbarContainer = document.getElementById(toolbarId) || null;

        if (!this.editorContainer || !this.toolbarContainer) {
            throw new Error("Editor element not found or incorrect element type.");
        }

        this.document = new TextDocument();
        this.editorView = new EditorView(this.editorContainer, this.document);
        this.toolbarView = new ToolbarView(this.toolbarContainer);
        this.hyperlinkHandler = new HyperlinkHandler(this.editorContainer, this.editorView, this.document);
        this.imageHandler = new ImageHandler(this.editorContainer, this.document);
        this.editorView.setImageHandler(this.imageHandler);
        this.imageHandler.setEditorView(this.editorView);
        this.currentAttributes = { bold: false, italic: false, underline: false, undo: false, redo: false, hyperlink: false };
        this.manualOverride = false;
        this.lastPiece = null;
        this.toolbarView.on('toolbarAction', (action: string, dataId: string[] = []) => this.handleToolbarAction(action, dataId));
        this.document.on('documentChanged', () => this.editorView.render());
        this.editorContainer.addEventListener('keydown', (e) => { this.syncCurrentAttributesWithCursor(); this.handleKeydown(e as KeyboardEvent); });
        this.editorContainer.addEventListener('keyup', () => this.syncCurrentAttributesWithCursor());
        this.editorContainer.addEventListener("blur", () => {
            this.hyperlinkHandler.hideHyperlinkViewButton();
        });

        document.addEventListener('mouseup', () => {
            this.syncCurrentAttributesWithCursor();
            const dataId = this.document.getAllSelectedDataIds();
        });
        document.getElementById('fontColor')?.addEventListener('click', (e) => {

            const fontColorPicker = document.getElementById("fontColorPicker") as HTMLInputElement;
            const fontColorButton = document.querySelector(`[data-feature="fontColor"]`);

            fontColorPicker.style.display = 'inline';
            const colorWrapper = document.getElementById('colorWrapper') as HTMLElement;
            // Get the button's position (x, y)
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const x = rect.left + window.scrollX; // Adjust for scrolling
            const y = rect.bottom + window.scrollY; // Position below the button

            // Position the color picker
            colorWrapper.style.position = "absolute";
            colorWrapper.style.left = `${x - 2}px`;
            colorWrapper.style.top = `${y - 15}px`;
            colorWrapper.style.display = "block"; // Show the color picker

            fontColorPicker.click();
            if (fontColorPicker) {


                fontColorPicker.addEventListener("input", (event) => {
                    const selectedColor = (event.target as HTMLInputElement).value;
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
                                this.document.applyFontColor(countS, countE, selectedColor);

                            }
                        })
                    } else {
                        if (this.debounceTimer) {
                            clearTimeout(this.debounceTimer); // Clear previous timer
                        }
                        this.debounceTimer = setTimeout(() => {
                            this.document.applyFontColor(start, end, selectedColor);

                        }, 300);
                    }

                });
            }
        })

        document.getElementById('bgColor')?.addEventListener('click', (e) => {

            const bgColorPicker = document.getElementById("bgColorPicker") as HTMLInputElement;

            bgColorPicker.style.display = 'inline';
            const colorBgWrapper = document.getElementById('colorBgWrapper') as HTMLElement;
            // Get the button's position (x, y)
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const x = rect.left + window.scrollX; // Adjust for scrolling
            const y = rect.bottom + window.scrollY; // Position below the button

            // Position the color picker
            colorBgWrapper.style.position = "absolute";
            colorBgWrapper.style.left = `${x - 2}px`;
            colorBgWrapper.style.top = `${y - 15}px`;
            colorBgWrapper.style.display = "block"; // Show the color picker

            bgColorPicker.click();
            if (bgColorPicker) {
                bgColorPicker.addEventListener("input", (event) => {
                    const selectedColor = (event.target as HTMLInputElement).value;
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
                                this.document.applyBgColor(countS, countE, selectedColor);

                            }
                        })
                    } else {
                        if (this.debounceTimer) {
                            clearTimeout(this.debounceTimer); // Clear previous timer
                        }
                        this.debounceTimer = setTimeout(() => {
                            this.document.applyBgColor(start, end, selectedColor);

                        }, 300);
                    }


                    // this.document.applyFontColor(start, end, selectedColor);

                });
            }
        })

        document.getElementById("getHtmlButton")?.addEventListener('click', (e) => {
            const htmlString = this.document.getHtmlContent();
            console.log("Editor HTML Content:", htmlString)
            this.htmlToJsonParser = new HtmlToJsonParser(htmlString as string);
            const jsonOutput = this.htmlToJsonParser.parse();

            console.log("htmltoJson", JSON.stringify(jsonOutput, null, 2), jsonOutput);
        })

        document.getElementById("loadHtmlButton")?.addEventListener('click', (e) => {
            
            // const htmlString = this.document.getHtmlContent();
            const str = strings.TEST_HTML_CODE;
            this.htmlToJsonParser = new HtmlToJsonParser(str as string);
            const jsonOutput = this.htmlToJsonParser.parse();

            this.document.blocks = jsonOutput;
            this.document.dataIds[0] = jsonOutput[0].dataId;
            this.document.selectedBlockId = 'data-id-1734604240404';
            this.document.emit('documentChanged', this);
            const [start, end] = this.getSelectionRange();
            this.document.blocks.forEach((block: any) => {
                if (this.document.dataIds.includes(block.dataId)) {
                    this.document.selectedBlockId = block.dataId;
                    let countE = 0;
                    block.pieces.forEach((obj: any) => {
                        countE += obj.text.length;
                    })
                    let countS = start - countE;
                    
                    this.document.setFontSize(countS, countE, block.fontSize);
                }
            })
            console.log("blocks", this.document.blocks, this.document.dataIds, this.document.currentOffset)
            console.log("htmltoJson", JSON.stringify(jsonOutput, null, 2), jsonOutput);
        })

        

        document.getElementById('fontFamily')?.addEventListener('change', (e) => {
            const fontFamily = (e.target as HTMLSelectElement).value;
            const [start, end] = this.getSelectionRange();
            if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach((block: any) => {
                    if (this.document.dataIds.includes(block.dataId)) {
                       
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

        this.editorContainer.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && !e.altKey) {
                const key = e.key.toLowerCase();
                if (['b', 'i', 'u', 'h'].includes(key)) {
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
                    const dataId = this.document.handleCtrlASelection();
                    this.document.selectAll = true;
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
                // console.log('undo', this.document.undoStack, 'redo', this.document.redoStack);
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

    getSelectionRange(): [number, number] {
        const sel = saveSelection(this.editorView.container);
        if (!sel) return [0, 0];
        return [sel.start, sel.end];
    }

    // Function to apply selected color
    applyFontColor(color: string) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (!selectedText) return;

        // Apply color to pieces
        // this.applyFontColor(selection, color);
    }

    handleToolbarAction(action: string, dataId: string[] = []): void {

        const [start, end] = this.getSelectionRange();
        
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
        if (action === 'image') {
            this.imageHandler.insertImage();
        }
        else if (start < end) {

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
                    this.hyperlinkHandler.hanldeHyperlinkClick(start, end, this.document.currentOffset, this.document.selectedBlockId, this.document.blocks);
                    break;
            }
        } else {
            this.currentAttributes[action as 'bold' | 'italic' | 'underline' | 'undo' | 'redo'] = !this.currentAttributes[action as 'bold' | 'italic' | 'underline' | 'undo' | 'redo'];
            this.manualOverride = true;
        }
        // console.log('undo', this.document.undoStack, 'redo', this.document.redoStack);
        this.toolbarView.updateActiveStates(this.currentAttributes);
    }




    handleSelectionChange(): void {

        const [start] = this.getSelectionRange();
        this.imageHandler.currentCursorLocation = start;

        const selection = window.getSelection();
        
        if (!selection || selection.rangeCount === 0) {
            // this.document.selectedBlockId = null;
            
            return;
        }
        if (selection && (selection.isCollapsed === true)) {
            
            this.document.dataIds = [];
            // this.document.selectedBlockId = 'data-id-1734604240404';
            // return;
        }

        const range = selection.getRangeAt(0);
        const parentBlock =
            range.startContainer.parentElement?.closest('[data-id]') || range.startContainer;
        if (parentBlock instanceof HTMLElement) {
            this.document.selectedBlockId =
                parentBlock.getAttribute('data-id') ||
                (range.startContainer instanceof HTMLElement
                    ? range.startContainer.getAttribute('data-id')
                    : null);
        }
        this.syncCurrentAttributesWithCursor();
    }

    handleKeydown(e: KeyboardEvent): void {
        const [start, end] = this.getSelectionRange();
        this.imageHandler.currentCursorLocation = start;
        let ending = end;
        if (e.key === 'Enter') {
            console.log('blocks--->>', this.document.blocks)
            e.preventDefault();
            const uniqueId = `data-id-${Date.now()}`;
            if (this.document.blocks[this.document.blocks.length - 1]?.listType === 'ol' || this.document.blocks[this.document.blocks.length - 1]?.listType === 'ul' || this.document.blocks[this.document.blocks.length - 1]?.listType === 'li') {
                const ListType2 = this.document.blocks[this.document.blocks.length - 2]?.listType;
                const ListType = this.document.blocks[this.document.blocks.length - 1]?.listType;
                let parentId = '';
                let _start = 1;
                let blockListType = ListType;
               
                if (ListType === 'ol') {
                    _start = this.document.blocks[this.document.blocks.length - 1]?.listStart;
                    _start += 1;
                    blockListType = 'li';
                    parentId = this.document.blocks[this.document.blocks.length - 1]?.dataId;
                } else if (ListType === 'li') {
                    _start = this.document.blocks[this.document.blocks.length - 1]?.listStart;
                    _start += 1;
                    parentId = this.document.blocks[this.document.blocks.length - 1]?.parentId;
                }
                //  else if (ListType === 'ol' && ListType2 === null) {
                //     blockListType = 'li';
                // }
                
                this.document.blocks.push({
                    "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
                    "type": "text",
                    // listType: ListType, // null | 'ol' | 'ul'
                    listType: blockListType,
                    parentId: parentId,
                    listStart: ListType === 'ol' || ListType === 'li' ? _start : '',
                })
            } else {
                
                const currentBlockIndex = this.document.blocks.findIndex((block: any) => block.dataId === this.document.selectedBlockId)
                if (this.document.blocks[currentBlockIndex].type === "image") {
                    this.document.blocks.push({
                        "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
                        "type": "text"
                    });
                    this.document.emit('documentChanged', this);
                    this.imageHandler.setCursorPostion(1, uniqueId);
                    return;
                }
                if (this.getCurrentCursorBlock() !== null) {
                    const { remainingText, piece } = this.extractTextFromDataId(this.getCurrentCursorBlock()!.toString());
                    const extractedContent = " " + remainingText;
                    let updatedBlock = this.document.blocks;
                    
                    if (extractedContent.length > 0) {
                        const _extractedContent = remainingText.split(' ');
                        let _pieces = []
                        
                        if (_extractedContent[0] !== '' || _extractedContent[1] !== undefined) {
                            if (piece.length === 1) {
                                _pieces = [new Piece(extractedContent, piece[0].attributes)]
                                

                            } else {
                               
                                _pieces.push(new Piece(" " + _extractedContent[0] + " ", piece[0].attributes))
                                if (piece.length >= 2) {
                                    
                                    piece.forEach((obj: any, i: number) => {
                                        if (i !== 0) {
                                            _pieces.push(obj)
                                        }

                                    })
                                }
                            }


                        } else {
                           
                            _pieces = [new Piece(" ")]
                        }
                        
                        updatedBlock = this.addBlockAfter(this.document.blocks, this.getCurrentCursorBlock()!.toString(), {
                            "dataId": uniqueId, "class": "paragraph-block", "pieces": _pieces,
                            "type": "text"
                            // listType: null, // null | 'ol' | 'ul'
                        });
                        
                        ending = start + extractedContent.length - 1;
                    } else {
                        updatedBlock = this.addBlockAfter(this.document.blocks, this.getCurrentCursorBlock()!.toString(), {
                            "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
                            "type": "text"
                            // listType: null, // null | 'ol' | 'ul'
                        });
                    }

                    this.document.blocks = updatedBlock
                    
                } else {
                    
                    this.document.blocks.push({
                        "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
                        "type": "text"
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
            if (this.imageHandler.isImageHighlighted) {
                const currentBlockIndex = this.document.blocks.findIndex((block: any) => block.dataId === this.imageHandler.highLightedImageDataId);
                
                this.imageHandler.deleteImage();
                this.imageHandler.setCursorPostion(1, this.document.blocks[currentBlockIndex - 1].dataId);
                return;
            }
            const selection = window.getSelection();
           

            if (this.document.dataIds.length >= 1 && this.document.selectAll) {
                
                // this.document.dataIds.forEach(obj => {
                //     this.document.deleteBlocks(obj)
                // })
                this.document.deleteBlocks();
                this.setCursorPosition(start + 1);
            }

            if (start === end && start > 0) {
                // this.document.dataIds.forEach(obj => this.document.deleteRange(start - 1, start, obj, this.document.currentOffset))
                this.document.deleteRange(start - 1, start, this.document.selectedBlockId, this.document.currentOffset);
                this.setCursorPosition(start - 1);
                const index = this.document.blocks.findIndex((block: any) => block.dataId === this.document.selectedBlockId)
                const chkBlock = document.querySelector(`[data-id="${this.document.selectedBlockId}"]`) as HTMLElement
                
                if (chkBlock === null) {
                    // const listType = this.document.blocks[index].listType;
                    // let parentId = this.document.blocks[index]?.parentId;
                    let listStart = 0;
                    const _blocks = this.document.blocks.map((block: any, index: number) => {
                        if (block?.listType !== undefined || block?.listType !== null) {
                            if (block?.listType === 'ol') {
                                listStart = 1;
                                block.listStart = 1;
                            } else if (block?.listType === 'li') {
                                listStart = listStart + 1
                                block.listStart = listStart;
                            }
                        }
                        return block;
                    });
                    
                    this.document.emit('documentChanged', this);
                }
            } else if (end > start) {
                
                // this.document.deleteBlocks();
                // this.document.dataIds.forEach(obj => this.document.deleteRange(start, end, obj, this.document.currentOffset))
                // this.document.deleteBlocks();
                this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
                this.setCursorPosition(start + 1);

            }
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            if (end > start) {
                this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
            }
            this.document.insertAt(e.key, this.currentAttributes, start, this.document.selectedBlockId, this.document.currentOffset);
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

        this.hyperlinkHandler.hideHyperlinkViewButton();
    }


    extractTextFromDataId(dataId: string): { remainingText: string, piece: any } {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return { remainingText: '', piece: null }; // No valid selection
        }

        const range = selection.getRangeAt(0); // Get the current range of the cursor
        const cursorNode = range.startContainer; // The node where the cursor is placed

        // Find the element with the given data-id
        let fText = '';

        let count = 0;
        const _block = this.document.blocks.filter((block: any) => {
            if (block.dataId === dataId) {
                return block;
            }
        })
        const element = document.querySelector(`[data-id="${dataId}"]`) as HTMLElement;
        const textPosition = this.document.getCursorOffsetInParent(`[data-id="${dataId}"]`)
        let _piece: any = [];
        let index = 0;
        _block[0].pieces.forEach((obj: any, i: number) => {
            fText += obj.text
            if (textPosition?.innerText === obj.text) {
                index = i;
                _piece.push(obj);
            }
        })
        if (_block[0].pieces.length > 1) {
            _block[0].pieces.forEach((obj: any, i: number) => {
                if (index < i) {
                    _piece.push(obj)
                }
            })
        }
        

        if (!element) {
            console.error(`Element with data-id "${dataId}" not found.`);
            return { remainingText: '', piece: null }; // No element with the provided data-id
        }

        // Ensure the cursor is inside the specified element
        if (!element.contains(cursorNode)) {
            console.error(`Cursor is not inside the element with data-id "${dataId}".`);
            return { remainingText: '', piece: null }; // Cursor is outside the target element
        }

        // Get the full text content of the element
        // const fullText = element.textContent || '';
        const fullText = fText;
        // Calculate the offset position of the cursor within the text node
        // const cursorOffset = range.startOffset;
        const cursorOffset = textPosition?.offset;

       
        // Extract text from the cursor position to the end
        const remainingText = fullText.slice(cursorOffset);

        // Update the DOM: Keep only the text before the cursor
        const newContent = fullText.slice(0, cursorOffset);
        element.textContent = newContent; // Update the element content with remaining text

        

        return { remainingText: remainingText, piece: _piece }; // Return the extracted text
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
        const blockIndex = this.document.blocks.findIndex((block: any) => block.dataId === this.document.selectedBlockId);
        if (this.document.blocks[blockIndex]?.type === 'image') {
            this.imageHandler.addStyleToImage(this.document.selectedBlockId || "");
        } else {
            if (this.imageHandler.isImageHighlighted) {
                this.imageHandler.clearImageStyling();
            }
        }
        if (start === end) {
            const piece = this.document.findPieceAtOffset(start, this.document.selectedBlockId);
            if (piece) {
                if (piece !== this.lastPiece) {
                    this.manualOverride = false;
                    this.lastPiece = piece;
                }

                if (!this.manualOverride) {
                    this.currentAttributes = {
                        bold: this.currentAttributes.bold || piece.attributes.bold,
                        italic: this.currentAttributes.italic || piece.attributes.italic,
                        underline: this.currentAttributes.underline || piece.attributes.underline,
                        hyperlink: this.currentAttributes.hyperlink || piece.attributes.hyperlink || false,
                        fontFamily: this.currentAttributes.fontFamily || piece.attributes.fontFamily,
                        fontSize: this.currentAttributes.fontSize || piece.attributes.fontSize,
                    };
                    this.toolbarView.updateActiveStates(this.currentAttributes);
                }
                // Show below link..
                const hyperlink = piece?.attributes.hyperlink;
                if (hyperlink && typeof hyperlink === 'string') {
                    this.hyperlinkHandler.showHyperlinkViewButton(hyperlink);
                }
                else {
                    this.hyperlinkHandler.hideHyperlinkViewButton();
                }


            } else {
                if (!this.manualOverride) {
                    this.currentAttributes = { bold: false, italic: false, underline: false, hyperlink: false };
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
export { TextIgniter };
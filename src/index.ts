import TextDocument from "./textDocument";
import EditorView from "./view/editorView";
import ToolbarView from "./view/toolbarView";
import HyperlinkHandler from "./handlers/hyperlink";
import Piece from "./piece";
import { saveSelection, restoreSelection } from "./utils/selectionManager";
import { parseHtmlToPieces } from "./utils/parseHtml";
import { createEditor } from "./config/editorConfig";
import "./styles/text-igniter.css"

import { EditorConfig } from "./types/editorConfig";


export interface CurrentAttributeDTO { bold: boolean; italic: boolean; underline: boolean; undo?: boolean; redo?: boolean, hyperlink?: string | boolean, fontFamily?: string; fontSize?: string; }

class TextIgniter {
    document: TextDocument;
    editorView: EditorView;
    toolbarView: ToolbarView;
    hyperlinkHandler: HyperlinkHandler;
    currentAttributes: CurrentAttributeDTO;
    manualOverride: boolean;
    lastPiece: Piece | null;
    editorContainer: HTMLElement | null;
    toolbarContainer: HTMLElement | null;
    savedSelection: { start: number; end: number } | null = null;

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
        this.currentAttributes = { bold: false, italic: false, underline: false, undo: false, redo: false, hyperlink: false };
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
                    this.hyperlinkHandler.hanldeHyperlinkClick(start, end, this.document.currentOffset, this.document.selectedBlockId, this.document.blocks);
                    break;
            }
        } else {
            this.currentAttributes[action as 'bold' | 'italic' | 'underline' | 'undo' | 'redo'] = !this.currentAttributes[action as 'bold' | 'italic' | 'underline' | 'undo' | 'redo'];
            this.manualOverride = true;
        }
        console.log('undo', this.document.undoStack, 'redo', this.document.redoStack);
        this.toolbarView.updateActiveStates(this.currentAttributes);
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
            console.log('blocks--->>', this.document.blocks)
            e.preventDefault();
            const uniqueId = `data-id-${Date.now()}`;
            if (this.document.blocks[this.document.blocks.length - 1]?.listType === 'ol' || this.document.blocks[this.document.blocks.length - 1]?.listType === 'ul' || this.document.blocks[this.document.blocks.length - 1]?.listType === 'li') {
                const ListType2 = this.document.blocks[this.document.blocks.length - 2]?.listType;
                const ListType = this.document.blocks[this.document.blocks.length - 1]?.listType;
                let parentId = '';
                let _start = 1;
                let blockListType = ListType;
                console.log('action -', ListType2, ListType)
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
                console.log('vk11   0', this.getCurrentCursorBlock())
                this.document.blocks.push({
                    "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
                    // listType: ListType, // null | 'ol' | 'ul'
                    listType: blockListType,
                    parentId: parentId,
                    listStart: ListType === 'ol' || ListType === 'li' ? _start : '',
                })
            } else {
                console.log('vk11   1', this.getCurrentCursorBlock())
                if (this.getCurrentCursorBlock() !== null) {
                    const { remainingText, piece } = this.extractTextFromDataId(this.getCurrentCursorBlock()!.toString());
                    const extractedContent = " " + remainingText;
                    let updatedBlock = this.document.blocks;
                    console.log({ extractedContent })
                    if (extractedContent.length > 0) {
                        const _extractedContent = remainingText.split(' ');
                        let _pieces = []
                        console.log("extractTextFromDataId run if0", _extractedContent, piece)
                        if (_extractedContent[0] !== '' || _extractedContent[1] !== undefined) {
                            if (piece.length === 1) {
                                _pieces = [new Piece(extractedContent, piece[0].attributes)]
                                console.log("extractTextFromDataId run if1", _extractedContent, piece, "_pieces", _pieces)

                            } else {
                                console.log("extractTextFromDataId run else1", _extractedContent, piece)
                                _pieces.push(new Piece(" " + _extractedContent[0] + " ", piece[0].attributes))
                                if (piece.length >= 2) {
                                    console.log("extractTextFromDataId run if2")
                                    piece.forEach((obj: any, i: number) => {
                                        if (i !== 0) {
                                            _pieces.push(obj)
                                        }

                                    })
                                }
                            }


                        } else {
                            console.log("extractTextFromDataId run else0")
                            _pieces = [new Piece(" ")]
                        }
                        console.log(" extractTextFromDataId pieces", _pieces, piece);
                        updatedBlock = this.addBlockAfter(this.document.blocks, this.getCurrentCursorBlock()!.toString(), {
                            "dataId": uniqueId, "class": "paragraph-block", "pieces": _pieces,
                            // listType: null, // null | 'ol' | 'ul'
                        });
                        console.log('schenerio1');
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
                    console.log('jagdiii 1')
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
                const index = this.document.blocks.findIndex((block: any) => block.dataId === this.document.selectedBlockId)
                const chkBlock = document.querySelector(`[data-id="${this.document.selectedBlockId}"]`) as HTMLElement
                console.log(chkBlock, " _block index action")
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
                    console.log(_blocks, " _block index action-----")
                    this.document.emit('documentChanged', this);
                }
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
        console.log("v11, element", element, "_block", _block, textPosition, _piece)

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

        console.log("v11 fullText", fullText, fText, cursorOffset, range)
        // Extract text from the cursor position to the end
        const remainingText = fullText.slice(cursorOffset);

        // Update the DOM: Keep only the text before the cursor
        const newContent = fullText.slice(0, cursorOffset);
        element.textContent = newContent; // Update the element content with remaining text

        console.log('v11 Extracted text:', remainingText);
        console.log('v11 Updated element content:', newContent);

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
        // console.log("oooo",{start});
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
                        hyperlink: piece.attributes.hyperlink || false,
                        fontFamily: piece.attributes.fontFamily,
                        fontSize: piece.attributes.fontSize,
                    };
                    this.toolbarView.updateActiveStates(this.currentAttributes);
                }
                // Show below link..
                const hyperlink = piece?.attributes.hyperlink;
                if (hyperlink && typeof hyperlink === 'string') {
                    this.hyperlinkHandler.showHyperlinkViewButton(hyperlink);
                }
                else {
                    this.hyperlinkHandler.hideHyperlinkViewButton()
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
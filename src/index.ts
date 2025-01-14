import TextDocument from "./textDocument";
import EditorView from "./view/editorView";
import ToolbarView from "./view/toolbarView";
import Piece from "./piece";
import { saveSelection } from "./utils/selectionManager";
import { parseHtmlToPieces } from "./utils/parseHtml";

export interface CurrentAttributeDTO { bold: boolean; italic: boolean; underline: boolean; undo?: boolean; redo?: boolean }

class TextIgniter {
    document: TextDocument;
    editorView: EditorView;
    toolbarView: ToolbarView;
    currentAttributes: CurrentAttributeDTO;
    manualOverride: boolean;
    lastPiece: Piece | null;

    constructor(editorContainer: HTMLElement, toolbarContainer: HTMLElement) {
        this.document = new TextDocument();
        this.editorView = new EditorView(editorContainer, this.document);
        this.toolbarView = new ToolbarView(toolbarContainer);
        this.currentAttributes = { bold: false, italic: false, underline: false, undo: false, redo: false, };
        this.manualOverride = false;
        this.lastPiece = null;
        this.toolbarView.on('toolbarAction', (action: string) => this.handleToolbarAction(action));
        this.document.on('documentChanged', () => this.editorView.render());
        editorContainer.addEventListener('keydown', (e) => this.handleKeydown(e as KeyboardEvent));
        editorContainer.addEventListener('keyup', () => this.syncCurrentAttributesWithCursor());
        
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && !e.altKey) {
                const key = e.key.toLowerCase();
                if (['b', 'i', 'u'].includes(key)) {
                    e.preventDefault();
                    const action = key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'underline';
                    this.handleToolbarAction(action);
                }

                if (key === 'z') {
                    e.preventDefault();
                    this.document.undo();
                } else if (key === 'y') {
                    e.preventDefault();
                    this.document.redo();
                }
                console.log('undo', this.document.undoStack, 'redo', this.document.redoStack);
            }
        });

        document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
        this.document.emit('documentChanged', this.document);

        editorContainer.addEventListener('paste', (e: ClipboardEvent) => {
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

        editorContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        editorContainer.addEventListener('drop', (e: DragEvent) => {
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

    handleToolbarAction(action: string): void {
        const [start, end] = this.getSelectionRange();
        console.log(action, "action---")
        switch (action) {
            case 'orderedList':
                this.document.toggleOrderedList(this.document.selectedBlockId);
                break;
            case 'unorderedList':
                this.document.toggleUnorderedList(this.document.selectedBlockId);
                break;
        }
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
            }
        } else {
            this.currentAttributes[action as 'bold' | 'italic' | 'underline' | 'undo' | 'redo'] = !this.currentAttributes[action as 'bold' | 'italic' | 'underline' | 'undo' | 'redo'];
            this.manualOverride = true;
        }
        console.log('undo', this.document.undoStack, 'redo', this.document.redoStack);
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
                this.document.blocks.push({
                    "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
                    // listType: null, // null | 'ol' | 'ul'
                })
            }

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
        } else if (e.key === "Delete") {
            e.preventDefault();
            if (start === end) { // just a char
                this.document.deleteRange(start, start + 1, this.document.selectedBlockId);
                this.setCursorPosition(start);
            } else if (end > start) { //Selection
                this.document.deleteRange(start, end, this.document.selectedBlockId);
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
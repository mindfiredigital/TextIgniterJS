import TextDocument from "./textDocument";
import EditorView from "./view/editorView";
import ToolbarView from "./view/toolbarView";
import Piece from "./piece";
import { saveSelection } from "./utils/selectionManager";

class TextIgniter {
    document: TextDocument;
    editorView: EditorView;
    toolbarView: ToolbarView;
    currentAttributes: { bold: boolean; italic: boolean; underline: boolean };
    manualOverride: boolean;
    lastPiece: Piece | null;

    constructor(editorContainer: HTMLElement, toolbarContainer: HTMLElement) {
        this.document = new TextDocument();
        this.editorView = new EditorView(editorContainer, this.document);
        this.toolbarView = new ToolbarView(toolbarContainer);
        this.currentAttributes = { bold: false, italic: false, underline: false };
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
            }
        });

        document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
        this.document.emit('documentChanged', this.document);
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
            // this.document.currentOffset = this.document.getCursorOffset(this.editorView.container);
            // this.document.selectedBlockId = uniqueId;
            this.syncCurrentAttributesWithCursor();
            console.log(start, end, end + 1, this.document.getCursorOffset(this.editorView.container), "this.document.currentOffset")
            this.editorView.render()
            this.setCursorPosition(end, uniqueId);
            if (end > start) {
                this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
            }
            // this.document.insertAt('\n', { ...this.currentAttributes }, start);
            // this.setCursorPosition(start + 1);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            console.log(this.document.selectedBlockId, this.document.currentOffset, "this.document.currentOffset backspce")
            if (start === end && start > 0) {
                console.log("runn1 backspce")
                // this.document.blocks = this.document.blocks.filter((obj: any) => {
                //     if (obj.pieces.length === 0) {
                //         return obj;
                //     }
                // });
                this.document.deleteRange(start - 1, start, this.document.selectedBlockId, this.document.currentOffset);
                this.setCursorPosition(start - 1);
            } else if (end > start) {
                console.log("runn2 backspce")

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
        }
    }

    syncCurrentAttributesWithCursor(): void {
        const [start, end] = this.getSelectionRange();
        if (start === end) {
            const piece = this.document.findPieceAtOffset(start, this.document.selectedBlockId);
            console.log(piece, "syncCurrentAttributesWithCursor", this.document.selectedBlockId, "start === end", start, end)
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
            console.log(this.editorView.container, "this.editorView.container", divDataid)
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
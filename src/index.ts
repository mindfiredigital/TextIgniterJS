import TextDocument from "./textDocument";
import EditorView from "./view/editorView";
import ToolbarView from "./view/toolbarView";
import Piece from "./piece";
import { saveSelection } from "./utils/selectionManager";
import { parseHtmlToPieces } from "./utils/parseHtml";

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
                if (['b','i','u'].includes(key)) {
                    e.preventDefault();
                    const action = key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'underline';
                    this.handleToolbarAction(action);
                }
            }
        });
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
                this.document.insertAt(p.text, p.attributes, offset);
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
                this.document.insertAt(p.text, p.attributes, offset);
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
            this.currentAttributes[action as 'bold'|'italic'|'underline'] = !this.currentAttributes[action as 'bold'|'italic'|'underline'];
            this.manualOverride = true;
        }
        this.toolbarView.updateActiveStates(this.currentAttributes);
    }

    handleKeydown(e: KeyboardEvent): void {
        const [start, end] = this.getSelectionRange();
        if (e.key === 'Enter') {
            e.preventDefault();
            if (end > start) {
                this.document.deleteRange(start, end);
            }
            this.document.insertAt('\n', { ...this.currentAttributes }, start);
            this.setCursorPosition(start + 1);
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            if (start === end && start > 0) {
                this.document.deleteRange(start - 1, start);
                this.setCursorPosition(start - 1);
            } else if (end > start) {
                this.document.deleteRange(start, end);
                this.setCursorPosition(start);
            }
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            if (end > start) {
                this.document.deleteRange(start, end);
            }
            this.document.insertAt(e.key, { ...this.currentAttributes }, start);
            this.setCursorPosition(start + 1);
        }
    }

    syncCurrentAttributesWithCursor(): void {
        const [start, end] = this.getSelectionRange();
        if (start === end) {
            const piece = this.document.findPieceAtOffset(start);
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

    setCursorPosition(position: number): void {
        this.editorView.container.focus();
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
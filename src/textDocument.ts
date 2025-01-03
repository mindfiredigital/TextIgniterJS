import EventEmitter from "./utils/events";
import Piece from "./piece";
class TextDocument extends EventEmitter {
    undoStack: { id: string, start: number; end: number; action: string; previousValue: string | null; newValue: string | null }[] = [];
    redoStack: { id: string, start: number; end: number; action: string; previousValue: string | null; newValue: string | null }[] = [];
    pieces: Piece[];
    blocks: any;
    // selectedBlockId: string | null;
    private _selectedBlockId: string | null = null;
    get selectedBlockId(): string | null {
        return this._selectedBlockId;
    }

    set selectedBlockId(value: string | null) {
        if (this._selectedBlockId !== value) {
            this._selectedBlockId = value;
            const editorOffset = this.getCursorOffset(document.querySelector('[id="editor"]') as HTMLElement);
            const paraOffset = this.getCursorOffset(document.querySelector('[data-id="' + value + '"]') as HTMLElement)

            this.currentOffset = editorOffset - paraOffset;
        }
    }
    currentOffset: number;
    constructor() {
        super();
        this.pieces = [new Piece("")];
        this.blocks = [
            { "dataId": 'data-id-1734604240404', "class": "paragraph-block", "pieces": [new Piece(" ")] },
            // { "dataId": 'data-id-1734604240401', "pieces": [new Piece("")] }
        ];
        this.selectedBlockId = 'data-id-1734604240404';
        // this.selectedBlockId = '';

        this.currentOffset = 0;
    }
    getPlainText(): string {
        return this.pieces.map(p => p.text).join("");
    }

    insertAt(text: string, attributes: { bold?: boolean; italic?: boolean; underline?: boolean }, position: number, dataId: string | null = "", currentOffset: number = 0, id = "", actionType = ''): void {
        let offset = 0;
        let newPieces: Piece[] = [];
        let inserted = false;
        let index = 0;
        if (dataId !== '' || dataId !== null) {

            index = this.blocks.findIndex((block: any) => block.dataId === dataId)
            offset = this.currentOffset;
            // offset = this.getCursorOffset(document.querySelector('[data-id="' + dataId + '"]') as HTMLElement);
        }
        const previousValue = this.getRangeText(position, position);
        console.log('run1..', text, position, previousValue)
        // for (let piece of this.pieces) {
        for (let piece of this.blocks[index].pieces) {
            const pieceEnd = offset + piece.text.length;
            if (!inserted && position <= pieceEnd) {
                const relPos = position - offset;
                if (relPos > 0) {
                    newPieces.push(new Piece(piece.text.slice(0, relPos), { ...piece.attributes }));
                }
                newPieces.push(new Piece(text, { bold: attributes.bold || false, italic: attributes.italic || false, underline: attributes.underline || false }));
                if (relPos < piece.text.length) {
                    newPieces.push(new Piece(piece.text.slice(relPos), { ...piece.attributes }));
                }
                inserted = true;
            } else {
                newPieces.push(piece.clone());
            }
            offset = pieceEnd;
        }

        if (!inserted) {
            const lastPiece = newPieces[newPieces.length - 1];
            if (lastPiece && lastPiece.hasSameAttributes(new Piece("", { bold: attributes.bold || false, italic: attributes.italic || false, underline: attributes.underline || false }))) {
                lastPiece.text += text;
            } else {
                newPieces.push(new Piece(text, { bold: attributes.bold || false, italic: attributes.italic || false, underline: attributes.underline || false }));
            }
        }

        const _data = this.mergePieces(newPieces)
        // this.pieces = _data;

        this.blocks[index].pieces = _data
        const newValue = this.getRangeText(position, position + text.length);
        // if (dataId !== '' || dataId !== null) {
        //     const index = this.blocks.findIndex((block: any) => block.dataId === dataId)
        // }
        // Push to undo stack
        if (actionType !== 'redo') {
            const _redoStackIds = this.redoStack.filter(obj => obj.id === id)
            if (_redoStackIds.length === 0) {
                this.undoStack.push({
                    id: Date.now().toString(),
                    start: position,
                    end: position + text.length,
                    action: 'insert',
                    previousValue,
                    newValue
                });

                // Clear redo stack
                this.redoStack = [];
            }
        }
        this.emit('documentChanged', this);
        const ele = document.querySelector('[data-id="' + dataId + '"]') as HTMLElement;
        ele.focus();
        this.setCursorPositionUsingOffset(ele, offset);
    }

    setCursorPositionUsingOffset(element: HTMLElement, offset: number): void {
        element.focus(); // Ensure the element is focusable and focused

        const selection = window.getSelection();
        if (!selection) return;

        const range = document.createRange();
        let currentOffset = 0;

        const traverseNodes = (node: Node): boolean => {
            if (node.nodeType === 3) { // Text node

                const textNode = node as Text;
                const nextOffset = currentOffset + textNode.length;
                console.log("data", nextOffset, textNode)
                if (offset >= currentOffset && offset <= nextOffset) {
                    range.setStart(textNode, offset - currentOffset); // Set the cursor position
                    range.collapse(true); // Collapse the range to a single point (cursor)
                    return true; // Cursor set
                }

                currentOffset = nextOffset;
            } else if (node.nodeType === 1) { // Element node
                const childNodes = Array.from(node.childNodes);
                for (const child of childNodes) {
                    if (traverseNodes(child)) return true;
                }
            }
            return false;
        };

        traverseNodes(element);

        console.log(range, "data")
        // Clear any previous selection and apply the new range
        selection.removeAllRanges();
        selection.addRange(range);
    }

    deleteRange(start: number, end: number, dataId: string | null = "", currentOffset: number = 0): void {

        if (start === end) return;
        let newPieces: Piece[] = [];
        let offset = 0;
        let index = 0;

        if (dataId !== '' || dataId !== null) {

            index = this.blocks.findIndex((block: any) => block.dataId === dataId)
            offset = currentOffset;


        }

        const previousValue = this.getRangeText(start, end);

        console.log(previousValue);
        for (let piece of this.blocks[index].pieces) {
            const pieceEnd = offset + piece.text.length;
            if (pieceEnd <= start || offset >= end) {
                newPieces.push(piece.clone());
            } else {
                const pieceStart = offset;
                const pieceText = piece.text;
                if (start > pieceStart && start < pieceEnd) {
                    newPieces.push(new Piece(pieceText.slice(0, start - pieceStart), { ...piece.attributes }));
                }
                if (end < pieceEnd) {
                    newPieces.push(new Piece(pieceText.slice(end - pieceStart), { ...piece.attributes }));
                }
            }
            offset = pieceEnd;
        }
        console.log(dataId, "dataId", this.currentOffset, "offset", offset, "currentOffset", currentOffset)
        const _data = this.mergePieces(newPieces)

        this.blocks[index].pieces = _data

        
        if (_data.length === 0 && this.blocks.length > 1) {
            this.blocks = this.blocks.filter((blocks: any) => {
                return blocks.pieces.length !== 0;
            });
        }
        const newValue = this.getRangeText(start - 1, end - 1);
        console.log(newValue)

        this.emit('documentChanged', this);
        const ele = document.querySelector('[data-id="' + dataId + '"]') as HTMLElement;
        ele.focus();
        this.setCursorPositionUsingOffset(ele, offset);
        
    }

    getCursorOffset(container: HTMLElement): number {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return -1; // No selection or cursor in the container
        }

        const range = selection.getRangeAt(0);
        let offset = 0;

        const traverseNodes = (node: Node): boolean => {
            if (node === range.startContainer) {
                offset += range.startOffset;
                return true; // Found the cursor
            }

            if (node.nodeType === 3) { // Text node
                offset += node.textContent?.length || 0;
            }

            return Array.from(node.childNodes).some(traverseNodes);
        };

        traverseNodes(container);

        return offset;
    }

    formatAttribute(start: number, end: number, attribute: 'bold' | 'italic' | 'underline' | 'undo' | 'redo', value: boolean): void {
        let newPieces: Piece[] = [];
        let offset = 0;
        let index = -1;
        if (this.selectedBlockId !== '' || this.selectedBlockId !== null) {
            index = this.blocks.findIndex((block: any) => block.dataId === this.selectedBlockId)
            offset = this.currentOffset;
        }

        for (let piece of this.blocks[index].pieces) {

            const pieceEnd = offset + piece.text.length;

            if (pieceEnd <= start || offset >= end) {
                newPieces.push(piece.clone());
            } else {
                const pieceStart = offset;
                const pieceText = piece.text;
                const startInPiece = Math.max(start - pieceStart, 0);
                const endInPiece = Math.min(end - pieceStart, pieceText.length);
                if (startInPiece > 0) {
                    newPieces.push(new Piece(pieceText.slice(0, startInPiece), { ...piece.attributes }));
                }
                const selectedPiece = new Piece(pieceText.slice(startInPiece, endInPiece), { ...piece.attributes });
                selectedPiece.attributes[attribute] = value;
                newPieces.push(selectedPiece);
                if (endInPiece < pieceText.length) {
                    newPieces.push(new Piece(pieceText.slice(endInPiece), { ...piece.attributes }));
                }
            }
            offset = pieceEnd;
        }

        const _data = this.mergePieces(newPieces)
        this.blocks[index].pieces = _data
        this.emit('documentChanged', this);
    }

    getRangeText(start: number, end: number): string {
        let rangeText = '';
        let currentOffset = 0;

        for (const block of this.blocks) {
            for (const piece of block.pieces) {
                const pieceLength = piece.text.length;

                if (currentOffset + pieceLength >= start && currentOffset < end) {
                    const rangeStart = Math.max(0, start - currentOffset);
                    const rangeEnd = Math.min(pieceLength, end - currentOffset);
                    rangeText += piece.text.substring(rangeStart, rangeEnd);
                }

                currentOffset += pieceLength;

                if (currentOffset >= end) {
                    break;
                }
            }

            if (currentOffset >= end) {
                break;
            }
        }

        return rangeText;
    }

    undo(): void {
        const action = this.undoStack.pop();
        console.log(action, "action undo")
        if (!action) return;

        this.redoStack.push(action);
        this.revertAction(action);
    }

    redo(): void {
        const action = this.redoStack.pop();
        console.log(action, "action redo")

        if (!action) return;

        this.undoStack.push(action);
        this.applyAction(action);
    }

    private revertAction(action: { id: string, start: number; end: number; action: string; previousValue: string | null; newValue: string | null }): void {
        switch (action.action) {
            case 'bold':
                this.toggleBoldRange(action.start, action.end, action.id); // Reverse bold toggle
                break;
            case 'italic':
                this.toggleItalicRange(action.start, action.end, action.id);
                break;
            case 'underline':
                this.toggleUnderlineRange(action.start, action.end, action.id);
                break
            case 'insert':
                console.log('insert... delete')
                this.deleteRange(action.start, action.end, this.selectedBlockId, this.currentOffset);
                break;
            // Add cases for other actions like italic, underline, insert, delete
            // ...
        }
    }

    private applyAction(action: { id: string, start: number; end: number; action: string; previousValue: string | null; newValue: string | null }): void {
        switch (action.action) {
            case 'bold':
                this.toggleBoldRange1(action.start, action.end, action.id); // Reapply bold toggle
                break;
            case 'italic':
                this.toggleItalicRange1(action.start, action.end, action.id);
                break;
            case 'underline':
                this.toggleUnderlineRange1(action.start, action.end, action.id);
                break;
            case 'insert':
                console.log('insert... insert')
                this.insertAt(action.newValue || '', {}, action.start, this.selectedBlockId, this.currentOffset, action.id, 'redo');
                // this.setCursorPosition(action.start, action.end, action.id)
                break;
            // Add cases for other actions
            // ...
        }
    }

    toggleBoldRange1(start: number, end: number, id = ""): void {
        const allBold = this.isRangeEntirelyAttribute(start, end, 'bold');
        this.formatAttribute(start, end, 'bold', !allBold);
    }
    toggleItalicRange1(start: number, end: number, id = ""): void {
        const allItalic = this.isRangeEntirelyAttribute(start, end, 'italic');
        this.formatAttribute(start, end, 'italic', !allItalic);
    }

    toggleUnderlineRange1(start: number, end: number, id = ""): void {
        const allUnderline = this.isRangeEntirelyAttribute(start, end, 'underline');
        this.formatAttribute(start, end, 'underline', !allUnderline);
    }

    toggleBoldRange(start: number, end: number, id = ""): void {
        const previousValue = this.getRangeText(start, end);
        const allBold = this.isRangeEntirelyAttribute(start, end, 'bold');
        this.formatAttribute(start, end, 'bold', !allBold);
        const newValue = this.getRangeText(start, end);

        const _redoStackIds = this.redoStack.filter(obj => obj.id === id)
        if (_redoStackIds.length === 0) {
            this.undoStack.push({ id: Date.now().toString(), start, end, action: 'bold', previousValue, newValue });
            this.redoStack = [];
        }
    }

    toggleItalicRange(start: number, end: number, id = ""): void {
        const previousValue = this.getRangeText(start, end);

        const allItalic = this.isRangeEntirelyAttribute(start, end, 'italic');
        this.formatAttribute(start, end, 'italic', !allItalic);

        const newValue = this.getRangeText(start, end);
        const _redoStackIds = this.redoStack.filter(obj => obj.id === id)
        if (_redoStackIds.length === 0) {
            this.undoStack.push({ id: Date.now().toString(), start, end, action: 'italic', previousValue, newValue });
            this.redoStack = [];
        }
    }

    toggleUnderlineRange(start: number, end: number, id = ""): void {
        const previousValue = this.getRangeText(start, end);
        const allUnderline = this.isRangeEntirelyAttribute(start, end, 'underline');
        this.formatAttribute(start, end, 'underline', !allUnderline);

        const newValue = this.getRangeText(start, end);
        const _redoStackIds = this.redoStack.filter(obj => obj.id === id)
        if (_redoStackIds.length === 0) {
            this.undoStack.push({ id: Date.now().toString(), start, end, action: 'underline', previousValue, newValue });
            this.redoStack = [];
        }
    }
    toggleUndoRange(start: number, end: number, id = ""): void {
        const allUndo = this.isRangeEntirelyAttribute(start, end, 'undo');
        this.formatAttribute(start, end, 'undo', !allUndo);
    }
    toggleRedoRange(start: number, end: number): void {
        const allRedo = this.isRangeEntirelyAttribute(start, end, 'redo');
        this.formatAttribute(start, end, 'redo', !allRedo);
    }

    isRangeEntirelyAttribute(start: number, end: number, attr: 'bold' | 'italic' | 'underline' | 'undo' | 'redo'): boolean {
        let offset = this.currentOffset;
        let allHaveAttr = true;

        if (this.selectedBlockId !== '') {
            const index = this.blocks.findIndex((block: any) => block.dataId === this.selectedBlockId)

            for (let piece of this.blocks[index].pieces) {
                const pieceEnd = offset + piece.text.length;
                if (pieceEnd > start && offset < end) {
                    if (!piece.attributes[attr]) {
                        allHaveAttr = false;
                        break;
                    }
                }
                offset = pieceEnd;
            }
        }
        return allHaveAttr;
    }

    mergePieces(pieces: Piece[]): Piece[] {
        let merged: Piece[] = [];
        for (let p of pieces) {
            const last = merged[merged.length - 1];
            if (last && last.hasSameAttributes(p)) {
                last.text += p.text;
            } else {
                merged.push(p);
            }
        }
        return merged;
    }

    findPieceAtOffset(offset: number, dataId: string | null = ""): Piece | null {
        // let currentOffset = 0;
        let currentOffset = this.currentOffset;
        // for (let piece of this.pieces) {
        //     const pieceEnd = currentOffset + piece.text.length;
        //     if (offset >= currentOffset && offset <= pieceEnd) {
        //         return piece;
        //     }
        //     currentOffset = pieceEnd;
        // }
        if (dataId !== '') {
            const index = this.blocks.findIndex((block: any) => block.dataId === dataId)
            for (let piece of this.blocks[index].pieces) {
                const pieceEnd = currentOffset + piece.text.length;
                if (offset >= currentOffset && offset <= pieceEnd) {
                    return piece;
                }
                currentOffset = pieceEnd;
            }
        }
        return null;
    }
}


export default TextDocument;
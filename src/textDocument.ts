import EventEmitter from "./utils/events";
import Piece from "./piece";

// text document extend
class TextDocument extends EventEmitter {
    undoStack: { id: string, start: number; end: number; action: string; previousValue: string | null; newValue: string | null }[] = [];
    redoStack: { id: string, start: number; end: number; action: string; previousValue: string | null; newValue: string | null }[] = [];
    dataIds: string[] = [];
    pieces: Piece[];
    blocks: any;
    selectAll: boolean = false;

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
            {
                "type" : "text",
                "dataId": 'data-id-1734604240404',
                "class": "paragraph-block",
                "alignment": "left",
                "pieces": [new Piece(" ")],
                // listType: null, // null | 'ol' | 'ul' 
            },
            // { "dataId": 'data-id-1734604240401', "pieces": [new Piece("")] }
        ];
        this.selectedBlockId = 'data-id-1734604240404';
        // this.selectedBlockId = '';

        this.currentOffset = 0;
    }
    getPlainText(): string {
        return this.pieces.map(p => p.text).join("");
    }

    insertAt(text: string, attributes: { bold?: boolean; italic?: boolean; underline?: boolean, hyperlink?: boolean | string }, position: number, dataId: string | null = "", currentOffset: number = 0, id = "", actionType = ''): void {
        let offset = 0;
        let newPieces: Piece[] = [];
        let inserted = false;
        let index = 0;
        if (dataId) {
            index = this.blocks.findIndex((block: any) => block.dataId === dataId);
            // index = this.blocks.findIndex((block: any) => block.dataId === dataId)
            offset = this.currentOffset;
        }
        const previousValue = this.getRangeText(position, position);
        
        // for (let piece of this.pieces) {
        for (let piece of this.blocks[index].pieces) {
            const pieceEnd = offset + piece.text.length;
            if (!inserted && position <= pieceEnd) {
                const relPos = position - offset;
                if (relPos > 0) {
                    newPieces.push(new Piece(piece.text.slice(0, relPos), { ...piece.attributes }));
                }
                newPieces.push(new Piece(text, { bold: attributes.bold || false, italic: attributes.italic || false, underline: attributes.underline || false, hyperlink: attributes.hyperlink || false }));
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
            if (lastPiece && lastPiece.hasSameAttributes(new Piece("", { bold: attributes.bold || false, italic: attributes.italic || false, underline: attributes.underline || false, hyperlink: attributes.hyperlink || false }))) {
                lastPiece.text += text;
            } else {
                newPieces.push(new Piece(text, { bold: attributes.bold || false, italic: attributes.italic || false, underline: attributes.underline || false, hyperlink: attributes.hyperlink || false }));
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

        
        // Clear any previous selection and apply the new range
        selection.removeAllRanges();
        selection.addRange(range);
    }

    deleteRange(start: number, end: number, dataId: string | null = "", currentOffset: number = 0): void {
        
        if (start === end) return;
        let newPieces: Piece[] = [];
        let offset = 0;
        let index = 0;
        let runBackspace = false;
        if (dataId !== '' || dataId !== null) {
            index = this.blocks.findIndex((block: any) => block.dataId === dataId)
            
            offset = currentOffset;
        }

        const previousValue = this.getRangeText(start, end);

       
        if (start === offset) {
            for (let piece1 of this.blocks[index - 1].pieces) {
               
                newPieces.push(piece1.clone());
                runBackspace = true;
            }
        }
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
        
        const _data = this.mergePieces(newPieces)

        if (runBackspace) {
            this.blocks[index - 1].pieces = _data
            
            this.blocks[index].pieces = [new Piece(" ")]
            this.blocks = this.blocks.filter((block: any, i: number) => {
                if (i !== index)
                    return block;
            });

        } else
            this.blocks[index].pieces = _data


        if (_data.length === 0 && this.blocks.length > 1) {
            this.blocks = this.blocks.filter((blocks: any) => {
                return blocks.pieces.length !== 0;
            });
        }
        const newValue = this.getRangeText(start - 1, end - 1);
        

        this.emit('documentChanged', this);
        // const ele = document.querySelector('[data-id="' + dataId + '"]') as HTMLElement;
        // ele.focus();
        // this.setCursorPositionUsingOffset(ele, offset);

    }

    deleteBlocks() {
        this.blocks = this.blocks.filter((block: any) => {
            // if (block.dataId === 'data-id-1734604240404') {
            //     block.pieces = [new Piece(" ")]
            //     return block;
            // }
            if (!this.dataIds.includes(block.dataId)) {
                return block;
            }
        })
        this.dataIds = [];
        this.selectAll = false;
        if (this.blocks.length === 0) {
            this.blocks.push({
                "dataId": 'data-id-1734604240404', "class": "paragraph-block", "pieces": [new Piece(" ")],
                // listType: null, // null | 'ol' | 'ul'
            })
        }
        this.emit('documentChanged', this);
    }

    getSelectedTextDataId(): string | null {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return null; // No text is selected
        }

        const range = selection.getRangeAt(0); // Get the current range of selection
        const container = range.startContainer; // The container node of the selection

        // Traverse to the parent element with `data-id` attribute
        const elementWithId = (container.nodeType === Node.TEXT_NODE
            ? container.parentElement
            : container) as HTMLElement;

        const dataIdElement = elementWithId.closest('[data-id]'); // Find the closest ancestor with `data-id`
        return dataIdElement?.getAttribute('data-id') || null; // Return the `data-id` or null if not found
    }

    getAllSelectedDataIds(): string[] {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return []; // No text is selected
        }

        const range = selection.getRangeAt(0); // Get the current range of selection
        const selectedIds: string[] = [];

        // Traverse all nodes in the selection
        const iterator = document.createNodeIterator(
            range.commonAncestorContainer, // Start traversal from the common ancestor
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT // Include element and text nodes
        );

        let currentNode: Node | null;
        while ((currentNode = iterator.nextNode())) {
            if (range.intersectsNode(currentNode)) {
                const element =
                    currentNode.nodeType === Node.TEXT_NODE
                        ? currentNode.parentElement
                        : (currentNode as HTMLElement);

                const dataId = element?.closest('[data-id]')?.getAttribute('data-id');
                if (dataId && !selectedIds.includes(dataId)) {
                    selectedIds.push(dataId); // Add unique data-id to the array
                }
            }
        }
        this.dataIds = selectedIds
        return selectedIds;
    }

    handleCtrlASelection(): string[] {
        const selectedDataIds: string[] = [];
        const editor = document.getElementById('editor'); // Assuming your contenteditable div has id 'editor'

        if (editor) {
            const childNodes = editor.querySelectorAll('[data-id]');
            childNodes.forEach((node) => {
                const dataId = node.getAttribute('data-id');
                if (dataId && !selectedDataIds.includes(dataId)) {
                    selectedDataIds.push(dataId);
                }
            });
        }
        this.dataIds = selectedDataIds;
        
        return selectedDataIds;
        // Now you can use `selectedDataIds` as needed
    }
    getSelectedDataIds(): string[] {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return []; // No text is selected
        }

        const range = selection.getRangeAt(0); // Get the current range of selection
        const selectedIds: string[] = [];

        // Get the start and end nodes of the selection
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;

        // Check if the startContainer or endContainer has a `data-id`
        const startDataId = this.getDataIdFromNode(startContainer);
        const endDataId = this.getDataIdFromNode(endContainer);

        // Add unique data-ids
        if (startDataId && !selectedIds.includes(startDataId)) {
            selectedIds.push(startDataId);
        }
        if (endDataId && !selectedIds.includes(endDataId)) {
            selectedIds.push(endDataId);
        }

        this.dataIds = selectedIds;
        return selectedIds;
    }

    private getDataIdFromNode(node: Node): string | null {
        const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement);
        return element?.closest('[data-id]')?.getAttribute('data-id') || null;
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

            if (node.nodeType === Node.TEXT_NODE) {
                offset += (node.textContent || '').length;
            }

            for (const child of Array.from(node.childNodes)) {
                if (traverseNodes(child)) {
                    return true;
                }
            }

            return false;
        };

        traverseNodes(container);

        return offset;
    }


    formatAttribute(start: number, end: number, attribute: keyof Piece['attributes'],
        // 'bold' | 'italic' | 'underline' | 'undo' | 'redo' | 'fontFamily' | 'fontSize'
        value: string | boolean): void {
        

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
                // selectedPiece.attributes[attribute] = value;
                
                if (
                    (attribute === 'bold' || attribute === 'italic' || attribute === 'underline' || attribute === 'undo' || attribute === 'redo' || attribute === 'hyperlink') &&
                    typeof value === 'boolean'
                ) {
                   
                    selectedPiece.attributes[attribute] = value; // TypeScript knows this is safe
                } else if (
                    (attribute === 'fontFamily' || attribute === 'fontSize' || attribute === 'hyperlink' || attribute === 'fontColor' || attribute === 'bgColor') &&
                    typeof value === 'string'
                ) {
                    
                    selectedPiece.attributes[attribute] = value; // TypeScript knows this is safe
                }
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

    toggleOrderedList(dataId: string | null, listStart: number = 1): void {
        const index = this.blocks.findIndex((block: any) => block.dataId === dataId)
        const block = this.blocks.find((block: any) => block.dataId === dataId);
        if (!block) return;

        block.listType = block.listType === 'ol' ? null : 'ol'; // Toggle between 'ol' and null
        block.listStart = listStart;
        this.blocks[index].listType = block.listType;
        
        this.emit('documentChanged', this);
    }

    toggleUnorderedList(dataId: string | null): void {
        const block = this.blocks.find((block: any) => block.dataId === dataId);
        if (!block) return;

        block.listType = block.listType === 'ul' ? null : 'ul'; // Toggle between 'ul' and null
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
        
        if (!action) return;

        this.redoStack.push(action);
        this.revertAction(action);
    }

    redo(): void {
        const action = this.redoStack.pop();
        

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

    applyFontColor(start: number, end: number, color: string, id = ""): void {
        // const _color = this.isRangeEntirelyAttribute(start, end, 'fontColor');
        if (start < end) {
            
            this.formatAttribute(start, end, "fontColor", color);
        }
    }

    applyBgColor(start: number, end: number, color: string, id = ""): void {
        // const _color = this.isRangeEntirelyAttribute(start, end, 'fontColor');
        if (start < end) {
           
            this.formatAttribute(start, end, "bgColor", color);
        }
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
        let currentOffset = 0;
        if (dataId !== null && dataId !== '') {
            for (let i = 0; i < this.blocks.length; i++) {
                let block = this.blocks[i];
                const blockLenght = block.pieces.reduce((acc: number, currVal: Piece) => acc + currVal.text.length, 0);
                if (block.dataId == dataId) {
                    for (let piece of block.pieces) {
                        const pieceEnd = currentOffset + piece.text.length;
                        if (offset >= currentOffset && offset < pieceEnd) {
                            return piece;
                        }
                        currentOffset = pieceEnd;
                    }
                } else {
                    currentOffset += blockLenght;
                }
            }
        }
        return null;
    }

    setFontFamily(start: number, end: number, fontFamily: string): void {
        this.formatAttribute(start, end, 'fontFamily', fontFamily);
    }

    setFontSize(start: number, end: number, fontSize: string): void {
        this.formatAttribute(start, end, 'fontSize', fontSize);
    }
    setAlignment(alignment: 'left' | 'center' | 'right', dataId: string | null): void {
        const block = this.blocks.find((block: any) => block.dataId === dataId);
        if (!block) return;

        block.alignment = alignment; // Update alignment
        this.emit('documentChanged', this); // Trigger re-render
    }

    getHtmlContent() {
        const editorContainer = document.getElementById("editor"); // Adjust to your editor's ID
        if (!editorContainer) {
            console.error("Editor container not found.");
            return;
        }

        const htmlContent = editorContainer.innerHTML;
        

        // You can also copy it to the clipboard
        navigator.clipboard.writeText(htmlContent).then(() => {
            console.log("HTML copied to clipboard!");
        }).catch(err => console.error("Failed to copy HTML:", err));
        return htmlContent;
    }



    getCursorOffsetInParent(parentSelector: string): {
        offset: number; childNode: Node | null, innerHTML: string;
        innerText: string;
    } | null {
        const parentElement = document.querySelector(parentSelector);
        if (!parentElement) return null;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);

        // Ensure the cursor is within the parent element
        if (!parentElement.contains(range.startContainer)) return null;

        let offset = 0;
        let targetNode: Node | null = null;
        const walker = document.createTreeWalker(parentElement, NodeFilter.SHOW_TEXT, null);
        let matchedChild = null;
        // Traverse text nodes to calculate the total offset
        while (walker.nextNode()) {
            const currentNode = walker.currentNode;
            if (currentNode === range.startContainer) {
                offset += range.startOffset; // Add the offset in the current node
                targetNode = currentNode; // This is the child containing the cursor
                matchedChild = currentNode.parentElement;
                break;
            } else {
                offset += currentNode.textContent?.length || 0;
            }
        }


        return {
            offset, childNode: targetNode, innerHTML: matchedChild!.innerHTML,
            innerText: matchedChild!.innerText
        };
    }
}


export default TextDocument;

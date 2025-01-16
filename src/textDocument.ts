import EventEmitter from "./utils/events";
import Piece from "./piece";
class TextDocument extends EventEmitter {
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
    insertAt(text: string, attributes: { bold?: boolean; italic?: boolean; underline?: boolean,hyperlink?:boolean|string }, position: number, dataId: string | null = "", currentOffset: number = 0): void {
        let offset = 0;
        let newPieces: Piece[] = [];
        let inserted = false;
        let index = 0;
        if (dataId !== '' || dataId !== null) {
            index = this.blocks.findIndex((block: any) => block.dataId === dataId);

            // index = this.blocks.findIndex((block: any) => block.dataId === dataId)
            // offset = this.currentOffset;
            // offset = this.getCursorOffset(document.querySelector('[data-id="' + dataId + '"]') as HTMLElement);
        }
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
        // if (dataId !== '' || dataId !== null) {
        //     const index = this.blocks.findIndex((block: any) => block.dataId === dataId)
        // }
        this.emit('documentChanged', this);
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
        
        this.blocks[index].pieces = _data
        
        if (_data.length === 0 && this.blocks.length > 1) {
            this.blocks = this.blocks.filter((blocks: any) => {
                return blocks.pieces.length !== 0;
            });
        }
        
        this.emit('documentChanged', this);
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
    
    applyHyperlinkRange(start: number, end: number, url: string): void {
        this.formatAttribute(start, end, 'hyperlink', url);
    }

    removeHyperlinkRange(start: number, end: number): void {
        this.formatAttribute(start, end, 'hyperlink', false);
    }

    getCommonHyperlinkInRange(start: number, end: number): string | null {
        let offset = this.currentOffset;
        let index = 0;
        if (this.selectedBlockId) {
            index = this.blocks.findIndex((block: any) => block.dataId === this.selectedBlockId);
        }
        const pieces = this.blocks[index].pieces;
        let commonLink: string | null = null;

        for (let piece of pieces) {
            const pieceEnd = offset + piece.text.length;
            if (pieceEnd > start && offset < end) {
                const pieceLink = piece.attributes.hyperlink || null;
                if (commonLink === null) {
                    commonLink = pieceLink;
                } else if (commonLink !== pieceLink) {
                    // Different hyperlinks in selection
                    return null;
                }
            }
            offset = pieceEnd;
        }
        return commonLink;
    }


    formatAttribute(start: number, end: number, attribute: 'bold' | 'italic' | 'underline' | 'hyperlink', value: string|boolean): void {
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

    toggleBoldRange(start: number, end: number): void {
        const allBold = this.isRangeEntirelyAttribute(start, end, 'bold');
        this.formatAttribute(start, end, 'bold', !allBold);
    }

    toggleItalicRange(start: number, end: number): void {
        const allItalic = this.isRangeEntirelyAttribute(start, end, 'italic');
        this.formatAttribute(start, end, 'italic', !allItalic);
    }

    toggleUnderlineRange(start: number, end: number): void {
        const allUnderline = this.isRangeEntirelyAttribute(start, end, 'underline');
        this.formatAttribute(start, end, 'underline', !allUnderline);
    }

    isRangeEntirelyAttribute(start: number, end: number, attr: 'bold' | 'italic' | 'underline'): boolean {
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

    // findPieceAtOffset(offset: number, dataId: string | null = ""): Piece | null {
    //     // let currentOffset = 0;
    //     let currentOffset = this.currentOffset;
    //     // for (let piece of this.pieces) {
    //     //     const pieceEnd = currentOffset + piece.text.length;
    //     //     if (offset >= currentOffset && offset <= pieceEnd) {
    //     //         return piece;
    //     //     }
    //     //     currentOffset = pieceEnd;
    //     // }
    //     if (dataId !== '') {
    //         const index = this.blocks.findIndex((block: any) => block.dataId === dataId)
    //         for (let piece of this.blocks[index].pieces) {
    //             const pieceEnd = currentOffset + piece.text.length;
    //             if (offset >= currentOffset && offset <= pieceEnd) {
    //                 return piece;
    //             }
    //             currentOffset = pieceEnd;
    //         }
    //     }
    //     return null;
    // }
    findPieceAtOffset(offset: number, dataId: string | null = ""): Piece | null {
        let currentOffset = 0;
        if (dataId !== null && dataId !== '') {
            const index = this.blocks.findIndex((block: any) => block.dataId === dataId);
            if (index >= 0) {
                for (let piece of this.blocks[index].pieces) {
                    const pieceEnd = currentOffset + piece.text.length;
                    if (offset >= currentOffset && offset < pieceEnd) {
                        return piece;
                    }
                    currentOffset = pieceEnd;
                }
            }
        }
        return null;
    }
}


export default TextDocument;
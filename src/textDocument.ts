import EventEmitter from "./utils/events";
import Piece from "./piece";
class TextDocument extends EventEmitter {
    pieces: Piece[];
    constructor() {
        super();
        this.pieces = [new Piece("")];
    }
    getPlainText(): string {
        return this.pieces.map(p => p.text).join("");
    }
    insertAt(text: string, attributes: { bold?: boolean; italic?: boolean; underline?: boolean }, position: number): void {
        let offset = 0;
        let newPieces: Piece[] = [];
        let inserted = false;

        for (let piece of this.pieces) {
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

        this.pieces = this.mergePieces(newPieces);
        this.emit('documentChanged', this);
    }

    deleteRange(start: number, end: number): void {
        if (start === end) return;
        let newPieces: Piece[] = [];
        let offset = 0;
        for (let piece of this.pieces) {
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
        this.pieces = this.mergePieces(newPieces);
        this.emit('documentChanged', this);
    }

    formatAttribute(start: number, end: number, attribute: 'bold'|'italic'|'underline', value: boolean): void {
        let newPieces: Piece[] = [];
        let offset = 0;

        for (let piece of this.pieces) {
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

        this.pieces = this.mergePieces(newPieces);
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

    isRangeEntirelyAttribute(start: number, end: number, attr: 'bold'|'italic'|'underline'): boolean {
        let offset = 0;
        let allHaveAttr = true;
        for (let piece of this.pieces) {
            const pieceEnd = offset + piece.text.length;
            if (pieceEnd > start && offset < end) {
                if (!piece.attributes[attr]) {
                    allHaveAttr = false;
                    break;
                }
            }
            offset = pieceEnd;
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

    findPieceAtOffset(offset: number): Piece | null {
        let currentOffset = 0;
        for (let piece of this.pieces) {
            const pieceEnd = currentOffset + piece.text.length;
            if (offset >= currentOffset && offset <= pieceEnd) {
                return piece;
            }
            currentOffset = pieceEnd;
        }
        return null;
    }
}


export default TextDocument;
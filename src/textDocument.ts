import { Piece } from './piece';

export class TextDocument {
    pieces: Piece[];

    constructor(text: string = "") {
        this.pieces = [new Piece(text)];
    }

    getPlainText(): string {
        return this.pieces.map(piece => piece.text).join("");
    }

    formatBold(start: number, end: number): void {
        let newPieces: Piece[] = [];
        let offset = 0;
        let selectionFullyBold = true;
        let selectionContainsBold = false;

        // First pass: Determine if the entire selection is bold
        for (let piece of this.pieces) {
            const pieceEnd = offset + piece.text.length;

            if (pieceEnd <= start || offset >= end) {
                // Outside the selection range
            } else {
                if (!piece.isBold()) {
                    selectionFullyBold = false;
                } else {
                    selectionContainsBold = true;
                }
            }

            offset = pieceEnd;
        }

        const shouldBold = !selectionFullyBold;

        // Reset offset for second pass
        offset = 0;

        // Second pass: Apply bold formatting accordingly
        for (let piece of this.pieces) {
            const pieceEnd = offset + piece.text.length;

            if (pieceEnd <= start || offset >= end) {
                // Outside the selection range
                newPieces.push(piece.clone());
            } else {
                let currentPiece = piece.clone();
                let pieceStart = offset;
                let pieceText = currentPiece.text;

                if (pieceStart < start && pieceEnd > end) {
                    // Selection is inside this piece; split into three
                    const beforeText = pieceText.slice(0, start - pieceStart);
                    const selectedText = pieceText.slice(start - pieceStart, end - pieceStart);
                    const afterText = pieceText.slice(end - pieceStart);

                    newPieces.push(new Piece(beforeText, { ...currentPiece.attributes }));
                    const selectedPiece = new Piece(selectedText, { ...currentPiece.attributes });
                    selectedPiece.setBold(shouldBold);
                    newPieces.push(selectedPiece);
                    newPieces.push(new Piece(afterText, { ...currentPiece.attributes }));
                } else if (pieceStart < start) {
                    // Selection starts in the middle of this piece
                    const beforeText = pieceText.slice(0, start - pieceStart);
                    const afterText = pieceText.slice(start - pieceStart);

                    newPieces.push(new Piece(beforeText, { ...currentPiece.attributes }));
                    currentPiece.text = afterText;
                    currentPiece.setBold(shouldBold);
                    newPieces.push(currentPiece);
                } else if (pieceEnd > end) {
                    // Selection ends in the middle of this piece
                    const selectedText = pieceText.slice(0, end - pieceStart);
                    const afterText = pieceText.slice(end - pieceStart);

                    currentPiece.text = selectedText;
                    currentPiece.setBold(shouldBold);
                    newPieces.push(currentPiece);
                    newPieces.push(new Piece(afterText, { ...piece.attributes }));
                } else {
                    // The entire piece is within the selection
                    currentPiece.setBold(shouldBold);
                    newPieces.push(currentPiece);
                }
            }

            offset = pieceEnd;
        }

        this.pieces = this.mergePieces(newPieces);
    }

    mergePieces(pieces: Piece[]): Piece[] {
        let merged: Piece[] = [];
        for (let piece of pieces) {
            const last = merged[merged.length - 1];
            if (last && this.areAttributesEqual(last.attributes, piece.attributes)) {
                last.text += piece.text; // Merge adjacent pieces with the same attributes
            } else {
                merged.push(piece);
            }
        }
        return merged;
    }

    areAttributesEqual(attr1: Record<string, any>, attr2: Record<string, any>): boolean {
        return JSON.stringify(attr1) === JSON.stringify(attr2);
    }

    render(container: HTMLElement): void {
        container.innerHTML = ""; // Clear the container
        this.pieces.forEach(piece => {
            if (piece.isBold()) {
                const element = document.createElement("strong");
                element.textContent = piece.text;
                container.appendChild(element);
            } else {
                // Plain text node if not bold
                container.appendChild(document.createTextNode(piece.text));
            }
        });
    }
}

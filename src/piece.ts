class Piece {
    text: string;
    attributes: { bold: boolean; italic: boolean; underline: boolean, undo?: boolean, redo?: boolean };
    constructor(text: string, attributes: { bold?: boolean; italic?: boolean; underline?: boolean; undo?: boolean; redo?: boolean } = {}) {
        this.text = text;
        this.attributes = {
            bold: attributes.bold || false,
            italic: attributes.italic || false,
            underline: attributes.underline || false,
            undo: attributes.undo || false,
            redo: attributes.redo || false
        };
    }
    isBold(): boolean { return this.attributes.bold; }
    setBold(v: boolean): void { this.attributes.bold = v; }
    isItalic(): boolean { return this.attributes.italic; }
    isUndo(): boolean | undefined { return this.attributes.undo; }
    isRedo(): boolean | undefined { return this.attributes.redo; }

    setItalic(v: boolean): void { this.attributes.italic = v; }
    isUnderline(): boolean { return this.attributes.underline; }
    setUnderline(v: boolean): void { this.attributes.underline = v; }
    setUndo(v: boolean): void { this.attributes.undo = v; }
    setRedo(v: boolean): void { this.attributes.redo = v; }

    clone(): Piece {
        return new Piece(this.text, { ...this.attributes });
    }
    hasSameAttributes(other: Piece): boolean {
        return this.attributes.bold === other.attributes.bold &&
            this.attributes.italic === other.attributes.italic &&
            this.attributes.underline === other.attributes.underline &&
            this.attributes.undo === other.attributes.undo &&
            this.attributes.redo === other.attributes.redo
    }
}

export default Piece;
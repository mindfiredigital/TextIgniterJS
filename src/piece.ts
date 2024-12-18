class Piece {
    text: string;
    attributes: { bold: boolean; italic: boolean; underline: boolean };
    constructor(text: string, attributes: { bold?: boolean; italic?: boolean; underline?: boolean } = {}) {
        this.text = text;
        this.attributes = {
            bold: attributes.bold || false,
            italic: attributes.italic || false,
            underline: attributes.underline || false
        };
    }
    isBold(): boolean { return this.attributes.bold; }
    setBold(v: boolean): void { this.attributes.bold = v; }
    isItalic(): boolean { return this.attributes.italic; }
    setItalic(v: boolean): void { this.attributes.italic = v; }
    isUnderline(): boolean { return this.attributes.underline; }
    setUnderline(v: boolean): void { this.attributes.underline = v; }
    clone(): Piece {
        return new Piece(this.text, { ...this.attributes });
    }
    hasSameAttributes(other: Piece): boolean {
        return this.attributes.bold === other.attributes.bold &&
               this.attributes.italic === other.attributes.italic &&
               this.attributes.underline === other.attributes.underline;
    }
}

export default Piece;
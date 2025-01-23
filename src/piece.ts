class Piece {
    text: string;
    attributes: { bold: boolean; italic: boolean; underline: boolean, hyperlink?: string | boolean;image?: string;
    };
    constructor(text: string, attributes: { bold?: boolean; italic?: boolean; underline?: boolean,hyperlink?: string | boolean;image?: string;
    } = {}) {
        this.text = text;
        this.attributes = {
            bold: attributes.bold || false,
            italic: attributes.italic || false,
            underline: attributes.underline || false,
            hyperlink: attributes.hyperlink || false,
            image: attributes.image,
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
               this.attributes.underline === other.attributes.underline &&
               this.attributes.hyperlink === other.attributes.hyperlink &&
               this.attributes.image === other.attributes.image;
    }
    getHyperlink(): string | boolean {
        return this.attributes.hyperlink || false;
    }
    setHyperlink(url: string | boolean): void {
        this.attributes.hyperlink = url;
    }
}

export default Piece;
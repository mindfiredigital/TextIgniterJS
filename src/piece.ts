export class Piece {
    public text: string;
    public attributes: Record<string, any>;

    constructor(text: string, attributes: Record<string, any> = {}) {
        this.text = text;
        this.attributes = { ...attributes };
    }

    isBold(): boolean {
        return this.attributes.bold || false;
    }

    setBold(value: boolean): void {
        this.attributes.bold = value;
    }

    clone(): Piece {
        return new Piece(this.text, { ...this.attributes });
    }
}

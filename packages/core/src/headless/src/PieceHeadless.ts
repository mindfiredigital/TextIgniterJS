type PieceAttributes = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontFamily?: string;
  fontSize?: string;
  fontColor?: string;
  bgColor?: string;
  hyperlink?: string | boolean;
};

class Piece {
  text: string;
  attributes: Required<PieceAttributes> & {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    fontFamily: string;
    fontSize: string;
    fontColor: string;
    bgColor: string;
    hyperlink: string | boolean;
  };

  constructor(text: string, attributes: PieceAttributes = {}) {
    this.text = text;

    this.attributes = {
      bold: attributes.bold || false,
      italic: attributes.italic || false,
      underline: attributes.underline || false,
      strikethrough: attributes.strikethrough || false,
      fontFamily: attributes.fontFamily || 'Arial',
      fontSize: attributes.fontSize || '16px',
      fontColor: attributes.fontColor || '#000000',
      bgColor: attributes.bgColor || '#ffffff',
      hyperlink: attributes.hyperlink || false,
    };
  }

  isBold() {
    return this.attributes.bold;
  }
  setBold(v: boolean) {
    this.attributes.bold = v;
  }
}

export default Piece;

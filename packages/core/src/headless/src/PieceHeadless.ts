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

// Function to get active font size (similar to reading from dropdown in core)
let getActiveFontSizeFn: (() => string) | null = null;
let getActiveFontColorFn: (() => string) | null = null;

export function setActiveFontSizeGetter(fn: () => string) {
  getActiveFontSizeFn = fn;
}

export function setActiveFontColorGetter(fn: () => string) {
  getActiveFontColorFn = fn;
}

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

    // Get active values (similar to reading from dropdown in core Piece constructor)
    const activeFontSize = getActiveFontSizeFn ? getActiveFontSizeFn() : '16px';
    const activeFontColor = getActiveFontColorFn
      ? getActiveFontColorFn()
      : '#000000';

    this.attributes = {
      bold: attributes.bold || false,
      italic: attributes.italic || false,
      underline: attributes.underline || false,
      strikethrough: attributes.strikethrough || false,
      fontFamily: attributes.fontFamily || 'Arial',
      fontSize: attributes.fontSize || activeFontSize, // Use active font size if not provided (like core)
      fontColor: attributes.fontColor || activeFontColor, // Use active font color if not provided (like core)
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

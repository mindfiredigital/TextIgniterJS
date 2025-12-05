import type { PieceAttributes } from '../types';
import {
  DEFAULT_FONT_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
  DEFAULT_BG_COLOR,
} from '../constants';

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
    const activeFontSize = getActiveFontSizeFn
      ? getActiveFontSizeFn()
      : DEFAULT_FONT_SIZE;
    const activeFontColor = getActiveFontColorFn
      ? getActiveFontColorFn()
      : DEFAULT_FONT_COLOR;

    this.attributes = {
      bold: attributes.bold || false,
      italic: attributes.italic || false,
      underline: attributes.underline || false,
      strikethrough: attributes.strikethrough || false,
      fontFamily: attributes.fontFamily || DEFAULT_FONT_FAMILY,
      fontSize: attributes.fontSize || activeFontSize, // Use active font size if not provided (like core)
      fontColor: attributes.fontColor || activeFontColor, // Use active font color if not provided (like core)
      bgColor: attributes.bgColor || DEFAULT_BG_COLOR,
      hyperlink: attributes.hyperlink || false,
    };
  }

  isBold(): boolean {
    return this.attributes.bold;
  }

  setBold(v: boolean): void {
    this.attributes.bold = v;
  }

  /**
   * Checks if this piece has the same attributes as another piece.
   * Used by mergePieces to determine if two pieces should be merged.
   */
  hasSameAttributes(other: Piece): boolean {
    return (
      this.attributes.bold === other.attributes.bold &&
      this.attributes.italic === other.attributes.italic &&
      this.attributes.underline === other.attributes.underline &&
      (this.attributes.strikethrough || false) ===
        (other.attributes.strikethrough || false) &&
      this.attributes.fontFamily === other.attributes.fontFamily &&
      this.attributes.fontSize === other.attributes.fontSize &&
      this.attributes.fontColor === other.attributes.fontColor &&
      this.attributes.bgColor === other.attributes.bgColor &&
      this.attributes.hyperlink === other.attributes.hyperlink
    );
  }
}

export default Piece;

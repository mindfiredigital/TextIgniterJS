declare class Piece {
  text: string;
  attributes: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    undo?: boolean;
    redo?: boolean;
    fontFamily?: string;
    fontSize?: string;
    hyperlink?: string | boolean;
    fontColor?: string;
    bgColor: string;
  };
  constructor(
    text: string,
    attributes?: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      undo?: boolean;
      redo?: boolean;
      fontFamily?: string;
      fontSize?: string;
      hyperlink?: string | boolean;
      fontColor?: string;
      bgColor?: string;
    }
  );
  isBold(): boolean;
  setBold(v: boolean): void;
  isItalic(): boolean;
  isUndo(): boolean | undefined;
  isRedo(): boolean | undefined;
  setItalic(v: boolean): void;
  isUnderline(): boolean;
  setUnderline(v: boolean): void;
  setUndo(v: boolean): void;
  setRedo(v: boolean): void;
  clone(): Piece;
  hasSameAttributes(other: Piece): boolean;
  getHyperlink(): string | boolean;
  setHyperlink(url: string | boolean): void;
}
export default Piece;

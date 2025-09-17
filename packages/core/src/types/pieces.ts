export type blockType = any;

// Ensure hyperlink is properly typed in the attributes interface
export interface PieceAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  hyperlink?: string | boolean; // Link attribute
  fontFamily?: string;
  fontSize?: string;
  fontColor?: string;
  bgColor?: string;
}

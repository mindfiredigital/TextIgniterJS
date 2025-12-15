export type TextAttribute = 'bold' | 'italic' | 'underline' | 'strikethrough';
export type BlockType = 'text' | 'image';
export type Alignment = 'left' | 'center' | 'right' | 'justify';

export interface PieceAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontFamily?: string;
  fontSize?: string;
  fontColor?: string;
  bgColor?: string;
  hyperlink?: string | boolean;
}

// Note: Block uses Piece from core/Piece
// Import Piece type where Block is used to get proper typing
export interface Block<PieceType = any> {
  type: BlockType;
  dataId: string;
  class: string;
  alignment: Alignment;
  pieces: PieceType[];
  image?: string; // For image blocks: data URL of the image
}

import Piece from './Piece';
import type { Block, TextAttribute } from '../types';
import { mergePieces } from '../utils/pieceMerger';

class TextDocument {
  blocks: Block<Piece>[] = [];
  selectedBlockId: string | null = null;
  currentOffset: number = 0;

  /**
   * Checks if a range is entirely covered by a specific attribute.
   */
  isRangeEntirelyAttribute(
    start: number,
    end: number,
    attr: TextAttribute
  ): boolean {
    const block = this.blocks.find(b => b.dataId === this.selectedBlockId);
    if (!block) return false;

    let offset = 0;
    let allTrue = true;

    for (const piece of block.pieces) {
      const pieceEnd = offset + piece.text.length;
      if (pieceEnd <= start) {
        offset = pieceEnd;
        continue;
      }
      if (offset >= end) break;

      const inRangeStart = Math.max(start, offset);
      const inRangeEnd = Math.min(end, pieceEnd);

      if (inRangeEnd > inRangeStart && !piece.attributes[attr]) {
        allTrue = false;
        break;
      }
      offset = pieceEnd;
    }

    return allTrue;
  }

  /**
   * Formats a range with a specific attribute value.
   * This is the core formatting method used by all formatting operations.
   */
  formatAttribute(
    start: number,
    end: number,
    attr: TextAttribute,
    value: boolean
  ): void {
    const block = this.blocks.find(b => b.dataId === this.selectedBlockId);
    if (!block) return;

    const newPieces: Piece[] = [];
    let offset = 0;

    for (const piece of block.pieces) {
      const pieceEnd = offset + piece.text.length;

      if (pieceEnd <= start || offset >= end) {
        newPieces.push(piece);
      } else {
        // Split the piece at the range boundaries
        const pieceStart = offset;
        const pieceText = piece.text;
        const startInPiece = Math.max(start - pieceStart, 0);
        const endInPiece = Math.min(end - pieceStart, pieceText.length);

        if (startInPiece > 0) {
          newPieces.push(
            new Piece(pieceText.slice(0, startInPiece), { ...piece.attributes })
          );
        }

        // Create selected piece with updated attribute
        const selectedPiece = new Piece(
          pieceText.slice(startInPiece, endInPiece),
          { ...piece.attributes, [attr]: value }
        );
        newPieces.push(selectedPiece);

        if (endInPiece < pieceText.length) {
          newPieces.push(
            new Piece(pieceText.slice(endInPiece), { ...piece.attributes })
          );
        }
      }

      offset = pieceEnd;
    }

    // Merge adjacent pieces with identical attributes
    block.pieces = mergePieces(newPieces);
  }

  /**
   * Applies font color to a range.
   */
  formatColor(start: number, end: number, color: string): void {
    this.formatAttributeValue(start, end, 'fontColor', color);
  }

  /**
   * Applies font size to a range.
   */
  formatSize(start: number, end: number, size: string): void {
    this.formatAttributeValue(start, end, 'fontSize', size);
  }

  /**
   * Generic method to format a range with a specific attribute value.
   * Used by formatColor and formatSize.
   */
  private formatAttributeValue(
    start: number,
    end: number,
    attr: 'fontColor' | 'fontSize',
    value: string
  ): void {
    const block = this.blocks.find(b => b.dataId === this.selectedBlockId);
    if (!block) return;

    const newPieces: Piece[] = [];
    let offset = 0;

    for (const piece of block.pieces) {
      const pieceEnd = offset + piece.text.length;

      if (pieceEnd <= start || offset >= end) {
        newPieces.push(piece);
      } else {
        // Split the piece at the range boundaries
        const pieceStart = offset;
        const pieceText = piece.text;
        const startInPiece = Math.max(start - pieceStart, 0);
        const endInPiece = Math.min(end - pieceStart, pieceText.length);

        if (startInPiece > 0) {
          newPieces.push(
            new Piece(pieceText.slice(0, startInPiece), { ...piece.attributes })
          );
        }

        // Create selected piece with updated attribute
        const selectedPiece = new Piece(
          pieceText.slice(startInPiece, endInPiece),
          { ...piece.attributes, [attr]: value }
        );
        newPieces.push(selectedPiece);

        if (endInPiece < pieceText.length) {
          newPieces.push(
            new Piece(pieceText.slice(endInPiece), { ...piece.attributes })
          );
        }
      }

      offset = pieceEnd;
    }

    // Merge adjacent pieces with identical attributes
    block.pieces = mergePieces(newPieces);
  }
}

export default TextDocument;

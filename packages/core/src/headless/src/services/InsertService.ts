import HeadlessState from '../core/HeadlessState';
import Piece from '../core/Piece';
import type { Block } from '../types';

type BlockWithPieces = Block<Piece>;
import { mergePieces } from '../utils/pieceMerger';

/**
 * Service for handling text insertion at specific positions.
 */
class InsertService {
  constructor(private state: HeadlessState) {}

  /**
   * Inserts text at a specific position with active formatting.
   * This is used when user types new text - it inserts with active font size/color.
   */
  insertAt(position: number, text: string): void {
    const doc = this.state.getDocument();
    if (!doc.selectedBlockId) {
      doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;
    }

    const block = doc.blocks.find(b => b.dataId === doc.selectedBlockId) as
      | BlockWithPieces
      | undefined;
    if (!block) return;

    const newPieces: Piece[] = [];
    let offset = 0;
    let inserted = false;

    for (const piece of block.pieces) {
      const pieceEnd = offset + piece.text.length;

      if (!inserted && position <= pieceEnd) {
        // Split at insertion point
        const relPos = position - offset;

        if (relPos > 0) {
          // Keep text before insertion point
          newPieces.push(
            new Piece(piece.text.slice(0, relPos), { ...piece.attributes })
          );
        }

        // Insert new text with active formatting
        newPieces.push(
          new Piece(text, {
            fontColor: this.state.getActiveFontColor(),
            fontSize: this.state.getActiveFontSize(),
          })
        );

        if (relPos < piece.text.length) {
          // Keep text after insertion point
          newPieces.push(
            new Piece(piece.text.slice(relPos), { ...piece.attributes })
          );
        }

        inserted = true;
      } else {
        newPieces.push(piece);
      }

      offset = pieceEnd;
    }

    // If position is beyond all pieces, append at end
    if (!inserted) {
      newPieces.push(
        new Piece(text, {
          fontColor: this.state.getActiveFontColor(),
          fontSize: this.state.getActiveFontSize(),
        })
      );
    }

    // Merge adjacent pieces with identical attributes
    block.pieces = mergePieces(newPieces);
  }
}

export default InsertService;

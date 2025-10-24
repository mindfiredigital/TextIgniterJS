import Piece from './PieceHeadless';

type Block = {
  type: 'text';
  dataId: string;
  class: string;
  alignment: string;
  pieces: Piece[];
};

class TextDocument {
  blocks: Block[] = [];
  selectedBlockId: string | null = null;
  currentOffset: number = 0;

  isRangeEntirelyAttribute(
    start: number,
    end: number,
    attr: 'bold' | 'italic' | 'underline' | 'strikethrough'
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

  formatAttribute(
    start: number,
    end: number,
    attr: 'bold' | 'italic' | 'underline' | 'strikethrough',
    value: boolean
  ) {
    const block = this.blocks.find(b => b.dataId === this.selectedBlockId);
    if (!block) return;

    const newPieces: Piece[] = [];
    let offset = 0;

    for (const piece of block.pieces) {
      const pieceEnd = offset + piece.text.length;

      if (pieceEnd <= start || offset >= end) {
        newPieces.push(piece);
      } else {
        const before = piece.text.slice(0, Math.max(0, start - offset));
        const middle = piece.text.slice(
          Math.max(0, start - offset),
          Math.min(piece.text.length, end - offset)
        );
        const after = piece.text.slice(
          Math.min(piece.text.length, end - offset)
        );

        if (before) newPieces.push(new Piece(before, { ...piece.attributes }));
        if (middle)
          newPieces.push(
            new Piece(middle, { ...piece.attributes, [attr]: value })
          );
        if (after) newPieces.push(new Piece(after, { ...piece.attributes }));
      }

      offset = pieceEnd;
    }

    const merged: Piece[] = [];
    for (const p of newPieces) {
      const last = merged[merged.length - 1];
      if (
        last &&
        JSON.stringify(last.attributes) === JSON.stringify(p.attributes)
      ) {
        last.text += p.text;
      } else {
        merged.push(p);
      }
    }

    block.pieces = merged;
  }
}

export default TextDocument;

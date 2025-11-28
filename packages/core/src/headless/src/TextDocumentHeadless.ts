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
        // Split the piece (matches core formatAttribute behavior)
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

    // Merge adjacent pieces with identical attributes (matches core mergePieces)
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

  // ✅ Apply font color to a range (matches core formatAttribute behavior)
  formatColor(start: number, end: number, color: string) {
    const block = this.blocks.find(b => b.dataId === this.selectedBlockId);
    if (!block) return;

    const newPieces: Piece[] = [];
    let offset = 0;

    for (const piece of block.pieces) {
      const pieceEnd = offset + piece.text.length;

      if (pieceEnd <= start || offset >= end) {
        newPieces.push(piece);
      } else {
        // Split the piece (matches core formatAttribute behavior exactly)
        const pieceStart = offset;
        const pieceText = piece.text;
        const startInPiece = Math.max(start - pieceStart, 0);
        const endInPiece = Math.min(end - pieceStart, pieceText.length);

        if (startInPiece > 0) {
          newPieces.push(
            new Piece(pieceText.slice(0, startInPiece), { ...piece.attributes })
          );
        }

        // Create selected piece with updated fontColor (matches core)
        const selectedPiece = new Piece(
          pieceText.slice(startInPiece, endInPiece),
          { ...piece.attributes, fontColor: color }
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

    // Merge adjacent pieces with identical attributes (matches core mergePieces)
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

  // ✅ Apply font size to a range (matches core setFontSize -> formatAttribute behavior)
  formatSize(start: number, end: number, size: string) {
    // Use the same formatAttribute logic as core, but for fontSize
    // This ensures consistent behavior
    const block = this.blocks.find(b => b.dataId === this.selectedBlockId);
    if (!block) return;

    const newPieces: Piece[] = [];
    let offset = 0;

    for (const piece of block.pieces) {
      const pieceEnd = offset + piece.text.length;

      if (pieceEnd <= start || offset >= end) {
        newPieces.push(piece);
      } else {
        // Split the piece (matches core formatAttribute behavior exactly)
        const pieceStart = offset;
        const pieceText = piece.text;
        const startInPiece = Math.max(start - pieceStart, 0);
        const endInPiece = Math.min(end - pieceStart, pieceText.length);

        if (startInPiece > 0) {
          newPieces.push(
            new Piece(pieceText.slice(0, startInPiece), { ...piece.attributes })
          );
        }

        // Create selected piece with updated fontSize (matches core)
        const selectedPiece = new Piece(
          pieceText.slice(startInPiece, endInPiece),
          { ...piece.attributes, fontSize: size }
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

    // Merge adjacent pieces with identical attributes (matches core mergePieces)
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

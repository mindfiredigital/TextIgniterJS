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

  // Check if entire range is bold
  isRangeEntirelyAttribute(start: number, end: number, attr: 'bold'): boolean {
    const block = this.blocks.find(b => b.dataId === this.selectedBlockId);
    if (!block) return false;

    let count = 0;
    for (const piece of block.pieces) {
      if (piece.attributes[attr]) count += piece.text.length;
    }
    return count >= end - start;
  }

  // Toggle attribute in range
  formatAttribute(start: number, end: number, attr: 'bold', value: boolean) {
    const block = this.blocks.find(b => b.dataId === this.selectedBlockId);
    if (!block) return;
    for (const piece of block.pieces) {
      piece.attributes[attr] = value;
    }
  }
}

export default TextDocument;

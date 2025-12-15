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
   * Applies font family to a range.
   */
  formatFamily(start: number, end: number, family: string): void {
    this.formatAttributeValue(start, end, 'fontFamily', family);
  }

  /**
   * Generic method to format a range with a specific attribute value.
   * Used by formatColor and formatSize.
   */
  private formatAttributeValue(
    start: number,
    end: number,
    attr: 'fontColor' | 'fontSize' | 'fontFamily',
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

  /**
   * Inserts an image at the specified position in the current block.
   * Creates an image block and optionally a new text block after it.
   * Matches core module behavior.
   * @param dataId - The data-id of the current block
   * @param position - The cursor position relative to the start of the block
   * @param imageDataUrl - The data URL of the image to insert
   */
  insertImageAtPosition(
    dataId: string | null,
    position: number,
    imageDataUrl: string
  ): string {
    console.log('[TextDocument] insertImageAtPosition called', {
      dataId,
      position,
      imageDataUrlLength: imageDataUrl?.length,
      blocksCount: this.blocks.length,
    });

    if (!imageDataUrl) {
      console.error('[TextDocument] No imageDataUrl provided');
      return dataId || '';
    }

    const currentBlockIndex = this.blocks.findIndex(b => b.dataId === dataId);
    console.log('[TextDocument] Current block index:', currentBlockIndex);

    // Create image block
    const imageBlockId = `headless-${Date.now()}`;
    const textBlockId = `headless-${Date.now() + 1}`;
    console.log('[TextDocument] Created IDs:', { imageBlockId, textBlockId });

    const imageBlock: Block<Piece> = {
      type: 'image',
      dataId: imageBlockId,
      class: 'paragraph-block',
      alignment: 'left',
      pieces: [new Piece(' ')],
      image: imageDataUrl,
    };
    console.log('[TextDocument] Image block created:', {
      type: imageBlock.type,
      dataId: imageBlock.dataId,
      hasImage: !!imageBlock.image,
    });

    // If we have a current block and it's a text block, split it
    if (currentBlockIndex >= 0) {
      const currentBlock = this.blocks[currentBlockIndex];

      if (currentBlock.type === 'text' && position >= 0) {
        const fullText = currentBlock.pieces.map(p => p.text).join('');
        const beforeText = fullText.slice(0, position);
        const afterText = fullText.slice(position);

        // Update current block with text before cursor
        if (currentBlock.pieces.length > 0) {
          const lastPiece = currentBlock.pieces[currentBlock.pieces.length - 1];
          currentBlock.pieces = [
            new Piece(beforeText || ' ', lastPiece.attributes),
          ];
        }

        // Create new text block with remaining text
        const textBlock: Block<Piece> = {
          type: 'text',
          dataId: textBlockId,
          class: 'paragraph-block',
          alignment: currentBlock.alignment || 'left',
          pieces:
            afterText.trim().length > 0
              ? [new Piece(afterText, currentBlock.pieces[0]?.attributes || {})]
              : [new Piece(' ')],
        } as Block<Piece>;

        // Insert image block and text block after current block
        this.blocks.splice(currentBlockIndex + 1, 0, imageBlock, textBlock);
        this.selectedBlockId = textBlockId;
        return textBlockId;
      }
    }

    // No current block or not a text block - just append image and text blocks
    this.blocks.push(imageBlock);
    const textBlock: Block<Piece> = {
      type: 'text',
      dataId: textBlockId,
      class: 'paragraph-block',
      alignment: 'left',
      pieces: [new Piece(' ')],
    } as Block<Piece>;
    this.blocks.push(textBlock);
    this.selectedBlockId = textBlockId;
    return textBlockId;
  }

  /**
   * Deletes an image block by its dataId.
   * @param dataId - The data-id of the image block to delete
   */
  deleteImageBlock(dataId: string): void {
    if (!dataId) return;

    // Find and remove the block
    const blockIndex = this.blocks.findIndex(b => b.dataId === dataId);
    if (blockIndex >= 0 && this.blocks[blockIndex].type === 'image') {
      this.blocks.splice(blockIndex, 1);

      // If we deleted the selected block, select the next available block
      if (this.selectedBlockId === dataId) {
        if (this.blocks.length > 0) {
          // Select the block at the same index, or the previous one if we deleted the last
          const newIndex =
            blockIndex < this.blocks.length ? blockIndex : blockIndex - 1;
          if (newIndex >= 0) {
            this.selectedBlockId = this.blocks[newIndex].dataId;
          } else if (this.blocks.length > 0) {
            this.selectedBlockId = this.blocks[0].dataId;
          } else {
            this.selectedBlockId = null;
          }
        } else {
          this.selectedBlockId = null;
        }
      }
    }
  }
}

export default TextDocument;

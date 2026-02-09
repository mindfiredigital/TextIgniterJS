import HeadlessState from '../core/HeadlessState';
import Piece from '../core/Piece';
import type { Block } from '../types';

type BlockWithPieces = Block<Piece>;
import { mergePieces } from '../utils/pieceMerger';
import {
  findCommonPrefix,
  findCommonSuffix,
  isAppended,
  isPrepended,
} from '../utils/textDiff';

/**
 * Service for handling text updates while preserving formatting.
 * NOTE: This should NOT be called on every input event as it resets formatting.
 * It's only for initial setup or when you need to sync text from editor.
 */
class TextUpdateService {
  constructor(private state: HeadlessState) {}

  /**
   * Updates the plain text content while preserving existing formatting when possible.
   */
  update(text: string): void {
    const doc = this.state.getDocument();
    const block = doc.blocks.find(b => b.dataId === doc.selectedBlockId);
    if (!block) return;

    if (block.pieces.length === 1) {
      this.updateSinglePiece(block, text);
    } else {
      this.updateMultiplePieces(block, text);
    }
  }

  /**
   * Handles text update when there's only one piece.
   */
  private updateSinglePiece(block: BlockWithPieces, text: string): void {
    const existingText = block.pieces[0].text;
    const existingFontSize = block.pieces[0].attributes.fontSize;
    const existingFontColor = block.pieces[0].attributes.fontColor;
    const activeFontSize = this.state.getActiveFontSize();
    const activeFontColor = this.state.getActiveFontColor();

    // If new text starts with existing text, text was appended
    if (isAppended(existingText, text)) {
      this.handleAppend(block, existingText, text);
      return;
    }

    // If new text ends with existing text, text was prepended
    if (isPrepended(existingText, text)) {
      this.handlePrepend(block, existingText, text);
      return;
    }

    // If text was inserted in the middle or completely replaced
    // Check if active formatting differs from existing piece
    if (
      activeFontSize !== existingFontSize ||
      activeFontColor !== existingFontColor
    ) {
      this.handleFormattingChange(block, existingText, text, {
        existingFontSize,
        existingFontColor,
        activeFontSize,
        activeFontColor,
      });
      return;
    }

    // If formatting hasn't changed or we can't determine insertion point,
    // just update the text (this preserves the piece's formatting)
    block.pieces[0].text = text;
    block.pieces = mergePieces(block.pieces);
  }

  /**
   * Handles text update when there are multiple pieces.
   */
  private updateMultiplePieces(block: BlockWithPieces, text: string): void {
    const currentTextLength = block.pieces.reduce(
      (sum, p) => sum + p.text.length,
      0
    );
    const currentModelText = block.pieces.map(p => p.text).join('');

    // If text length matches, likely just a sync - preserve structure
    if (text.length === currentTextLength) {
      this.handleSync(block, text);
      return;
    }

    // Text length changed - user typed new text or deleted text
    // Try to preserve existing pieces by detecting where text was added/removed

    // If the new text starts with the old text, text was appended at the end
    if (isAppended(currentModelText, text)) {
      this.handleAppend(block, currentModelText, text);
      return;
    }

    // If the new text ends with the old text, text was prepended at the start
    if (isPrepended(currentModelText, text)) {
      this.handlePrepend(block, currentModelText, text);
      return;
    }

    // Try to find where text was inserted by finding the longest common prefix and suffix
    this.handleMiddleInsert(block, currentModelText, text);
  }

  /**
   * Handles appending text at the end.
   */
  private handleAppend(
    block: BlockWithPieces,
    existingText: string,
    newText: string
  ): void {
    const appended = newText.slice(existingText.length);
    if (appended) {
      block.pieces.push(
        new Piece(appended, {
          fontColor: this.state.getActiveFontColor(),
          fontSize: this.state.getActiveFontSize(),
        })
      );
      block.pieces = mergePieces(block.pieces);
    }
  }

  /**
   * Handles prepending text at the start.
   */
  private handlePrepend(
    block: BlockWithPieces,
    existingText: string,
    newText: string
  ): void {
    const prepended = newText.slice(0, newText.length - existingText.length);
    if (prepended) {
      block.pieces.unshift(
        new Piece(prepended, {
          fontColor: this.state.getActiveFontColor(),
          fontSize: this.state.getActiveFontSize(),
        })
      );
      block.pieces = mergePieces(block.pieces);
    }
  }

  /**
   * Handles text sync when length matches (preserves piece structure).
   */
  private handleSync(block: BlockWithPieces, text: string): void {
    let offset = 0;
    for (const piece of block.pieces) {
      const pieceLength = piece.text.length;
      piece.text = text.slice(offset, offset + pieceLength);
      // Don't update attributes - preserve existing formatting
      offset += pieceLength;
    }
    block.pieces = mergePieces(block.pieces);
  }

  /**
   * Handles formatting change when active formatting differs from existing.
   */
  private handleFormattingChange(
    block: BlockWithPieces,
    existingText: string,
    text: string,
    formatting: {
      existingFontSize: string;
      existingFontColor: string;
      activeFontSize: string;
      activeFontColor: string;
    }
  ): void {
    const prefixLength = findCommonPrefix(existingText, text);
    const suffixLength = findCommonSuffix(existingText, text);

    // If we found significant overlap, split into pieces
    if (prefixLength > 0 || suffixLength > 0) {
      const newPieces: Piece[] = [];

      if (prefixLength > 0) {
        // Keep prefix with existing formatting
        newPieces.push(
          new Piece(text.slice(0, prefixLength), {
            fontColor: formatting.existingFontColor,
            fontSize: formatting.existingFontSize,
          })
        );
      }

      // Insert new text with active formatting
      const insertedText = text.slice(prefixLength, text.length - suffixLength);
      if (insertedText) {
        newPieces.push(
          new Piece(insertedText, {
            fontColor: formatting.activeFontColor,
            fontSize: formatting.activeFontSize,
          })
        );
      }

      if (suffixLength > 0) {
        // Keep suffix with existing formatting
        newPieces.push(
          new Piece(text.slice(text.length - suffixLength), {
            fontColor: formatting.existingFontColor,
            fontSize: formatting.existingFontSize,
          })
        );
      }

      block.pieces = mergePieces(newPieces);
      return;
    }

    // If we can't determine insertion point, just update the text
    block.pieces[0].text = text;
    block.pieces = mergePieces(block.pieces);
  }

  /**
   * Handles text insertion in the middle of multiple pieces.
   */
  private handleMiddleInsert(
    block: BlockWithPieces,
    currentModelText: string,
    text: string
  ): void {
    const prefixLength = findCommonPrefix(currentModelText, text);
    const suffixLength = findCommonSuffix(currentModelText, text);

    // If we found a significant overlap, try to preserve existing pieces
    if (prefixLength + suffixLength > currentModelText.length * 0.5) {
      const newPieces = this.preservePiecesWithInsert(
        block,
        prefixLength,
        suffixLength,
        text,
        currentModelText.length
      );
      block.pieces = mergePieces(newPieces);
      return;
    }

    // If we can't preserve pieces intelligently, rebuild with active formatting
    // This is a fallback for complex edits
    block.pieces = [
      new Piece(text, {
        fontColor: this.state.getActiveFontColor(),
        fontSize: this.state.getActiveFontSize(),
      }),
    ];
  }

  /**
   * Preserves existing pieces while inserting new text in the middle.
   */
  private preservePiecesWithInsert(
    block: BlockWithPieces,
    prefixLength: number,
    suffixLength: number,
    text: string,
    currentTextLength: number
  ): Piece[] {
    const newPieces: Piece[] = [];
    let offset = 0;
    let prefixProcessed = 0;

    // Process pieces that are part of the prefix
    for (const piece of block.pieces) {
      const pieceEnd = offset + piece.text.length;
      if (pieceEnd <= prefixLength) {
        // This piece is entirely in the prefix - keep it
        newPieces.push(piece);
        prefixProcessed = pieceEnd;
      } else if (offset < prefixLength) {
        // This piece spans the prefix boundary - split it
        const splitPos = prefixLength - offset;
        newPieces.push(
          new Piece(piece.text.slice(0, splitPos), { ...piece.attributes })
        );
        prefixProcessed = prefixLength;

        // Insert new text here
        const insertedText = text.slice(
          prefixLength,
          text.length - suffixLength
        );
        if (insertedText) {
          newPieces.push(
            new Piece(insertedText, {
              fontColor: this.state.getActiveFontColor(),
              fontSize: this.state.getActiveFontSize(),
            })
          );
        }

        // Add the rest of the piece if it's not part of suffix
        if (pieceEnd > text.length - suffixLength) {
          const remainingText = piece.text.slice(splitPos);
          newPieces.push(new Piece(remainingText, { ...piece.attributes }));
        }
        break;
      } else {
        break;
      }
      offset = pieceEnd;
    }

    // If we didn't process all pieces, add the inserted text and remaining pieces
    if (prefixProcessed < prefixLength) {
      const insertedText = text.slice(prefixLength, text.length - suffixLength);
      if (insertedText) {
        newPieces.push(
          new Piece(insertedText, {
            fontColor: this.state.getActiveFontColor(),
            fontSize: this.state.getActiveFontSize(),
          })
        );
      }
    }

    // Add pieces that match the suffix
    offset = 0;
    const suffixStart = currentTextLength - suffixLength;
    for (const piece of block.pieces) {
      const pieceEnd = offset + piece.text.length;
      if (offset >= suffixStart) {
        newPieces.push(piece);
      } else if (pieceEnd > suffixStart) {
        // This piece spans the suffix boundary
        const splitPos = suffixStart - offset;
        const suffixText = piece.text.slice(splitPos);
        newPieces.push(new Piece(suffixText, { ...piece.attributes }));
      }
      offset = pieceEnd;
    }

    return newPieces;
  }
}

export default TextUpdateService;

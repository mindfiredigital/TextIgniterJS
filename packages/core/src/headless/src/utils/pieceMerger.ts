import Piece from '../core/Piece';

/**
 * Merges adjacent pieces with identical attributes for performance optimization.
 * This prevents creating one span per character, which is inefficient.
 * Uses Piece.hasSameAttributes() method for consistent comparison.
 */
export function mergePieces(pieces: Piece[]): Piece[] {
  if (pieces.length === 0) return pieces;

  const merged: Piece[] = [];
  for (const piece of pieces) {
    const last = merged[merged.length - 1];
    // Use hasSameAttributes() method for consistent comparison
    if (last && last.hasSameAttributes(piece)) {
      // Merge with previous piece if attributes are identical
      last.text += piece.text;
    } else {
      merged.push(piece);
    }
  }
  return merged;
}

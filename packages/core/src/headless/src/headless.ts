import TextDocument from './TextDocumentHeadless';
import Piece, {
  setActiveFontSizeGetter,
  setActiveFontColorGetter,
} from './PieceHeadless';

let _doc: TextDocument | null = null;
let activeFontColor: string = '#000000';
let activeFontSize: string = '16px';

// Set up getters so Piece constructor can access active values (like core reads from dropdown)
setActiveFontSizeGetter(() => activeFontSize);
setActiveFontColorGetter(() => activeFontColor);

export function initHeadless(content = '') {
  _doc = new TextDocument();
  const id = `headless-${Date.now()}`;
  _doc.blocks = [
    {
      type: 'text',
      dataId: id,
      class: 'paragraph-block',
      alignment: 'left',
      pieces: [new Piece(content)],
    },
  ];
  _doc.selectedBlockId = id;
  _doc.currentOffset = 0;
  return _doc;
}

function getDoc(): TextDocument {
  if (!_doc) _doc = initHeadless('');
  return _doc;
}

// Export getDoc for debugging/syncing purposes
export function getDocForSync(): TextDocument {
  return getDoc();
}

// Helper function to merge adjacent pieces with identical attributes
// ✅ Merge adjacent pieces with identical attributes (performance optimization)
// This matches the core editor's mergePieces behavior EXACTLY
// Uses Piece.hasSameAttributes() method (same as core) instead of JSON.stringify
// CRITICAL: This prevents creating one span per character, which is inefficient
function mergePieces(pieces: Piece[]): Piece[] {
  if (pieces.length === 0) return pieces;

  const merged: Piece[] = [];
  for (const p of pieces) {
    const last = merged[merged.length - 1];
    // Use hasSameAttributes() method (matches core editor exactly)
    if (last && last.hasSameAttributes(p)) {
      // Merge with previous piece if attributes are identical
      // This combines adjacent pieces with same formatting into one span
      last.text += p.text;
    } else {
      merged.push(p);
    }
  }
  return merged;
}

// ✅ Update text typing — preserve existing formatting if possible
// NOTE: This should NOT be called on every input event as it resets formatting
// It's only for initial setup or when you need to sync text from editor
export function updatePlainText(text: string) {
  const doc = getDoc();
  const block = doc.blocks.find(b => b.dataId === doc.selectedBlockId);
  if (!block) return;

  // Calculate total text length from existing pieces
  const currentTextLength = block.pieces.reduce(
    (sum, p) => sum + p.text.length,
    0
  );

  // If text length matches and we have multiple pieces, try to preserve structure
  // Otherwise, if we have a single piece or text changed significantly, update it
  if (block.pieces.length === 1) {
    // Single piece - check if text was appended or prepended
    const existingText = block.pieces[0].text;
    const existingFontSize = block.pieces[0].attributes.fontSize;
    const existingFontColor = block.pieces[0].attributes.fontColor;

    // If new text starts with existing text, text was appended
    if (text.startsWith(existingText)) {
      const newText = text.slice(existingText.length);
      if (newText) {
        // Add new piece with active formatting (preserves existing piece)
        block.pieces.push(
          new Piece(newText, {
            fontColor: activeFontColor,
            fontSize: activeFontSize,
          })
        );
        // Merge adjacent pieces with identical attributes (performance optimization)
        block.pieces = mergePieces(block.pieces);
      }
      return;
    }

    // If new text ends with existing text, text was prepended
    if (text.endsWith(existingText)) {
      const newText = text.slice(0, text.length - existingText.length);
      if (newText) {
        // Add new piece at beginning with active formatting (preserves existing piece)
        block.pieces.unshift(
          new Piece(newText, {
            fontColor: activeFontColor,
            fontSize: activeFontSize,
          })
        );
        // Merge adjacent pieces with identical attributes (performance optimization)
        block.pieces = mergePieces(block.pieces);
      }
      return;
    }

    // If text was inserted in the middle or completely replaced
    // Check if active formatting differs from existing piece
    if (
      activeFontSize !== existingFontSize ||
      activeFontColor !== existingFontColor
    ) {
      // Formatting changed - split the text to preserve existing formatting
      // Find where the text differs to determine insertion point
      let prefixLength = 0;
      let suffixLength = 0;

      // Find longest common prefix
      while (
        prefixLength < existingText.length &&
        prefixLength < text.length &&
        existingText[prefixLength] === text[prefixLength]
      ) {
        prefixLength++;
      }

      // Find longest common suffix
      while (
        suffixLength < existingText.length - prefixLength &&
        suffixLength < text.length - prefixLength &&
        existingText[existingText.length - 1 - suffixLength] ===
          text[text.length - 1 - suffixLength]
      ) {
        suffixLength++;
      }

      // If we found significant overlap, split into pieces
      if (prefixLength > 0 || suffixLength > 0) {
        const newPieces: Piece[] = [];

        if (prefixLength > 0) {
          // Keep prefix with existing formatting
          newPieces.push(
            new Piece(text.slice(0, prefixLength), {
              fontColor: existingFontColor,
              fontSize: existingFontSize,
            })
          );
        }

        // Insert new text with active formatting
        const insertedText = text.slice(
          prefixLength,
          text.length - suffixLength
        );
        if (insertedText) {
          newPieces.push(
            new Piece(insertedText, {
              fontColor: activeFontColor,
              fontSize: activeFontSize,
            })
          );
        }

        if (suffixLength > 0) {
          // Keep suffix with existing formatting
          newPieces.push(
            new Piece(text.slice(text.length - suffixLength), {
              fontColor: existingFontColor,
              fontSize: existingFontSize,
            })
          );
        }

        // Merge adjacent pieces with identical attributes (performance optimization)
        block.pieces = mergePieces(newPieces);
        return;
      }
    }

    // If formatting hasn't changed or we can't determine insertion point,
    // just update the text (this preserves the piece's formatting)
    block.pieces[0].text = text;
    // Always merge after any modification to ensure optimization
    block.pieces = mergePieces(block.pieces);
    return;
  }

  // Multiple pieces exist - check if text length matches
  // If it matches, assume formatting is preserved and don't reset
  // If it doesn't match, we need to handle text changes intelligently
  if (text.length === currentTextLength) {
    // Text length matches - likely just a sync, don't reset pieces
    // Just update text content while preserving piece structure
    let offset = 0;
    for (const piece of block.pieces) {
      const pieceLength = piece.text.length;
      piece.text = text.slice(offset, offset + pieceLength);
      // Don't update attributes - preserve existing formatting
      offset += pieceLength;
    }
    // Always merge after any modification to ensure optimization
    block.pieces = mergePieces(block.pieces);
    return;
  }

  // Text length changed - user typed new text or deleted text
  // Try to preserve existing pieces by detecting where text was added/removed

  // Get current model text
  const currentModelText = block.pieces.map(p => p.text).join('');

  // If the new text starts with the old text, text was appended at the end
  if (text.startsWith(currentModelText)) {
    // Text was appended at the end - add new piece with active formatting
    const newText = text.slice(currentModelText.length);
    if (newText) {
      block.pieces.push(
        new Piece(newText, {
          fontColor: activeFontColor,
          fontSize: activeFontSize,
        })
      );
      // Merge adjacent pieces with identical attributes (performance optimization)
      block.pieces = mergePieces(block.pieces);
    }
    return;
  }

  // If the new text ends with the old text, text was prepended at the start
  if (text.endsWith(currentModelText)) {
    // Text was prepended at the start - add new piece at beginning
    const newText = text.slice(0, text.length - currentModelText.length);
    if (newText) {
      block.pieces.unshift(
        new Piece(newText, {
          fontColor: activeFontColor,
          fontSize: activeFontSize,
        })
      );
      // Merge adjacent pieces with identical attributes (performance optimization)
      block.pieces = mergePieces(block.pieces);
    }
    return;
  }

  // Try to find where text was inserted by finding the longest common prefix and suffix
  // This helps preserve pieces when text is inserted in the middle
  let prefixLength = 0;
  let suffixLength = 0;

  // Find longest common prefix
  while (
    prefixLength < currentModelText.length &&
    prefixLength < text.length &&
    currentModelText[prefixLength] === text[prefixLength]
  ) {
    prefixLength++;
  }

  // Find longest common suffix
  while (
    suffixLength < currentModelText.length - prefixLength &&
    suffixLength < text.length - prefixLength &&
    currentModelText[currentModelText.length - 1 - suffixLength] ===
      text[text.length - 1 - suffixLength]
  ) {
    suffixLength++;
  }

  // If we found a significant overlap, try to preserve existing pieces
  if (prefixLength + suffixLength > currentModelText.length * 0.5) {
    // Text was likely inserted in the middle
    // Keep pieces that match the prefix and suffix, insert new text in between
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
              fontColor: activeFontColor,
              fontSize: activeFontSize,
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
            fontColor: activeFontColor,
            fontSize: activeFontSize,
          })
        );
      }
    }

    // Add pieces that match the suffix
    offset = 0;
    let suffixStart = currentModelText.length - suffixLength;
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

    // Merge adjacent pieces with identical attributes
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
    return;
  }

  // If we can't preserve pieces intelligently, rebuild with active formatting
  // This is a fallback for complex edits
  block.pieces = [
    new Piece(text, { fontColor: activeFontColor, fontSize: activeFontSize }),
  ];
}

// ✅ Font color handling
export function setActiveFontColor(color: string) {
  activeFontColor = color;
}

export function getActiveFontColor() {
  return activeFontColor;
}

export function toggleFontColor(start: number, end: number, color: string) {
  const doc = getDoc();
  if (!doc.selectedBlockId) doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;

  // Apply font color to range (matches core formatAttribute behavior)
  doc.formatColor(start, end, color);

  // Update active font color so new text uses this color (like dropdown value in core)
  activeFontColor = color;

  return getContentHtml();
}

// ✅ Font size handling
export function setActiveFontSize(size: string) {
  activeFontSize = size;
}

export function getActiveFontSize() {
  return activeFontSize;
}

export function toggleFontSize(start: number, end: number, size: string) {
  const doc = getDoc();
  if (!doc.selectedBlockId) doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;

  // Apply font size to range (matches core setFontSize behavior)
  doc.formatSize(start, end, size);

  // Update active font size so new text uses this size (like dropdown value in core)
  activeFontSize = size;

  return getContentHtml();
}

// ✅ Insert text at position with active formatting (matches core insertAt behavior)
// This is used when user types new text - it inserts with active font size/color
export function insertTextAt(position: number, text: string) {
  const doc = getDoc();
  if (!doc.selectedBlockId) doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;

  const block = doc.blocks.find(b => b.dataId === doc.selectedBlockId);
  if (!block) return getContentHtml();

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

      // Insert new text with active formatting (like core Piece constructor reads from dropdown)
      newPieces.push(
        new Piece(text, {
          fontColor: activeFontColor,
          fontSize: activeFontSize,
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
        fontColor: activeFontColor,
        fontSize: activeFontSize,
      })
    );
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
  return getContentHtml();
}

// ✅ Style toggles (unchanged)
function toggleStyle(
  start: number,
  end: number,
  attr: 'bold' | 'italic' | 'underline' | 'strikethrough'
): string {
  const doc = getDoc();
  if (!doc.selectedBlockId) doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;

  const allActive = doc.isRangeEntirelyAttribute(start, end, attr);
  doc.formatAttribute(start, end, attr, !allActive);
  return getContentHtml();
}

export const toggleBold = (s: number, e: number) => toggleStyle(s, e, 'bold');
export const toggleItalic = (s: number, e: number) =>
  toggleStyle(s, e, 'italic');
export const toggleUnderline = (s: number, e: number) =>
  toggleStyle(s, e, 'underline');
export const toggleStrikethrough = (s: number, e: number) =>
  toggleStyle(s, e, 'strikethrough');

// ✅ Updated renderer: split pieces correctly
export function getContentHtml(): string {
  const doc = getDoc();
  let html = '';

  for (const block of doc.blocks) {
    if (block.type === 'text') {
      let inner = '';
      for (const piece of block.pieces) {
        let txt = piece.text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        // Apply text formatting tags
        if (piece.attributes.bold) txt = `<b>${txt}</b>`;
        if (piece.attributes.italic) txt = `<i>${txt}</i>`;
        if (piece.attributes.underline) txt = `<u>${txt}</u>`;
        if (piece.attributes.strikethrough) txt = `<s>${txt}</s>`;

        // Build style attributes - only include if different from defaults
        const styles: string[] = [];
        const color = piece.attributes.fontColor || '#000000';
        const fontSize = piece.attributes.fontSize || '16px';

        // Always include color and fontSize in style to ensure proper rendering
        // This ensures each piece with different attributes gets its own span
        styles.push(`color:${color}`);
        styles.push(`font-size:${fontSize}`);

        // Wrap in span with style - each piece gets its own span
        txt = `<span style="${styles.join(';')}">${txt}</span>`;

        inner += txt;
      }
      html += `<div data-id="${block.dataId}">${inner}</div>`;
    }
  }
  return html;
}

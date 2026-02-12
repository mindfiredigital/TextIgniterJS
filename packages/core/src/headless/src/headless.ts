import HeadlessState from './core/HeadlessState';
import TextDocument from './core/TextDocument';
import TextUpdateService from './services/TextUpdateService';
import FormattingService from './services/FormattingService';
import InsertService from './services/InsertService';
import RenderService from './services/RenderService';

// Single instance manager
const state = new HeadlessState();

/**
 * Initializes a new headless document with optional content.
 */
export function initHeadless(content: string = ''): TextDocument {
  return state.init(content);
}

/**
 * Gets the current document for debugging/syncing purposes.
 */
export function getDocForSync(): TextDocument {
  return state.getDocument();
}

/**
 * Updates the plain text content while preserving existing formatting when possible.
 * NOTE: This should NOT be called on every input event as it resets formatting.
 * It's only for initial setup or when you need to sync text from editor.
 */
export function updatePlainText(text: string): void {
  const service = new TextUpdateService(state);
  service.update(text);
}

/**
 * Sets the active font color for new text.
 */
export function setActiveFontColor(color: string): void {
  state.setActiveFontColor(color);
}

/**
 * Gets the active font color.
 */
export function getActiveFontColor(): string {
  return state.getActiveFontColor();
}

/**
 * Sets the active font size for new text.
 */
export function setActiveFontSize(size: string): void {
  state.setActiveFontSize(size);
}

/**
 * Gets the active font size.
 */
export function getActiveFontSize(): string {
  return state.getActiveFontSize();
}

/**
 * Toggles font color on a range and updates active font color.
 */
export function toggleFontColor(
  start: number,
  end: number,
  color: string
): string {
  const service = new FormattingService(state);
  service.setFontColor(start, end, color);
  return getContentHtml();
}

/**
 * Toggles font size on a range and updates active font size.
 */
export function toggleFontSize(
  start: number,
  end: number,
  size: string
): string {
  const service = new FormattingService(state);
  service.setFontSize(start, end, size);
  return getContentHtml();
}

/**
 * Sets the active font family for new text.
 */
export function setActiveFontFamily(family: string): void {
  state.setActiveFontFamily(family);
}

/**
 * Gets the active font family.
 */
export function getActiveFontFamily(): string {
  return state.getActiveFontFamily();
}

/**
 * Toggles font family on a range and updates active font family.
 */
export function toggleFontFamily(
  start: number,
  end: number,
  family: string
): string {
  const service = new FormattingService(state);
  service.setFontFamily(start, end, family);
  return getContentHtml();
}

/**
 * Inserts text at a specific position with active formatting.
 */
export function insertTextAt(position: number, text: string): string {
  const service = new InsertService(state);
  service.insertAt(position, text);
  return getContentHtml();
}

/**
 * Represents a selection range within a specific block.
 */
export interface BlockSelection {
  blockId: string;
  start: number;
  end: number;
}

/**
 * Toggles bold formatting on a range.
 * @param start - Start offset (used when selections is null)
 * @param end - End offset (used when selections is null)
 * @param selections - Optional array of block selections for multi-block formatting
 */
export function toggleBold(
  start: number,
  end: number,
  selections?: BlockSelection[] | null
): string {
  const service = new FormattingService(state);
  if (selections && selections.length > 0) {
    service.toggleStyleForMultipleBlocks(selections, 'bold');
  } else {
    service.toggleStyle(start, end, 'bold');
  }
  return getContentHtml();
}

/**
 * Toggles italic formatting on a range.
 * @param start - Start offset (used when selections is null)
 * @param end - End offset (used when selections is null)
 * @param selections - Optional array of block selections for multi-block formatting
 */
export function toggleItalic(
  start: number,
  end: number,
  selections?: BlockSelection[] | null
): string {
  const service = new FormattingService(state);
  if (selections && selections.length > 0) {
    service.toggleStyleForMultipleBlocks(selections, 'italic');
  } else {
    service.toggleStyle(start, end, 'italic');
  }
  return getContentHtml();
}

/**
 * Toggles underline formatting on a range.
 * @param start - Start offset (used when selections is null)
 * @param end - End offset (used when selections is null)
 * @param selections - Optional array of block selections for multi-block formatting
 */
export function toggleUnderline(
  start: number,
  end: number,
  selections?: BlockSelection[] | null
): string {
  const service = new FormattingService(state);
  if (selections && selections.length > 0) {
    service.toggleStyleForMultipleBlocks(selections, 'underline');
  } else {
    service.toggleStyle(start, end, 'underline');
  }
  return getContentHtml();
}

/**
 * Toggles strikethrough formatting on a range.
 * @param start - Start offset (used when selections is null)
 * @param end - End offset (used when selections is null)
 * @param selections - Optional array of block selections for multi-block formatting
 */
export function toggleStrikethrough(
  start: number,
  end: number,
  selections?: BlockSelection[] | null
): string {
  const service = new FormattingService(state);
  if (selections && selections.length > 0) {
    service.toggleStyleForMultipleBlocks(selections, 'strikethrough');
  } else {
    service.toggleStyle(start, end, 'strikethrough');
  }
  return getContentHtml();
}

/**
 * Inserts an image at the specified position.
 * @param dataId - The data-id of the current block
 * @param position - The cursor position relative to the start of the block
 * @param imageDataUrl - The data URL of the image to insert
 * @returns The HTML string after insertion
 */
export function insertImageAtPosition(
  dataId: string | null,
  position: number,
  imageDataUrl: string
): string {
  console.log('[headless.ts] insertImageAtPosition called', {
    dataId,
    position,
    imageDataUrlLength: imageDataUrl?.length,
  });
  const doc = state.getDocument();
  const newBlockId = doc.insertImageAtPosition(dataId, position, imageDataUrl);
  console.log('[headless.ts] New block ID returned:', newBlockId);
  const html = getContentHtml();
  console.log('[headless.ts] Generated HTML length:', html.length);
  return html;
}

/**
 * Deletes an image block by its dataId.
 * @param dataId - The data-id of the image block to delete
 * @returns The HTML string after deletion
 */
export function deleteImageBlock(dataId: string): string {
  const doc = state.getDocument();
  doc.deleteImageBlock(dataId);
  return getContentHtml();
}

/**
 * Toggles unordered list formatting on the selected block(s).
 * If multiple blocks are selected, toggles list formatting on all of them.
 * @param dataIds - Array of data-ids of blocks to toggle, or null to use selected block
 * @returns The HTML string after toggling
 */
export function toggleUnorderedList(dataIds: string[] | null = null): string {
  const doc = state.getDocument();

  if (dataIds && dataIds.length > 0) {
    // Toggle multiple blocks
    for (const dataId of dataIds) {
      doc.toggleUnorderedList(dataId);
    }
  } else {
    // Toggle selected block
    doc.toggleUnorderedList(doc.selectedBlockId);
  }

  return getContentHtml();
}

/**
 * Toggles ordered list formatting on the selected block(s).
 * If multiple blocks are selected, groups them into a single ordered list with sequential numbering.
 * @param dataIds - Array of data-ids of blocks to toggle, or null to use selected block
 * @returns The HTML string after toggling
 */
export function toggleOrderedList(dataIds: string[] | null = null): string {
  const doc = state.getDocument();

  console.log('[headless.ts] toggleOrderedList called with:', dataIds);

  if (dataIds && dataIds.length > 1) {
    // Multiple blocks: use toggleOrderedListForMultipleBlocks to group them
    console.log(
      '[headless.ts] Multiple blocks detected, using toggleOrderedListForMultipleBlocks'
    );
    doc.toggleOrderedListForMultipleBlocks(dataIds);
  } else if (dataIds && dataIds.length === 1) {
    // Single block
    console.log('[headless.ts] Single block, using toggleOrderedList');
    doc.toggleOrderedList(dataIds[0]);
  } else {
    // Toggle selected block
    console.log(
      '[headless.ts] No dataIds provided, using selectedBlockId:',
      doc.selectedBlockId
    );
    doc.toggleOrderedList(doc.selectedBlockId);
  }

  return getContentHtml();
}

/**
 * Renders the document content to HTML.
 */
export function getContentHtml(): string {
  return RenderService.render(state.getDocument());
}

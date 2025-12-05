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
 * Inserts text at a specific position with active formatting.
 */
export function insertTextAt(position: number, text: string): string {
  const service = new InsertService(state);
  service.insertAt(position, text);
  return getContentHtml();
}

/**
 * Toggles bold formatting on a range.
 */
export function toggleBold(start: number, end: number): string {
  const service = new FormattingService(state);
  service.toggleStyle(start, end, 'bold');
  return getContentHtml();
}

/**
 * Toggles italic formatting on a range.
 */
export function toggleItalic(start: number, end: number): string {
  const service = new FormattingService(state);
  service.toggleStyle(start, end, 'italic');
  return getContentHtml();
}

/**
 * Toggles underline formatting on a range.
 */
export function toggleUnderline(start: number, end: number): string {
  const service = new FormattingService(state);
  service.toggleStyle(start, end, 'underline');
  return getContentHtml();
}

/**
 * Toggles strikethrough formatting on a range.
 */
export function toggleStrikethrough(start: number, end: number): string {
  const service = new FormattingService(state);
  service.toggleStyle(start, end, 'strikethrough');
  return getContentHtml();
}

/**
 * Renders the document content to HTML.
 */
export function getContentHtml(): string {
  return RenderService.render(state.getDocument());
}

import HeadlessState from '../core/HeadlessState';
import type { TextAttribute } from '../types';

/**
 * Service for handling text formatting operations.
 */
class FormattingService {
  constructor(private state: HeadlessState) {}

  /**
   * Toggles a style attribute (bold, italic, underline, strikethrough) on a range.
   */
  toggleStyle(start: number, end: number, attr: TextAttribute): void {
    const doc = this.state.getDocument();
    if (!doc.selectedBlockId) {
      doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;
    }

    const allActive = doc.isRangeEntirelyAttribute(start, end, attr);
    doc.formatAttribute(start, end, attr, !allActive);
  }

  /**
   * Sets font color on a range and updates active font color.
   */
  setFontColor(start: number, end: number, color: string): void {
    const doc = this.state.getDocument();
    if (!doc.selectedBlockId) {
      doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;
    }

    // Apply font color to range
    doc.formatColor(start, end, color);

    // Update active font color so new text uses this color
    // (like dropdown value in core)
    this.state.setActiveFontColor(color);
  }

  /**
   * Sets font size on a range and updates active font size.
   */
  setFontSize(start: number, end: number, size: string): void {
    const doc = this.state.getDocument();
    if (!doc.selectedBlockId) {
      doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;
    }

    // Apply font size to range
    doc.formatSize(start, end, size);

    // Update active font size so new text uses this size
    // (like dropdown value in core)
    this.state.setActiveFontSize(size);
  }

  /**
   * Sets font family on a range and updates active font family.
   */
  setFontFamily(start: number, end: number, family: string): void {
    const doc = this.state.getDocument();
    if (!doc.selectedBlockId) {
      doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;
    }

    // Apply font family to range
    doc.formatFamily(start, end, family);

    // Update active font family so new text uses this family
    // (like dropdown value in core)
    this.state.setActiveFontFamily(family);
  }
}

export default FormattingService;

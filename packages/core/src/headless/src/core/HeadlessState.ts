import TextDocument from './TextDocument';
import Piece, {
  setActiveFontSizeGetter,
  setActiveFontColorGetter,
  setActiveFontFamilyGetter,
} from './Piece';
import type { Block } from '../types';
import {
  DEFAULT_FONT_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
} from '../constants';

/**
 * Manages the state of the headless editor instance.
 * Encapsulates document, active formatting, and initialization logic.
 */
class HeadlessState {
  private document: TextDocument | null = null;
  private activeFontColor: string = DEFAULT_FONT_COLOR;
  private activeFontSize: string = DEFAULT_FONT_SIZE;
  private activeFontFamily: string = DEFAULT_FONT_FAMILY;

  constructor() {
    // Set up getters so Piece constructor can access active values
    // (like core reads from dropdown)
    setActiveFontSizeGetter(() => this.activeFontSize);
    setActiveFontColorGetter(() => this.activeFontColor);
    setActiveFontFamilyGetter(() => this.activeFontFamily);
  }

  /**
   * Initializes a new document with optional content.
   */
  init(content: string = ''): TextDocument {
    this.document = new TextDocument();
    const id = `headless-${Date.now()}`;
    this.document.blocks = [
      {
        type: 'text',
        dataId: id,
        class: 'paragraph-block',
        alignment: 'left',
        pieces: [new Piece(content)],
      } as Block<Piece>,
    ];
    this.document.selectedBlockId = id;
    this.document.currentOffset = 0;
    return this.document;
  }

  /**
   * Gets the current document, initializing it if necessary.
   */
  getDocument(): TextDocument {
    if (!this.document) {
      this.document = this.init('');
    }
    return this.document;
  }

  /**
   * Sets the active font color for new text.
   */
  setActiveFontColor(color: string): void {
    this.activeFontColor = color;
  }

  /**
   * Gets the active font color.
   */
  getActiveFontColor(): string {
    return this.activeFontColor;
  }

  /**
   * Sets the active font size for new text.
   */
  setActiveFontSize(size: string): void {
    this.activeFontSize = size;
  }

  /**
   * Gets the active font size.
   */
  getActiveFontSize(): string {
    return this.activeFontSize;
  }

  /**
   * Sets the active font family for new text.
   */
  setActiveFontFamily(family: string): void {
    this.activeFontFamily = family;
  }

  /**
   * Gets the active font family.
   */
  getActiveFontFamily(): string {
    return this.activeFontFamily;
  }
}

export default HeadlessState;

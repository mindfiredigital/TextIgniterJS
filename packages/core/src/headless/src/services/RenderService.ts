import type { Block } from '../types';
import TextDocument from '../core/TextDocument';
import Piece from '../core/Piece';
import {
  DEFAULT_FONT_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
} from '../constants';

type BlockWithPieces = Block<Piece>;

/**
 * Service for rendering document content to HTML.
 */
class RenderService {
  /**
   * Renders a document to HTML string.
   */
  static render(doc: TextDocument): string {
    let html = '';

    for (const block of doc.blocks) {
      if (block.type === 'text') {
        html += this.renderTextBlock(block);
      }
    }

    return html;
  }

  /**
   * Renders a text block to HTML.
   */
  private static renderTextBlock(block: BlockWithPieces): string {
    let inner = '';

    for (const piece of block.pieces) {
      let txt = this.escapeHtml(piece.text);

      // Apply text formatting tags
      if (piece.attributes.bold) txt = `<b>${txt}</b>`;
      if (piece.attributes.italic) txt = `<i>${txt}</i>`;
      if (piece.attributes.underline) txt = `<u>${txt}</u>`;
      if (piece.attributes.strikethrough) txt = `<s>${txt}</s>`;

      // Build style attributes - only include if different from defaults
      const styles: string[] = [];
      const color = piece.attributes.fontColor || DEFAULT_FONT_COLOR;
      const fontSize = piece.attributes.fontSize || DEFAULT_FONT_SIZE;
      const fontFamily = piece.attributes.fontFamily || DEFAULT_FONT_FAMILY;

      // Only include color if it's not the default black (optimization)
      if (color !== DEFAULT_FONT_COLOR) {
        styles.push(`color:${color}`);
      }

      // Only include fontSize if it's not the default 16px (optimization)
      if (fontSize !== DEFAULT_FONT_SIZE) {
        styles.push(`font-size:${fontSize}`);
      }

      // Only include fontFamily if it's not the default Arial (optimization)
      if (fontFamily !== DEFAULT_FONT_FAMILY) {
        styles.push(`font-family:${fontFamily}`);
      }

      // Wrap in span with style only if there are styles to apply
      // This optimization reduces HTML size when using defaults
      if (styles.length > 0) {
        txt = `<span style="${styles.join(';')}">${txt}</span>`;
      }

      inner += txt;
    }

    return `<div data-id="${block.dataId}">${inner}</div>`;
  }

  /**
   * Escapes HTML special characters.
   */
  private static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

export default RenderService;

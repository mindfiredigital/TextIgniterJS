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
    console.log(
      '[RenderService] Rendering document with',
      doc.blocks.length,
      'blocks'
    );

    for (const block of doc.blocks) {
      if (block.type === 'text') {
        html += this.renderTextBlock(block);
      } else if (block.type === 'image') {
        console.log(
          '[RenderService] Rendering image block:',
          block.dataId,
          'has image:',
          !!block.image
        );
        html += this.renderImageBlock(block);
      } else {
        console.warn('[RenderService] Unknown block type:', block.type);
      }
    }

    console.log('[RenderService] Final HTML length:', html.length);
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
   * Renders an image block to HTML.
   * Matches core module behavior: creates a div with an img element wrapped in span.
   */
  private static renderImageBlock(
    block: BlockWithPieces & { image?: string }
  ): string {
    if (!block.image) {
      console.warn(
        '[RenderService] Image block has no image property:',
        block.dataId
      );
      return `<div data-id="${block.dataId}" class="${block.class}" type="${block.type}"></div>`;
    }

    const alignmentStyle =
      block.alignment && block.alignment !== 'left'
        ? ` style="text-align:${block.alignment}"`
        : '';

    // Create image with styling matching core module (max-width:30%, contenteditable=false)
    // Note: We escape the image URL to prevent XSS, but data URLs are generally safe
    const imgHtml = `<img src="${this.escapeHtml(block.image)}" style="max-width:30%" contenteditable="false" />`;

    // Wrap in span with contenteditable=false, then div matching core module structure
    return `<div data-id="${block.dataId}" class="${block.class}" type="${block.type}"${alignmentStyle}><span contenteditable="false">${imgHtml}</span></div>`;
  }

  /**
   * Escapes HTML special characters.
   */
  private static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

export default RenderService;

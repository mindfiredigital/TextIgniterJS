import { describe, it, expect } from 'vitest';
import { parseHtmlToPieces } from '../../utils/parseHtml';

describe('parseHtmlToPieces', () => {
  it('parses plain text', () => {
    const pieces = parseHtmlToPieces('Hello world');
    expect(pieces).toHaveLength(1);
    expect(pieces[0].text).toBe('Hello world');
    expect(pieces[0].attributes.bold).toBe(false);
    expect(pieces[0].attributes.italic).toBe(false);
    expect(pieces[0].attributes.underline).toBe(false);
    expect(pieces[0].attributes.hyperlink).toBe(false);
  });

  it('parses bold, italic, underline', () => {
    const html = '<strong>Bold</strong> <em>Italic</em> <u>Underline</u>';
    const pieces = parseHtmlToPieces(html);
    expect(pieces.some(p => p.text.includes('Bold') && p.attributes.bold)).toBe(
      true
    );
    expect(
      pieces.some(p => p.text.includes('Italic') && p.attributes.italic)
    ).toBe(true);
    expect(
      pieces.some(p => p.text.includes('Underline') && p.attributes.underline)
    ).toBe(true);
  });

  it('parses nested formatting', () => {
    const html = '<strong><em>BoldItalic</em></strong>';
    const pieces = parseHtmlToPieces(html);
    expect(pieces[0].attributes.bold).toBe(true);
    expect(pieces[0].attributes.italic).toBe(true);
  });

  it('parses hyperlinks', () => {
    const html = '<a href="https://example.com">Link</a>';
    const pieces = parseHtmlToPieces(html);
    expect(pieces[0].attributes.hyperlink).toBe('https://example.com');
  });

  it('parses mixed content', () => {
    const html =
      'Text <strong>Bold</strong> <a href="/foo"><em>LinkItalic</em></a>';
    const pieces = parseHtmlToPieces(html);
    expect(pieces.some(p => p.text.includes('Text'))).toBe(true);
    expect(pieces.some(p => p.text.includes('Bold') && p.attributes.bold)).toBe(
      true
    );
    expect(
      pieces.some(
        p =>
          p.text.includes('LinkItalic') &&
          p.attributes.italic &&
          p.attributes.hyperlink === '/foo'
      )
    ).toBe(true);
  });

  it('ignores empty text nodes', () => {
    const html = '<strong> </strong> <em></em> Text';
    const pieces = parseHtmlToPieces(html);
    // Only non-empty text nodes should be present
    expect(pieces.every(p => p.text.trim() !== '')).toBe(true);
    expect(pieces.some(p => p.text.trim() === 'Text')).toBe(true);
  });

  it('handles deeply nested tags', () => {
    const html = '<strong><em><u>Deep</u></em></strong>';
    const pieces = parseHtmlToPieces(html);
    expect(pieces[0].attributes.bold).toBe(true);
    expect(pieces[0].attributes.italic).toBe(true);
    expect(pieces[0].attributes.underline).toBe(true);
  });

  it('handles empty input', () => {
    const pieces = parseHtmlToPieces('');
    expect(pieces).toHaveLength(0);
  });
});

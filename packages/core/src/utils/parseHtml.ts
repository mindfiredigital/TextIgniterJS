import Piece from '../piece';

export function parseHtmlToPieces(html: string): Piece[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return extractPiecesFromNode(doc.body, {
    bold: false,
    italic: false,
    underline: false,
    hyperlink: false,
  });
}

export function extractPiecesFromNode(
  node: Node,
  inheritedAttrs: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    hyperlink?: string | boolean;
  }
): Piece[] {
  let currentAttrs = { ...inheritedAttrs };
  const pieces: Piece[] = [];

  if (node instanceof HTMLElement) {
    // In extractPiecesFromNode function,
    if (node.tagName === 'A') {
      const href = node.getAttribute('href');
      if (href) {
        currentAttrs.hyperlink = href;
      }
    }
    // Check if this element changes formatting
    if (node.tagName === 'STRONG' || node.tagName === 'B')
      currentAttrs.bold = true;
    if (node.tagName === 'EM' || node.tagName === 'I')
      currentAttrs.italic = true;
    if (node.tagName === 'U') currentAttrs.underline = true;

    node.childNodes.forEach(child => {
      pieces.push(...extractPiecesFromNode(child, currentAttrs));
    });
  } else if (node instanceof Text) {
    const text = node.nodeValue || '';
    if (text.trim() !== '') {
      pieces.push(new Piece(text, { ...currentAttrs }));
    }
  }
  return pieces;
}

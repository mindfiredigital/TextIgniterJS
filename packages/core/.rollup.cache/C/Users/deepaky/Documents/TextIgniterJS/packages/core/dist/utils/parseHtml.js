import Piece from '../piece';
export function parseHtmlToPieces(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return extractPiecesFromNode(doc.body, {
    bold: false,
    italic: false,
    underline: false,
  });
}
export function extractPiecesFromNode(node, inheritedAttrs) {
  let currentAttrs = Object.assign({}, inheritedAttrs);
  const pieces = [];
  if (node instanceof HTMLElement) {
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
      pieces.push(new Piece(text, Object.assign({}, currentAttrs)));
    }
  }
  return pieces;
}
//# sourceMappingURL=parseHtml.js.map

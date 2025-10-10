import TextDocument from './TextDocumentHeadless';
import Piece from './PieceHeadless';

let _doc: TextDocument | null = null;

// Initialize headless document
export function initHeadless(content?: string) {
  _doc = new TextDocument();
  if (content !== undefined) setContent(content);
  return _doc;
}

function getDoc(): TextDocument {
  if (!_doc) _doc = new TextDocument();
  return _doc;
}

// Set content (plain text)
export function setContent(text: string) {
  const doc = getDoc();
  const id = `headless-${Date.now()}`;
  doc.blocks = [
    {
      type: 'text',
      dataId: id,
      class: 'paragraph-block',
      alignment: 'left',
      pieces: [new Piece(text)],
    },
  ];
  doc.selectedBlockId = id;
  doc.currentOffset = 0;
}

// Toggle bold for character range (start, end)
export function toggleBold(start: number, end: number): string {
  const doc = getDoc();
  if (!doc.selectedBlockId) {
    doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;
  }
  const allBold = doc.isRangeEntirelyAttribute(start, end, 'bold');
  doc.formatAttribute(start, end, 'bold', !allBold);
  return getContentHtml();
}

// Get current HTML content (simple serializer)
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
        if (piece.attributes.bold) txt = `<strong>${txt}</strong>`;
        inner += txt;
      }
      html += `<div data-id="${block.dataId}">${inner}</div>`;
    }
  }
  return html;
}

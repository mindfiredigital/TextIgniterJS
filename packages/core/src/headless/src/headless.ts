import TextDocument from './TextDocumentHeadless';
import Piece from './PieceHeadless';

let _doc: TextDocument | null = null;

export function initHeadless(content = '') {
  _doc = new TextDocument();
  const id = `headless-${Date.now()}`;
  _doc.blocks = [
    {
      type: 'text',
      dataId: id,
      class: 'paragraph-block',
      alignment: 'left',
      pieces: [new Piece(content)],
    },
  ];
  _doc.selectedBlockId = id;
  _doc.currentOffset = 0;
  return _doc;
}

function getDoc(): TextDocument {
  if (!_doc) _doc = initHeadless('');
  return _doc;
}

// This is only for reloading full plain text (not on every input)
export function setContent(text: string) {
  const doc = getDoc();
  const id = doc.selectedBlockId || `headless-${Date.now()}`;
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

// Optional — update plain text without breaking existing styles
export function updatePlainText(text: string) {
  const doc = getDoc();
  const block = doc.blocks.find(b => b.dataId === doc.selectedBlockId);
  if (!block) return;
  // crude replacement if text changed
  block.pieces = [new Piece(text)];
}

export function toggleBold(start: number, end: number): string {
  const doc = getDoc();
  if (!doc.selectedBlockId) doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;

  const allBold = doc.isRangeEntirelyAttribute(start, end, 'bold');
  doc.formatAttribute(start, end, 'bold', !allBold);

  return getContentHtml();
}

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
        if (piece.attributes.bold) txt = `<b>${txt}</b>`;
        inner += txt;
      }
      html += `<div data-id="${block.dataId}">${inner}</div>`;
    }
  }
  return html;
}

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

// ✅ Update plain text safely
export function updatePlainText(text: string) {
  const doc = getDoc();
  const block = doc.blocks.find(b => b.dataId === doc.selectedBlockId);
  if (!block) return;
  block.pieces = [new Piece(text)];
}

// ✅ Generic toggler
function toggleStyle(
  start: number,
  end: number,
  attr: 'bold' | 'italic'
): string {
  const doc = getDoc();
  if (!doc.selectedBlockId) doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;

  const allActive = doc.isRangeEntirelyAttribute(start, end, attr);
  doc.formatAttribute(start, end, attr, !allActive);

  return getContentHtml();
}

export function toggleBold(start: number, end: number) {
  return toggleStyle(start, end, 'bold');
}

export function toggleItalic(start: number, end: number) {
  return toggleStyle(start, end, 'italic');
}

// ✅ Simple HTML serializer
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
        if (piece.attributes.italic) txt = `<i>${txt}</i>`;
        inner += txt;
      }
      html += `<div data-id="${block.dataId}">${inner}</div>`;
    }
  }
  return html;
}

import TextDocument from './TextDocumentHeadless';
import Piece from './PieceHeadless';

let _doc: TextDocument | null = null;
let activeFontColor: string = '#000000';

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

// ✅ Update text typing — preserve existing formatting if possible
export function updatePlainText(text: string) {
  const doc = getDoc();
  const block = doc.blocks.find(b => b.dataId === doc.selectedBlockId);
  if (!block) return;

  // If plain typing (not formatting), merge into single piece but keep color state
  if (block.pieces.length === 1) {
    block.pieces[0].text = text;
    return;
  }

  // otherwise, rebuild from scratch (rare case)
  block.pieces = [new Piece(text, { fontColor: activeFontColor })];
}

// ✅ Font color handling
export function setActiveFontColor(color: string) {
  activeFontColor = color;
}

export function getActiveFontColor() {
  return activeFontColor;
}

export function toggleFontColor(start: number, end: number, color: string) {
  const doc = getDoc();
  if (!doc.selectedBlockId) return getContentHtml();
  doc.formatColor(start, end, color);
  return getContentHtml();
}

// ✅ Style toggles (unchanged)
function toggleStyle(
  start: number,
  end: number,
  attr: 'bold' | 'italic' | 'underline' | 'strikethrough'
): string {
  const doc = getDoc();
  if (!doc.selectedBlockId) doc.selectedBlockId = doc.blocks[0]?.dataId ?? null;

  const allActive = doc.isRangeEntirelyAttribute(start, end, attr);
  doc.formatAttribute(start, end, attr, !allActive);
  return getContentHtml();
}

export const toggleBold = (s: number, e: number) => toggleStyle(s, e, 'bold');
export const toggleItalic = (s: number, e: number) =>
  toggleStyle(s, e, 'italic');
export const toggleUnderline = (s: number, e: number) =>
  toggleStyle(s, e, 'underline');
export const toggleStrikethrough = (s: number, e: number) =>
  toggleStyle(s, e, 'strikethrough');

// ✅ Updated renderer: split pieces correctly
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
        if (piece.attributes.underline) txt = `<u>${txt}</u>`;
        if (piece.attributes.strikethrough) txt = `<s>${txt}</s>`;

        const color = piece.attributes.fontColor || '#000000';
        txt = `<span style="color:${color}">${txt}</span>`;

        inner += txt;
      }
      html += `<div data-id="${block.dataId}">${inner}</div>`;
    }
  }
  return html;
}

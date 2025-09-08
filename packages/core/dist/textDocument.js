import EventEmitter from './utils/events';
import Piece from './piece';
class TextDocument extends EventEmitter {
  get selectedBlockId() {
    return this._selectedBlockId;
  }
  set selectedBlockId(value) {
    if (this._selectedBlockId !== value) {
      this._selectedBlockId = value;
      const editorOffset = this.getCursorOffset(
        document.querySelector('[id="editor"]')
      );
      const paraOffset = this.getCursorOffset(
        document.querySelector('[data-id="' + value + '"]')
      );
      this.currentOffset = editorOffset - paraOffset;
    }
  }
  constructor() {
    super();
    this.dataIds = [];
    this.selectAll = false;
    this._selectedBlockId = null;
    this.pieces = [new Piece('')];
    this.blocks = [
      {
        type: 'text',
        dataId: 'data-id-1734604240404',
        class: 'paragraph-block',
        alignment: 'left',
        pieces: [new Piece(' ')],
      },
    ];
    this.selectedBlockId = 'data-id-1734604240404';
    this.currentOffset = 0;
  }
  setEditorView(editorView) {
    this.editorView = editorView;
  }
  getPlainText() {
    return this.pieces.map(p => p.text).join('');
  }
  setUndoRedoManager(undoRedoManager) {
    this.undoRedoManager = undoRedoManager;
  }
  insertAt(
    text,
    attributes,
    position,
    dataId = '',
    currentOffset = 0,
    id = '',
    actionType = '',
    isSynthetic = false
  ) {
    if (!isSynthetic) {
      this.undoRedoManager.saveUndoSnapshot();
    }
    console.log('inserted,', { start: position, text });
    console.log('inserted,', this.blocks);
    let offset = 0;
    let newPieces = [];
    let inserted = false;
    let index = 0;
    if (dataId) {
      index = this.blocks.findIndex(block => block.dataId === dataId);
      offset = this.currentOffset;
    }
    for (let piece of this.blocks[index].pieces) {
      const pieceEnd = offset + piece.text.length;
      if (!inserted && position <= pieceEnd) {
        const relPos = position - offset;
        if (relPos > 0) {
          newPieces.push(
            new Piece(
              piece.text.slice(0, relPos),
              Object.assign({}, piece.attributes)
            )
          );
        }
        newPieces.push(
          new Piece(text, {
            bold: attributes.bold || false,
            italic: attributes.italic || false,
            underline: attributes.underline || false,
            hyperlink: attributes.hyperlink || false,
          })
        );
        if (relPos < piece.text.length) {
          newPieces.push(
            new Piece(
              piece.text.slice(relPos),
              Object.assign({}, piece.attributes)
            )
          );
        }
        inserted = true;
      } else {
        newPieces.push(piece.clone());
      }
      offset = pieceEnd;
    }
    if (!inserted) {
      const lastPiece = newPieces[newPieces.length - 1];
      if (
        lastPiece &&
        lastPiece.hasSameAttributes(
          new Piece('', {
            bold: attributes.bold || false,
            italic: attributes.italic || false,
            underline: attributes.underline || false,
            hyperlink: attributes.hyperlink || false,
          })
        )
      ) {
        lastPiece.text += text;
      } else {
        newPieces.push(
          new Piece(text, {
            bold: attributes.bold || false,
            italic: attributes.italic || false,
            underline: attributes.underline || false,
            hyperlink: attributes.hyperlink || false,
          })
        );
      }
    }
    let _data = this.mergePieces(newPieces);
    this.blocks[index].pieces = _data;
    console.log({ position });
    this.emit('documentChanged', this);
  }
  deleteRange(start, end, dataId = '', currentOffset = 0, isBackspace = false) {
    console.log('deleted2,', { start, end });
    if (start === end) return;
    let newPieces = [];
    let offset = 0;
    let index = 0;
    let runBackspace = false;
    if (dataId !== '' || dataId !== null) {
      index = this.blocks.findIndex(block => block.dataId === dataId);
      offset = currentOffset;
    }
    let previousTextBlockIndex = 0;
    if (isBackspace && start === offset) {
      if (index - 1 >= 0 && this.blocks[index - 1].type === 'image') {
        previousTextBlockIndex = index - 2;
      } else {
        previousTextBlockIndex = index - 1;
      }
      for (let piece1 of this.blocks[previousTextBlockIndex].pieces) {
        newPieces.push(piece1.clone());
        runBackspace = true;
      }
    }
    for (let piece of this.blocks[index].pieces) {
      const pieceEnd = offset + piece.text.length;
      if (pieceEnd <= start || offset >= end) {
        newPieces.push(piece.clone());
      } else {
        const pieceStart = offset;
        const pieceText = piece.text;
        if (start > pieceStart && start < pieceEnd) {
          newPieces.push(
            new Piece(
              pieceText.slice(0, start - pieceStart),
              Object.assign({}, piece.attributes)
            )
          );
        }
        if (end < pieceEnd) {
          newPieces.push(
            new Piece(
              pieceText.slice(end - pieceStart),
              Object.assign({}, piece.attributes)
            )
          );
        }
      }
      offset = pieceEnd;
    }
    let _data = this.mergePieces(newPieces);
    if (runBackspace) {
      this.blocks[previousTextBlockIndex].pieces = _data;
      this.blocks[index].pieces = [new Piece(' ')];
      this.blocks = this.blocks.filter((block, i) => {
        if (i !== index) return block;
      });
    } else {
      if (_data.length === 0) {
        _data = [new Piece(' ')];
      }
      this.blocks[index].pieces = _data;
    }
    if (_data.length === 0 && this.blocks.length > 1) {
      this.blocks = this.blocks.filter(blocks => {
        return blocks.pieces.length !== 0;
      });
    }
    this.emit('documentChanged', this);
  }
  deleteBlocks() {
    this.blocks = this.blocks.filter(block => {
      if (!this.dataIds.includes(block.dataId)) {
        return block;
      }
    });
    this.dataIds = [];
    this.selectAll = false;
    if (this.blocks.length === 0) {
      this.blocks.push({
        dataId: 'data-id-1734604240404',
        class: 'paragraph-block',
        pieces: [new Piece(' ')],
      });
    }
    this.emit('documentChanged', this);
  }
  getSelectedTextDataId() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }
    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    const elementWithId =
      container.nodeType === Node.TEXT_NODE
        ? container.parentElement
        : container;
    const dataIdElement = elementWithId.closest('[data-id]');
    return (
      (dataIdElement === null || dataIdElement === void 0
        ? void 0
        : dataIdElement.getAttribute('data-id')) || null
    );
  }
  getAllSelectedDataIds() {
    var _a;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return [];
    }
    const range = selection.getRangeAt(0);
    const selectedIds = [];
    const iterator = document.createNodeIterator(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );
    let currentNode;
    while ((currentNode = iterator.nextNode())) {
      if (range.intersectsNode(currentNode)) {
        const element =
          currentNode.nodeType === Node.TEXT_NODE
            ? currentNode.parentElement
            : currentNode;
        const dataId =
          (_a =
            element === null || element === void 0
              ? void 0
              : element.closest('[data-id]')) === null || _a === void 0
            ? void 0
            : _a.getAttribute('data-id');
        if (dataId && !selectedIds.includes(dataId)) {
          selectedIds.push(dataId);
        }
      }
    }
    this.dataIds = selectedIds;
    console.log('selected id 3', this.dataIds, selectedIds);
    return selectedIds;
  }
  handleCtrlASelection() {
    const selectedDataIds = [];
    const editor = document.getElementById('editor');
    if (editor) {
      const childNodes = editor.querySelectorAll('[data-id]');
      childNodes.forEach(node => {
        const dataId = node.getAttribute('data-id');
        if (dataId && !selectedDataIds.includes(dataId)) {
          selectedDataIds.push(dataId);
        }
      });
    }
    this.dataIds = selectedDataIds;
    console.log('selected id 2', this.dataIds, selectedDataIds);
    return selectedDataIds;
  }
  getSelectedDataIds() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return [];
    }
    const range = selection.getRangeAt(0);
    const selectedIds = [];
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    const startDataId = this.getDataIdFromNode(startContainer);
    const endDataId = this.getDataIdFromNode(endContainer);
    if (startDataId && !selectedIds.includes(startDataId)) {
      selectedIds.push(startDataId);
    }
    if (endDataId && !selectedIds.includes(endDataId)) {
      selectedIds.push(endDataId);
    }
    this.dataIds = selectedIds;
    console.log('selected id 1', this.dataIds, selectedIds);
    return selectedIds;
  }
  getDataIdFromNode(node) {
    var _a;
    const element =
      node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    return (
      ((_a =
        element === null || element === void 0
          ? void 0
          : element.closest('[data-id]')) === null || _a === void 0
        ? void 0
        : _a.getAttribute('data-id')) || null
    );
  }
  getCursorOffset(container) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return -1;
    }
    const range = selection.getRangeAt(0);
    let offset = 0;
    const traverseNodes = node => {
      if (node === range.startContainer) {
        offset += range.startOffset;
        return true;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        offset += (node.textContent || '').length;
      }
      for (const child of Array.from(node.childNodes)) {
        if (traverseNodes(child)) {
          return true;
        }
      }
      return false;
    };
    traverseNodes(container);
    return offset;
  }
  formatAttribute(start, end, attribute, value) {
    console.log('formatAttribute', start, end, attribute, value);
    let newPieces = [];
    let offset = 0;
    let index = -1;
    if (this.selectedBlockId !== '' || this.selectedBlockId !== null) {
      index = this.blocks.findIndex(
        block => block.dataId === this.selectedBlockId
      );
      offset = this.currentOffset;
    }
    for (let piece of this.blocks[index].pieces) {
      const pieceEnd = offset + piece.text.length;
      if (pieceEnd <= start || offset >= end) {
        newPieces.push(piece.clone());
      } else {
        const pieceStart = offset;
        const pieceText = piece.text;
        const startInPiece = Math.max(start - pieceStart, 0);
        const endInPiece = Math.min(end - pieceStart, pieceText.length);
        if (startInPiece > 0) {
          newPieces.push(
            new Piece(
              pieceText.slice(0, startInPiece),
              Object.assign({}, piece.attributes)
            )
          );
        }
        const selectedPiece = new Piece(
          pieceText.slice(startInPiece, endInPiece),
          Object.assign({}, piece.attributes)
        );
        if (
          (attribute === 'bold' ||
            attribute === 'italic' ||
            attribute === 'underline' ||
            attribute === 'undo' ||
            attribute === 'redo' ||
            attribute === 'hyperlink') &&
          typeof value === 'boolean'
        ) {
          selectedPiece.attributes[attribute] = value;
        } else if (
          (attribute === 'fontFamily' ||
            attribute === 'fontSize' ||
            attribute === 'hyperlink' ||
            attribute === 'fontColor' ||
            attribute === 'bgColor') &&
          typeof value === 'string'
        ) {
          selectedPiece.attributes[attribute] = value;
        }
        newPieces.push(selectedPiece);
        if (endInPiece < pieceText.length) {
          newPieces.push(
            new Piece(
              pieceText.slice(endInPiece),
              Object.assign({}, piece.attributes)
            )
          );
        }
      }
      offset = pieceEnd;
    }
    const _data = this.mergePieces(newPieces);
    this.blocks[index].pieces = _data;
    this.emit('documentChanged', this);
  }
  toggleOrderedList(dataId, id = '') {
    const index = this.blocks.findIndex(block => block.dataId === dataId);
    if (index === -1) return;
    const block = this.blocks[index];
    if (block.listType === 'ol' || block.listType === 'li') {
      block.listType = null;
      block.listStart = undefined;
      block.parentId = undefined;
    } else {
      block.listType = 'ol';
      block.listStart = 1;
      block.parentId = block.dataId;
    }
    this.emit('documentChanged', this);
  }
  toggleUnorderedList(dataId) {
    const index = this.blocks.findIndex(block => block.dataId === dataId);
    if (index === -1) return;
    const block = this.blocks[index];
    block.listType = block.listType === 'ul' ? null : 'ul';
    this.emit('documentChanged', this);
  }
  updateOrderedListNumbers() {
    let currentNumber = 1;
    let currentParentId = null;
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      if (block.listType === 'ol' || block.listType === 'li') {
        if (block.listType === 'ol' || block.parentId !== currentParentId) {
          currentNumber = 1;
          currentParentId =
            block.listType === 'ol' ? block.dataId : block.parentId;
        }
        block.listStart = currentNumber;
        currentNumber++;
      } else {
        currentNumber = 1;
        currentParentId = null;
      }
    }
    this.emit('documentChanged', this);
  }
  undo() {
    console.log('undo');
    this.undoRedoManager.undo();
  }
  redo() {
    this.undoRedoManager.redo();
    console.log('redo');
  }
  setCursorPosition(position, dataId = '') {
    var _a;
    if (dataId !== '') {
      const divDataid = document.querySelector(`[data-id="${dataId}"]`);
      if (divDataid) {
        setTimeout(() => divDataid.focus(), 0);
      } else {
        console.warn(`Element with data-id="${dataId}" not found.`);
        return;
      }
    } else {
      this.editorView.container.focus();
    }
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    let charIndex = 0;
    const nodeStack = [this.editorView.container];
    let node;
    const totalLength =
      ((_a = this.editorView.container.textContent) === null || _a === void 0
        ? void 0
        : _a.length) || 0;
    if (position < 0 || position > totalLength) return;
    while ((node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        const textNode = node;
        const nextCharIndex = charIndex + textNode.length;
        if (position >= charIndex && position <= nextCharIndex) {
          range.setStart(
            textNode,
            Math.min(position - charIndex, textNode.length)
          );
          range.collapse(true);
          break;
        }
        charIndex = nextCharIndex;
      } else if (node.tagName === 'BR') {
        if (position === charIndex) {
          range.setStartBefore(node);
          range.collapse(true);
          break;
        }
        charIndex++;
      } else {
        const el = node;
        let i = el.childNodes.length;
        while (i--) {
          nodeStack.push(el.childNodes[i]);
        }
      }
    }
    sel.removeAllRanges();
    sel.addRange(range);
  }
  toggleBoldRange(start, end, id = '') {
    const allBold = this.isRangeEntirelyAttribute(start, end, 'bold');
    this.formatAttribute(start, end, 'bold', !allBold);
  }
  toggleItalicRange(start, end, id = '') {
    const allItalic = this.isRangeEntirelyAttribute(start, end, 'italic');
    this.formatAttribute(start, end, 'italic', !allItalic);
  }
  toggleUnderlineRange(start, end, id = '') {
    const allUnderline = this.isRangeEntirelyAttribute(start, end, 'underline');
    this.formatAttribute(start, end, 'underline', !allUnderline);
  }
  toggleUndoRange(start, end, id = '') {
    const allUndo = this.isRangeEntirelyAttribute(start, end, 'undo');
    this.formatAttribute(start, end, 'undo', !allUndo);
  }
  toggleRedoRange(start, end) {
    const allRedo = this.isRangeEntirelyAttribute(start, end, 'redo');
    this.formatAttribute(start, end, 'redo', !allRedo);
  }
  applyFontColor(start, end, color, id = '') {
    if (start < end) {
      this.formatAttribute(start, end, 'fontColor', color);
      console.log('applyFontColor-color', color, start, end);
    }
  }
  applyBgColor(start, end, color, id = '') {
    if (start < end) {
      this.formatAttribute(start, end, 'bgColor', color);
    }
  }
  isRangeEntirelyAttribute(start, end, attr) {
    let offset = this.currentOffset;
    let allHaveAttr = true;
    if (this.selectedBlockId !== '') {
      const index = this.blocks.findIndex(
        block => block.dataId === this.selectedBlockId
      );
      for (let piece of this.blocks[index].pieces) {
        const pieceEnd = offset + piece.text.length;
        if (pieceEnd > start && offset < end) {
          if (!piece.attributes[attr]) {
            allHaveAttr = false;
            break;
          }
        }
        offset = pieceEnd;
      }
    }
    return allHaveAttr;
  }
  mergePieces(pieces) {
    let merged = [];
    for (let p of pieces) {
      const last = merged[merged.length - 1];
      if (last && last.hasSameAttributes(p)) {
        last.text += p.text;
      } else {
        merged.push(p);
      }
    }
    return merged;
  }
  findPieceAtOffset(offset, dataId = '') {
    let currentOffset = 0;
    if (dataId) {
      for (let block of this.blocks) {
        const blockLength = block.pieces.reduce(
          (acc, curr) => acc + curr.text.length,
          0
        );
        if (block.dataId == dataId) {
          let prevPiece = null;
          for (let piece of block.pieces) {
            const pieceStart = currentOffset;
            const pieceEnd = pieceStart + piece.text.length;
            if (offset >= pieceStart && offset < pieceEnd) {
              return offset === pieceStart && prevPiece ? prevPiece : piece;
            }
            prevPiece = piece;
            currentOffset = pieceEnd;
          }
        } else {
          currentOffset += blockLength;
        }
      }
    }
    return null;
  }
  setFontFamily(start, end, fontFamily) {
    this.formatAttribute(start, end, 'fontFamily', fontFamily);
  }
  setFontSize(start, end, fontSize) {
    this.formatAttribute(start, end, 'fontSize', fontSize);
  }
  setAlignment(alignment, dataId) {
    const block = this.blocks.find(block => block.dataId === dataId);
    if (!block) return;
    block.alignment = alignment;
    this.emit('documentChanged', this);
  }
  getHtmlContent() {
    const editorContainer = document.getElementById('editor');
    if (!editorContainer) {
      console.error('Editor container not found.');
      return;
    }
    const htmlContent = editorContainer.innerHTML;
    navigator.clipboard
      .writeText(htmlContent)
      .then(() => {
        console.log('HTML copied to clipboard!');
      })
      .catch(err => console.error('Failed to copy HTML:', err));
    return htmlContent;
  }
  getCursorOffsetInParent(parentSelector) {
    var _a;
    console.log('textPosition -1:vicky', parentSelector);
    const parentElement = document.querySelector(parentSelector);
    if (!parentElement) return null;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (!parentElement.contains(range.startContainer)) return null;
    let offset = 0;
    let targetNode = null;
    const walker = document.createTreeWalker(
      parentElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    let matchedChild = null;
    while (walker.nextNode()) {
      const currentNode = walker.currentNode;
      console.log(currentNode, 'textPosition - currentNode: vicky');
      if (currentNode === range.startContainer) {
        offset += range.startOffset;
        targetNode = currentNode;
        matchedChild = currentNode.parentElement;
        break;
      } else {
        offset +=
          ((_a = currentNode.textContent) === null || _a === void 0
            ? void 0
            : _a.length) || 0;
      }
    }
    console.log(
      {
        offset,
        childNode: targetNode,
        innerHTML: matchedChild.innerHTML,
        innerText: matchedChild.innerText,
      },
      'textPosition - return values: vicky'
    );
    return {
      offset,
      childNode: targetNode,
      innerHTML: matchedChild.innerHTML,
      innerText: matchedChild.innerText,
    };
  }
}
export default TextDocument;

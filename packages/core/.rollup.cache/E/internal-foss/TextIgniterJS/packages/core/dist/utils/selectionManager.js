export function saveSelection(container) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(container);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;
  preSelectionRange.setEnd(range.endContainer, range.endOffset);
  const end = preSelectionRange.toString().length;
  return { start, end };
}
export function restoreSelection(container, savedSel) {
  if (!savedSel) return;
  let charIndex = 0;
  const range = document.createRange();
  range.setStart(container, 0);
  range.collapse(true);
  const nodeStack = [container];
  let node;
  let foundStart = false;
  let stop = false;
  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType === 3) {
      const textNode = node;
      const nextCharIndex = charIndex + textNode.length;
      if (
        !foundStart &&
        savedSel.start >= charIndex &&
        savedSel.start <= nextCharIndex
      ) {
        range.setStart(textNode, savedSel.start - charIndex);
        foundStart = true;
      }
      if (
        foundStart &&
        savedSel.end >= charIndex &&
        savedSel.end <= nextCharIndex
      ) {
        range.setEnd(textNode, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else if (node.tagName === 'BR') {
      if (!foundStart && savedSel.start === charIndex) {
        range.setStartBefore(node);
        foundStart = true;
      }
      if (foundStart && savedSel.end === charIndex) {
        range.setEndBefore(node);
        stop = true;
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
  const sel = window.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  sel.addRange(range);
}
export function getSelectionRange(editorView) {
  const sel = saveSelection(editorView.container);
  if (!sel) return [0, 0];
  return [sel.start, sel.end];
}
export function extractTextFromDataId(dataId, textDocument) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { remainingText: '', piece: null };
  }
  const range = selection.getRangeAt(0);
  const cursorNode = range.startContainer;
  let fText = '';
  const _block = textDocument.blocks.filter(block => {
    if (block.dataId === dataId) {
      return block;
    }
  });
  const element = document.querySelector(`[data-id="${dataId}"]`);
  const textPosition = textDocument.getCursorOffsetInParent(
    `[data-id="${dataId}"]`
  );
  console.log(textPosition, 'textPosition:vicky');
  let _piece = [];
  let index = 0;
  _block[0].pieces.forEach((obj, i) => {
    fText += obj.text;
    if (
      (textPosition === null || textPosition === void 0
        ? void 0
        : textPosition.innerText) === obj.text
    ) {
      index = i;
      _piece.push(obj);
    }
  });
  if (_block[0].pieces.length > 1) {
    _block[0].pieces.forEach((obj, i) => {
      if (index < i) {
        _piece.push(obj);
      }
    });
  }
  if (!element) {
    console.error(`Element with data-id "${dataId}" not found.`);
    return { remainingText: '', piece: null };
  }
  if (!element.contains(cursorNode)) {
    console.error(`Cursor is not inside the element with data-id "${dataId}".`);
    return { remainingText: '', piece: null };
  }
  const fullText = fText;
  const cursorOffset =
    textPosition === null || textPosition === void 0
      ? void 0
      : textPosition.offset;
  const remainingText = fullText.slice(cursorOffset);
  const newContent = fullText.slice(0, cursorOffset);
  element.textContent = newContent;
  return { remainingText: remainingText, piece: _piece };
}
export function addBlockAfter(data, targetDataId, newBlock) {
  const targetIndex = data.findIndex(block => block.dataId === targetDataId);
  if (targetIndex === -1) {
    console.error(`Block with dataId "${targetDataId}" not found.`);
    return data;
  }
  const updatedData = [
    ...data.slice(0, targetIndex + 1),
    newBlock,
    ...data.slice(targetIndex + 1),
  ];
  return updatedData;
}
//# sourceMappingURL=selectionManager.js.map

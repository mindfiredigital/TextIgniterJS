export function setCursorPosition(editorView, position, dataId = '') {
  if (dataId === '') editorView.container.focus();
  else {
    const divDataid = document.querySelector('[data-id="' + dataId + '"]');
    divDataid.focus();
  }
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  let charIndex = 0;
  const nodeStack = [editorView.container];
  let node;
  while ((node = nodeStack.pop())) {
    if (node.nodeType === 3) {
      const textNode = node;
      const nextCharIndex = charIndex + textNode.length;
      if (position >= charIndex && position <= nextCharIndex) {
        range.setStart(textNode, position - charIndex);
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

import EditorView from '../view/editorView';

export function setCursorPosition(
  editorView: EditorView,
  position: number,
  dataId: string | null = ''
): void {
  if (dataId === '') editorView.container.focus();
  else {
    const divDataid = document.querySelector(
      '[data-id="' + dataId + '"]'
    ) as HTMLElement;
    if (!divDataid) return; // Guard: if not found, do nothing
    divDataid.focus();
  }
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  let charIndex = 0;
  const nodeStack: Node[] = [editorView.container];
  let node: Node | undefined;

  while ((node = nodeStack.pop())) {
    if (node.nodeType === 3) {
      const textNode = node as Text;
      const nextCharIndex = charIndex + textNode.length;
      if (position >= charIndex && position <= nextCharIndex) {
        range.setStart(textNode, position - charIndex);
        range.collapse(true);
        break;
      }
      charIndex = nextCharIndex;
    } else if ((node as HTMLElement).tagName === 'BR') {
      if (position === charIndex) {
        range.setStartBefore(node);
        range.collapse(true);
        break;
      }
      charIndex++;
    } else {
      const el = node as HTMLElement;
      let i = el.childNodes.length;
      while (i--) {
        nodeStack.push(el.childNodes[i]);
      }
    }
  }

  sel.removeAllRanges();
  sel.addRange(range);
}

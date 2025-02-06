import EditorView from "../view/editorView";
export function saveSelection(container: HTMLElement): { start: number; end: number } | null {
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

export function restoreSelection(container: HTMLElement, savedSel: { start: number; end: number } | null): void {
    if (!savedSel) return;
    let charIndex = 0;
    const range = document.createRange();
    range.setStart(container, 0);
    range.collapse(true);

    const nodeStack: Node[] = [container];
    let node: Node | undefined;
    let foundStart = false;
    let stop = false;
    while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType === 3) {
            const textNode = node as Text;
            const nextCharIndex = charIndex + textNode.length;
            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                range.setStart(textNode, savedSel.start - charIndex);
                foundStart = true;
            }
            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                range.setEnd(textNode, savedSel.end - charIndex);
                stop = true;
            }
            charIndex = nextCharIndex;
        } else if ((node as HTMLElement).tagName === 'BR') {
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
            const el = node as HTMLElement;
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


export function getSelectionRange(editorView:EditorView): [number, number] {
    const sel = saveSelection(editorView.container);
    if (!sel) return [0, 0];
    return [sel.start, sel.end];
}
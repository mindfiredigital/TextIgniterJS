export default function saveSelection(container) {
    const selection = window.getSelection();
    if(!selection) return null;
    if (selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(container);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;

    preSelectionRange.setEnd(range.endContainer, range.endOffset);
    const end = preSelectionRange.toString().length;

    return { start, end };
}

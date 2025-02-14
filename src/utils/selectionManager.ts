import TextDocument from "../textDocument";
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



export function  extractTextFromDataId(dataId: string,textDocument:TextDocument): { remainingText: string, piece: any } {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return { remainingText: '', piece: null }; // No valid selection
    }

    const range = selection.getRangeAt(0); // Get the current range of the cursor
    const cursorNode = range.startContainer; // The node where the cursor is placed

    // Find the element with the given data-id
    let fText = '';

    let count = 0;
    const _block = textDocument.blocks.filter((block: any) => {
        if (block.dataId === dataId) {
            return block;
        }
    })
    const element = document.querySelector(`[data-id="${dataId}"]`) as HTMLElement;
    const textPosition = textDocument.getCursorOffsetInParent(`[data-id="${dataId}"]`)
    let _piece: any = [];
    let index = 0;
    _block[0].pieces.forEach((obj: any, i: number) => {
        fText += obj.text
        if (textPosition?.innerText === obj.text) {
            index = i;
            _piece.push(obj);
        }
    })
    if (_block[0].pieces.length > 1) {
        _block[0].pieces.forEach((obj: any, i: number) => {
            if (index < i) {
                _piece.push(obj)
            }
        })
    }
    

    if (!element) {
        console.error(`Element with data-id "${dataId}" not found.`);
        return { remainingText: '', piece: null }; // No element with the provided data-id
    }

    // Ensure the cursor is inside the specified element
    if (!element.contains(cursorNode)) {
        console.error(`Cursor is not inside the element with data-id "${dataId}".`);
        return { remainingText: '', piece: null }; // Cursor is outside the target element
    }

    // Get the full text content of the element
    // const fullText = element.textContent || '';
    const fullText = fText;
    // Calculate the offset position of the cursor within the text node
    // const cursorOffset = range.startOffset;
    const cursorOffset = textPosition?.offset;

    
    // Extract text from the cursor position to the end
    const remainingText = fullText.slice(cursorOffset);

    // Update the DOM: Keep only the text before the cursor
    const newContent = fullText.slice(0, cursorOffset);
    element.textContent = newContent; // Update the element content with remaining text

    

    return { remainingText: remainingText, piece: _piece }; // Return the extracted text
}


export function addBlockAfter(data: any[], targetDataId: string, newBlock: any): any[] {
    // Find the index of the block with the specified dataId
    const targetIndex = data.findIndex(block => block.dataId === targetDataId);

    if (targetIndex === -1) {
        console.error(`Block with dataId "${targetDataId}" not found.`);
        return data;
    }

    // Insert the new block after the target index
    const updatedData = [
        ...data.slice(0, targetIndex + 1),
        newBlock,
        ...data.slice(targetIndex + 1),
    ];

    return updatedData;
}
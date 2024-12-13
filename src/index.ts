import restoreSelection from './utils/selection/restoreSelection';
import saveSelection from './utils/selection/saveSelection';
import {TextDocument } from './textDocument';
import { Piece } from './piece';

class TextIgniter {
    private editorElement: HTMLElement;
    private boldButton: HTMLElement;
    private document: TextDocument;

    constructor(editorElement: HTMLElement, boldButton: HTMLElement) {
        this.editorElement = editorElement;
        this.boldButton = boldButton;
        this.document = new TextDocument();

        this.boldButton.addEventListener("click", () => this.toggleBold());
        this.editorElement.addEventListener("input", () => this.onInput());
        this.render();
    }

    private getSelectionRange(): [number, number] {
        const savedSel = saveSelection(this.editorElement);
        if (!savedSel) return [0, 0];
        return [savedSel.start, savedSel.end];
    }

    private toggleBold(): void {
        const [start, end] = this.getSelectionRange();
        if (start === end) return; // Do nothing if there's no selection

        this.document.formatBold(start, end);
        this.render();
        this.setCursorPosition(end);
    }

    private onInput(): void {
        const savedSel = saveSelection(this.editorElement);
        const plainText = this.editorElement.textContent || "";
        // this.document = new TextDocument();
        this.document.pieces = [new Piece(plainText)];
        this.render();
        restoreSelection(this.editorElement, savedSel);
    }

    private render(): void {
        const savedSel = saveSelection(this.editorElement);
        this.document.render(this.editorElement);
        restoreSelection(this.editorElement, savedSel);
    }

    private setCursorPosition(position: number): void {
        this.editorElement.focus();
        const sel = window.getSelection();
        const range = document.createRange();
        let charIndex = 0;
        const nodeStack: Node[] = [this.editorElement];
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
            } else {
                for (let i = node.childNodes.length - 1; i >= 0; i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

(window as any).TextIgniter = TextIgniter;

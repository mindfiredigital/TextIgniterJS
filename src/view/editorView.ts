import Piece from "../piece";
import TextDocument from "../textDocument";
import { saveSelection, restoreSelection } from "../utils/selectionManager";

class EditorView {
    container: HTMLElement;
    document: TextDocument;
    constructor(container: HTMLElement, document: TextDocument) {
        this.container = container;
        this.document = document;
    }

    render(): void {
        const savedSel = saveSelection(this.container);
        this.container.innerHTML = "";
        // Create a wrapper div with a unique data-id
        console.log(this.document.blocks, "action -- block editorview")
        this.document.blocks.forEach((block: any) => {
            if (block.dataId !== '') {
                let wrapperDiv: HTMLElement;
                let olWrapper: HTMLElement;
                if (block.listType === 'ol') {
                    wrapperDiv = document.createElement('ol');
                    
                } else if (block.listType === 'ul') {
                    wrapperDiv = document.createElement('ul');
                } else {
                    wrapperDiv = document.createElement('div'); // Default to a paragraph block
                }
                // const wrapperDiv = document.createElement("div");
                wrapperDiv.setAttribute("data-id", block.dataId);
                wrapperDiv.setAttribute("class", block.class);
                if (block.listType === 'ol' || block.listType === 'ul') {
                    olWrapper = document.createElement('li');
                    block.pieces.forEach((piece: Piece) => {
                        olWrapper.appendChild(this.renderPiece(piece));
                    });
                    wrapperDiv.append(olWrapper)

                } else {
                    block.pieces.forEach((piece: Piece) => {
                        wrapperDiv.appendChild(this.renderPiece(piece));
                    });
                }
                // this.document.pieces.forEach(piece => {
                //     console.log(piece, "this.document.pieces", this.renderPiece(piece))
                //     // this.container.appendChild(this.renderPiece(piece));
                //     wrapperDiv.appendChild(this.renderPiece(piece));
                // });
                this.container.appendChild(wrapperDiv);
            }

        })

        restoreSelection(this.container, savedSel);
    }

    renderPiece(piece: Piece): DocumentFragment {
        const lines = piece.text.split('\n');
        return this.wrapAttributes(lines, piece.attributes);
    }

    wrapAttributes(lines: string[], attrs: { bold: boolean; italic: boolean; underline: boolean }): DocumentFragment {
        const fragment = document.createDocumentFragment();
        lines.forEach((line, index) => {
            let textNode: Node = document.createTextNode(line);
            if (attrs.underline) {
                const u = document.createElement('u');
                u.appendChild(textNode);
                textNode = u;
            }
            if (attrs.italic) {
                const em = document.createElement('em');
                em.appendChild(textNode);
                textNode = em;
            }
            if (attrs.bold) {
                const strong = document.createElement('strong');
                strong.appendChild(textNode);
                textNode = strong;
            }

            fragment.appendChild(textNode);
            if (index < lines.length - 1) {
                fragment.appendChild(document.createElement('br'));
            }
        });
        return fragment;
    }
}

export default EditorView;
import Piece from "../piece";
import TextDocument from "../textDocument";
declare class EditorView {
    container: HTMLElement;
    document: TextDocument;
    constructor(container: HTMLElement, document: TextDocument);
    render(): void;
    renderPiece(piece: Piece): DocumentFragment;
    wrapAttributes(lines: string[], attrs: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
        fontFamily?: string;
        fontSize?: string;
        hyperlink?: string | boolean;
    }): DocumentFragment;
}
export default EditorView;

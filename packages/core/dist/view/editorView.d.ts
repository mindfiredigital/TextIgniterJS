import Piece from '../piece';
import TextDocument from '../textDocument';
import { ImageHandler } from '../handlers/image';
declare class EditorView {
    container: HTMLElement;
    document: TextDocument;
    imageHandler: ImageHandler;
    constructor(container: HTMLElement, document: TextDocument);
    setImageHandler(imageHandler: ImageHandler): void;
    render(): void;
    renderPiece(piece: Piece): DocumentFragment;
    wrapAttributes(lines: string[], attrs: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
        strikethrough?: boolean;
        fontFamily?: string;
        fontSize?: string;
        hyperlink?: string | boolean;
        fontColor?: string;
        bgColor?: string;
    }): DocumentFragment;
}
export default EditorView;

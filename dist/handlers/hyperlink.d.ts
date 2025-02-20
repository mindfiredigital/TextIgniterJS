import { blockType } from "../types/pieces";
import EditorView from "../view/editorView";
import TextDocument from "../textDocument";
declare class HyperlinkHandler {
    savedSelection: {
        start: number;
        end: number;
    } | null;
    editorContainer: HTMLElement | null;
    editorView: EditorView;
    document: TextDocument;
    constructor(editorContainer: HTMLElement, editorView: EditorView, document: TextDocument);
    hanldeHyperlinkClick(start: number, end: number, currentOffset: number, selectedBlockId: string | null, blocks: blockType): void;
    getCommonHyperlinkInRange(start: number, end: number, currentOffset: number, selectedBlockId: string | null, blocks: blockType): string | null;
    showHyperlinkInput(existingLink: string | null): void;
    highlightSelection(): void;
    removeHighlightSelection(): void;
    applyHyperlink(url: string, dataIdsSnapshot: any): void;
    removeHyperlink(dataIdsSnapshot: any): void;
    showHyperlinkViewButton(link: string | ""): void;
    hideHyperlinkViewButton(): void;
}
export default HyperlinkHandler;

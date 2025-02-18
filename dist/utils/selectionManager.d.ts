import TextDocument from "../textDocument";
import EditorView from "../view/editorView";
export declare function saveSelection(container: HTMLElement): {
    start: number;
    end: number;
} | null;
export declare function restoreSelection(container: HTMLElement, savedSel: {
    start: number;
    end: number;
} | null): void;
export declare function getSelectionRange(editorView: EditorView): [number, number];
export declare function extractTextFromDataId(dataId: string, textDocument: TextDocument): {
    remainingText: string;
    piece: any;
};
export declare function addBlockAfter(data: any[], targetDataId: string, newBlock: any): any[];

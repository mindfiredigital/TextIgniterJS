import EventEmitter from "./utils/events";
import Piece from "./piece";
declare class TextDocument extends EventEmitter {
    undoStack: {
        id: string;
        start: number;
        end: number;
        action: string;
        previousValue: any;
        newValue: any;
        dataId?: string | null;
    }[];
    redoStack: {
        id: string;
        start: number;
        end: number;
        action: string;
        previousValue: any;
        newValue: any;
        dataId?: string | null;
    }[];
    dataIds: string[];
    pieces: Piece[];
    blocks: any;
    selectAll: boolean;
    private _selectedBlockId;
    get selectedBlockId(): string | null;
    set selectedBlockId(value: string | null);
    currentOffset: number;
    constructor();
    getPlainText(): string;
    triggerBackspaceEvents(target: any): void;
    triggerKeyPress(target: any, key: any): void;
    simulateEnterPress(target: any): void;
    insertAt(text: string, attributes: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        hyperlink?: boolean | string;
    }, position: number, dataId?: string | null, currentOffset?: number, id?: string, actionType?: string, isSynthetic?: boolean): void;
    setCursorPositionUsingOffset(element: HTMLElement, offset: number): void;
    deleteRange(start: number, end: number, dataId?: string | null, currentOffset?: number): void;
    deleteBlocks(): void;
    getSelectedTextDataId(): string | null;
    getAllSelectedDataIds(): string[];
    handleCtrlASelection(): string[];
    getSelectedDataIds(): string[];
    private getDataIdFromNode;
    getCursorOffset(container: HTMLElement): number;
    formatAttribute(start: number, end: number, attribute: keyof Piece['attributes'], value: string | boolean): void;
    toggleOrderedList(dataId: string | null, id?: string): void;
    toggleOrderedList1(dataId: string | null, id?: string): void;
    toggleUnorderedList(dataId: string | null, id?: string): void;
    toggleUnorderedList1(dataId: string | null, id?: string): void;
    updateOrderedListNumbers(): void;
    getRangeText(start: number, end: number): string;
    getRangeTextPiece(start: number, end: number): {
        rangeText: string;
        piece: any;
    };
    undo(): void;
    redo(): void;
    private revertAction;
    private applyAction;
    toggleBoldRange1(start: number, end: number, id?: string): void;
    toggleItalicRange1(start: number, end: number, id?: string): void;
    toggleUnderlineRange1(start: number, end: number, id?: string): void;
    toggleBoldRange(start: number, end: number, id?: string): void;
    toggleItalicRange(start: number, end: number, id?: string): void;
    toggleUnderlineRange(start: number, end: number, id?: string): void;
    toggleUndoRange(start: number, end: number, id?: string): void;
    toggleRedoRange(start: number, end: number): void;
    applyFontColor(start: number, end: number, color: string, id?: string): void;
    applyFontColor1(start: number, end: number, color: string, id?: string): void;
    applyBgColor(start: number, end: number, color: string, id?: string): void;
    applyBgColor1(start: number, end: number, color: string, id?: string): void;
    isRangeEntirelyAttribute(start: number, end: number, attr: 'bold' | 'italic' | 'underline' | 'undo' | 'redo'): boolean;
    mergePieces(pieces: Piece[]): Piece[];
    findPieceAtOffset(offset: number, dataId?: string | null): Piece | null;
    setFontFamily(start: number, end: number, fontFamily: string, id?: string): void;
    setFontFamily1(start: number, end: number, fontFamily: string, id?: string): void;
    setFontSize(start: number, end: number, fontSize: string, id?: string): void;
    setFontSize1(start: number, end: number, fontSize: string, id?: string): void;
    setAlignment(alignment: 'left' | 'center' | 'right', dataId: string | null, id?: string): void;
    setAlignment1(alignment: 'left' | 'center' | 'right', dataId: string | null, id?: string): void;
    getHtmlContent(): string | undefined;
    getCursorOffsetInParent(parentSelector: string): {
        offset: number;
        childNode: Node | null;
        innerHTML: string;
        innerText: string;
    } | null;
}
export default TextDocument;

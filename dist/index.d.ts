declare class EventEmitter {
    private events;
    on(event: string, listener: (data?: any) => void): void;
    emit(event: string, data?: any): void;
}

declare class Piece {
    text: string;
    attributes: {
        bold: boolean;
        italic: boolean;
        underline: boolean;
        undo?: boolean;
        redo?: boolean;
        fontFamily?: string;
        fontSize?: string;
        hyperlink?: string | boolean;
    };
    constructor(text: string, attributes?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        undo?: boolean;
        redo?: boolean;
        fontFamily?: string;
        fontSize?: string;
        hyperlink?: string | boolean;
    });
    isBold(): boolean;
    setBold(v: boolean): void;
    isItalic(): boolean;
    isUndo(): boolean | undefined;
    isRedo(): boolean | undefined;
    setItalic(v: boolean): void;
    isUnderline(): boolean;
    setUnderline(v: boolean): void;
    setUndo(v: boolean): void;
    setRedo(v: boolean): void;
    clone(): Piece;
    hasSameAttributes(other: Piece): boolean;
    getHyperlink(): string | boolean;
    setHyperlink(url: string | boolean): void;
}

declare class TextDocument extends EventEmitter {
    undoStack: {
        id: string;
        start: number;
        end: number;
        action: string;
        previousValue: string | null;
        newValue: string | null;
    }[];
    redoStack: {
        id: string;
        start: number;
        end: number;
        action: string;
        previousValue: string | null;
        newValue: string | null;
    }[];
    dataIds: string[];
    pieces: Piece[];
    blocks: any;
    private _selectedBlockId;
    get selectedBlockId(): string | null;
    set selectedBlockId(value: string | null);
    currentOffset: number;
    constructor();
    getPlainText(): string;
    insertAt(text: string, attributes: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        hyperlink?: boolean | string;
    }, position: number, dataId?: string | null, currentOffset?: number, id?: string, actionType?: string): void;
    setCursorPositionUsingOffset(element: HTMLElement, offset: number): void;
    deleteRange(start: number, end: number, dataId?: string | null, currentOffset?: number): void;
    deleteBlocks(): void;
    getSelectedTextDataId(): string | null;
    getAllSelectedDataIds(): string[];
    getSelectedDataIds(): string[];
    private getDataIdFromNode;
    getCursorOffset(container: HTMLElement): number;
    applyHyperlinkRange(start: number, end: number, url: string): void;
    removeHyperlinkRange(start: number, end: number): void;
    getCommonHyperlinkInRange(start: number, end: number): string | null;
    formatAttribute(start: number, end: number, attribute: keyof Piece['attributes'], value: string | boolean): void;
    toggleOrderedList(dataId: string | null, listStart?: number): void;
    toggleUnorderedList(dataId: string | null): void;
    getRangeText(start: number, end: number): string;
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
    isRangeEntirelyAttribute(start: number, end: number, attr: 'bold' | 'italic' | 'underline' | 'undo' | 'redo'): boolean;
    mergePieces(pieces: Piece[]): Piece[];
    findPieceAtOffset(offset: number, dataId?: string | null): Piece | null;
    setFontFamily(start: number, end: number, fontFamily: string): void;
    setFontSize(start: number, end: number, fontSize: string): void;
    setAlignment(alignment: 'left' | 'center' | 'right', dataId: string | null): void;
}

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

declare class ToolbarView extends EventEmitter {
    container: HTMLElement;
    constructor(container: HTMLElement);
    setupButtons(): void;
    updateActiveStates(attributes: CurrentAttributeDTO): void;
}

type EditorConfig = {
    features: string[];
};
interface CurrentAttributeDTO {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    undo?: boolean;
    redo?: boolean;
    hyperlink?: string | boolean;
    fontFamily?: string;
    fontSize?: string;
}
declare class TextIgniter {
    document: TextDocument;
    editorView: EditorView;
    toolbarView: ToolbarView;
    currentAttributes: CurrentAttributeDTO;
    manualOverride: boolean;
    lastPiece: Piece | null;
    editorContainer: HTMLElement | null;
    toolbarContainer: HTMLElement | null;
    savedSelection: {
        start: number;
        end: number;
    } | null;
    constructor(editorId: string, config: EditorConfig);
    createEditor(editorId: string, config: EditorConfig): void;
    getSelectionRange(): [number, number];
    handleToolbarAction(action: string, dataId?: string[]): void;
    showHyperlinkInput(existingLink: string | null): void;
    highlightSelection(): void;
    removeHighlightSelection(): void;
    applyHyperlink(url: string): void;
    removeHyperlink(): void;
    handleSelectionChange(): void;
    handleKeydown(e: KeyboardEvent): void;
    extractTextFromDataId(dataId: string): string;
    getCurrentCursorBlock(): string | null;
    addBlockAfter(data: any[], targetDataId: string, newBlock: any): any[];
    syncCurrentAttributesWithCursor(): void;
    setCursorPosition(position: number, dataId?: string | null): void;
}

export { type CurrentAttributeDTO, type EditorConfig, TextIgniter };

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
        fontColor?: string;
        bgColor: string;
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
        fontColor?: string;
        bgColor?: string;
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

declare class ImageHandler {
    private editor;
    private editorView;
    private document;
    isImageHighlighted: boolean;
    highLightedImageDataId: string;
    currentCursorLocation: number;
    isCrossIconVisible: boolean;
    constructor(editor: HTMLElement, document: TextDocument);
    setEditorView(editorView: EditorView): void;
    insertImage(): void;
    insertImageAtCursor(dataUrl: string): void;
    setCursorPostion(postion: number, dataId: string): void;
    insertImageAtPosition(dataUrl: string, position: number, dataId: string | null): void;
    createImageFragment(imageUrl: string, dataId: string): HTMLSpanElement;
    addStyleToImage(dataId: string): void;
    clearImageStyling(): void;
    deleteImage(): void;
}

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
        fontFamily?: string;
        fontSize?: string;
        hyperlink?: string | boolean;
        fontColor?: string;
        bgColor?: string;
    }): DocumentFragment;
}

declare class UndoRedoManager {
    private document;
    private snapshotUndoStack;
    private snapshotRedoStack;
    private maxSnapshots;
    private editorView;
    constructor(document: TextDocument, editorView: EditorView);
    private createSnapshot;
    private getCurrentSelection;
    saveUndoSnapshot(): void;
    private restoreSnapshot;
    undo(): void;
    redo(): void;
}

declare class TextDocument extends EventEmitter {
    dataIds: string[];
    pieces: Piece[];
    blocks: any;
    selectAll: boolean;
    editorView: EditorView;
    undoRedoManager: UndoRedoManager;
    private _selectedBlockId;
    get selectedBlockId(): string | null;
    set selectedBlockId(value: string | null);
    currentOffset: number;
    constructor();
    setEditorView(editorView: EditorView): void;
    getPlainText(): string;
    setUndoRedoManager(undoRedoManager: UndoRedoManager): void;
    insertAt(text: string, attributes: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        hyperlink?: boolean | string;
    }, position: number, dataId?: string | null, currentOffset?: number, id?: string, actionType?: string, isSynthetic?: boolean): void;
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
    toggleUnorderedList(dataId: string | null): void;
    updateOrderedListNumbers(): void;
    undo(): void;
    redo(): void;
    setCursorPosition(position: number, dataId?: string | null): void;
    toggleBoldRange(start: number, end: number, id?: string): void;
    toggleItalicRange(start: number, end: number, id?: string): void;
    toggleUnderlineRange(start: number, end: number, id?: string): void;
    toggleUndoRange(start: number, end: number, id?: string): void;
    toggleRedoRange(start: number, end: number): void;
    applyFontColor(start: number, end: number, color: string, id?: string): void;
    applyBgColor(start: number, end: number, color: string, id?: string): void;
    isRangeEntirelyAttribute(start: number, end: number, attr: 'bold' | 'italic' | 'underline' | 'undo' | 'redo'): boolean;
    mergePieces(pieces: Piece[]): Piece[];
    findPieceAtOffset(offset: number, dataId?: string | null): Piece | null;
    setFontFamily(start: number, end: number, fontFamily: string): void;
    setFontSize(start: number, end: number, fontSize: string): void;
    setAlignment(alignment: 'left' | 'center' | 'right', dataId: string | null): void;
    getHtmlContent(): string | undefined;
    getCursorOffsetInParent(parentSelector: string): {
        offset: number;
        childNode: Node | null;
        innerHTML: string;
        innerText: string;
    } | null;
}

declare class ToolbarView extends EventEmitter {
    container: HTMLElement;
    constructor(container: HTMLElement);
    setupButtons(): void;
    updateActiveStates(attributes: CurrentAttributeDTO): void;
}

type blockType = any;

declare class HyperlinkHandler {
    savedSelection: {
        start: number;
        end: number;
    } | null;
    editorContainer: HTMLElement | null;
    editorView: EditorView;
    document: TextDocument;
    undoRedoManager: UndoRedoManager;
    constructor(editorContainer: HTMLElement, editorView: EditorView, document: TextDocument);
    setUndoRedoManager(undoRedoManager: UndoRedoManager): void;
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

declare class HtmlToJsonParser {
    private htmlString;
    private doc;
    constructor(htmlString: string);
    parse(): any[];
    private parseElement;
    private parseListItems;
    private parseParagraphText;
    private extractTextAttributes;
    private rgbToHex;
}

type EditorConfig = {
    features: string[];
    showToolbar?: boolean;
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
    fontColor?: string;
    bgColor?: string;
}
declare class TextIgniter {
    document: TextDocument;
    htmlToJsonParser: HtmlToJsonParser | undefined;
    editorView: EditorView;
    toolbarView: ToolbarView;
    hyperlinkHandler: HyperlinkHandler;
    imageHandler: ImageHandler;
    currentAttributes: CurrentAttributeDTO;
    manualOverride: boolean;
    lastPiece: Piece | null;
    editorContainer: HTMLElement | null;
    toolbarContainer: HTMLElement | null;
    savedSelection: {
        start: number;
        end: number;
    } | null;
    debounceTimer: NodeJS.Timeout | null;
    undoRedoManager: UndoRedoManager;
    constructor(editorId: string, config: EditorConfig);
    getSelectionRange(): [number, number];
    applyFontColor(color: string): void;
    handleToolbarAction(action: string, dataId?: string[]): void;
    handleSelectionChange(): void;
    handleKeydown(e: KeyboardEvent): void;
    extractTextFromDataId(dataId: string): {
        remainingText: string;
        piece: any;
    };
    getCurrentCursorBlock(): string | null;
    addBlockAfter(data: any[], targetDataId: string, newBlock: any): any[];
    syncCurrentAttributesWithCursor(): void;
    setCursorPosition(position: number, dataId?: string | null): void;
}

export { TextIgniter };

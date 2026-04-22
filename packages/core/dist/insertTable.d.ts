export declare class InsertTableHandler {
    private editor;
    private document;
    private modal;
    private activeTable;
    constructor(editor: HTMLDivElement, document: any);
    openTableModal(): void;
    private closeModal;
    private insertTable;
    private setupCellEvents;
    private selectAllInCell;
    private setActiveTable;
    private clearTableActive;
    private setupClickOutsideListener;
}

export declare class InsertLayoutHandler {
    private editor;
    private document;
    private modal;
    private activeLayout;
    constructor(editor: HTMLDivElement, document: any);
    openLayoutModal(): void;
    private closeModal;
    private insertLayout;
    private setupCellEvents;
    private selectAllInCell;
    private setActiveLayout;
    private clearLayoutActive;
    private setupClickOutsideListener;
}

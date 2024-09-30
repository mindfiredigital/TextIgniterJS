export declare class HyperlinkHandler {
    private editor;
    private modal;
    private overlay;
    private currentAnchor;
    private savedRange;
    constructor(editor: HTMLDivElement);
    private saveSelection;
    openHyperlinkModal(): void;
    private insertHyperlink;
    private closeHyperlinkModal;
}

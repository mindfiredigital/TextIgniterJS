export declare function saveSelection(container: HTMLElement): {
    start: number;
    end: number;
} | null;
export declare function restoreSelection(container: HTMLElement, savedSel: {
    start: number;
    end: number;
} | null): void;

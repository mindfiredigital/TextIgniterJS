export type EditorConfig = {
    features: string[];
    showToolbar?: boolean;
    popupFeatures?: string[];
};
export type EditorConfigReturnType = {
    mainEditorId: string;
    toolbarId: string;
    popupToolbarId: string;
};

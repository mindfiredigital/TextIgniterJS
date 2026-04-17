export interface Template {
    name: string;
    html: string;
}
export type EditorConfig = {
    features: string[];
    showToolbar?: boolean;
    popupFeatures?: string[];
    templates?: Template[];
};
export type EditorConfigReturnType = {
    mainEditorId: string;
    toolbarId: string;
    popupToolbarId: string;
};

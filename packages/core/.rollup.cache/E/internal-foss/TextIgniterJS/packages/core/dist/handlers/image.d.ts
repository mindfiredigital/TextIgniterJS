import EditorView from '../view/editorView';
import TextDocument from '../textDocument';
export declare class ImageHandler {
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
  insertImageAtPosition(
    dataUrl: string,
    position: number,
    dataId: string | null
  ): void;
  createImageFragment(imageUrl: string, dataId: string): HTMLSpanElement;
  addStyleToImage(dataId: string): void;
  clearImageStyling(): void;
  deleteImage(): void;
}

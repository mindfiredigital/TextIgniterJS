import TextDocument from './textDocument';
import EditorView from './view/editorView';
import ToolbarView from './view/toolbarView';
import HyperlinkHandler from './handlers/hyperlink';
import Piece from './piece';
import './styles/text-igniter.css';
import HtmlToJsonParser from './HtmlToJsonParser';
import { EditorConfig } from './types/editorConfig';
import { ImageHandler } from './handlers/image';
import UndoRedoManager from './handlers/undoRedoManager';
export interface CurrentAttributeDTO {
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
export declare class TextIgniter {
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
//# sourceMappingURL=TextIgniter.d.ts.map

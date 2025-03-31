import TextDocument from '../textDocument';
import EditorView from '../view/editorView';
export interface DocumentSnapshot {
  blocks: any[];
  dataIds: string[];
  selectedBlockId: string | null;
  currentOffset: number;
  selection?: {
    start: number;
    end: number;
  };
  cursorPosition?: number;
}
export default class UndoRedoManager {
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
//# sourceMappingURL=undoRedoManager.d.ts.map

import { getSelectionRange, saveSelection } from '../utils/selectionManager';
import TextDocument from '../textDocument';
import EditorView from '../view/editorView';
import Piece from '../piece';

export interface DocumentSnapshot {
  blocks: any[];
  dataIds: string[];
  selectedBlockId: string | null;
  currentOffset: number;
  selection?: { start: number; end: number };
  cursorPosition?: number;
}

export default class UndoRedoManager {
  private document: TextDocument;
  private snapshotUndoStack: DocumentSnapshot[] = [];
  private snapshotRedoStack: DocumentSnapshot[] = [];
  private maxSnapshots = 5000;
  private editorView: EditorView;

  constructor(document: TextDocument, editorView: EditorView) {
    this.document = document;
    this.editorView = editorView;
  }

  private createSnapshot(): DocumentSnapshot {
    // eslint-disable-next-line no-unused-vars
    const [start, end] = getSelectionRange(this.editorView);
    return {
      blocks: JSON.parse(JSON.stringify(this.document.blocks)),
      dataIds: [...this.document.dataIds],
      selectedBlockId: this.document.selectedBlockId,
      currentOffset: this.document.currentOffset,
      selection: this.getCurrentSelection(),
      cursorPosition: start,
    };
  }

  private getCurrentSelection(): { start: number; end: number } {
    // Assumes that document.editorView is set
    const sel = saveSelection(this.document.editorView.container);
    return sel ? { start: sel.start, end: sel.end } : { start: 0, end: 0 };
  }

  public saveUndoSnapshot(): void {
    const snapshot = this.createSnapshot();
    this.snapshotUndoStack.push(snapshot);
    if (this.snapshotUndoStack.length > this.maxSnapshots) {
      this.snapshotUndoStack.shift();
    }
    this.snapshotRedoStack = [];
  }

  private restoreSnapshot(snapshot: DocumentSnapshot): void {
    this.document.blocks = snapshot.blocks;
    this.document.dataIds = snapshot.dataIds;
    // Use the internal setter (or assign directly) for selectedBlockId.
    (this.document as any)._selectedBlockId = snapshot.selectedBlockId;
    this.document.currentOffset = snapshot.currentOffset;
    // Let TextDocument’s event listeners know that things have changed.
    // IMPORTANT: Recreate the Piece instances.
    for (let block of this.document.blocks) {
      if (block.pieces && Array.isArray(block.pieces)) {
        block.pieces = block.pieces.map(
          (piece: any) => new Piece(piece.text, piece.attributes)
        );
      }
    }
    this.document.emit('documentChanged', this.document);
    this.document.setCursorPosition(snapshot.cursorPosition || 0);
    // Restore selection using your helper.
    // if (snapshot.selection) {
    //   restoreSelection(
    //     this.document.editorView.container,
    //     snapshot.selection.start,
    //     snapshot.selection.end
    //   );
    // }
  }

  public undo(): void {
    console.log('   ', this.snapshotUndoStack);
    console.log('uuuno', this.snapshotRedoStack);
    if (this.snapshotUndoStack.length === 0) return;
    const currentSnapshot = this.createSnapshot();
    this.snapshotRedoStack.push(currentSnapshot);
    if (this.snapshotRedoStack.length > this.maxSnapshots) {
      this.snapshotRedoStack.shift();
    }
    // Pop the last snapshot and restore it.
    const snapshot = this.snapshotUndoStack.pop();
    if (snapshot) {
      this.restoreSnapshot(snapshot);
    }
  }

  public redo(): void {
    if (this.snapshotRedoStack.length === 0) return;
    const currentSnapshot = this.createSnapshot();
    this.snapshotUndoStack.push(currentSnapshot);
    if (this.snapshotUndoStack.length > this.maxSnapshots) {
      this.snapshotUndoStack.shift();
    }
    const snapshot = this.snapshotRedoStack.pop();
    if (snapshot) {
      this.restoreSnapshot(snapshot);
    }
  }
}

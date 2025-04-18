import { getSelectionRange, saveSelection } from '../utils/selectionManager';
import Piece from '../piece';
export default class UndoRedoManager {
    constructor(document, editorView) {
        this.snapshotUndoStack = [];
        this.snapshotRedoStack = [];
        this.maxSnapshots = 5000;
        this.document = document;
        this.editorView = editorView;
    }
    createSnapshot() {
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
    getCurrentSelection() {
        const sel = saveSelection(this.document.editorView.container);
        return sel ? { start: sel.start, end: sel.end } : { start: 0, end: 0 };
    }
    saveUndoSnapshot() {
        const snapshot = this.createSnapshot();
        this.snapshotUndoStack.push(snapshot);
        if (this.snapshotUndoStack.length > this.maxSnapshots) {
            this.snapshotUndoStack.shift();
        }
        this.snapshotRedoStack = [];
    }
    restoreSnapshot(snapshot) {
        this.document.blocks = snapshot.blocks;
        this.document.dataIds = snapshot.dataIds;
        this.document._selectedBlockId = snapshot.selectedBlockId;
        this.document.currentOffset = snapshot.currentOffset;
        for (let block of this.document.blocks) {
            if (block.pieces && Array.isArray(block.pieces)) {
                block.pieces = block.pieces.map((piece) => new Piece(piece.text, piece.attributes));
            }
        }
        this.document.emit('documentChanged', this.document);
        this.document.setCursorPosition(snapshot.cursorPosition || 0);
    }
    undo() {
        console.log('   ', this.snapshotUndoStack);
        console.log('uuuno', this.snapshotRedoStack);
        if (this.snapshotUndoStack.length === 0)
            return;
        const currentSnapshot = this.createSnapshot();
        this.snapshotRedoStack.push(currentSnapshot);
        if (this.snapshotRedoStack.length > this.maxSnapshots) {
            this.snapshotRedoStack.shift();
        }
        const snapshot = this.snapshotUndoStack.pop();
        if (snapshot) {
            this.restoreSnapshot(snapshot);
        }
    }
    redo() {
        if (this.snapshotRedoStack.length === 0)
            return;
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

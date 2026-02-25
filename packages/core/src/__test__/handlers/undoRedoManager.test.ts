import { describe, it, expect, beforeEach } from 'vitest';
import UndoRedoManager from '../../handlers/undoRedoManager';
import TextDocument from '../../textDocument';
import EditorView from '../../view/editorView';
import Piece from '../../piece';

function createMockDocument() {
  const doc = new TextDocument();
  doc.blocks = [
    {
      dataId: 'block1',
      pieces: [new Piece('Hello', { bold: true })],
      type: 'text',
      class: 'paragraph-block',
    },
    {
      dataId: 'block2',
      pieces: [new Piece('World', { italic: true })],
      type: 'text',
      class: 'paragraph-block',
    },
  ];
  doc.dataIds = ['block1', 'block2'];
  doc.selectedBlockId = 'block1';
  doc.currentOffset = 0;
  return doc;
}

describe('UndoRedoManager', () => {
  let document: TextDocument;
  let container: HTMLElement;
  let editorView: EditorView;
  let manager: UndoRedoManager;

  beforeEach(() => {
    document = createMockDocument();
    container = global.document.createElement('div');
    editorView = new EditorView(container, document);
    document.editorView = editorView;
    manager = new UndoRedoManager(document, editorView);
  });

  it('creates a snapshot with correct properties', () => {
    const snapshot = (manager as any).createSnapshot();
    expect(snapshot.blocks.length).toBe(2);
    expect(snapshot.dataIds).toEqual(['block1', 'block2']);
    expect(snapshot.selectedBlockId).toBe('block1');
    expect(typeof snapshot.currentOffset).toBe('number');
    expect(snapshot.selection).toBeDefined();
    expect(typeof snapshot.cursorPosition).toBe('number');
  });

  it('saves and restores undo snapshots', () => {
    manager.saveUndoSnapshot();
    document.blocks[0].pieces[0].text = 'Changed';
    manager.undo();
    expect(document.blocks[0].pieces[0].text).toBe('Hello');
  });

  it('does not undo if stack is empty', () => {
    (manager as any).snapshotUndoStack = [];
    expect(() => manager.undo()).not.toThrow();
  });

  it('saves and restores redo snapshots', () => {
    manager.saveUndoSnapshot();
    document.blocks[0].pieces[0].text = 'Changed';
    manager.undo();
    document.blocks[0].pieces[0].text = 'Again';
    manager.redo();
    expect(document.blocks[0].pieces[0].text).toBe('Changed');
  });

  it('does not redo if stack is empty', () => {
    (manager as any).snapshotRedoStack = [];
    expect(() => manager.redo()).not.toThrow();
  });

  it('limits undo stack size', () => {
    (manager as any).maxSnapshots = 3;
    for (let i = 0; i < 5; i++) manager.saveUndoSnapshot();
    expect((manager as any).snapshotUndoStack.length).toBeLessThanOrEqual(3);
  });

  it('restores Piece instances on undo', () => {
    manager.saveUndoSnapshot();
    document.blocks[0].pieces[0].text = 'Changed';
    manager.undo();
    expect(document.blocks[0].pieces[0] instanceof Piece).toBe(true);
  });
});

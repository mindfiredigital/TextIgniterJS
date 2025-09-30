import { describe, it, expect, beforeEach } from 'vitest';
import * as selectionManager from '../../utils/selectionManager';

// Mock TextDocument and EditorView
class MockTextDocument {
  blocks: any[] = [];
  getCursorOffsetInParent() {
    return { offset: 0, innerText: '' };
  }
}
class MockEditorView {
  container: HTMLElement;
  constructor(container: HTMLElement) {
    this.container = container;
  }
}

describe('selectionManager', () => {
  let container: HTMLElement;
  let editorView: MockEditorView;
  let textDocument: MockTextDocument;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    editorView = new MockEditorView(container);
    textDocument = new MockTextDocument();
  });

  it('saveSelection returns null if no selection', () => {
    const orig = window.getSelection;
    (window as any).getSelection = () => null;
    expect(selectionManager.saveSelection(container)).toBeNull();
    (window as any).getSelection = orig;
  });

  it('saveSelection returns correct start/end', () => {
    container.textContent = 'Hello world';
    const range = document.createRange();
    range.setStart(container.firstChild!, 2);
    range.setEnd(container.firstChild!, 7);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    const result = selectionManager.saveSelection(container);
    expect(result?.start).toBe(2);
    expect(result?.end).toBe(7);
  });

  it('restoreSelection restores selection', () => {
    container.textContent = 'Hello world';
    selectionManager.restoreSelection(container, { start: 2, end: 7 });
    const sel = window.getSelection();
    expect(sel?.toString()).toBe('llo w');
  });

  it('restoreSelection does nothing if savedSel is null', () => {
    expect(() =>
      selectionManager.restoreSelection(container, null)
    ).not.toThrow();
  });

  it('getSelectionRange returns [0,0] if no selection', () => {
    const sel = window.getSelection();
    sel?.removeAllRanges();
    expect(selectionManager.getSelectionRange(editorView as any)).toEqual([
      0, 0,
    ]);
  });

  it('getSelectionRange returns correct range', () => {
    container.textContent = 'abc';
    const range = document.createRange();
    range.setStart(container.firstChild!, 1);
    range.setEnd(container.firstChild!, 2);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    expect(selectionManager.getSelectionRange(editorView as any)).toEqual([
      1, 2,
    ]);
  });

  it('addBlockAfter inserts after correct block', () => {
    const data = [{ dataId: 'a' }, { dataId: 'b' }];
    const newBlock = { dataId: 'c' };
    const result = selectionManager.addBlockAfter(data, 'a', newBlock);
    expect(result.map(b => b.dataId)).toEqual(['a', 'c', 'b']);
  });

  it('addBlockAfter returns original if not found', () => {
    const data = [{ dataId: 'a' }];
    const newBlock = { dataId: 'b' };
    expect(selectionManager.addBlockAfter(data, 'notfound', newBlock)).toBe(
      data
    );
  });

  it('extractTextFromDataId returns empty if no selection', () => {
    const orig = window.getSelection;
    (window as any).getSelection = () => null;
    expect(
      selectionManager.extractTextFromDataId('id', textDocument as any)
    ).toEqual({ remainingText: '', piece: null });
    (window as any).getSelection = orig;
  });

  it('extractTextFromDataId returns empty if no element', () => {
    textDocument.blocks = [{ dataId: 'id', pieces: [{ text: 'abc' }] }];
    expect(
      selectionManager.extractTextFromDataId('notfound', textDocument as any)
    ).toEqual({ remainingText: '', piece: null });
  });

  it('extractTextFromDataId returns empty if cursor not in element', () => {
    textDocument.blocks = [{ dataId: 'id', pieces: [{ text: 'abc' }] }];
    const element = document.createElement('div');
    element.setAttribute('data-id', 'id');
    document.body.appendChild(element);
    const orig = window.getSelection;
    (window as any).getSelection = () => ({
      rangeCount: 1,
      getRangeAt: () => ({ startContainer: document.body }),
    });
    expect(
      selectionManager.extractTextFromDataId('id', textDocument as any)
    ).toEqual({ remainingText: '', piece: null });
    (window as any).getSelection = orig;
    document.body.removeChild(element);
  });

  it('restoreSelection works at start and end of content', () => {
    container.textContent = 'Edge';
    selectionManager.restoreSelection(container, { start: 0, end: 0 });
    let sel = window.getSelection();
    expect(sel?.toString()).toBe('');
    selectionManager.restoreSelection(container, { start: 0, end: 4 });
    sel = window.getSelection();
    expect(sel?.toString()).toBe('Edge');
  });

  it('restoreSelection works with <br> nodes', () => {
    container.innerHTML = 'foo<br>bar';
    selectionManager.restoreSelection(container, { start: 3, end: 3 });
    const sel = window.getSelection();
    expect(
      sel?.anchorNode?.nodeType === 1 || sel?.anchorNode?.nodeType === 3
    ).toBe(true);
  });

  it('saveSelection works across multiple text nodes', () => {
    const span1 = document.createElement('span');
    span1.textContent = 'abc';
    const span2 = document.createElement('span');
    span2.textContent = 'def';
    container.appendChild(span1);
    container.appendChild(span2);
    const range = document.createRange();
    range.setStart(span1.firstChild!, 1);
    range.setEnd(span2.firstChild!, 2);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    const result = selectionManager.saveSelection(container);
    expect(result).toEqual({ start: 1, end: 5 });
  });

  it('extractTextFromDataId returns empty if pieces is empty or malformed', () => {
    textDocument.blocks = [{ dataId: 'id', pieces: [] }];
    expect(
      selectionManager.extractTextFromDataId('id', textDocument as any)
    ).toEqual({ remainingText: '', piece: null });
    textDocument.blocks = [{ dataId: 'id', pieces: null }];
    expect(
      selectionManager.extractTextFromDataId('id', textDocument as any)
    ).toEqual({ remainingText: '', piece: null });
  });

  it('extractTextFromDataId finds correct piece with multiple pieces', () => {
    textDocument.blocks = [
      {
        dataId: 'id',
        pieces: [{ text: 'foo' }, { text: 'bar' }, { text: 'baz' }],
      },
    ];
    const element = document.createElement('div');
    element.setAttribute('data-id', 'id');
    document.body.appendChild(element);
    textDocument.getCursorOffsetInParent = () => ({
      offset: 0,
      innerText: 'bar',
    });
    const orig = window.getSelection;
    (window as any).getSelection = () => ({
      rangeCount: 1,
      getRangeAt: () => ({ startContainer: element }),
    });
    const result = selectionManager.extractTextFromDataId(
      'id',
      textDocument as any
    );
    expect(result.piece).toEqual([{ text: 'bar' }, { text: 'baz' }]);
    (window as any).getSelection = orig;
    document.body.removeChild(element);
  });

  it('restoreSelection works with deeply nested DOM', () => {
    // Ensure window.getSelection is not mocked
    (window as any).getSelection = document.getSelection.bind(document);
    const outer = document.createElement('div');
    const inner = document.createElement('span');
    const text = document.createTextNode('deep');
    inner.appendChild(text);
    outer.appendChild(inner);
    container.appendChild(outer);
    selectionManager.restoreSelection(container, { start: 1, end: 3 });
    const sel = window.getSelection();
    expect(sel?.toString()).toBe('ee');
  });
});

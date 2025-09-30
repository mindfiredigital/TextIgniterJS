import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setCursorPosition } from '../../utils/cursor';

// Mock EditorView
class MockEditorView {
  container: HTMLElement;
  constructor(container: HTMLElement) {
    this.container = container;
  }
}

describe('setCursorPosition', () => {
  let container: HTMLElement;
  let editorView: MockEditorView;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    editorView = new MockEditorView(container);
  });

  it('focuses container if dataId is empty', () => {
    const focusSpy = vi.spyOn(container, 'focus');
    setCursorPosition(editorView as any, 0, '');
    expect(focusSpy).toHaveBeenCalled();
  });

  it('focuses element with data-id if dataId is provided', () => {
    const div = document.createElement('div');
    div.setAttribute('data-id', 'block1');
    document.body.appendChild(div);
    const focusSpy = vi.spyOn(div, 'focus');
    setCursorPosition(editorView as any, 0, 'block1');
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(div);
  });

  it('sets selection at correct position in text node', () => {
    container.textContent = 'Hello world';
    setCursorPosition(editorView as any, 6, '');
    const sel = window.getSelection();
    expect(sel?.anchorNode?.nodeValue).toContain('Hello world');
    expect(sel?.anchorOffset).toBe(6);
  });

  it('sets selection at correct position for <br> node', () => {
    container.innerHTML = 'Hello<br>world';
    setCursorPosition(editorView as any, 5, '');
    const sel = window.getSelection();
    // Should be before the <br>
    expect(sel?.anchorNode?.nodeType).toBe(3); // #text node
    expect(sel?.anchorOffset).toBe(5);
  });

  it('does nothing if selection is not available', () => {
    const origGetSelection = window.getSelection;
    (window as any).getSelection = () => null;
    expect(() => setCursorPosition(editorView as any, 0, '')).not.toThrow();
    (window as any).getSelection = origGetSelection;
  });

  it('handles empty container gracefully', () => {
    container.innerHTML = '';
    expect(() => setCursorPosition(editorView as any, 0, '')).not.toThrow();
  });

  it('handles deeply nested nodes', () => {
    container.innerHTML = '<div><span>abc</span><span>def</span></div>';
    setCursorPosition(editorView as any, 4, '');
    const sel = window.getSelection();
    expect(sel?.anchorNode?.nodeValue).toContain('def');
    expect(sel?.anchorOffset).toBe(1);
  });

  it('handles invalid dataId gracefully', () => {
    expect(() =>
      setCursorPosition(editorView as any, 0, 'notfound')
    ).to.not.throw();
  });
});

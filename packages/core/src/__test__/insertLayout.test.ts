import { describe, it, beforeEach, expect } from 'vitest';
import { InsertLayoutHandler } from '../insertLayout';

// Recursive helper to get all trimmed text inside an element
function getDeepTextContent(element: HTMLElement): string {
  let text = '';
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) text += node.textContent;
    else if (node.nodeType === Node.ELEMENT_NODE)
      text += getDeepTextContent(node as HTMLElement);
  });
  return text.trim();
}

// Find button by exact trimmed text
function getButton(modal: HTMLElement, label: string) {
  return Array.from(modal.querySelectorAll('button')).find(
    btn => getDeepTextContent(btn) === label
  );
}

describe('InsertLayoutHandler', () => {
  let editor: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = ''; // clear DOM
    editor = document.createElement('div');
    editor.id = 'editor';
    document.body.appendChild(editor);
  });

  async function stabilizeDom() {
    // Allow any DOM updates in jsdom to complete
    await new Promise(r => setTimeout(r, 0));
  }

  it('renders a modal with layout buttons', async () => {
    const handler = new InsertLayoutHandler(editor);
    handler.openLayoutModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal');
    expect(modal).not.toBeNull();

    console.log('Modal innerHTML:', modal?.innerHTML);

    const buttons = Array.from(modal!.querySelectorAll('button')).map(btn =>
      getDeepTextContent(btn)
    );
    expect(buttons).toContain('Single Column');
    expect(buttons).toContain('Two Columns');
    expect(buttons).toContain('Three Columns');
    expect(buttons).toContain('60-40 Split');
    expect(buttons).toContain('40-60 Split');
    expect(buttons).toContain('Close');
  });

  it('inserts single column layout on button click', async () => {
    const handler = new InsertLayoutHandler(editor);
    handler.openLayoutModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal');
    expect(modal).not.toBeNull();

    const oneColBtn = getButton(modal! as HTMLElement, 'Single Column');
    expect(oneColBtn).toBeDefined();
    oneColBtn!.click();

    expect(document.body.querySelector('.modal')).toBeNull();

    expect(editor.children.length).toBe(1);
    const layout = editor.children[0] as HTMLDivElement;
    expect(layout.style.display).toBe('flex');
    expect(layout.children.length).toBe(1);
    expect((layout.children[0] as HTMLDivElement).style.flex).toBe('0 0 100%');
    expect((layout.children[0] as HTMLDivElement).contentEditable).toBe('true');
  });

  it('inserts two column layout on button click', async () => {
    const handler = new InsertLayoutHandler(editor);
    handler.openLayoutModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal');
    expect(modal).not.toBeNull();

    const twoColBtn = getButton(modal! as HTMLElement, 'Two Columns');
    expect(twoColBtn).toBeDefined();
    twoColBtn!.click();

    expect(document.body.querySelector('.modal')).toBeNull();
    expect(editor.children.length).toBe(1);

    const layout = editor.children[0] as HTMLDivElement;
    expect(layout.children.length).toBe(2);
    expect((layout.children[0] as HTMLDivElement).style.flex).toBe('0 0 50%');
    expect((layout.children[1] as HTMLDivElement).style.flex).toBe('0 0 50%');
  });

  it('inserts three column layout on button click', async () => {
    const handler = new InsertLayoutHandler(editor);
    handler.openLayoutModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal');
    expect(modal).not.toBeNull();

    const threeColBtn = getButton(modal! as HTMLElement, 'Three Columns');
    expect(threeColBtn).toBeDefined();
    threeColBtn!.click();

    expect(document.body.querySelector('.modal')).toBeNull();

    const layout = editor.children[0] as HTMLDivElement;
    expect(layout.children.length).toBe(3);
    for (let i = 0; i < 3; i++) {
      expect((layout.children[i] as HTMLDivElement).style.flex).toBe(
        '0 0 33.33%'
      );
    }
  });

  it('inserts 60-40 split layout', async () => {
    const handler = new InsertLayoutHandler(editor);
    handler.openLayoutModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal');
    expect(modal).not.toBeNull();

    const sixtyFortyBtn = getButton(modal! as HTMLElement, '60-40 Split');
    expect(sixtyFortyBtn).toBeDefined();
    sixtyFortyBtn!.click();

    expect(document.body.querySelector('.modal')).toBeNull();

    const layout = editor.children[0] as HTMLDivElement;
    expect(layout.children.length).toBe(2);
    expect((layout.children[0] as HTMLDivElement).style.flex).toBe('0 0 60%');
    expect((layout.children[1] as HTMLDivElement).style.flex).toBe('0 0 40%');
  });

  it('inserts 40-60 split layout', async () => {
    const handler = new InsertLayoutHandler(editor);
    handler.openLayoutModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal');
    expect(modal).not.toBeNull();

    const fortySixtyBtn = getButton(modal! as HTMLElement, '40-60 Split');
    expect(fortySixtyBtn).toBeDefined();
    fortySixtyBtn!.click();

    expect(document.body.querySelector('.modal')).toBeNull();

    const layout = editor.children[0] as HTMLDivElement;
    expect(layout.children.length).toBe(2);
    expect((layout.children[0] as HTMLDivElement).style.flex).toBe('0 0 40%');
    expect((layout.children[1] as HTMLDivElement).style.flex).toBe('0 0 60%');
  });

  it('removes the modal when clicking Close', async () => {
    const handler = new InsertLayoutHandler(editor);
    handler.openLayoutModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal');
    expect(modal).not.toBeNull();

    const closeBtn = getButton(modal! as HTMLElement, 'Close');
    expect(closeBtn).toBeDefined();
    closeBtn!.click();

    expect(document.body.querySelector('.modal')).toBeNull();
    expect(editor.children.length).toBe(0);
  });
});

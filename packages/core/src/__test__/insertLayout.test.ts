import { describe, it, beforeEach, expect, vi } from 'vitest';
import { InsertLayoutHandler } from '../insertLayout';

function getDeepTextContent(element: HTMLElement): string {
  let text = '';
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) text += node.textContent;
    else if (node.nodeType === Node.ELEMENT_NODE)
      text += getDeepTextContent(node as HTMLElement);
  });
  return text.trim();
}

function getButton(modal: HTMLElement, label: string) {
  return Array.from(modal.querySelectorAll('button')).find(
    btn => getDeepTextContent(btn) === label
  );
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('InsertLayoutHandler', () => {
  let editor: HTMLDivElement;
  let mockDoc: any;

  beforeEach(() => {
    document.body.innerHTML = '';

    editor = document.createElement('div');
    document.body.appendChild(editor);

    mockDoc = {
      blocks: [],
      selectedBlockId: null,
      currentOffset: 0,
      emit: vi.fn(),
    };
  });

  it('it should be render the layout model with all buttons and there proper names', async () => {
    const handler = new InsertLayoutHandler(editor, mockDoc);
    handler.openLayoutModal();

    const modal = document.body.querySelector('.table_modal');
    expect(modal).not.toBeNull();

    const buttons = Array.from(modal!.querySelectorAll('button')).map(btn =>
      getDeepTextContent(btn)
    );

    expect(buttons).toContain('Single');
    expect(buttons).toContain('50 - 50');
    expect(buttons).toContain('60 - 40');
    expect(buttons).toContain('40 - 60');
    expect(buttons).toContain('33 - 33 - 33');
    expect(buttons).toContain('25 - 50 - 25');
    expect(buttons).toContain('Cancel');
    expect(buttons).toContain('Insert Custom');
  });

  it('in layout it should be insert the single column layout', async () => {
    const handler = new InsertLayoutHandler(editor, mockDoc);
    handler.openLayoutModal();

    const modal = document.body.querySelector('.table_modal')!;
    const btn = getButton(modal as HTMLElement, 'Single')!;
    btn.click();

    expect(mockDoc.blocks.length).toBe(2);

    const layoutBlock = mockDoc.blocks[0];
    const wrapper = layoutBlock.element as HTMLElement;

    const columns = wrapper.querySelectorAll('.layout_column');
    expect(columns.length).toBe(1);
  });

  it('in layout it should insert the 2 column 50-50', async () => {
    const handler = new InsertLayoutHandler(editor, mockDoc);
    handler.openLayoutModal();

    const modal = document.body.querySelector('.table_modal')!;
    getButton(modal as HTMLElement, '50 - 50')!.click();

    const wrapper = mockDoc.blocks[0].element as HTMLElement;
    const columns = wrapper.querySelectorAll('.layout_column');

    expect(columns.length).toBe(2);
    expect((columns[0] as HTMLElement).style.flex).toContain('50%');
    expect((columns[1] as HTMLElement).style.flex).toContain('50%');
  });

  it('in layout it should insert the 3 column 33-33-33 ', async () => {
    const handler = new InsertLayoutHandler(editor, mockDoc);
    handler.openLayoutModal();

    const modal = document.body.querySelector('.table_modal')!;
    getButton(modal as HTMLElement, '33 - 33 - 33')!.click();

    const wrapper = mockDoc.blocks[0].element as HTMLElement;
    const columns = wrapper.querySelectorAll('.layout_column');

    expect(columns.length).toBe(3);
  });

  it('in layout it should insert the 2 column 60-40', async () => {
    const handler = new InsertLayoutHandler(editor, mockDoc);
    handler.openLayoutModal();

    const modal = document.body.querySelector('.table_modal')!;
    getButton(modal as HTMLElement, '60 - 40')!.click();

    const wrapper = mockDoc.blocks[0].element as HTMLElement;
    const columns = wrapper.querySelectorAll('.layout_column');

    expect((columns[0] as HTMLElement).style.flex).toContain('60%');
    expect((columns[1] as HTMLElement).style.flex).toContain('40%');
  });

  it('inserts custom layout', async () => {
    const handler = new InsertLayoutHandler(editor, mockDoc);
    handler.openLayoutModal();

    const modal = document.body.querySelector('.table_modal')!;
    const input = modal.querySelector('input') as HTMLInputElement;

    input.value = '10,20,30,40,50,10';

    getButton(modal as HTMLElement, 'Insert Custom')!.click();

    const wrapper = mockDoc.blocks[0].element as HTMLElement;
    const columns = wrapper.querySelectorAll('.layout_column');

    expect(columns.length).toBe(6);
  });

  it('closes modal on cancel', async () => {
    const handler = new InsertLayoutHandler(editor, mockDoc);
    handler.openLayoutModal();

    await wait(0);

    const modal = document.body.querySelector('.table_modal')!;
    getButton(modal as HTMLElement, 'Cancel')!.click();

    await wait(250);

    expect(document.body.querySelector('.table_modal')).toBeNull();
  });

  it('calls emit after inserting layout', async () => {
    const handler = new InsertLayoutHandler(editor, mockDoc);
    handler.openLayoutModal();

    const modal = document.body.querySelector('.table_modal')!;
    getButton(modal as HTMLElement, 'Single')!.click();

    expect(mockDoc.emit).toHaveBeenCalledWith('documentChanged', mockDoc);
  });
});

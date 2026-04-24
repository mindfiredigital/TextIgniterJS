import { describe, it, beforeEach, expect, vi } from 'vitest';
import { InsertTableHandler } from '../insertTable';

function getButton(
  root: ParentNode,
  label: string
): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find(
    btn => btn.textContent?.trim() === label
  ) as HTMLButtonElement | undefined;
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('InsertTableHandler', () => {
  let editor: HTMLDivElement;
  let mockDocument: any;

  beforeEach(() => {
    document.body.innerHTML = '';

    editor = document.createElement('div');
    document.body.appendChild(editor);

    mockDocument = {
      blocks: [],
      selectedBlockId: null,
      currentOffset: 0,
      emit: vi.fn(),
    };
  });

  it('opens modal with inputs and buttons', async () => {
    const handler = new InsertTableHandler(editor, mockDocument);
    handler.openTableModal();

    await wait(0);

    const modal = document.body.querySelector('.main_modal');
    expect(modal).not.toBeNull();

    if (!(modal instanceof HTMLElement)) throw new Error('Modal not found');

    expect(getButton(modal, 'Insert Table')).toBeDefined();
    expect(getButton(modal, 'Cancel')).toBeDefined();

    const inputs = modal.querySelectorAll('input');
    expect(inputs.length).toBe(2);
  });

  it('inserts default 3x3 table', async () => {
    const handler = new InsertTableHandler(editor, mockDocument);
    handler.openTableModal();

    await wait(0);

    const modal = document.body.querySelector('.main_modal') as HTMLElement;
    getButton(modal, 'Insert Table')!.click();

    await wait(250);

    expect(document.body.querySelector('.table_modal')).toBeNull();

    const tableBlock = mockDocument.blocks.find((b: any) => b.type === 'table');
    expect(tableBlock).toBeDefined();

    const table = tableBlock.element.querySelector('table') as HTMLTableElement;
    expect(table.querySelectorAll('tr').length).toBe(4);
  });

  it('inserts table with given rows and columns', async () => {
    const handler = new InsertTableHandler(editor, mockDocument);
    handler.openTableModal();

    await wait(0);

    const modal = document.body.querySelector('.main_modal') as HTMLElement;
    const inputs = modal.querySelectorAll('input');

    (inputs[0] as HTMLInputElement).value = '2';
    (inputs[1] as HTMLInputElement).value = '3';

    getButton(modal, 'Insert Table')!.click();

    await wait(250);

    const tableBlock = mockDocument.blocks.find((b: any) => b.type === 'table');
    const table = tableBlock.element.querySelector('table') as HTMLTableElement;

    expect(table.querySelectorAll('tr').length).toBe(3);
  });

  it('closes modal on Cancel click', async () => {
    const handler = new InsertTableHandler(editor, mockDocument);
    handler.openTableModal();

    await wait(0);

    const modal = document.body.querySelector('.main_modal') as HTMLElement;
    getButton(modal, 'Cancel')!.click();

    await wait(250);

    expect(document.body.querySelector('.table_modal')).toBeNull();
    expect(mockDocument.blocks.length).toBe(0);
  });
});

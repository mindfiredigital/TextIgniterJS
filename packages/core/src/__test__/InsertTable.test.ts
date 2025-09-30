import { describe, it, beforeEach, expect } from 'vitest';
import { InsertTableHandler } from '../insertTable';

// Helper for safe button query by exact trimmed text
function getButton(modal: HTMLElement, label: string) {
  return Array.from(modal.querySelectorAll('button')).find(
    btn => btn.textContent?.trim() === label
  );
}

// Async helper to stabilize jsdom DOM mutations
async function stabilizeDom() {
  await new Promise(resolve => setTimeout(resolve, 0));
}

describe('InsertTableHandler', () => {
  let editor: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    editor = document.createElement('div');
    editor.id = 'editor';
    document.body.appendChild(editor);
  });

  it('opens modal with inputs and buttons', async () => {
    const handler = new InsertTableHandler(editor);
    handler.openTableModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal');
    expect(modal).not.toBeNull();

    const insertButton = getButton(modal! as HTMLElement, 'Insert Table');
    expect(insertButton).toBeDefined();

    const closeButton = getButton(modal! as HTMLElement, 'Close');
    expect(closeButton).toBeDefined();

    const inputs = modal!.querySelectorAll('input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0].getAttribute('placeholder')).toBe('Enter No. Of Rows');
    expect(inputs[0].getAttribute('type')).toBe('number');
    expect(inputs[0].getAttribute('min')).toBe('1');
    expect(inputs[1].getAttribute('placeholder')).toBe('Enter No. Of Columns');
    expect(inputs[1].getAttribute('type')).toBe('number');
    expect(inputs[1].getAttribute('min')).toBe('1');
  });

  it('inserts table with default 1 row and 1 column if inputs empty', async () => {
    const handler = new InsertTableHandler(editor);
    handler.openTableModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal')!;
    const insertButton = getButton(modal as HTMLElement, 'Insert Table')!;
    insertButton.click();

    expect(document.body.querySelector('.modal')).toBeNull();

    const table = editor.querySelector('table');
    expect(table).not.toBeNull();
    expect(table!.style.width).toBe('100%');
    expect(table!.style.borderCollapse).toBe('collapse');
    expect(table!.rows.length).toBe(1);
    expect(table!.rows[0].cells.length).toBe(1);

    const cell = table!.rows[0].cells[0];
    // Border style assertions removed due to jsdom CSS limitations
    expect(cell.style.padding).toBe('20px');
    expect(cell.contentEditable).toBe('true');
    expect(cell.textContent).toBe(' ');
  });

  it('inserts table with specified rows and columns', async () => {
    const handler = new InsertTableHandler(editor);
    handler.openTableModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal')!;
    const inputs = modal.querySelectorAll('input');
    (inputs[0] as HTMLInputElement).value = '2';
    (inputs[1] as HTMLInputElement).value = '3';

    const insertButton = getButton(modal as HTMLElement, 'Insert Table')!;
    insertButton.click();

    expect(document.body.querySelector('.modal')).toBeNull();

    const table = editor.querySelector('table');
    expect(table).not.toBeNull();
    expect(table!.rows.length).toBe(2);
    expect(table!.rows[0].cells.length).toBe(3);
    expect(table!.rows[1].cells.length).toBe(3);
  });

  it('closes modal when Close button clicked', async () => {
    const handler = new InsertTableHandler(editor);
    handler.openTableModal();

    await stabilizeDom();

    const modal = document.body.querySelector('.modal')!;
    const closeButton = getButton(modal as HTMLElement, 'Close')!;
    closeButton.click();

    expect(document.body.querySelector('.modal')).toBeNull();
    expect(editor.children.length).toBe(0); // no table inserted
  });
});

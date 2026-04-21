import { icons } from './assets/icons';
import Piece from './piece';

export class InsertTableHandler {
  private editor: HTMLDivElement;
  private document: any;
  private modal: HTMLDivElement | null = null;
  private activeTable: HTMLTableElement | null = null;

  constructor(editor: HTMLDivElement, document: any) {
    this.editor = editor;
    this.document = document;
    this.setupClickOutsideListener();
  }

  public openTableModal() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'table_modal';
    backdrop.id = 'table_modal';

    const modal = document.createElement('div');
    modal.className = 'main_modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Insert Table');

    const header = document.createElement('div');
    header.className = 'main_modal_header';

    const title = document.createElement('h3');
    title.className = 'main_modal_title';
    title.textContent = 'Insert Table';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'main_modal_close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = icons.close_icon;
    closeBtn.onclick = () => this.closeModal();

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.className = 'main_modal_body';

    const inputsRow = document.createElement('div');
    inputsRow.className = 'main_modal_inputs';

    const rowGroup = document.createElement('div');
    rowGroup.className = 'all_input';
    const rowLabel = document.createElement('label');
    rowLabel.textContent = 'Rows';
    rowLabel.className = 'input_label';
    rowLabel.setAttribute('for', 'modal_input_row');
    const rowInput = document.createElement('input');
    rowInput.type = 'number';
    rowInput.id = 'modal_input_row';
    rowInput.className = 'modal_inputs';
    rowInput.placeholder = 'Enter the row number 1 to 20';
    rowInput.min = '1';
    rowInput.max = '20';
    rowInput.value = '3';
    rowGroup.appendChild(rowLabel);
    rowGroup.appendChild(rowInput);

    const colGroup = document.createElement('div');
    colGroup.className = 'all_input';
    const colLabel = document.createElement('label');
    colLabel.textContent = 'Columns';
    colLabel.className = 'input_label';
    colLabel.setAttribute('for', 'modal_input_col');
    const colInput = document.createElement('input');
    colInput.type = 'number';
    colInput.id = 'modal_input_col';
    colInput.className = 'modal_inputs';
    colInput.placeholder = 'Enter the coloumn number 1 to 20';
    colInput.min = '1';
    colInput.max = '20';
    colInput.value = '3';
    colGroup.appendChild(colLabel);
    colGroup.appendChild(colInput);

    inputsRow.appendChild(rowGroup);
    inputsRow.appendChild(colGroup);

    const footer = document.createElement('div');
    footer.className = 'main_modal_footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'modal_close_button modal_close_button_secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.type = 'button';
    cancelBtn.onclick = () => this.closeModal();

    const insertBtn = document.createElement('button');
    insertBtn.className = 'modal_close_button modal_close_button_primary';
    insertBtn.textContent = 'Insert Table';
    insertBtn.type = 'button';
    insertBtn.onclick = () => {
      const rows = Math.max(1, Math.min(20, parseInt(rowInput.value) || 3));
      const cols = Math.max(1, Math.min(20, parseInt(colInput.value) || 3));
      this.insertTable(rows, cols);
      this.closeModal();
    };

    footer.appendChild(cancelBtn);
    footer.appendChild(insertBtn);

    body.appendChild(inputsRow);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    backdrop.appendChild(modal);

    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) this.closeModal();
    });

    document.body.appendChild(backdrop);
    this.modal = backdrop as unknown as HTMLDivElement;

    requestAnimationFrame(() => {
      backdrop.classList.add('table_modal_visible');
    });
  }

  private closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('table_modal_visible');
    setTimeout(() => {
      this.modal?.remove();
      this.modal = null;
    }, 200);
  }

  private insertTable(rows: number, cols: number) {
    const tableId = `data-id-${Date.now()}`;
    const afterId = `data-id-${Date.now() + 1}`;

    const wrapper = document.createElement('div');
    wrapper.className = 'table_wrapper';
    wrapper.setAttribute('data-type', 'tbl');
    wrapper.setAttribute('data-id', tableId);
    wrapper.setAttribute('contenteditable', 'false');

    const controls = document.createElement('div');
    controls.className = 'table_controls';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'table_delete_button';
    deleteBtn.innerHTML = icons.close_icon;
    deleteBtn.onclick = () => {
      const index = this.document.blocks.findIndex(
        (b: any) => b.dataId === tableId
      );
      if (index !== -1) {
        this.document.blocks.splice(index, 1);
        if (this.document.selectedBlockId === tableId) {
          this.document.selectedBlockId = null;
        }
        this.document.emit('documentChanged', this.document);
      }
    };
    controls.appendChild(deleteBtn);
    wrapper.appendChild(controls);

    const table = document.createElement('table');
    table.className = 'tbl';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    for (let c = 0; c < cols; c++) {
      const th = document.createElement('th');
      th.className = 'tblCell tbl_header_cell';
      th.contentEditable = 'true';
      th.setAttribute('data-placeholder', `Header ${c + 1}`);
      this.setupCellEvents(th);
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body rows (tbody)
    const tbody = document.createElement('tbody');
    for (let r = 0; r < rows; r++) {
      const row = document.createElement('tr');
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('td');
        cell.className = 'tblCell';
        cell.contentEditable = 'true';
        cell.setAttribute('data-placeholder', '');
        this.setupCellEvents(cell);
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    wrapper.appendChild(table);

    // Determine where to insert the table in the document model
    let insertIndex = this.document.blocks.length;
    if (this.document.selectedBlockId) {
      const idx = this.document.blocks.findIndex(
        (b: any) => b.dataId === this.document.selectedBlockId
      );
      if (idx !== -1) insertIndex = idx + 1;
    }

    // Add table and a paragraph after it to the model
    const tableBlock = {
      dataId: tableId,
      type: 'table',
      element: wrapper,
    };

    const afterBlock = {
      dataId: afterId,
      type: 'text',
      class: 'paragraph-block',
      pieces: [
        new Piece('\u200B', {
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          hyperlink: false,
        }),
      ],
    };

    this.document.blocks.splice(insertIndex, 0, tableBlock, afterBlock);
    this.document.selectedBlockId = tableId;
    this.document.currentOffset = 0;

    // Trigger re-render which will attach the elements
    this.document.emit('documentChanged', this.document);

    // Focus first header cell asynchronously since render happens synchronously
    setTimeout(() => {
      const firstCell = wrapper.querySelector('.tblCell') as HTMLElement;
      if (firstCell) {
        firstCell.focus();
        this.setActiveTable(wrapper.querySelector('table') as HTMLTableElement);
      }
    }, 0);
  }

  private setupCellEvents(cell: HTMLElement) {
    cell.addEventListener('focus', () => {
      const table = cell.closest('table') as HTMLTableElement;
      if (table) this.setActiveTable(table);
      cell.classList.add('tblCell_focused');
    });

    cell.addEventListener('blur', () => {
      cell.classList.remove('tblCell_focused');
    });

    cell.addEventListener('keydown', (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key === 'Tab') {
        ke.preventDefault();
        ke.stopPropagation();
        const allCells = Array.from(
          cell.closest('table')?.querySelectorAll('.tblCell') || []
        ) as HTMLElement[];
        const idx = allCells.indexOf(cell);
        if (!ke.shiftKey) {
          if (idx < allCells.length - 1) {
            allCells[idx + 1].focus();
            this.selectAllInCell(allCells[idx + 1]);
          } else {
            const wrapper = cell.closest('.table_wrapper');
            const afterEl = wrapper?.nextElementSibling as HTMLElement;
            if (afterEl) {
              afterEl.focus();
              this.clearTableActive();
            }
          }
        } else {
          if (idx > 0) {
            allCells[idx - 1].focus();
            this.selectAllInCell(allCells[idx - 1]);
          }
        }
      }

      if (ke.key === 'Enter' && !ke.shiftKey) {
        ke.stopPropagation();
      }

      if (ke.key === 'Backspace' || ke.key === 'Delete') {
        ke.stopPropagation();
      }

      if (ke.key.length === 1 && !ke.ctrlKey && !ke.metaKey && !ke.altKey) {
        ke.stopPropagation();
      }
    });
  }

  private selectAllInCell(cell: HTMLElement) {
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.selectNodeContents(cell);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  private setActiveTable(table: HTMLTableElement) {
    document.querySelectorAll('.tbl_active').forEach(t => {
      if (t !== table) t.classList.remove('tbl_active');
    });
    table.classList.add('tbl_active');
    this.activeTable = table;
  }

  private clearTableActive() {
    if (this.activeTable) {
      this.activeTable.classList.remove('tbl_active');
      this.activeTable = null;
    }
  }

  private setupClickOutsideListener() {
    document.addEventListener(
      'click',
      (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInsideTable = target.closest('.table_wrapper') !== null;
        const isInsideModal = target.closest('#table_modal') !== null;

        if (!isInsideTable && !isInsideModal) {
          this.clearTableActive();
        }
      },
      true
    );

    document.addEventListener(
      'focusin',
      (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.table_wrapper')) {
          this.clearTableActive();
        }
      },
      true
    );
  }
}

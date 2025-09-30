export class InsertTableHandler {
  private editor: HTMLDivElement;

  constructor(editor: HTMLDivElement) {
    this.editor = editor;
  }

  // Open a modal to let the user specify the table size
  public openTableModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const rowInput = document.createElement('input');
    rowInput.type = 'number';
    rowInput.placeholder = 'Enter No. Of Rows';
    rowInput.min = '1';
    rowInput.style.marginRight = '2px';

    const colInput = document.createElement('input');
    colInput.type = 'number';
    colInput.placeholder = 'Enter No. Of Columns';
    colInput.min = '1';

    const insertButton = document.createElement('button');
    insertButton.textContent = 'Insert Table';
    insertButton.onclick = () => {
      const rows = parseInt(rowInput.value) || 1;
      const cols = parseInt(colInput.value) || 1;
      this.insertTable(rows, cols);
      document.body.removeChild(modal); // Close modal after inserting the table
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => document.body.removeChild(modal);

    modal.appendChild(rowInput);
    modal.appendChild(colInput);
    modal.appendChild(insertButton);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
  }

  // Insert table into the editor
  private insertTable(rows: number, cols: number) {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    for (let r = 0; r < rows; r++) {
      const row = table.insertRow();
      for (let c = 0; c < cols; c++) {
        const cell = row.insertCell();
        cell.style.border = '1px solid #ccc';
        cell.style.padding = '20px';
        cell.contentEditable = 'true'; // Make cells editable
        cell.textContent = ' ';
      }
    }

    this.editor.appendChild(table);
  }
}

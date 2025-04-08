export class InsertLayoutHandler {
  constructor(editor) {
    this.editor = editor;
  }
  openLayoutModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const oneColButton = document.createElement('button');
    oneColButton.innerText = 'Single Column';
    oneColButton.onclick = () => {
      this.insertLayout(1, [100, 0]);
      document.body.removeChild(modal);
    };
    const twoColButton = document.createElement('button');
    twoColButton.innerText = 'Two Columns';
    twoColButton.onclick = () => {
      this.insertLayout(2, [50, 50]);
      document.body.removeChild(modal);
    };
    const threeColButton = document.createElement('button');
    threeColButton.innerText = 'Three Columns';
    threeColButton.onclick = () => {
      this.insertLayout(3, [33.33, 33.33, 33.33]);
      document.body.removeChild(modal);
    };
    const sixtyFortyButton = document.createElement('button');
    sixtyFortyButton.innerText = '60-40 Split';
    sixtyFortyButton.onclick = () => {
      this.insertLayout(2, [60, 40]);
      document.body.removeChild(modal);
    };
    const fortySixtyButton = document.createElement('button');
    fortySixtyButton.innerText = '40-60 Split';
    fortySixtyButton.onclick = () => {
      this.insertLayout(2, [40, 60]);
      document.body.removeChild(modal);
    };
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.onclick = () => document.body.removeChild(modal);
    modal.appendChild(oneColButton);
    modal.appendChild(twoColButton);
    modal.appendChild(threeColButton);
    modal.appendChild(sixtyFortyButton);
    modal.appendChild(fortySixtyButton);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
  }
  insertLayout(columns, widths) {
    const layoutDiv = document.createElement('div');
    layoutDiv.style.display = 'flex';
    for (let i = 0; i < columns; i++) {
      const columnDiv = document.createElement('div');
      columnDiv.style.flex = `0 0 ${widths[i]}%`;
      columnDiv.style.border = '1px solid #ccc';
      columnDiv.style.padding = '20px';
      columnDiv.contentEditable = 'true';
      layoutDiv.appendChild(columnDiv);
    }
    this.editor.appendChild(layoutDiv);
  }
}

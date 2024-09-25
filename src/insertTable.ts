export class InsertTableHandler {
    private editor: HTMLDivElement;
  
    constructor(editor: HTMLDivElement) {
      this.editor = editor;
    }
  
    // Open a modal to let the user specify the table size
    public openTableModal() {
      const modal = document.createElement("div");
      modal.classList.add("table-modal");
  
      const rowInput = document.createElement("input");
      rowInput.type = "number";
      rowInput.placeholder = "Enter No. Of Rows";
      rowInput.min = "1";
      rowInput.style.marginRight ="2px"
      
      const colInput = document.createElement("input");
      colInput.type = "number";
      colInput.placeholder = "Enter No. Of Columns";
      colInput.min = "1";
  
      const insertButton = document.createElement("button");
      insertButton.innerText = "Insert Table";
      insertButton.onclick = () => {
        const rows = parseInt(rowInput.value) || 1;
        const cols = parseInt(colInput.value) || 1;
        this.insertTable(rows, cols);
        document.body.removeChild(modal); // Close modal after inserting the table
      };
  
      const closeButton = document.createElement("button");
      closeButton.innerText = "Close";
      closeButton.onclick = () => document.body.removeChild(modal);
  
      modal.appendChild(rowInput);
      modal.appendChild(colInput);
      modal.appendChild(insertButton);
      modal.appendChild(closeButton);
  
      // Style the modal (you can modify these styles)
      modal.style.position = "fixed";
      modal.style.top = "10%";
      modal.style.left = "50%";
      modal.style.transform = "translate(-30%, -30%)";
      modal.style.padding = "10px";
      modal.style.backgroundColor = "white";
      // modal.style.border = "1px solid #ccc";
      modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.1)";
  
      document.body.appendChild(modal);
    }
  
    // Insert table into the editor
    private insertTable(rows: number, cols: number) {
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
  
      for (let r = 0; r < rows; r++) {
        const row = table.insertRow();
        for (let c = 0; c < cols; c++) {
          const cell = row.insertCell();
          cell.style.border = "1px solid #ccc";
          cell.style.padding = "8px";
          cell.contentEditable = "true"; // Make cells editable
          cell.innerText = " ";
        }
      }
  
      this.editor.appendChild(table);
    }
}  
export class InsertLayoutHandler {
    private editor: HTMLDivElement;
  
    constructor(editor: HTMLDivElement) {
      this.editor = editor;
    }
  
    // Open a modal to choose the layout type
    public openLayoutModal() {
      const modal = document.createElement("div");
      modal.classList.add("layout-modal");
  
      // Buttons for different layout options
      const oneColButton = document.createElement("button");
      oneColButton.innerText = "Single Column";
      oneColButton.onclick = () => {
        this.insertLayout(1, [100, 0]);
        document.body.removeChild(modal); // Close modal
      };

      const twoColButton = document.createElement("button");
      twoColButton.innerText = "Two Columns";
      twoColButton.onclick = () => {
        this.insertLayout(2, [50, 50]);
        document.body.removeChild(modal); // Close modal
      };
  
      const threeColButton = document.createElement("button");
      threeColButton.innerText = "Three Columns";
      threeColButton.onclick = () => {
        this.insertLayout(3, [33.33, 33.33, 33.33]);
        document.body.removeChild(modal); // Close modal
      };
  
      const sixtyFortyButton = document.createElement("button");
      sixtyFortyButton.innerText = "60-40 Split";
      sixtyFortyButton.onclick = () => {
        this.insertLayout(2, [60, 40]);
        document.body.removeChild(modal); // Close modal
      };
  
      const fortySixtyButton = document.createElement("button");
      fortySixtyButton.innerText = "40-60 Split";
      fortySixtyButton.onclick = () => {
        this.insertLayout(2, [40, 60]);
        document.body.removeChild(modal); // Close modal
      };
  
      const closeButton = document.createElement("button");
      closeButton.innerText = "Close";
      closeButton.onclick = () => document.body.removeChild(modal);
  
      // Append buttons to the modal
      modal.appendChild(oneColButton);
      modal.appendChild(twoColButton);
      modal.appendChild(threeColButton);
      modal.appendChild(sixtyFortyButton);
      modal.appendChild(fortySixtyButton);
      modal.appendChild(closeButton);
  
      // Style the modal (you can modify these styles)
      modal.style.position = "fixed";
      modal.style.top = "10%";
      modal.style.left = "50%";
      modal.style.transform = "translate(-20%, -20%)";
      modal.style.padding = "10px";
      modal.style.backgroundColor = "white";
      modal.style.border = "1px solid #ccc";
      modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.1)";
  
      document.body.appendChild(modal);
    }
  
    // Insert the selected layout into the editor
    private insertLayout(columns: number, widths: number[]) {
      const layoutDiv = document.createElement("div");
      layoutDiv.style.display = "flex";

      for (let i = 0; i < columns; i++) {
        const columnDiv = document.createElement("div");
        columnDiv.style.flex = `0 0 ${widths[i]}%`; // Set the width based on the given percentage
        columnDiv.style.border = "1px solid #ccc";
        columnDiv.style.padding = "20px";
        columnDiv.contentEditable = "true"; // Make the column editable
        layoutDiv.appendChild(columnDiv);
      }
      this.editor.appendChild(layoutDiv); // Insert the layout into the editor
    }
}  
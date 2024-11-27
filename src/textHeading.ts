export class TextHeadingHandler {
    private editor: HTMLDivElement;
    
    constructor(editor: HTMLDivElement) {
      this.editor = editor;
    }
  
    // Create the modal and display heading options
    public openHeadingModal() {
      const modal = document.createElement("div");
      modal.classList.add("modal");
  
      const headingLevels = [1, 2, 3, 4, 5, 6];
      headingLevels.forEach((level) => {
        const headingButton = document.createElement("button");
        headingButton.innerText = `H${level}`;
        headingButton.onclick = () => {
          document.execCommand("formatBlock", false, `<h${level}>`);
          document.body.removeChild(modal); // Close modal after selecting heading
        };
        modal.appendChild(headingButton);
      });
  
      // Modal close button
      const closeButton = document.createElement("button");
      closeButton.innerText = "Close";
      closeButton.onclick = () => document.body.removeChild(modal);
      modal.appendChild(closeButton);
      document.body.appendChild(modal);
    }
}
  
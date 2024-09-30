export class TextHeadingHandler {
    private editor: HTMLDivElement;
    
    constructor(editor: HTMLDivElement) {
      this.editor = editor;
    }
  
    // Create the modal and display heading options
    public openHeadingModal() {
      const modal = document.createElement("div");
      modal.classList.add("heading-modal");
  
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
  
      // Styling the modal (you can customize this CSS)
      modal.style.position = "fixed";
      modal.style.top = "10%";
      modal.style.left = "50%";
      modal.style.transform = "translate(-30%, -30%)";
      modal.style.padding = "10px";
      modal.style.backgroundColor = "white";
      modal.style.border = "1px solid #ccc";
      modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.1)";
      document.body.appendChild(modal);
    }
}
  
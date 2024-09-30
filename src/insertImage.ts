export class ImageHandler {
    private editor: HTMLDivElement;
  
    constructor(editor: HTMLDivElement) {
      this.editor = editor;
    }
  
    public insertImage() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
  
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const img = document.createElement("img");
            img.src = event.target?.result as string;
            img.style.maxWidth = "100%"; // Adjust the max width as needed
  
            // Insert image at the current caret position
            const range = window.getSelection()?.getRangeAt(0);
            if (range) {
              range.deleteContents();
              range.insertNode(img);
            }
          };
          reader.readAsDataURL(file);
        }
      };
  
      // Programmatically click to open the file dialog
      input.click();
    }
  }
  
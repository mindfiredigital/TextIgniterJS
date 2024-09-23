export class HyperLinkHandler {
    private editor: HTMLDivElement;
  
    constructor(editor: HTMLDivElement) {
      this.editor = editor;
    }
  
    // Method to prompt the user for the hyperlink URL and apply it
    public insertHyperlink() {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
  
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (!selectedText) {
        alert('Please select the text to hyperlink.');
        return;
      }
  
      // Prompt the user for the URL
      const url = prompt('Enter the URL for the hyperlink:', 'https://');
      if (!url) return;
  
      // Create the link element
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // Open link in a new tab
      link.textContent = selectedText;
  
      // Replace the selected text with the hyperlink
      range.deleteContents();
      range.insertNode(link);
    }
  }  
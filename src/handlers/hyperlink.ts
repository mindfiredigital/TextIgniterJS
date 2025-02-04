export class HyperlinkHandler {
    private editor: HTMLDivElement;
    private modal: HTMLDivElement | null = null;
    private overlay: HTMLDivElement | null = null;
    private currentAnchor: HTMLAnchorElement | null = null; // For update functionality
    private savedRange: Range | null = null; // To save the selection range
  
    constructor(editor: HTMLDivElement) {
      this.editor = editor;
  
      // Capture the caret/selection when the user clicks in the editor
      this.editor.addEventListener('mouseup', () => this.saveSelection());
      this.editor.addEventListener('keyup', () => this.saveSelection());
    }
  
    // Method to save the current selection or caret position
    private saveSelection() {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        this.savedRange = selection.getRangeAt(0).cloneRange();
      }
    }
  
    public openHyperlinkModal() {
      // If modal already exists, don't create it again
      if (this.modal) return;
  
      // Create background overlay
      this.overlay = document.createElement("div");
      this.overlay.classList.add("modal-overlay");
      document.body.appendChild(this.overlay);
  
      // Create modal structure
      this.modal = document.createElement("div");
      this.modal.classList.add("hyperlink-modal");
  
      const linkTextInput = document.createElement("input");
      linkTextInput.type = "text";
      linkTextInput.placeholder = "Enter link text";
      linkTextInput.classList.add("hyperlink-input");
  
      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.placeholder = "Enter URL";
      urlInput.classList.add("hyperlink-input");
  
      const insertButton = document.createElement("button");
      insertButton.textContent = "Insert/Update Link";
      insertButton.onclick = () => this.insertHyperlink(linkTextInput.value, urlInput.value);
  
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Close";
      cancelButton.onclick = () => this.closeHyperlinkModal();
  
      // Append elements to modal
      this.modal.appendChild(linkTextInput);
      this.modal.appendChild(urlInput);
      this.modal.appendChild(insertButton);
      this.modal.appendChild(cancelButton);
  
      // Check if there is an anchor (hyperlink) in the saved selection
      if (this.savedRange) {
        const container = this.savedRange.commonAncestorContainer;
        let anchor = container instanceof HTMLAnchorElement ? container : container.parentElement as HTMLAnchorElement;
  
        if (anchor && anchor.tagName === 'A') {
          // If an anchor is found, populate the input fields for update functionality
          this.currentAnchor = anchor;
          linkTextInput.value = anchor.textContent || '';
          urlInput.value = anchor.href;
        }
      }
  
      // Append the modal to the document body
      document.body.appendChild(this.modal);
  
      // Style modal (add your own styling as needed)
      this.modal.style.position = "fixed";
      this.modal.style.top = "20%";
      this.modal.style.left = "45%";
      this.modal.style.backgroundColor = "#fff";
      this.modal.style.zIndex = "1000"; // Ensure the modal is above other elements
  
      // Style overlay
      this.overlay.style.position = "fixed";
      this.overlay.style.top = "0";
      this.overlay.style.left = "0";
      this.overlay.style.width = "100%";
      this.overlay.style.height = "100%";
      this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
      this.overlay.style.backdropFilter = "blur(5px)"; // Apply blur effect
      this.overlay.style.zIndex = "999"; // Make sure overlay is below the modal
    }
  
    private insertHyperlink(linkText: string, url: string) {
      // Validate input
      if (!linkText || !url) {
        console.error("Both link text and URL are required.");
        return;
      }
  
      if (this.currentAnchor) {
        // Update existing hyperlink
        this.currentAnchor.href = url;
        this.currentAnchor.textContent = linkText;
        this.currentAnchor.target = "_blank"; // Ensure the link opens in a new tab
        this.currentAnchor = null; // Clear reference after updating
      } else if (this.savedRange) {
        const selection = window.getSelection();
  
        // Restore the saved selection before inserting the hyperlink
        selection?.removeAllRanges();
        selection?.addRange(this.savedRange);
  
        // Create the anchor element
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.textContent = linkText;
        anchor.target = "_blank"; // Ensure the link opens in a new tab
        anchor.style.textDecoration = 'none'; // Remove underline
  
        // Optional: Handle click event to prevent default navigation behavior if needed
        anchor.onclick = (event: MouseEvent) => {
          event.preventDefault();
          window.open(anchor.href, '_blank'); // Open the URL in a new tab manually
        };
  
        // Use DocumentFragment for safer insertion
        const fragment = document.createDocumentFragment();
        fragment.appendChild(anchor);
  
        try {
          // Insert the fragment into the saved range
          this.savedRange.deleteContents();
          this.savedRange.insertNode(fragment);
  
          // Move the cursor right after the inserted link
          this.savedRange.setStartAfter(anchor);
          this.savedRange.setEndAfter(anchor);
  
          // Clear the saved range
          this.savedRange = null;
        } catch (error) {
          console.error("Error inserting hyperlink:", error);
        }
      } else {
        console.error("No saved selection range found.");
      }
  
      this.closeHyperlinkModal();
    }
  
    private closeHyperlinkModal() {
      if (this.modal) {
        document.body.removeChild(this.modal);
        this.modal = null;
      }
      if (this.overlay) {
        document.body.removeChild(this.overlay);
        this.overlay = null;
      }
    }
  }
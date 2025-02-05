import { blockType } from "../types/pieces";
import { saveSelection,restoreSelection,getSelectionRange } from "../utils/selectionManager";
import EditorView from "../view/editorView";
import TextDocument from "../textDocument";
class HyperlinkHandler {
  savedSelection: { start: number; end: number } | null = null;
  editorContainer: HTMLElement | null;
  editorView: EditorView;
  document:TextDocument;

  constructor(editorContainer: HTMLElement, editorView: EditorView,document:TextDocument) {
    this.editorContainer = editorContainer;
    this.editorView = editorView;
    this.document = document;
  }

  // Method to save the current selection or caret position

  hanldeHyperlinkClick(
    start: number,
    end: number,
    currentOffset: number,
    selectedBlockId: string | null,
    blocks: blockType
  ) {
    const existingLink = this.getCommonHyperlinkInRange(
      start,
      end,
      currentOffset,
      selectedBlockId,
      blocks
    );
    this.showHyperlinkInput(existingLink);
  }

  getCommonHyperlinkInRange(
    start: number,
    end: number,
    currentOffset: number,
    selectedBlockId: string | null,
    blocks: blockType
  ): string | null {
    // let offset = this.currentOffset;
    let offset = currentOffset;
    let index = 0;
    if (selectedBlockId) {
      index = blocks.findIndex(
        (block: any) => block.dataId === selectedBlockId
      );
    }
    const pieces = blocks[index].pieces;
    let commonLink: string | null = null;

    for (let piece of pieces) {
      const pieceEnd = offset + piece.text.length;
      if (pieceEnd > start && offset < end) {
        const pieceLink = piece.attributes.hyperlink || null;
        if (commonLink === null) {
          commonLink = pieceLink;
        } else if (commonLink !== pieceLink) {
          // Different hyperlinks in selection
          return null;
        }
      }
      offset = pieceEnd;
    }
    return commonLink;
  }

  showHyperlinkInput(existingLink: string | null): void {
    // Get the elements
    const hyperlinkContainer = document.getElementById("hyperlink-container");
    const hyperlinkInput = document.getElementById(
      "hyperlink-input"
    ) as HTMLInputElement;
    const applyButton = document.getElementById("apply-hyperlink");
    const cancelButton = document.getElementById("cancel-hyperlink");

    if (hyperlinkContainer && hyperlinkInput && applyButton && cancelButton) {
      hyperlinkContainer.style.display = "block";

      // position the container near the selection or toolbar
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        hyperlinkContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
        hyperlinkContainer.style.left = `${rect.left + window.scrollX}px`;
      }

      // Set the existing link
      hyperlinkInput.value = existingLink || "";

      // Save the current selection
      this.savedSelection = saveSelection(this.editorView.container);

      // Show temporary selection
      this.highlightSelection();

      // Ensure the hyperlink input is focused
      hyperlinkInput.focus();

      // Remove any previous event listeners
      applyButton.onclick = null;
      cancelButton.onclick = null;

      // Handle the 'Link' button
      applyButton.onclick = () => {
        const url = hyperlinkInput.value.trim();
        if (url) {
          this.applyHyperlink(url);
        }
        hyperlinkContainer.style.display = "none";
      };

      // Handle the 'Unlink' button
      cancelButton.onclick = () => {
        // console.log("yyy", { remove: this.document.dataIds });
        this.removeHyperlink();
        hyperlinkContainer.style.display = "none";
      };
    }
  }

  highlightSelection(): void {
    // Remove any existing temporary highlights
    this.removeHighlightSelection();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Create a wrapper span
      const span = document.createElement("span");
      span.className = "temporary-selection-highlight";

      // Extract the selected content and wrap it
      span.appendChild(range.extractContents());
      range.insertNode(span);

      // Adjust the selection to encompass the new span
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
    }
  }

  removeHighlightSelection(): void {
    const highlights = this.editorContainer?.querySelectorAll(
      "span.temporary-selection-highlight"
    );
    highlights?.forEach((span) => {
      const parent = span.parentNode;
      if (parent) {
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
      }
    });
  }


  applyHyperlink(url: string): void {
    // Remove any existing temporary highlights
    this.removeHighlightSelection();

    // Restore the selection
    restoreSelection(this.editorView.container, this.savedSelection);

    const [start, end] = getSelectionRange(this.editorView);
    if (start < end) {
        console.log('yyy',this.document.blocks)
        console.log('yyy',this.document.selectedBlockId)
        console.log('yyy',this.document.dataIds)
        
        if (this.document.dataIds.length > 1) {
            this.document.blocks.forEach((block: any) => {
                if (this.document.dataIds.includes(block.dataId)) {
                    this.document.selectedBlockId = block.dataId;
                    let countE = 0;
                    block.pieces.forEach((obj: any) => {
                        countE += obj.text.length;
                    })
                    let countS = start - countE;
                    // this.document.applyHyperlinkRange(countS, countE,url);
                    this.document.formatAttribute(countS, countE, 'hyperlink', url);
                }
            })
        } else {
            // this.document.applyHyperlinkRange(start, end,url);
            this.document.formatAttribute(start, end, 'hyperlink', url);
        }
      


        // this.document.applyHyperlinkRange(start, end, url);

        this.editorView.render();
        // Restore selection and focus
        restoreSelection(this.editorView.container, this.savedSelection);
        this.editorView.container.focus();
    }
    this.savedSelection = null;
}

removeHyperlink(): void {
    // Remove any existing temporary highlights
    this.removeHighlightSelection();

    // Restore the selection
    restoreSelection(this.editorView.container, this.savedSelection);

    const [start, end] = getSelectionRange(this.editorView);
    console.log('yyy',{remove:this.document.dataIds})
    if (start < end) {
        // this.document.removeHyperlinkRange(start, end);






        if (this.document.dataIds.length > 1) {
            this.document.blocks.forEach((block: any) => {
                if (this.document.dataIds.includes(block.dataId)) {
                    this.document.selectedBlockId = block.dataId;
                    let countE = 0;
                    block.pieces.forEach((obj: any) => {
                        countE += obj.text.length;
                    })
                    let countS = start - countE;
                    // this.document.removeHyperlinkRange(countS, countE);
                    this.document.formatAttribute(countS, countE, 'hyperlink', false);

                }
            })
        } else {
            this.document.formatAttribute(start, end, 'hyperlink', false);

            // this.document.removeHyperlinkRange(start, end);
        }
      



        this.editorView.render();
        // Restore selection and focus
        restoreSelection(this.editorView.container, this.savedSelection);
        this.editorView.container.focus();




    }
    this.savedSelection = null;
}


showHyperlinkViewButton(link:string | "") : void{
    const viewHyperlinkContainer = document.getElementById('hyperlink-container-view') as HTMLDivElement;
    const hyperLinkAnchor = document.getElementById('hyperlink-view-link') as HTMLAnchorElement;
  

    if (viewHyperlinkContainer && hyperLinkAnchor) {
        viewHyperlinkContainer.style.display = 'block';

        // position the container near the selection or toolbar
        const selection = window.getSelection();
        if (selection) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            viewHyperlinkContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
            viewHyperlinkContainer.style.left = `${rect.left + window.scrollX}px`;
        }

        // Set the existing link
        if(link){
            hyperLinkAnchor.innerText = link || '';
            hyperLinkAnchor.href = link || '';
        }
    }
}

 hideHyperlinkViewButton(){
    const hyperlinkContainer = document.getElementById('hyperlink-container-view');
    if(hyperlinkContainer){
        hyperlinkContainer.style.display = 'none';
    }
}


}

export default HyperlinkHandler;
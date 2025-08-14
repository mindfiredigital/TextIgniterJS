import { blockType } from '../types/pieces';
import {
  saveSelection,
  restoreSelection,
  getSelectionRange,
} from '../utils/selectionManager';
import EditorView from '../view/editorView';
import TextDocument from '../textDocument';
import UndoRedoManager from './undoRedoManager';
import { strings } from '../constants/strings';

class HyperlinkHandler {
  savedSelection: { start: number; end: number } | null = null;
  editorContainer: HTMLElement | null;
  editorView: EditorView;
  document: TextDocument;
  undoRedoManager!: UndoRedoManager;

  constructor(
    editorContainer: HTMLElement,
    editorView: EditorView,
    document: TextDocument
  ) {
    this.editorContainer = editorContainer;
    this.editorView = editorView;
    this.document = document;
  }

  setUndoRedoManager(undoRedoManager: UndoRedoManager): void {
    this.undoRedoManager = undoRedoManager;
  }

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
          return null;
        }
      }
      offset = pieceEnd;
    }
    return commonLink;
  }

  showHyperlinkInput(existingLink: string | null): void {
    const hyperlinkContainer = document.getElementById(
      strings.HYPERLINK_CONTAINER_ID
    );
    const hyperlinkInput = document.getElementById(
      strings.HYPERLINK_INPUT_ID
    ) as HTMLInputElement;
    const applyButton = document.getElementById(strings.HYPERLINK_APPLY_BTN_ID);
    const cancelButton = document.getElementById(
      strings.HYPERLINK_CANCEL_BTN_ID
    );

    if (hyperlinkContainer && hyperlinkInput && applyButton && cancelButton) {
      // Hide container first to clear any existing state
      hyperlinkContainer.style.display = 'none';

      // Force a reflow to ensure the container is hidden
      hyperlinkContainer.offsetHeight;

      // Now show the container
      hyperlinkContainer.style.display = 'block';

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        hyperlinkContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
        hyperlinkContainer.style.left = `${rect.left + window.scrollX}px`;
      }

      hyperlinkInput.value = existingLink || '';

      // Save selection BEFORE highlighting
      this.savedSelection = saveSelection(this.editorView.container);
      console.log('Saved selection:', this.savedSelection);

      this.highlightSelection();

      const dataIdsSnapshot = this.document.dataIds;
      console.log('Data IDs snapshot:', dataIdsSnapshot);

      // Remove any existing event listeners
      const newHyperlinkInput = hyperlinkInput.cloneNode(
        true
      ) as HTMLInputElement;
      hyperlinkInput.parentNode?.replaceChild(
        newHyperlinkInput,
        hyperlinkInput
      );

      // Focus the input
      newHyperlinkInput.focus();

      // Create the keydown handler
      const handleKeydown = (event: KeyboardEvent) => {
        console.log('keydown event triggered:', event.key);
        if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          console.log('Enter key pressed, triggering apply button click');
          handleApplyClick();
        }
      };

      // Create the apply click handler
      const handleApplyClick = () => {
        console.log('Apply button clicked');
        const url = newHyperlinkInput.value.trim();
        if (url) {
          this.applyHyperlink(url, dataIdsSnapshot);
        }
        hyperlinkContainer.style.display = 'none';
        // Remove the event listener when closing
        newHyperlinkInput.removeEventListener('keydown', handleKeydown);
      };

      // Create the cancel click handler
      const handleCancelClick = () => {
        console.log('Cancel button clicked');
        this.removeHyperlink(dataIdsSnapshot);
        hyperlinkContainer.style.display = 'none';
        // Remove the event listener when closing
        newHyperlinkInput.removeEventListener('keydown', handleKeydown);
      };

      // Add event listeners
      newHyperlinkInput.addEventListener('keydown', handleKeydown);
      applyButton.addEventListener('click', handleApplyClick);
      cancelButton.addEventListener('click', handleCancelClick);
    }
  }

  highlightSelection(): void {
    this.removeHighlightSelection();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = strings.TEMPORARY_SELECTION_HIGHLIGHT_CLASS;
      span.appendChild(range.extractContents());
      range.insertNode(span);
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
    }
  }

  removeHighlightSelection(): void {
    const highlights = this.editorContainer?.querySelectorAll(
      `span.${strings.TEMPORARY_SELECTION_HIGHLIGHT_CLASS}`
    );
    highlights?.forEach(span => {
      const parent = span.parentNode;
      if (parent) {
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
      }
    });
  }

  applyHyperlink(url: string, dataIdsSnapshot: any): void {
    console.log('applyHyperlink called with:', { url, dataIdsSnapshot });

    this.undoRedoManager.saveUndoSnapshot();
    this.removeHighlightSelection();

    // Restore the saved selection
    if (this.savedSelection) {
      restoreSelection(this.editorView.container, this.savedSelection);
    }

    const [start, end] = getSelectionRange(this.editorView);
    console.log('Selection range after restore:', { start, end });

    // Set the selectedBlockId if it's not set
    if (
      !this.document.selectedBlockId &&
      dataIdsSnapshot &&
      dataIdsSnapshot.length > 0
    ) {
      this.document.selectedBlockId = dataIdsSnapshot[0];
      console.log('Set selectedBlockId to:', dataIdsSnapshot[0]);
    }

    // If no selection range, try to use the saved selection
    if (start === end && this.savedSelection) {
      console.log('Using saved selection instead');
      const savedStart = this.savedSelection.start;
      const savedEnd = this.savedSelection.end;

      if (savedStart < savedEnd) {
        // Use the saved selection range
        if (dataIdsSnapshot && dataIdsSnapshot.length > 1) {
          this.document.blocks.forEach((block: any) => {
            if (dataIdsSnapshot.includes(block.dataId)) {
              this.document.selectedBlockId = block.dataId;
              let countE = 0;
              block.pieces.forEach((obj: any) => {
                countE += obj.text.length;
              });
              let countS = savedStart - countE;
              this.document.formatAttribute(countS, countE, 'hyperlink', url);
            }
          });
        } else {
          this.document.formatAttribute(savedStart, savedEnd, 'hyperlink', url);
        }
      }
    } else if (start < end) {
      // Use the current selection range
      if (dataIdsSnapshot && dataIdsSnapshot.length > 1) {
        this.document.blocks.forEach((block: any) => {
          if (dataIdsSnapshot.includes(block.dataId)) {
            this.document.selectedBlockId = block.dataId;
            let countE = 0;
            block.pieces.forEach((obj: any) => {
              countE += obj.text.length;
            });
            let countS = start - countE;
            this.document.formatAttribute(countS, countE, 'hyperlink', url);
          }
        });
      } else {
        // For single block, ensure selectedBlockId is set
        if (
          !this.document.selectedBlockId &&
          dataIdsSnapshot &&
          dataIdsSnapshot.length > 0
        ) {
          this.document.selectedBlockId = dataIdsSnapshot[0];
        }
        this.document.formatAttribute(start, end, 'hyperlink', url);
      }
    } else {
      console.log('No valid selection found');
    }

    this.editorView.render();

    // Restore selection and focus
    if (this.savedSelection) {
      restoreSelection(this.editorView.container, this.savedSelection);
    }
    this.editorView.container.focus();

    this.savedSelection = null;
  }

  removeHyperlink(dataIdsSnapshot: any): void {
    this.undoRedoManager.saveUndoSnapshot();
    this.removeHighlightSelection();
    restoreSelection(this.editorView.container, this.savedSelection);
    const [start, end] = getSelectionRange(this.editorView);
    if (start < end) {
      if (dataIdsSnapshot.length > 1) {
        this.document.blocks.forEach((block: any) => {
          if (dataIdsSnapshot.includes(block.dataId)) {
            this.document.selectedBlockId = block.dataId;
            let countE = 0;
            block.pieces.forEach((obj: any) => {
              countE += obj.text.length;
            });
            let countS = start - countE;
            this.document.formatAttribute(countS, countE, 'hyperlink', false);
          }
        });
      } else {
        this.document.formatAttribute(start, end, 'hyperlink', false);
      }
      this.editorView.render();
      restoreSelection(this.editorView.container, this.savedSelection);
      this.editorView.container.focus();
    }
    this.savedSelection = null;
  }

  showHyperlinkViewButton(link: string | ''): void {
    const viewHyperlinkContainer = document.getElementById(
      strings.VIEW_HYPERLINK_CONTAINER_ID
    ) as HTMLDivElement;
    const hyperLinkAnchor = document.getElementById(
      strings.VIEW_HYPERLINK_ANCHOR_ID
    ) as HTMLAnchorElement;

    if (viewHyperlinkContainer && hyperLinkAnchor) {
      viewHyperlinkContainer.style.display = 'block';

      const selection = window.getSelection();
      if (selection) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        viewHyperlinkContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
        viewHyperlinkContainer.style.left = `${rect.left + window.scrollX}px`;
      }

      if (link) {
        hyperLinkAnchor.innerText = link;
        hyperLinkAnchor.href = link;
      }
    }
  }

  hideHyperlinkViewButton() {
    const hyperlinkContainer = document.getElementById(
      strings.VIEW_HYPERLINK_CONTAINER_ID
    );
    if (hyperlinkContainer) {
      hyperlinkContainer.style.display = 'none';
    }
  }
}

export default HyperlinkHandler;

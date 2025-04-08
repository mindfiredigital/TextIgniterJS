import {
  saveSelection,
  restoreSelection,
  getSelectionRange,
} from '../utils/selectionManager';
import { strings } from '../constants/strings';
class HyperlinkHandler {
  constructor(editorContainer, editorView, document) {
    this.savedSelection = null;
    this.editorContainer = editorContainer;
    this.editorView = editorView;
    this.document = document;
  }
  setUndoRedoManager(undoRedoManager) {
    this.undoRedoManager = undoRedoManager;
  }
  hanldeHyperlinkClick(start, end, currentOffset, selectedBlockId, blocks) {
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
    start,
    end,
    currentOffset,
    selectedBlockId,
    blocks
  ) {
    let offset = currentOffset;
    let index = 0;
    if (selectedBlockId) {
      index = blocks.findIndex(block => block.dataId === selectedBlockId);
    }
    const pieces = blocks[index].pieces;
    let commonLink = null;
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
  showHyperlinkInput(existingLink) {
    const hyperlinkContainer = document.getElementById(
      strings.HYPERLINK_CONTAINER_ID
    );
    const hyperlinkInput = document.getElementById(strings.HYPERLINK_INPUT_ID);
    const applyButton = document.getElementById(strings.HYPERLINK_APPLY_BTN_ID);
    const cancelButton = document.getElementById(
      strings.HYPERLINK_CANCEL_BTN_ID
    );
    if (hyperlinkContainer && hyperlinkInput && applyButton && cancelButton) {
      hyperlinkContainer.style.display = 'block';
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        hyperlinkContainer.style.top = `${rect.bottom + window.scrollY + 5}px`;
        hyperlinkContainer.style.left = `${rect.left + window.scrollX}px`;
      }
      hyperlinkInput.value = existingLink || '';
      this.savedSelection = saveSelection(this.editorView.container);
      this.highlightSelection();
      hyperlinkInput.focus();
      applyButton.onclick = null;
      cancelButton.onclick = null;
      const dataIdsSnapshot = this.document.dataIds;
      applyButton.onclick = () => {
        const url = hyperlinkInput.value.trim();
        if (url) {
          this.applyHyperlink(url, dataIdsSnapshot);
        }
        hyperlinkContainer.style.display = 'none';
      };
      cancelButton.onclick = () => {
        this.removeHyperlink(dataIdsSnapshot);
        hyperlinkContainer.style.display = 'none';
      };
    }
  }
  highlightSelection() {
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
  removeHighlightSelection() {
    var _a;
    const highlights =
      (_a = this.editorContainer) === null || _a === void 0
        ? void 0
        : _a.querySelectorAll(
            `span.${strings.TEMPORARY_SELECTION_HIGHLIGHT_CLASS}`
          );
    highlights === null || highlights === void 0
      ? void 0
      : highlights.forEach(span => {
          const parent = span.parentNode;
          if (parent) {
            while (span.firstChild) {
              parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
          }
        });
  }
  applyHyperlink(url, dataIdsSnapshot) {
    this.undoRedoManager.saveUndoSnapshot();
    this.removeHighlightSelection();
    restoreSelection(this.editorView.container, this.savedSelection);
    const [start, end] = getSelectionRange(this.editorView);
    if (start < end) {
      if (dataIdsSnapshot.length > 1) {
        this.document.blocks.forEach(block => {
          if (dataIdsSnapshot.includes(block.dataId)) {
            this.document.selectedBlockId = block.dataId;
            let countE = 0;
            block.pieces.forEach(obj => {
              countE += obj.text.length;
            });
            let countS = start - countE;
            this.document.formatAttribute(countS, countE, 'hyperlink', url);
          }
        });
      } else {
        this.document.formatAttribute(start, end, 'hyperlink', url);
      }
      this.editorView.render();
      restoreSelection(this.editorView.container, this.savedSelection);
      this.editorView.container.focus();
    }
    this.savedSelection = null;
  }
  removeHyperlink(dataIdsSnapshot) {
    this.undoRedoManager.saveUndoSnapshot();
    this.removeHighlightSelection();
    restoreSelection(this.editorView.container, this.savedSelection);
    const [start, end] = getSelectionRange(this.editorView);
    if (start < end) {
      if (dataIdsSnapshot.length > 1) {
        this.document.blocks.forEach(block => {
          if (dataIdsSnapshot.includes(block.dataId)) {
            this.document.selectedBlockId = block.dataId;
            let countE = 0;
            block.pieces.forEach(obj => {
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
  showHyperlinkViewButton(link) {
    const viewHyperlinkContainer = document.getElementById(
      strings.VIEW_HYPERLINK_CONTAINER_ID
    );
    const hyperLinkAnchor = document.getElementById(
      strings.VIEW_HYPERLINK_ANCHOR_ID
    );
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

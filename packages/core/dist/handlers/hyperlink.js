import { saveSelection, restoreSelection, getSelectionRange, } from '../utils/selectionManager';
import { strings } from '../constants/strings';
import { ensureProtocol } from '../utils/urlDetector';
class HyperlinkHandler {
    constructor(editorContainer, editorView, document) {
        this.savedSelection = null;
        this.clickOutsideHandler = null;
        this.editorContainer = editorContainer;
        this.editorView = editorView;
        this.document = document;
    }
    setUndoRedoManager(undoRedoManager) {
        this.undoRedoManager = undoRedoManager;
    }
    hanldeHyperlinkClick(start, end, currentOffset, selectedBlockId, blocks) {
        const existingLink = this.getCommonHyperlinkInRange(start, end, currentOffset, selectedBlockId, blocks);
        this.showHyperlinkInput(existingLink);
    }
    getCommonHyperlinkInRange(start, end, currentOffset, selectedBlockId, blocks) {
        let offset = currentOffset;
        let index = 0;
        if (selectedBlockId) {
            index = blocks.findIndex((block) => block.dataId === selectedBlockId);
        }
        const pieces = blocks[index].pieces;
        let commonLink = null;
        for (let piece of pieces) {
            const pieceEnd = offset + piece.text.length;
            if (pieceEnd > start && offset < end) {
                const pieceLink = piece.attributes.hyperlink || null;
                if (commonLink === null) {
                    commonLink = pieceLink;
                }
                else if (commonLink !== pieceLink) {
                    return null;
                }
            }
            offset = pieceEnd;
        }
        return commonLink;
    }
    showHyperlinkInput(existingLink) {
        var _a, _b, _c;
        const hyperlinkContainer = document.getElementById(strings.HYPERLINK_CONTAINER_ID);
        const hyperlinkInput = document.getElementById(strings.HYPERLINK_INPUT_ID);
        const applyButton = document.getElementById(strings.HYPERLINK_APPLY_BTN_ID);
        const cancelButton = document.getElementById(strings.HYPERLINK_CANCEL_BTN_ID);
        if (hyperlinkContainer && hyperlinkInput && applyButton && cancelButton) {
            hyperlinkContainer.style.display = 'block';
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                let rect = null;
                if (range && typeof range.getBoundingClientRect === 'function') {
                    rect = range.getBoundingClientRect();
                }
                else if (range && typeof range.getClientRects === 'function') {
                    const list = (_a = range.getClientRects) === null || _a === void 0 ? void 0 : _a.call(range);
                    rect = list && list.length ? list[0] : null;
                }
                if (!rect || (Number.isNaN(rect.top) && Number.isNaN(rect.left))) {
                    rect = this.editorView.container.getBoundingClientRect();
                }
                const scrollY = (window === null || window === void 0 ? void 0 : window.scrollY) || 0;
                const scrollX = (window === null || window === void 0 ? void 0 : window.scrollX) || 0;
                hyperlinkContainer.style.top = `${((_b = rect.bottom) !== null && _b !== void 0 ? _b : rect.top) + scrollY + 5}px`;
                hyperlinkContainer.style.left = `${((_c = rect.left) !== null && _c !== void 0 ? _c : 0) + scrollX}px`;
            }
            hyperlinkInput.value = existingLink || '';
            this.savedSelection = saveSelection(this.editorView.container);
            this.highlightSelection();
            hyperlinkInput.focus();
            applyButton.onclick = null;
            cancelButton.onclick = null;
            const dataIdsSnapshot = this.document.dataIds;
            const applyHyperlinkAction = () => {
                const url = ensureProtocol(hyperlinkInput.value.trim());
                if (url) {
                    this.applyHyperlink(url, dataIdsSnapshot);
                }
                hyperlinkContainer.style.display = 'none';
            };
            applyButton.onclick = applyHyperlinkAction;
            hyperlinkInput.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    applyHyperlinkAction();
                }
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
        const highlights = (_a = this.editorContainer) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`span.${strings.TEMPORARY_SELECTION_HIGHLIGHT_CLASS}`);
        highlights === null || highlights === void 0 ? void 0 : highlights.forEach(span => {
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
            const normalizedUrl = ensureProtocol(url);
            if (dataIdsSnapshot.length > 1) {
                this.document.blocks.forEach((block) => {
                    if (dataIdsSnapshot.includes(block.dataId)) {
                        this.document.selectedBlockId = block.dataId;
                        let countE = 0;
                        block.pieces.forEach((obj) => {
                            countE += obj.text.length;
                        });
                        let countS = start - countE;
                        this.document.formatAttribute(countS, countE, 'hyperlink', normalizedUrl);
                    }
                });
            }
            else {
                this.document.formatAttribute(start, end, 'hyperlink', normalizedUrl);
            }
            this.editorView.render();
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
            }
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
                this.document.blocks.forEach((block) => {
                    if (dataIdsSnapshot.includes(block.dataId)) {
                        this.document.selectedBlockId = block.dataId;
                        let countE = 0;
                        block.pieces.forEach((obj) => {
                            countE += obj.text.length;
                        });
                        let countS = start - countE;
                        this.document.formatAttribute(countS, countE, 'hyperlink', false);
                    }
                });
            }
            else {
                this.document.formatAttribute(start, end, 'hyperlink', false);
            }
            this.editorView.render();
            restoreSelection(this.editorView.container, this.savedSelection);
            this.editorView.container.focus();
        }
        this.savedSelection = null;
    }
    addClickOutsideListener(container) {
        this.removeClickOutsideListener();
        this.clickOutsideHandler = (event) => {
            if (container && !container.contains(event.target)) {
                this.hideHyperlinkViewButton();
            }
        };
        setTimeout(() => {
            document.addEventListener('click', this.clickOutsideHandler);
        }, 100);
    }
    removeClickOutsideListener() {
        if (this.clickOutsideHandler) {
            document.removeEventListener('click', this.clickOutsideHandler);
            this.clickOutsideHandler = null;
        }
    }
    showHyperlinkViewButton(link) {
        var _a, _b, _c;
        const viewHyperlinkContainer = document.getElementById(strings.VIEW_HYPERLINK_CONTAINER_ID);
        const hyperLinkAnchor = document.getElementById(strings.VIEW_HYPERLINK_ANCHOR_ID);
        if (viewHyperlinkContainer && hyperLinkAnchor) {
            viewHyperlinkContainer.style.display = 'block';
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                let rect = null;
                if (range && typeof range.getBoundingClientRect === 'function') {
                    rect = range.getBoundingClientRect();
                }
                else if (range && typeof range.getClientRects === 'function') {
                    const list = (_a = range.getClientRects) === null || _a === void 0 ? void 0 : _a.call(range);
                    rect = list && list.length ? list[0] : null;
                }
                if (!rect) {
                    rect = this.editorView.container.getBoundingClientRect();
                }
                const scrollY = (window === null || window === void 0 ? void 0 : window.scrollY) || 0;
                const scrollX = (window === null || window === void 0 ? void 0 : window.scrollX) || 0;
                if (rect) {
                    viewHyperlinkContainer.style.top = `${((_b = rect.bottom) !== null && _b !== void 0 ? _b : rect.top) + scrollY + 5}px`;
                    viewHyperlinkContainer.style.left = `${((_c = rect.left) !== null && _c !== void 0 ? _c : 0) + scrollX}px`;
                }
            }
            if (link) {
                hyperLinkAnchor.innerText = link;
                hyperLinkAnchor.href = ensureProtocol(link);
            }
        }
        this.addClickOutsideListener(viewHyperlinkContainer);
    }
    hideHyperlinkViewButton() {
        const hyperlinkContainer = document.getElementById(strings.VIEW_HYPERLINK_CONTAINER_ID);
        if (hyperlinkContainer) {
            hyperlinkContainer.style.display = 'none';
        }
        this.removeClickOutsideListener();
    }
}
export default HyperlinkHandler;

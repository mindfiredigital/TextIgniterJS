import TextDocument from './textDocument';
import EditorView from './view/editorView';
import ToolbarView from './view/toolbarView';
import HyperlinkHandler from './handlers/hyperlink';
import Piece from './piece';
import { saveSelection } from './utils/selectionManager';
import { parseHtmlToPieces } from './utils/parseHtml';
import { createEditor } from './config/editorConfig';
import './styles/text-igniter.css';
import HtmlToJsonParser from './HtmlToJsonParser';
import { ImageHandler } from './handlers/image';
import { strings } from './constants/strings';
import UndoRedoManager from './handlers/undoRedoManager';
import PopupToolbarView from './view/popupToolbarView';
import LinkPopupView from './view/linkPopupView';
import { detectUrlsInText } from './utils/urlDetector';
import EventEmitter from './utils/events';
class TextIgniter extends EventEmitter {
    constructor(editorId, config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        super();
        this.savedSelection = null;
        this.debounceTimer = null;
        const { mainEditorId, toolbarId, popupToolbarId } = createEditor(editorId, config);
        this.editorContainer = document.getElementById(mainEditorId) || null;
        this.toolbarContainer = document.getElementById(toolbarId) || null;
        const popupToolbarContainer = document.getElementById(popupToolbarId) || null;
        if (!this.editorContainer ||
            !this.toolbarContainer ||
            !popupToolbarContainer) {
            throw new Error('Editor element not found or incorrect element type.');
        }
        this.document = new TextDocument();
        this.editorView = new EditorView(this.editorContainer, this.document);
        this.toolbarView = new ToolbarView(this.toolbarContainer);
        this.popupToolbarView = new PopupToolbarView(popupToolbarContainer);
        this.linkPopupView = new LinkPopupView();
        this.hyperlinkHandler = new HyperlinkHandler(this.editorContainer, this.editorView, this.document);
        this.imageHandler = new ImageHandler(this.editorContainer, this.document);
        this.undoRedoManager = new UndoRedoManager(this.document, this.editorView);
        this.editorView.setImageHandler(this.imageHandler);
        this.imageHandler.setEditorView(this.editorView);
        this.document.setEditorView(this.editorView);
        this.document.setUndoRedoManager(this.undoRedoManager);
        this.hyperlinkHandler.setUndoRedoManager(this.undoRedoManager);
        this.linkPopupView.setCallbacks((url) => this.openLink(url), (linkElement) => this.unlinkText(linkElement));
        this.currentAttributes = {
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            undo: false,
            redo: false,
            hyperlink: false,
        };
        this.manualOverride = false;
        this.lastPiece = null;
        this.toolbarView.on('toolbarAction', (action, dataId = []) => this.handleToolbarAction(action, dataId));
        this.popupToolbarView.on('popupAction', (action) => this.handleToolbarAction(action));
        this.document.on('documentChanged', () => this.editorView.render());
        this.document.on('documentChanged', () => {
            var _a;
            const htmlContent = this.document.getHtmlContent();
            this.emit('contentChange', {
                html: htmlContent,
                text: ((_a = this.editorContainer) === null || _a === void 0 ? void 0 : _a.textContent) || '',
            });
        });
        this.editorContainer.addEventListener('keydown', e => {
            this.syncCurrentAttributesWithCursor();
            this.handleKeydown(e);
        });
        this.editorContainer.addEventListener('keyup', () => this.syncCurrentAttributesWithCursor());
        this.editorContainer.addEventListener('blur', () => {
            this.hyperlinkHandler.hideHyperlinkViewButton();
        });
        document.addEventListener('mouseup', () => {
            this.syncCurrentAttributesWithCursor();
            const dataId = this.document.getAllSelectedDataIds();
            console.log(dataId, 'dataId lntgerr');
        });
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) {
                this.document.dataIds = [];
                this.document.selectAll = false;
            }
        });
        (_a = document.getElementById('fontColor')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', e => {
            e.stopPropagation();
            const colorWrapper = document.getElementById('colorWrapper');
            const fontColorPicker = document.getElementById('fontColorPicker');
            if (!colorWrapper || !fontColorPicker)
                return;
            const isVisible = colorWrapper.style.display === 'block';
            if (isVisible) {
                colorWrapper.style.display = 'none';
            }
            else {
                colorWrapper.style.display = 'block';
            }
        });
        (_b = document
            .getElementById('fontColorPicker')) === null || _b === void 0 ? void 0 : _b.addEventListener('input', event => {
            const selectedColor = event.target.value;
            const [start, end] = this.getSelectionRange();
            const indicator = document.getElementById('fontColorIndicator');
            if (indicator) {
                indicator.style.backgroundColor = selectedColor;
            }
            if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach((block) => {
                    if (this.document.dataIds.includes(block.dataId)) {
                        this.document.selectedBlockId = block.dataId;
                        let countE = 0;
                        block.pieces.forEach((obj) => {
                            countE += obj.text.length;
                        });
                        let countS = start - countE;
                        this.document.applyFontColor(countS, countE, selectedColor);
                    }
                });
            }
            else {
                if (this.debounceTimer) {
                    clearTimeout(this.debounceTimer);
                }
                this.debounceTimer = setTimeout(() => {
                    this.document.applyFontColor(start, end, selectedColor);
                }, 300);
            }
        });
        (_c = document.getElementById('colorResetFont')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
            const fontColorPicker = document.getElementById('fontColorPicker');
            const indicator = document.getElementById('fontColorIndicator');
            if (fontColorPicker) {
                fontColorPicker.value = '#000000';
                if (indicator) {
                    indicator.style.backgroundColor = '#000000';
                }
                fontColorPicker.dispatchEvent(new Event('input'));
            }
        });
        document.addEventListener('click', e => {
            var _a;
            const target = e.target;
            const colorWrapper = document.getElementById('colorWrapper');
            const colorBgWrapper = document.getElementById('colorBgWrapper');
            const fontColorBtn = document.getElementById('fontColor');
            const bgColorBtn = document.getElementById('bgColor');
            if (colorWrapper &&
                !target.closest('#colorWrapper') &&
                target !== fontColorBtn &&
                !(fontColorBtn === null || fontColorBtn === void 0 ? void 0 : fontColorBtn.contains(target))) {
                colorWrapper.style.display = 'none';
            }
            if (colorBgWrapper &&
                !target.closest('#colorBgWrapper') &&
                target !== bgColorBtn &&
                !(bgColorBtn === null || bgColorBtn === void 0 ? void 0 : bgColorBtn.contains(target))) {
                colorBgWrapper.style.display = 'none';
            }
            if (!((_a = this.editorContainer) === null || _a === void 0 ? void 0 : _a.contains(target)) &&
                !target.closest('.hyperlink-popup')) {
                this.hyperlinkHandler.hideHyperlinkViewButton();
            }
        });
        (_d = document.getElementById('bgColor')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', e => {
            e.stopPropagation();
            const colorBgWrapper = document.getElementById('colorBgWrapper');
            const bgColorPicker = document.getElementById('bgColorPicker');
            if (!colorBgWrapper || !bgColorPicker)
                return;
            const isVisible = colorBgWrapper.style.display === 'block';
            if (isVisible) {
                colorBgWrapper.style.display = 'none';
            }
            else {
                colorBgWrapper.style.display = 'block';
            }
        });
        (_e = document
            .getElementById('bgColorPicker')) === null || _e === void 0 ? void 0 : _e.addEventListener('input', event => {
            const selectedColor = event.target.value;
            const [start, end] = this.getSelectionRange();
            const indicator = document.getElementById('bgColorIndicator');
            if (indicator) {
                indicator.style.backgroundColor = selectedColor;
            }
            if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach((block) => {
                    if (this.document.dataIds.includes(block.dataId)) {
                        this.document.selectedBlockId = block.dataId;
                        let countE = 0;
                        block.pieces.forEach((obj) => {
                            countE += obj.text.length;
                        });
                        let countS = start - countE;
                        this.document.applyBgColor(countS, countE, selectedColor);
                    }
                });
            }
            else {
                if (this.debounceTimer) {
                    clearTimeout(this.debounceTimer);
                }
                this.debounceTimer = setTimeout(() => {
                    this.document.applyBgColor(start, end, selectedColor);
                }, 300);
            }
        });
        (_f = document.getElementById('colorResetBG')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => {
            const bgColorPicker = document.getElementById('bgColorPicker');
            const indicator = document.getElementById('bgColorIndicator');
            if (bgColorPicker) {
                bgColorPicker.value = '#ffffff';
                if (indicator) {
                    indicator.style.backgroundColor = '#ffffff';
                }
                bgColorPicker.dispatchEvent(new Event('input'));
            }
        });
        (_g = document.getElementById('getHtmlButton')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', e => {
            const htmlString = this.document.getHtmlContent(true);
            console.log('Editor HTML Content:', htmlString);
            this.htmlToJsonParser = new HtmlToJsonParser(htmlString);
            const jsonOutput = this.htmlToJsonParser.parse();
            console.log('htmltoJson', JSON.stringify(jsonOutput, null, 2), jsonOutput);
            this.showAcknowledgement('HTML copied to clipboard', 2000);
        });
        (_h = document.getElementById('loadHtmlButton')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', e => {
            this.undoRedoManager.saveUndoSnapshot();
            const str = strings.TEST_HTML_CODE;
            this.htmlToJsonParser = new HtmlToJsonParser(str);
            console.log(this.htmlToJsonParser, 'this.htmlToJsonParser');
            const jsonOutput = this.htmlToJsonParser.parse();
            this.document.blocks = jsonOutput;
            this.document.dataIds[0] = jsonOutput[0].dataId;
            this.document.selectedBlockId = 'data-id-1734604240404';
            this.document.emit('documentChanged', this);
            const [start] = this.getSelectionRange();
            this.document.blocks.forEach((block) => {
                if (this.document.dataIds.includes(block.dataId)) {
                    this.document.selectedBlockId = block.dataId;
                    let countE = 0;
                    block.pieces.forEach((obj) => {
                        countE += obj.text.length;
                    });
                    let countS = start - countE;
                    this.document.setFontSize(countS, countE, block.fontSize);
                }
            });
            console.log('blocks', this.document.blocks, this.document.dataIds, this.document.currentOffset);
            console.log('htmltoJson', JSON.stringify(jsonOutput, null, 2), jsonOutput);
        });
        (_j = document.getElementById('fontFamily')) === null || _j === void 0 ? void 0 : _j.addEventListener('change', e => {
            this.undoRedoManager.saveUndoSnapshot();
            const fontFamily = e.target.value;
            const [start, end] = this.getSelectionRange();
            if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach((block) => {
                    if (this.document.dataIds.includes(block.dataId)) {
                        this.document.selectedBlockId = block.dataId;
                        let countE = 0;
                        block.pieces.forEach((obj) => {
                            countE += obj.text.length;
                        });
                        let countS = start - countE;
                        this.document.setFontFamily(countS, countE, fontFamily);
                    }
                });
            }
            else {
                this.document.setFontFamily(start, end, fontFamily);
            }
        });
        (_k = document.getElementById('fontSize')) === null || _k === void 0 ? void 0 : _k.addEventListener('change', e => {
            this.undoRedoManager.saveUndoSnapshot();
            const fontSize = e.target.value;
            const [start, end] = this.getSelectionRange();
            if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach((block) => {
                    if (this.document.dataIds.includes(block.dataId)) {
                        this.document.selectedBlockId = block.dataId;
                        let countE = 0;
                        block.pieces.forEach((obj) => {
                            countE += obj.text.length;
                        });
                        let countS = start - countE;
                        this.document.setFontSize(countS, countE, fontSize);
                    }
                });
            }
            else {
                this.document.setFontSize(start, end, fontSize);
            }
        });
        (_l = document.getElementById('alignLeft')) === null || _l === void 0 ? void 0 : _l.addEventListener('click', () => {
            console.log('alignment alignLeft', this.document.dataIds);
            this.document.dataIds.forEach(obj => this.document.setAlignment('left', obj));
        });
        (_m = document.getElementById('alignCenter')) === null || _m === void 0 ? void 0 : _m.addEventListener('click', () => {
            console.log('alignment alignCenter', this.document.dataIds);
            this.document.dataIds.forEach(obj => this.document.setAlignment('center', obj));
        });
        (_o = document.getElementById('alignRight')) === null || _o === void 0 ? void 0 : _o.addEventListener('click', () => {
            console.log('alignment alignRight', this.document.dataIds);
            this.document.dataIds.forEach(obj => this.document.setAlignment('right', obj));
        });
        this.editorContainer.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && !e.altKey) {
                const key = e.key.toLowerCase();
                if (['b', 'i', 'u', 'h'].includes(key)) {
                    e.preventDefault();
                    let action = 'b';
                    switch (key) {
                        case 'b':
                            action = 'bold';
                            break;
                        case 'i':
                            action = 'italic';
                            break;
                        case 'u':
                            action = 'underline';
                            break;
                        case 'h':
                            action = 'hyperlink';
                            break;
                        default:
                            break;
                    }
                    this.handleToolbarAction(action);
                }
                if (key === 'z') {
                    e.preventDefault();
                    this.undoRedoManager.undo();
                }
                else if (key === 'y') {
                    e.preventDefault();
                    this.undoRedoManager.redo();
                }
                if (key === 'a') {
                    const dataId = this.document.handleCtrlASelection();
                    this.document.selectAll = true;
                    console.log('Selected text is inside element with data-id:', dataId);
                }
                if (e.key === 'l') {
                    e.preventDefault();
                    this.document.setAlignment('left', this.document.selectedBlockId);
                }
                else if (e.key === 'e') {
                    e.preventDefault();
                    this.document.setAlignment('center', this.document.selectedBlockId);
                }
                else if (e.key === 'r') {
                    e.preventDefault();
                    this.document.setAlignment('right', this.document.selectedBlockId);
                }
            }
        });
        document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
        this.editorContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.closest('a')) {
                e.preventDefault();
                e.stopPropagation();
                const linkElement = (target.tagName === 'A' ? target : target.closest('a'));
                this.showLinkPopup(linkElement, e.clientX, e.clientY);
            }
            else {
                this.hideLinkPopup();
            }
        });
        document.addEventListener('click', (e) => {
            if (!this.linkPopupView.isPopup(e.target)) {
                this.hideLinkPopup();
            }
        });
        this.document.emit('documentChanged', this.document);
        this.editorContainer.addEventListener('paste', (e) => {
            var _a, _b;
            this.undoRedoManager.saveUndoSnapshot();
            e.preventDefault();
            const html = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text/html');
            const [start, end] = this.getSelectionRange();
            if (end > start) {
                this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
            }
            let piecesToInsert = [];
            if (html) {
                piecesToInsert = parseHtmlToPieces(html);
            }
            else {
                const text = ((_b = e.clipboardData) === null || _b === void 0 ? void 0 : _b.getData('text/plain')) || '';
                const segments = detectUrlsInText(text);
                piecesToInsert = segments.map(segment => {
                    if (segment.isUrl && segment.url) {
                        return new Piece(segment.text, Object.assign(Object.assign({}, this.currentAttributes), { hyperlink: segment.url }));
                    }
                    else {
                        return new Piece(segment.text, Object.assign({}, this.currentAttributes));
                    }
                });
            }
            let offset = start;
            for (const p of piecesToInsert) {
                this.document.insertAt(p.text, Object.assign({}, p.attributes), offset, this.document.selectedBlockId, 0, '', 'batch');
                offset += p.text.length;
            }
            this.setCursorPosition(offset);
        });
        this.editorContainer.addEventListener('dragover', e => {
            e.preventDefault();
        });
        this.editorContainer.addEventListener('drop', (e) => {
            var _a, _b;
            e.preventDefault();
            this.undoRedoManager.saveUndoSnapshot();
            const html = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/html');
            const [start, end] = this.getSelectionRange();
            if (end > start) {
                this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
            }
            let piecesToInsert = [];
            if (html) {
                piecesToInsert = parseHtmlToPieces(html);
            }
            else {
                const text = ((_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.getData('text/plain')) || '';
                piecesToInsert = [new Piece(text, Object.assign({}, this.currentAttributes))];
            }
            let offset = start;
            for (const p of piecesToInsert) {
                this.document.insertAt(p.text, Object.assign({}, p.attributes), offset, this.document.selectedBlockId, 0, '', 'batch');
                offset += p.text.length;
            }
            this.setCursorPosition(offset);
        });
    }
    getSelectionRange() {
        const sel = saveSelection(this.editorView.container);
        if (!sel)
            return [0, 0];
        return [sel.start, sel.end];
    }
    applyFontColor(color) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (!selectedText)
            return;
    }
    handleToolbarAction(action, dataId = []) {
        const [start, end] = this.getSelectionRange();
        switch (action) {
            case 'orderedList':
                if (this.document.dataIds.length > 1) {
                    this.document.toggleOrderedListForMultipleBlocks(this.document.dataIds);
                }
                else {
                    const currentBlockId = this.document.selectedBlockId || this.document.dataIds[0];
                    this.document.toggleOrderedList(currentBlockId);
                }
                this.document.updateOrderedListNumbers();
                break;
            case 'unorderedList':
                this.document.dataIds.forEach((id) => {
                    this.document.toggleUnorderedList(id);
                });
                break;
            case 'image':
                this.imageHandler.insertImage();
                break;
            default:
                if (start < end) {
                    this.undoRedoManager.saveUndoSnapshot();
                    switch (action) {
                        case 'bold':
                            if (this.document.dataIds.length > 1) {
                                this.document.blocks.forEach((block) => {
                                    if (this.document.dataIds.includes(block.dataId)) {
                                        this.document.selectedBlockId = block.dataId;
                                        let countE = 0;
                                        block.pieces.forEach((obj) => {
                                            countE += obj.text.length;
                                        });
                                        let countS = start - countE;
                                        this.document.toggleBoldRange(countS, countE);
                                    }
                                });
                            }
                            else {
                                this.document.toggleBoldRange(start, end);
                            }
                            break;
                        case 'italic':
                            if (this.document.dataIds.length > 1) {
                                this.document.blocks.forEach((block) => {
                                    if (this.document.dataIds.includes(block.dataId)) {
                                        this.document.selectedBlockId = block.dataId;
                                        let countE = 0;
                                        block.pieces.forEach((obj) => {
                                            countE += obj.text.length;
                                        });
                                        let countS = start - countE;
                                        this.document.toggleItalicRange(countS, countE);
                                    }
                                });
                            }
                            else {
                                this.document.toggleItalicRange(start, end);
                            }
                            break;
                        case 'underline':
                            if (this.document.dataIds.length > 1) {
                                this.document.blocks.forEach((block) => {
                                    if (this.document.dataIds.includes(block.dataId)) {
                                        this.document.selectedBlockId = block.dataId;
                                        let countE = 0;
                                        block.pieces.forEach((obj) => {
                                            countE += obj.text.length;
                                        });
                                        let countS = start - countE;
                                        this.document.toggleUnderlineRange(countS, countE);
                                    }
                                });
                            }
                            else {
                                this.document.toggleUnderlineRange(start, end);
                            }
                            break;
                        case 'strikethrough':
                            if (this.document.dataIds.length > 1) {
                                this.document.blocks.forEach((block) => {
                                    if (this.document.dataIds.includes(block.dataId)) {
                                        this.document.selectedBlockId = block.dataId;
                                        let countE = 0;
                                        block.pieces.forEach((obj) => {
                                            countE += obj.text.length;
                                        });
                                        let countS = start - countE;
                                        this.document.toggleStrikethroughRange(countS, countE);
                                    }
                                });
                            }
                            else {
                                this.document.toggleStrikethroughRange(start, end);
                            }
                            break;
                        case 'hyperlink':
                            this.hyperlinkHandler.hanldeHyperlinkClick(start, end, this.document.currentOffset, this.document.selectedBlockId, this.document.blocks);
                            break;
                    }
                }
                else {
                    this.currentAttributes[action] =
                        !this.currentAttributes[action];
                    this.manualOverride = true;
                }
                break;
        }
        this.toolbarView.updateActiveStates(this.currentAttributes);
    }
    handleSelectionChange() {
        var _a, _b;
        const selection = window.getSelection();
        if (!selection ||
            selection.rangeCount === 0 ||
            !((_a = this.editorContainer) === null || _a === void 0 ? void 0 : _a.contains(selection.anchorNode))) {
            this.hyperlinkHandler.hideHyperlinkViewButton();
            this.popupToolbarView.hide();
            return;
        }
        const [start] = this.getSelectionRange();
        this.imageHandler.currentCursorLocation = start;
        if (selection.isCollapsed) {
            this.document.dataIds = [];
            this.document.selectAll = false;
            this.popupToolbarView.hide();
        }
        else {
            this.document.getAllSelectedDataIds();
            if (this.document.dataIds.length === this.document.blocks.length &&
                this.document.blocks.length > 0) {
                this.document.selectAll = true;
            }
            this.popupToolbarView.show(selection);
        }
        if (!selection || selection.rangeCount === 0) {
            return;
        }
        if (selection && selection.isCollapsed === true) {
            this.document.dataIds = [];
            this.document.selectAll = false;
        }
        const range = selection.getRangeAt(0);
        const parentBlock = ((_b = range.startContainer.parentElement) === null || _b === void 0 ? void 0 : _b.closest('[data-id]')) ||
            range.startContainer;
        if (parentBlock instanceof HTMLElement) {
            this.document.selectedBlockId =
                parentBlock.getAttribute('data-id') ||
                    (range.startContainer instanceof HTMLElement
                        ? range.startContainer.getAttribute('data-id')
                        : null);
        }
        this.syncCurrentAttributesWithCursor();
    }
    handleKeydown(e) {
        var _a, _b;
        const [start, end] = this.getSelectionRange();
        this.imageHandler.currentCursorLocation = start;
        if (e.key === 'Enter') {
            e.preventDefault();
            this.undoRedoManager.saveUndoSnapshot();
            const uniqueId = `data-id-${Date.now()}`;
            const currentBlockIndex = this.document.blocks.findIndex((block) => block.dataId === this.document.selectedBlockId);
            const currentBlock = this.document.blocks[currentBlockIndex];
            const lastPiece = ((_a = currentBlock === null || currentBlock === void 0 ? void 0 : currentBlock.pieces) === null || _a === void 0 ? void 0 : _a.length) > 0
                ? currentBlock.pieces[currentBlock.pieces.length - 1]
                : null;
            const lastPieceAttributes = lastPiece
                ? Object.assign({}, lastPiece.attributes) : {
                fontFamily: 'Arial',
                fontSize: '16px',
                fontColor: '#000000',
                bgColor: '#ffffff',
                bold: false,
                italic: false,
                underline: false,
                strikethrough: false,
            };
            if (currentBlock && currentBlock.type === 'image') {
                this.document.blocks.splice(currentBlockIndex + 1, 0, {
                    dataId: uniqueId,
                    class: 'paragraph-block',
                    pieces: [new Piece('\u200B', lastPieceAttributes)],
                    type: 'text',
                });
                this.document.emit('documentChanged', this);
                this.imageHandler.setCursorPostion(1, uniqueId);
            }
            else if (currentBlock &&
                (currentBlock.listType === 'ol' ||
                    currentBlock.listType === 'ul' ||
                    currentBlock.listType === 'li')) {
                let newBlock = {
                    dataId: uniqueId,
                    class: 'paragraph-block',
                    pieces: [new Piece('\u200B', lastPieceAttributes)],
                    type: 'text',
                };
                let listParentId = '';
                if (currentBlock.listType === 'ol') {
                    newBlock.listType = 'li';
                    newBlock.listStart = currentBlock.listStart + 1;
                    newBlock.parentId = currentBlock.dataId;
                    listParentId = currentBlock.dataId;
                }
                else if (currentBlock.listType === 'li') {
                    newBlock.listType = 'li';
                    newBlock.listStart = currentBlock.listStart + 1;
                    newBlock.parentId = currentBlock.parentId;
                    listParentId = currentBlock.parentId;
                }
                else if (currentBlock.listType === 'ul') {
                    newBlock.listType = 'ul';
                    newBlock.parentId = currentBlock.parentId || currentBlock.dataId;
                }
                this.document.blocks.splice(currentBlockIndex + 1, 0, newBlock);
                if (currentBlock.listType === 'ol' || currentBlock.listType === 'li') {
                    for (let i = currentBlockIndex + 2; i < this.document.blocks.length; i++) {
                        const block = this.document.blocks[i];
                        if (block.listType === 'li' && block.parentId === listParentId) {
                            block.listStart += 1;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            else {
                const cursorBlock = this.getCurrentCursorBlock();
                const cursorBlockId = cursorBlock === null || cursorBlock === void 0 ? void 0 : cursorBlock.toString();
                if (cursorBlockId && currentBlock && currentBlock.type === 'text') {
                    const fullText = currentBlock.pieces.map((p) => p.text).join('');
                    const cursorOffset = start - this.document.currentOffset;
                    const beforeText = fullText.slice(0, cursorOffset);
                    const afterText = fullText.slice(cursorOffset);
                    currentBlock.pieces = [
                        new Piece(beforeText || '\u200B', lastPieceAttributes),
                    ];
                    const newPieces = afterText && afterText.trim().length > 0
                        ? [new Piece(afterText, lastPieceAttributes)]
                        : [new Piece('\u200B', lastPieceAttributes)];
                    const updatedBlock = this.addBlockAfter(this.document.blocks, cursorBlockId, {
                        dataId: uniqueId,
                        class: 'paragraph-block',
                        pieces: newPieces,
                        type: 'text',
                    });
                    this.document.blocks = updatedBlock;
                }
                else {
                    this.document.blocks.push({
                        dataId: uniqueId,
                        class: 'paragraph-block',
                        pieces: [new Piece('\u200B', lastPieceAttributes)],
                        type: 'text',
                    });
                }
            }
            this.syncCurrentAttributesWithCursor();
            this.editorView.render();
            this.setCursorPosition(end + 1, uniqueId);
        }
        else if (e.key === 'Backspace') {
            e.preventDefault();
            if (this.imageHandler.isImageHighlighted) {
                const currentBlockIndex = this.document.blocks.findIndex((block) => block.dataId === this.imageHandler.highLightedImageDataId);
                this.imageHandler.deleteImage();
                this.imageHandler.setCursorPostion(1, this.document.blocks[currentBlockIndex - 1].dataId);
                return;
            }
            const selection = window.getSelection();
            console.log(selection, 'selection lntgerr');
            const isAllTextSelected = this.document.selectAll ||
                (this.document.dataIds.length === this.document.blocks.length &&
                    this.document.dataIds.length > 0);
            if ((isAllTextSelected || this.document.dataIds.length > 1) &&
                !((_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.isCollapsed)) {
                this.undoRedoManager.saveUndoSnapshot();
                const firstDeletedId = this.document.dataIds[0];
                const deletedIndex = this.document.blocks.findIndex((block) => block.dataId === firstDeletedId);
                this.document.deleteBlocks();
                let targetBlockId = null;
                let cursorPos = 0;
                if (this.document.blocks.length === 0) {
                    const newId = `data-id-${Date.now()}`;
                    this.document.blocks.push({
                        dataId: newId,
                        class: 'paragraph-block',
                        pieces: [new Piece(' ')],
                        type: 'text',
                    });
                    targetBlockId = newId;
                    cursorPos = 0;
                    this.editorView.render();
                }
                else if (deletedIndex < this.document.blocks.length) {
                    targetBlockId = this.document.blocks[deletedIndex].dataId;
                    cursorPos = 0;
                }
                else {
                    const prevBlock = this.document.blocks[this.document.blocks.length - 1];
                    targetBlockId = prevBlock.dataId;
                    cursorPos = prevBlock.pieces.reduce((acc, p) => acc + p.text.length, 0);
                }
                this.setCursorPosition(cursorPos, targetBlockId);
                return;
            }
            if (end > start) {
                this.undoRedoManager.saveUndoSnapshot();
                const adjustedOffset = Math.min(this.document.currentOffset, start);
                this.document.deleteRange(start, end, this.document.selectedBlockId, adjustedOffset, true);
                this.setCursorPosition(start - 1);
                const index = this.document.blocks.findIndex((block) => block.dataId === this.document.selectedBlockId);
                console.log(index, 'index lntgerr');
                const chkBlock = document.querySelector(`[data-id="${this.document.selectedBlockId}"]`);
                if (chkBlock === null) {
                    let listStart = 0;
                    console.log(listStart, ' listStart lntgerr');
                    const _blocks = this.document.blocks.map((block, index) => {
                        if ((block === null || block === void 0 ? void 0 : block.listType) !== undefined || (block === null || block === void 0 ? void 0 : block.listType) !== null) {
                            if ((block === null || block === void 0 ? void 0 : block.listType) === 'ol') {
                                listStart = 1;
                                block.listStart = 1;
                            }
                            else if ((block === null || block === void 0 ? void 0 : block.listType) === 'li') {
                                listStart = listStart + 1;
                                block.listStart = listStart;
                            }
                        }
                        return block;
                    });
                    console.log(_blocks, 'blocks lntgerr');
                    this.document.emit('documentChanged', this);
                }
            }
            else if (start === end && start > 0) {
                this.document.deleteRange(start - 1, start, this.document.selectedBlockId, this.document.currentOffset, true);
                this.setCursorPosition(start - 1);
            }
        }
        else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            if (end > start) {
                this.undoRedoManager.saveUndoSnapshot();
                this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset, false);
            }
            console.log('insertat', e.key, this.currentAttributes, start, this.document.selectedBlockId, this.document.currentOffset, '', '', !e.isTrusted || false);
            this.document.insertAt(e.key, this.currentAttributes, start, this.document.selectedBlockId, this.document.currentOffset, '', '', !e.isTrusted || false);
            this.setCursorPosition(start + 1);
        }
        else if (e.key === 'Delete') {
            e.preventDefault();
            if (start === end) {
                this.undoRedoManager.saveUndoSnapshot();
                if (end > start) {
                    const adjustedOffset = Math.min(this.document.currentOffset, start);
                    this.document.deleteRange(start, end, this.document.selectedBlockId, adjustedOffset);
                    this.setCursorPosition(start);
                }
                else if (end > start) {
                    this.undoRedoManager.saveUndoSnapshot();
                    this.document.deleteRange(start, end, this.document.selectedBlockId);
                    return;
                }
                const blockIndex = this.document.blocks.findIndex((block) => block.dataId === this.document.selectedBlockId);
                if (blockIndex === -1)
                    return;
                const block = this.document.blocks[blockIndex];
                const blockTextLength = block.pieces.reduce((acc, p) => acc + p.text.length, 0);
                const relPos = start - this.document.currentOffset;
                if (relPos < blockTextLength) {
                    this.document.deleteRange(start, start + 1, this.document.selectedBlockId, this.document.currentOffset, false);
                    this.setCursorPosition(start);
                }
                else if (end > start) {
                    this.undoRedoManager.saveUndoSnapshot();
                    this.document.deleteRange(start, end, this.document.selectedBlockId);
                    this.setCursorPosition(start);
                }
            }
            this.hyperlinkHandler.hideHyperlinkViewButton();
        }
    }
    extractTextFromDataId(dataId) {
        const selection = window.getSelection();
        console.log('selection::', selection);
        if (!selection || selection.rangeCount === 0) {
            return { remainingText: '', piece: null };
        }
        const range = selection.getRangeAt(0);
        const cursorNode = range.startContainer;
        let fText = '';
        let count = 0;
        console.log(count, 'count lntgerr');
        const _block = this.document.blocks.filter((block) => {
            if (block.dataId === dataId) {
                return block;
            }
        });
        const element = document.querySelector(`[data-id="${dataId}"]`);
        const textPosition = this.document.getCursorOffsetInParent(`[data-id="${dataId}"]`);
        let _piece = [];
        let index = 0;
        _block[0].pieces.forEach((obj, i) => {
            fText += obj.text;
            if ((textPosition === null || textPosition === void 0 ? void 0 : textPosition.innerText) === obj.text) {
                index = i;
                _piece.push(obj);
            }
        });
        if (_block[0].pieces.length > 1) {
            _block[0].pieces.forEach((obj, i) => {
                if (index < i) {
                    _piece.push(obj);
                }
            });
        }
        if (!element) {
            console.error(`Element with data-id "${dataId}" not found.`);
            return { remainingText: '', piece: null };
        }
        if (!element.contains(cursorNode)) {
            console.error(`Cursor is not inside the element with data-id "${dataId}".`);
            return { remainingText: '', piece: null };
        }
        const fullText = fText;
        const cursorOffset = textPosition === null || textPosition === void 0 ? void 0 : textPosition.offset;
        const remainingText = fullText.slice(cursorOffset);
        const newContent = fullText.slice(0, cursorOffset);
        element.textContent = newContent;
        return { remainingText: remainingText, piece: _piece };
    }
    getCurrentCursorBlock() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return null;
        }
        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        const elementWithId = container.nodeType === Node.TEXT_NODE
            ? container.parentElement
            : container;
        let dataIdElement = null;
        if (elementWithId && elementWithId instanceof Element) {
            dataIdElement = elementWithId.closest('[data-id]');
        }
        return (dataIdElement === null || dataIdElement === void 0 ? void 0 : dataIdElement.getAttribute('data-id')) || null;
    }
    addBlockAfter(data, targetDataId, newBlock) {
        const targetIndex = data.findIndex(block => block.dataId === targetDataId);
        if (targetIndex === -1) {
            console.error(`Block with dataId "${targetDataId}" not found.`);
            return data;
        }
        const updatedData = [
            ...data.slice(0, targetIndex + 1),
            newBlock,
            ...data.slice(targetIndex + 1),
        ];
        return updatedData;
    }
    syncCurrentAttributesWithCursor() {
        var _a;
        const [start, end] = this.getSelectionRange();
        console.log('log1', { start: start, end: end });
        const blockIndex = this.document.blocks.findIndex((block) => block.dataId === this.document.selectedBlockId);
        if (((_a = this.document.blocks[blockIndex]) === null || _a === void 0 ? void 0 : _a.type) === 'image') {
            this.imageHandler.addStyleToImage(this.document.selectedBlockId || '');
        }
        else {
            if (this.imageHandler.isImageHighlighted) {
                this.imageHandler.clearImageStyling();
            }
        }
        if (start === end) {
            const piece = this.document.findPieceAtOffset(start, this.document.selectedBlockId);
            if (piece) {
                if (piece !== this.lastPiece) {
                    this.manualOverride = false;
                    this.lastPiece = piece;
                }
                if (!this.manualOverride) {
                    this.currentAttributes = {
                        bold: piece.attributes.bold,
                        italic: piece.attributes.italic,
                        underline: piece.attributes.underline,
                        strikethrough: piece.attributes.strikethrough || false,
                        hyperlink: piece.attributes.hyperlink || false,
                        fontFamily: piece.attributes.fontFamily,
                        fontSize: piece.attributes.fontSize,
                        fontColor: piece.attributes.fontColor,
                        bgColor: piece.attributes.bgColor,
                    };
                    this.toolbarView.updateActiveStates(this.currentAttributes);
                    this.popupToolbarView.updateActiveStates(this.currentAttributes);
                }
                this.hyperlinkHandler.hideHyperlinkViewButton();
            }
            else {
                this.hyperlinkHandler.hideHyperlinkViewButton();
                if (!this.manualOverride) {
                    this.currentAttributes = {
                        bold: false,
                        italic: false,
                        underline: false,
                        strikethrough: false,
                        hyperlink: false,
                    };
                    this.toolbarView.updateActiveStates(this.currentAttributes);
                    this.popupToolbarView.updateActiveStates(this.currentAttributes);
                }
                this.lastPiece = null;
            }
        }
        else {
            this.hyperlinkHandler.hideHyperlinkViewButton();
            const allBold = this.document.isRangeEntirelyAttribute(start, end, 'bold');
            const allItalic = this.document.isRangeEntirelyAttribute(start, end, 'italic');
            const allUnderline = this.document.isRangeEntirelyAttribute(start, end, 'underline');
            const allStrikethrough = this.document.isRangeEntirelyAttribute(start, end, 'strikethrough');
            this.currentAttributes = {
                bold: allBold,
                italic: allItalic,
                underline: allUnderline,
                strikethrough: allStrikethrough,
                hyperlink: false,
            };
            this.toolbarView.updateActiveStates(this.currentAttributes);
            this.popupToolbarView.updateActiveStates(this.currentAttributes);
        }
    }
    setCursorPosition(position, dataId = '') {
        if (dataId === '')
            this.editorView.container.focus();
        else {
            const divDataid = document.querySelector('[data-id="' + dataId + '"]');
            if (divDataid) {
                divDataid.focus();
            }
        }
        const sel = window.getSelection();
        if (!sel)
            return;
        const range = document.createRange();
        let charIndex = 0;
        const nodeStack = [this.editorView.container];
        let node;
        while ((node = nodeStack.pop())) {
            if (node.nodeType === 3) {
                const textNode = node;
                const nextCharIndex = charIndex + textNode.length;
                if (position >= charIndex && position <= nextCharIndex) {
                    range.setStart(textNode, position - charIndex);
                    range.collapse(true);
                    break;
                }
                charIndex = nextCharIndex;
            }
            else if (node.tagName === 'BR') {
                if (position === charIndex) {
                    range.setStartBefore(node);
                    range.collapse(true);
                    break;
                }
                charIndex++;
            }
            else {
                const el = node;
                let i = el.childNodes.length;
                while (i--) {
                    nodeStack.push(el.childNodes[i]);
                }
            }
        }
        sel.removeAllRanges();
        sel.addRange(range);
    }
    showAcknowledgement(message, durationMs = 2000) {
        const existing = document.getElementById(strings.TOAST_ID);
        if (existing) {
            existing.remove();
        }
        const toast = document.createElement('div');
        toast.id = strings.TOAST_ID;
        toast.className = 'ti-toast';
        toast.textContent = message || strings.TOAST_DEFAULT_MESSAGE;
        document.body.appendChild(toast);
        toast.offsetHeight;
        toast.classList.add(strings.TOAST_SHOW_CLASS);
        setTimeout(() => {
            toast.classList.remove(strings.TOAST_SHOW_CLASS);
            setTimeout(() => toast.remove(), 200);
        }, durationMs || strings.TOAST_DEFAULT_DURATION_MS);
    }
    showLinkPopup(linkElement, x, y) {
        this.linkPopupView.show(linkElement, x, y);
    }
    hideLinkPopup() {
        this.linkPopupView.hide();
    }
    openLink(url) {
        window.open(url, '_blank');
        this.hideLinkPopup();
    }
    unlinkText(linkElement) {
        this.undoRedoManager.saveUndoSnapshot();
        const linkText = linkElement.textContent || '';
        const documentText = this.editorView.container.textContent || '';
        const linkIndex = documentText.indexOf(linkText);
        if (linkIndex !== -1) {
            this.document.formatAttribute(linkIndex, linkIndex + linkText.length, 'hyperlink', false);
            this.editorView.render();
        }
        this.hideLinkPopup();
    }
    onContentChange(callback) {
        this.on('contentChange', callback);
    }
    getContent() {
        return this.document.getHtmlContent() || '';
    }
    getTextContent() {
        var _a;
        return ((_a = this.editorContainer) === null || _a === void 0 ? void 0 : _a.textContent) || '';
    }
}
window.TextIgniter = TextIgniter;
export { TextIgniter };

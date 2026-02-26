// ../core/dist/utils/events.js
var EventEmitter = class {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    if (!this.events[event])
      this.events[event] = [];
    this.events[event].push(listener);
  }
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(data));
    }
  }
};
var events_default = EventEmitter;

// ../core/dist/piece.js
var Piece = class _Piece {
  constructor(text, attributes = {}) {
    this.text = text;
    const fontFamilySelect = document.getElementById("fontFamily");
    const fontSizeSelect = document.getElementById("fontSize");
    let selectedFontFamilyValue = "Arial";
    let selectedFontSizeValue = "16px";
    let selectedFontColor = document.getElementById("fontColorPicker");
    let selectedBgColor = document.getElementById("bgColorPicker");
    if (fontFamilySelect) {
      selectedFontFamilyValue = fontFamilySelect.value;
    }
    if (fontSizeSelect) {
      selectedFontSizeValue = fontSizeSelect.value;
    }
    const fontColorValue = attributes.fontColor || (selectedFontColor ? selectedFontColor.value : "#000000");
    const bgColorValue = attributes.bgColor || (selectedBgColor ? selectedBgColor.value : "#ffffff");
    this.attributes = {
      bold: attributes.bold || false,
      italic: attributes.italic || false,
      underline: attributes.underline || false,
      strikethrough: attributes.strikethrough || false,
      undo: attributes.undo || false,
      redo: attributes.redo || false,
      fontFamily: attributes.fontFamily || selectedFontFamilyValue,
      fontSize: attributes.fontSize || selectedFontSizeValue,
      hyperlink: attributes.hyperlink || false,
      fontColor: fontColorValue,
      bgColor: bgColorValue
    };
  }
  isBold() {
    return this.attributes.bold;
  }
  setBold(v) {
    this.attributes.bold = v;
  }
  isItalic() {
    return this.attributes.italic;
  }
  isUndo() {
    return this.attributes.undo;
  }
  isRedo() {
    return this.attributes.redo;
  }
  setItalic(v) {
    this.attributes.italic = v;
  }
  isUnderline() {
    return this.attributes.underline;
  }
  setUnderline(v) {
    this.attributes.underline = v;
  }
  isStrikethrough() {
    return this.attributes.strikethrough || false;
  }
  setStrikethrough(v) {
    this.attributes.strikethrough = v;
  }
  setUndo(v) {
    this.attributes.undo = v;
  }
  setRedo(v) {
    this.attributes.redo = v;
  }
  clone() {
    return new _Piece(this.text, Object.assign({}, this.attributes));
  }
  hasSameAttributes(other) {
    return this.attributes.bold === other.attributes.bold && this.attributes.italic === other.attributes.italic && this.attributes.underline === other.attributes.underline && (this.attributes.strikethrough || false) === (other.attributes.strikethrough || false) && this.attributes.undo === other.attributes.undo && this.attributes.redo === other.attributes.redo && this.attributes.fontFamily === other.attributes.fontFamily && this.attributes.fontSize === other.attributes.fontSize && this.attributes.italic === other.attributes.italic && this.attributes.underline === other.attributes.underline && this.attributes.hyperlink === other.attributes.hyperlink && this.attributes.fontColor === other.attributes.fontColor && this.attributes.bgColor === other.attributes.bgColor;
  }
  getHyperlink() {
    return this.attributes.hyperlink || false;
  }
  setHyperlink(url) {
    this.attributes.hyperlink = url;
  }
};
var piece_default = Piece;

// ../core/dist/textDocument.js
var TextDocument = class extends events_default {
  get selectedBlockId() {
    return this._selectedBlockId;
  }
  set selectedBlockId(value) {
    if (this._selectedBlockId !== value) {
      this._selectedBlockId = value;
      const editorOffset = this.getCursorOffset(document.querySelector('[id="editor"]'));
      const paraOffset = this.getCursorOffset(document.querySelector('[data-id="' + value + '"]'));
      this.currentOffset = editorOffset - paraOffset;
    }
  }
  constructor() {
    super();
    this.dataIds = [];
    this.selectAll = false;
    this._selectedBlockId = null;
    this.pieces = [new piece_default("")];
    this.blocks = [
      {
        type: "text",
        dataId: "data-id-1734604240404",
        class: "paragraph-block",
        alignment: "left",
        pieces: [new piece_default("\u200B")]
      }
    ];
    this.selectedBlockId = "data-id-1734604240404";
    this.currentOffset = 0;
  }
  setEditorView(editorView) {
    this.editorView = editorView;
  }
  getPlainText() {
    return this.pieces.map((p) => p.text).join("");
  }
  setUndoRedoManager(undoRedoManager) {
    this.undoRedoManager = undoRedoManager;
  }
  insertAt(text, attributes, position, dataId = "", currentOffset = 0, id = "", actionType = "", isSynthetic = false) {
    if (!isSynthetic && actionType !== "batch") {
      this.undoRedoManager.saveUndoSnapshot();
    }
    console.log("inserted,", { start: position, text });
    console.log("inserted,", this.blocks);
    let offset = 0;
    let newPieces = [];
    let inserted = false;
    let index = 0;
    if (dataId !== "" && dataId !== null) {
      index = this.blocks.findIndex((block) => block.dataId === dataId);
      offset = this.currentOffset;
    }
    for (let piece of this.blocks[index].pieces) {
      const pieceEnd = offset + piece.text.length;
      if (!inserted && position <= pieceEnd) {
        const relPos = position - offset;
        if (relPos > 0) {
          newPieces.push(new piece_default(piece.text.slice(0, relPos), Object.assign({}, piece.attributes)));
        }
        newPieces.push(new piece_default(text, {
          bold: attributes.bold || false,
          italic: attributes.italic || false,
          underline: attributes.underline || false,
          strikethrough: attributes.strikethrough || false,
          hyperlink: attributes.hyperlink || false
        }));
        if (relPos < piece.text.length) {
          newPieces.push(new piece_default(piece.text.slice(relPos), Object.assign({}, piece.attributes)));
        }
        inserted = true;
      } else {
        newPieces.push(piece.clone());
      }
      offset = pieceEnd;
    }
    if (!inserted) {
      const lastPiece = newPieces[newPieces.length - 1];
      if (lastPiece && lastPiece.hasSameAttributes(new piece_default("", {
        bold: attributes.bold || false,
        italic: attributes.italic || false,
        underline: attributes.underline || false,
        strikethrough: attributes.strikethrough || false,
        hyperlink: attributes.hyperlink || false
      }))) {
        lastPiece.text += text;
      } else {
        newPieces.push(new piece_default(text, {
          bold: attributes.bold || false,
          italic: attributes.italic || false,
          underline: attributes.underline || false,
          strikethrough: attributes.strikethrough || false,
          hyperlink: attributes.hyperlink || false
        }));
      }
    }
    let _data = this.mergePieces(newPieces);
    this.blocks[index].pieces = _data;
    console.log({ position });
    this.emit("documentChanged", this);
  }
  deleteRange(start, end, dataId = "", currentOffset = 0, isBackspace = false) {
    console.log("deleted2,", { start, end });
    if (start === end)
      return;
    let newPieces = [];
    let offset = 0;
    let index = 0;
    let runBackspace = false;
    if (dataId !== "" && dataId !== null) {
      index = this.blocks.findIndex((block) => block.dataId === dataId);
      if (index === -1)
        return;
      offset = currentOffset;
    }
    let previousTextBlockIndex = -1;
    if (isBackspace && start === offset && index > 0 && end === start) {
      if (index - 1 >= 0 && this.blocks[index - 1].type === "image") {
        previousTextBlockIndex = index - 2;
      } else {
        previousTextBlockIndex = index - 1;
      }
      if (previousTextBlockIndex >= 0 && this.blocks[previousTextBlockIndex]) {
        for (let piece1 of this.blocks[previousTextBlockIndex].pieces) {
          newPieces.push(piece1.clone());
          runBackspace = true;
        }
      }
    }
    for (let piece of this.blocks[index].pieces) {
      const pieceEnd = offset + piece.text.length;
      const pieceStart = offset;
      if (pieceEnd <= start || pieceStart >= end) {
        newPieces.push(piece.clone());
      } else {
        const pieceText = piece.text;
        if (start > pieceStart) {
          const beforeText = pieceText.slice(0, start - pieceStart);
          if (beforeText.length > 0) {
            newPieces.push(new piece_default(beforeText, Object.assign({}, piece.attributes)));
          }
        }
        if (end < pieceEnd) {
          const afterText = pieceText.slice(end - pieceStart);
          if (afterText.length > 0) {
            newPieces.push(new piece_default(afterText, Object.assign({}, piece.attributes)));
          }
        }
      }
      offset = pieceEnd;
    }
    let _data = this.mergePieces(newPieces);
    let listItemDeleted = false;
    if (runBackspace && previousTextBlockIndex >= 0) {
      if (this.blocks[index] && (this.blocks[index].listType === "ol" || this.blocks[index].listType === "li")) {
        listItemDeleted = true;
      }
      this.blocks[previousTextBlockIndex].pieces = _data;
      this.blocks.splice(index, 1);
    } else {
      if (_data.length === 0) {
        if (this.blocks.length > 1) {
          if (this.blocks[index] && (this.blocks[index].listType === "ol" || this.blocks[index].listType === "li")) {
            listItemDeleted = true;
          }
          this.blocks.splice(index, 1);
        } else {
          _data = [new piece_default(" ")];
          this.blocks[index].pieces = _data;
        }
      } else {
        this.blocks[index].pieces = _data;
      }
    }
    if (listItemDeleted) {
      this.updateOrderedListNumbers();
    }
    this.emit("documentChanged", this);
  }
  deleteBlocks() {
    const listItemsDeleted = this.blocks.some((block) => {
      return this.dataIds.includes(block.dataId) && (block.listType === "ol" || block.listType === "li");
    });
    this.blocks = this.blocks.filter((block) => {
      if (!this.dataIds.includes(block.dataId)) {
        return block;
      }
    });
    this.dataIds = [];
    this.selectAll = false;
    if (this.blocks.length === 0) {
      this.blocks.push({
        dataId: `data-id-${Date.now()}`,
        class: "paragraph-block",
        type: "text",
        pieces: [new piece_default("\u200B")]
      });
    }
    if (listItemsDeleted) {
      this.updateOrderedListNumbers();
    }
    this.emit("documentChanged", this);
  }
  getSelectedTextDataId() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }
    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    const elementWithId = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
    const dataIdElement = elementWithId.closest("[data-id]");
    return (dataIdElement === null || dataIdElement === void 0 ? void 0 : dataIdElement.getAttribute("data-id")) || null;
  }
  getAllSelectedDataIds() {
    var _a;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return [];
    }
    const range = selection.getRangeAt(0);
    const selectedIds = [];
    const iterator = document.createNodeIterator(range.commonAncestorContainer, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let currentNode;
    while (currentNode = iterator.nextNode()) {
      if (range.intersectsNode(currentNode)) {
        const element = currentNode.nodeType === Node.TEXT_NODE ? currentNode.parentElement : currentNode;
        const dataId = (_a = element === null || element === void 0 ? void 0 : element.closest("[data-id]")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id");
        if (dataId && !selectedIds.includes(dataId)) {
          selectedIds.push(dataId);
        }
      }
    }
    this.removeExclusiveEndBlock(range, selectedIds);
    this.dataIds = selectedIds;
    console.log("selected id 3", this.dataIds, selectedIds);
    return selectedIds;
  }
  handleCtrlASelection() {
    const selectedDataIds = [];
    const editor = document.getElementById("editor");
    if (editor) {
      const childNodes = editor.querySelectorAll("[data-id]");
      childNodes.forEach((node) => {
        const dataId = node.getAttribute("data-id");
        if (dataId && !selectedDataIds.includes(dataId)) {
          selectedDataIds.push(dataId);
        }
      });
    }
    this.dataIds = selectedDataIds;
    console.log("selected id 2", this.dataIds, selectedDataIds);
    return selectedDataIds;
  }
  getSelectedDataIds() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return [];
    }
    const range = selection.getRangeAt(0);
    const selectedIds = [];
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    const startDataId = this.getDataIdFromNode(startContainer);
    const endDataId = this.getDataIdFromNode(endContainer);
    if (startDataId && !selectedIds.includes(startDataId)) {
      selectedIds.push(startDataId);
    }
    if (endDataId && !selectedIds.includes(endDataId)) {
      selectedIds.push(endDataId);
    }
    this.removeExclusiveEndBlock(range, selectedIds);
    this.dataIds = selectedIds;
    console.log("selected id 1", this.dataIds, selectedIds);
    return selectedIds;
  }
  getDataIdFromNode(node) {
    var _a;
    const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    return ((_a = element === null || element === void 0 ? void 0 : element.closest("[data-id]")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id")) || null;
  }
  getCursorOffset(container) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return -1;
    }
    const range = selection.getRangeAt(0);
    let offset = 0;
    const traverseNodes = (node) => {
      if (node === range.startContainer) {
        offset += range.startOffset;
        return true;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        offset += (node.textContent || "").length;
      }
      for (const child of Array.from(node.childNodes)) {
        if (traverseNodes(child)) {
          return true;
        }
      }
      return false;
    };
    traverseNodes(container);
    return offset;
  }
  formatAttribute(start, end, attribute, value) {
    console.log("formatAttribute", start, end, attribute, value);
    let newPieces = [];
    let offset = 0;
    let index = -1;
    if (this.selectedBlockId !== "" && this.selectedBlockId !== null) {
      index = this.blocks.findIndex((block) => block.dataId === this.selectedBlockId);
      if (index === -1)
        return;
      offset = this.currentOffset;
    }
    for (let piece of this.blocks[index].pieces) {
      const pieceEnd = offset + piece.text.length;
      if (pieceEnd <= start || offset >= end) {
        newPieces.push(piece.clone());
      } else {
        const pieceStart = offset;
        const pieceText = piece.text;
        const startInPiece = Math.max(start - pieceStart, 0);
        const endInPiece = Math.min(end - pieceStart, pieceText.length);
        if (startInPiece > 0) {
          newPieces.push(new piece_default(pieceText.slice(0, startInPiece), Object.assign({}, piece.attributes)));
        }
        const selectedPiece = new piece_default(pieceText.slice(startInPiece, endInPiece), Object.assign({}, piece.attributes));
        if ((attribute === "bold" || attribute === "italic" || attribute === "underline" || attribute === "strikethrough" || attribute === "undo" || attribute === "redo" || attribute === "hyperlink") && typeof value === "boolean") {
          selectedPiece.attributes[attribute] = value;
        } else if ((attribute === "fontFamily" || attribute === "fontSize" || attribute === "hyperlink" || attribute === "fontColor" || attribute === "bgColor") && typeof value === "string") {
          selectedPiece.attributes[attribute] = value;
        }
        newPieces.push(selectedPiece);
        if (endInPiece < pieceText.length) {
          newPieces.push(new piece_default(pieceText.slice(endInPiece), Object.assign({}, piece.attributes)));
        }
      }
      offset = pieceEnd;
    }
    const _data = this.mergePieces(newPieces);
    this.blocks[index].pieces = _data;
    this.emit("documentChanged", this);
  }
  toggleOrderedList(dataId, id = "") {
    const index = this.blocks.findIndex((block2) => block2.dataId === dataId);
    if (index === -1)
      return;
    const block = this.blocks[index];
    if (block.listType === "ol" || block.listType === "li") {
      block.listType = null;
      block.listStart = void 0;
      block.parentId = void 0;
    } else {
      block.listType = "ol";
      block.listStart = 1;
      block.parentId = block.dataId;
    }
    this.updateOrderedListNumbers();
    this.emit("documentChanged", this);
  }
  toggleOrderedListForMultipleBlocks(dataIds) {
    if (dataIds.length === 0)
      return;
    const sortedDataIds = dataIds.sort((a, b) => {
      const indexA = this.blocks.findIndex((block) => block.dataId === a);
      const indexB = this.blocks.findIndex((block) => block.dataId === b);
      return indexA - indexB;
    });
    const allAreOrderedLists = sortedDataIds.every((dataId) => {
      const block = this.blocks.find((block2) => block2.dataId === dataId);
      return block && (block.listType === "ol" || block.listType === "li");
    });
    if (allAreOrderedLists) {
      sortedDataIds.forEach((dataId) => {
        const block = this.blocks.find((block2) => block2.dataId === dataId);
        if (block) {
          block.listType = null;
          block.listStart = void 0;
          block.parentId = void 0;
        }
      });
    } else {
      const firstBlockId = sortedDataIds[0];
      sortedDataIds.forEach((dataId, index) => {
        const block = this.blocks.find((block2) => block2.dataId === dataId);
        if (block) {
          if (index === 0) {
            block.listType = "ol";
            block.listStart = 1;
            block.parentId = firstBlockId;
          } else {
            block.listType = "li";
            block.listStart = index + 1;
            block.parentId = firstBlockId;
          }
        }
      });
    }
    this.updateOrderedListNumbers();
    this.emit("documentChanged", this);
  }
  toggleUnorderedList(dataId) {
    const index = this.blocks.findIndex((block2) => block2.dataId === dataId);
    if (index === -1)
      return;
    const block = this.blocks[index];
    block.listType = block.listType === "ul" ? null : "ul";
    this.emit("documentChanged", this);
  }
  updateOrderedListNumbers() {
    let currentNumber = 1;
    let currentParentId = null;
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      if (block.listType === "ol" || block.listType === "li") {
        const isNewListGroup = block.listType === "ol" || block.parentId !== currentParentId;
        if (isNewListGroup) {
          currentNumber = 1;
          currentParentId = block.listType === "ol" ? block.dataId : block.parentId;
        }
        block.listStart = currentNumber;
        currentNumber++;
      } else {
        currentNumber = 1;
        currentParentId = null;
      }
    }
    this.emit("documentChanged", this);
  }
  undo() {
    console.log("undo");
    this.undoRedoManager.undo();
  }
  redo() {
    this.undoRedoManager.redo();
    console.log("redo");
  }
  setCursorPosition(position, dataId = "") {
    var _a;
    if (dataId !== "") {
      const divDataid = document.querySelector(`[data-id="${dataId}"]`);
      if (divDataid) {
        setTimeout(() => divDataid.focus(), 0);
      } else {
        console.warn(`Element with data-id="${dataId}" not found.`);
        return;
      }
    } else {
      this.editorView.container.focus();
    }
    const sel = window.getSelection();
    if (!sel)
      return;
    const range = document.createRange();
    let charIndex = 0;
    const nodeStack = [this.editorView.container];
    let node;
    const totalLength = ((_a = this.editorView.container.textContent) === null || _a === void 0 ? void 0 : _a.length) || 0;
    if (position < 0 || position > totalLength)
      return;
    while (node = nodeStack.pop()) {
      if (node.nodeType === 3) {
        const textNode = node;
        const nextCharIndex = charIndex + textNode.length;
        if (position >= charIndex && position <= nextCharIndex) {
          range.setStart(textNode, Math.min(position - charIndex, textNode.length));
          range.collapse(true);
          break;
        }
        charIndex = nextCharIndex;
      } else if (node.tagName === "BR") {
        if (position === charIndex) {
          range.setStartBefore(node);
          range.collapse(true);
          break;
        }
        charIndex++;
      } else {
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
  toggleBoldRange(start, end, id = "") {
    const allBold = this.isRangeEntirelyAttribute(start, end, "bold");
    this.formatAttribute(start, end, "bold", !allBold);
  }
  toggleItalicRange(start, end, id = "") {
    const allItalic = this.isRangeEntirelyAttribute(start, end, "italic");
    this.formatAttribute(start, end, "italic", !allItalic);
  }
  toggleUnderlineRange(start, end, id = "") {
    const allUnderline = this.isRangeEntirelyAttribute(start, end, "underline");
    this.formatAttribute(start, end, "underline", !allUnderline);
  }
  toggleStrikethroughRange(start, end, id = "") {
    const allStrike = this.isRangeEntirelyAttribute(start, end, "strikethrough");
    this.formatAttribute(start, end, "strikethrough", !allStrike);
  }
  toggleUndoRange(start, end, id = "") {
    const allUndo = this.isRangeEntirelyAttribute(start, end, "undo");
    this.formatAttribute(start, end, "undo", !allUndo);
  }
  toggleRedoRange(start, end) {
    const allRedo = this.isRangeEntirelyAttribute(start, end, "redo");
    this.formatAttribute(start, end, "redo", !allRedo);
  }
  applyFontColor(start, end, color, id = "") {
    if (start < end) {
      this.formatAttribute(start, end, "fontColor", color);
      console.log("applyFontColor-color", color, start, end);
    }
  }
  applyBgColor(start, end, color, id = "") {
    if (start < end) {
      this.formatAttribute(start, end, "bgColor", color);
    }
  }
  isRangeEntirelyAttribute(start, end, attr) {
    let offset = this.currentOffset;
    let allHaveAttr = true;
    if (this.selectedBlockId !== "" && this.selectedBlockId !== null) {
      const index = this.blocks.findIndex((block) => block.dataId === this.selectedBlockId);
      if (index === -1)
        return false;
      for (let piece of this.blocks[index].pieces) {
        const pieceEnd = offset + piece.text.length;
        if (pieceEnd > start && offset < end) {
          if (!piece.attributes[attr]) {
            allHaveAttr = false;
            break;
          }
        }
        offset = pieceEnd;
      }
    }
    return allHaveAttr;
  }
  mergePieces(pieces) {
    let merged = [];
    for (let p of pieces) {
      const last = merged[merged.length - 1];
      if (last && last.hasSameAttributes(p)) {
        last.text += p.text;
      } else {
        merged.push(p);
      }
    }
    return merged;
  }
  findPieceAtOffset(offset, dataId = "") {
    let currentOffset = 0;
    if (dataId !== "" && dataId !== null) {
      for (let block of this.blocks) {
        const blockLength = block.pieces.reduce((acc, curr) => acc + curr.text.length, 0);
        if (block.dataId == dataId) {
          let prevPiece = null;
          for (let piece of block.pieces) {
            const pieceStart = currentOffset;
            const pieceEnd = pieceStart + piece.text.length;
            if (offset >= pieceStart && offset < pieceEnd) {
              return offset === pieceStart && prevPiece ? prevPiece : piece;
            }
            prevPiece = piece;
            currentOffset = pieceEnd;
          }
        } else {
          currentOffset += blockLength;
        }
      }
    }
    return null;
  }
  setFontFamily(start, end, fontFamily) {
    this.formatAttribute(start, end, "fontFamily", fontFamily);
  }
  setFontSize(start, end, fontSize) {
    this.formatAttribute(start, end, "fontSize", fontSize);
  }
  setAlignment(alignment, dataId) {
    const block = this.blocks.find((block2) => block2.dataId === dataId);
    if (!block)
      return;
    block.alignment = alignment;
    this.emit("documentChanged", this);
  }
  getHtmlContent(copyToClipboard = false) {
    const editorContainer = document.getElementById("editor");
    if (!editorContainer) {
      console.error("Editor container not found.");
      return;
    }
    const htmlContent = editorContainer.innerHTML;
    if (copyToClipboard) {
      navigator.clipboard.writeText(htmlContent).then(() => {
        console.log("HTML copied to clipboard!");
      }).catch((err) => console.error("Failed to copy HTML:", err));
    }
    return htmlContent;
  }
  getCursorOffsetInParent(parentSelector) {
    var _a;
    console.log("textPosition -1:vicky", parentSelector);
    const parentElement = document.querySelector(parentSelector);
    if (!parentElement)
      return null;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
      return null;
    const range = selection.getRangeAt(0);
    if (!parentElement.contains(range.startContainer))
      return null;
    let offset = 0;
    let targetNode = null;
    const walker = document.createTreeWalker(parentElement, NodeFilter.SHOW_TEXT, null);
    let matchedChild = null;
    while (walker.nextNode()) {
      const currentNode = walker.currentNode;
      console.log(currentNode, "textPosition - currentNode: vicky");
      if (currentNode === range.startContainer) {
        offset += range.startOffset;
        targetNode = currentNode;
        matchedChild = currentNode.parentElement;
        break;
      } else {
        offset += ((_a = currentNode.textContent) === null || _a === void 0 ? void 0 : _a.length) || 0;
      }
    }
    console.log({
      offset,
      childNode: targetNode,
      innerHTML: matchedChild.innerHTML,
      innerText: matchedChild.innerText
    }, "textPosition - return values: vicky");
    return {
      offset,
      childNode: targetNode,
      innerHTML: matchedChild.innerHTML,
      innerText: matchedChild.innerText
    };
  }
  removeExclusiveEndBlock(range, ids) {
    if (ids.length <= 1)
      return;
    const endNode = range.endContainer;
    const endOffset = range.endOffset;
    let atStartOfContainer = false;
    if (endNode.nodeType === Node.TEXT_NODE) {
      atStartOfContainer = endOffset === 0;
    } else if (endNode.nodeType === Node.ELEMENT_NODE) {
      atStartOfContainer = endOffset === 0;
    }
    if (!atStartOfContainer)
      return;
    const endBlockId = this.getDataIdFromNode(endNode);
    if (!endBlockId)
      return;
    const startBlockId = this.getDataIdFromNode(range.startContainer);
    if (endBlockId !== startBlockId && ids.includes(endBlockId)) {
      const idx = ids.lastIndexOf(endBlockId);
      if (idx > -1)
        ids.splice(idx, 1);
    }
  }
};
var textDocument_default = TextDocument;

// ../core/dist/utils/selectionManager.js
function saveSelection(container) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return null;
  const range = selection.getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(container);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;
  preSelectionRange.setEnd(range.endContainer, range.endOffset);
  const end = preSelectionRange.toString().length;
  return { start, end };
}
function restoreSelection(container, savedSel) {
  if (!savedSel)
    return;
  let charIndex = 0;
  const range = document.createRange();
  range.setStart(container, 0);
  range.collapse(true);
  const nodeStack = [container];
  let node;
  let foundStart = false;
  let stop = false;
  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType === 3) {
      const textNode = node;
      const nextCharIndex = charIndex + textNode.length;
      if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
        range.setStart(textNode, savedSel.start - charIndex);
        foundStart = true;
      }
      if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
        range.setEnd(textNode, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else if (node.tagName === "BR") {
      if (!foundStart && savedSel.start === charIndex) {
        range.setStartBefore(node);
        foundStart = true;
      }
      if (foundStart && savedSel.end === charIndex) {
        range.setEndBefore(node);
        stop = true;
      }
      charIndex++;
    } else {
      const el = node;
      let i = el.childNodes.length;
      while (i--) {
        nodeStack.push(el.childNodes[i]);
      }
    }
  }
  const sel = window.getSelection();
  if (!sel)
    return;
  sel.removeAllRanges();
  sel.addRange(range);
}
function getSelectionRange(editorView) {
  const sel = saveSelection(editorView.container);
  if (!sel)
    return [0, 0];
  return [sel.start, sel.end];
}
function extractTextFromDataId(dataId, textDocument) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { remainingText: "", piece: null };
  }
  const range = selection.getRangeAt(0);
  const cursorNode = range.startContainer;
  let fText = "";
  const _block = textDocument.blocks.filter((block) => {
    if (block.dataId === dataId) {
      return block;
    }
  });
  if (!_block[0] || !_block[0].pieces) {
    return { remainingText: "", piece: null };
  }
  const element = document.querySelector(`[data-id="${dataId}"]`);
  const textPosition = textDocument.getCursorOffsetInParent(`[data-id="${dataId}"]`);
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
    return { remainingText: "", piece: null };
  }
  if (!element.contains(cursorNode)) {
    console.error(`Cursor is not inside the element with data-id "${dataId}".`);
    return { remainingText: "", piece: null };
  }
  const fullText = fText;
  const cursorOffset = textPosition === null || textPosition === void 0 ? void 0 : textPosition.offset;
  const remainingText = fullText.slice(cursorOffset);
  const newContent = fullText.slice(0, cursorOffset);
  element.textContent = newContent;
  return { remainingText, piece: _piece };
}
function addBlockAfter(data, targetDataId, newBlock) {
  const targetIndex = data.findIndex((block) => block.dataId === targetDataId);
  if (targetIndex === -1) {
    console.error(`Block with dataId "${targetDataId}" not found.`);
    return data;
  }
  const updatedData = [
    ...data.slice(0, targetIndex + 1),
    newBlock,
    ...data.slice(targetIndex + 1)
  ];
  return updatedData;
}

// ../core/dist/utils/urlDetector.js
var URL_REGEX = /((https?:\/\/|www\.)[\w\-._~:\/?#[\]@!$&'()*+,;=%]+|\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[\w\-._~:\/?#[\]@!$&'()*+,;=%]*)?)/g;
function isPartOfEmail(text, matchIndex) {
  return matchIndex > 0 && text[matchIndex - 1] === "@";
}
function detectUrlsInText(text) {
  const segments = [];
  let lastIndex = 0;
  let match;
  while ((match = URL_REGEX.exec(text)) !== null) {
    const matchIndex = match.index;
    let urlText = match[0];
    let trailing = "";
    const trailingMatch = urlText.match(/[.,!?;:)\]\}"']+$/);
    if (trailingMatch) {
      trailing = trailingMatch[0];
      urlText = urlText.slice(0, -trailing.length);
    }
    if (isPartOfEmail(text, matchIndex)) {
      continue;
    }
    if (matchIndex > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, matchIndex),
        isUrl: false
      });
    }
    let url = urlText;
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }
    segments.push({
      text: urlText,
      isUrl: true,
      url
    });
    if (trailing) {
      segments.push({ text: trailing, isUrl: false });
    }
    lastIndex = matchIndex + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      isUrl: false
    });
  }
  return segments;
}
function ensureProtocol(url) {
  if (!url)
    return url;
  let trimmed = url.trim();
  const accidentalPrefixMatch = trimmed.match(/^https?:\/\/[\w.-]+(?::\d+)?\/(https?:\/\/.*)$/);
  if (accidentalPrefixMatch) {
    trimmed = accidentalPrefixMatch[1];
  }
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) {
    return "https:" + trimmed;
  }
  return "https://" + trimmed;
}

// ../core/dist/view/editorView.js
var EditorView = class {
  constructor(container, document2) {
    this.container = container;
    this.document = document2;
  }
  setImageHandler(imageHandler) {
    this.imageHandler = imageHandler;
  }
  render() {
    const savedSel = saveSelection(this.container);
    this.container.innerHTML = "";
    this.document.blocks.forEach((block) => {
      var _a;
      if (block.dataId !== "") {
        let wrapperDiv;
        if (block.type === "image") {
          wrapperDiv = document.createElement("div");
          wrapperDiv.setAttribute("data-id", block.dataId);
          wrapperDiv.setAttribute("class", block.class);
          wrapperDiv.setAttribute("type", block.type);
          wrapperDiv.style.textAlign = block.alignment || "left";
          if (block.image) {
            if (this.imageHandler && typeof this.imageHandler.createImageFragment === "function") {
              wrapperDiv.appendChild(this.imageHandler.createImageFragment(block.image, block.dataId));
            } else {
              const img = document.createElement("img");
              img.src = block.image;
              wrapperDiv.appendChild(img);
            }
          }
        } else {
          if (block.listType === "ol" || block.listType === "li") {
            wrapperDiv = document.createElement("ol");
            wrapperDiv.setAttribute("start", ((_a = block === null || block === void 0 ? void 0 : block.listStart) === null || _a === void 0 ? void 0 : _a.toString()) || "1");
          } else if (block.listType === "ul") {
            wrapperDiv = document.createElement("ul");
          } else {
            wrapperDiv = document.createElement("div");
          }
          wrapperDiv.setAttribute("data-id", block.dataId);
          wrapperDiv.setAttribute("class", block.class);
          wrapperDiv.setAttribute("type", block.type);
          wrapperDiv.style.textAlign = block.alignment || "left";
          if (Array.isArray(block.pieces)) {
            if (block.listType === "ol" || block.listType === "ul" || block.listType === "li") {
              const li = document.createElement("li");
              block.pieces.forEach((piece) => {
                li.appendChild(this.renderPiece(piece));
              });
              wrapperDiv.appendChild(li);
            } else {
              block.pieces.forEach((piece) => {
                wrapperDiv.appendChild(this.renderPiece(piece));
              });
            }
          }
        }
        this.container.appendChild(wrapperDiv);
      }
    });
    restoreSelection(this.container, savedSel);
  }
  renderPiece(piece) {
    const lines = piece.text.split("\n");
    return this.wrapAttributes(lines, piece.attributes);
  }
  wrapAttributes(lines, attrs) {
    const fragment = document.createDocumentFragment();
    lines.forEach((line, index) => {
      let textNode = document.createTextNode(line);
      if (attrs.strikethrough) {
        const s = document.createElement("s");
        s.appendChild(textNode);
        textNode = s;
      }
      if (attrs.underline) {
        const u = document.createElement("u");
        u.appendChild(textNode);
        textNode = u;
      }
      if (attrs.italic) {
        const em = document.createElement("em");
        em.appendChild(textNode);
        textNode = em;
      }
      if (attrs.bold) {
        const strong = document.createElement("strong");
        strong.appendChild(textNode);
        textNode = strong;
      }
      const fontFamilySelect = document.getElementById("fontFamily");
      const fontSizeSelect = document.getElementById("fontSize");
      let selectedFontFamilyValue = "Arial";
      let selectedFontSizeValue = "16px";
      if (fontFamilySelect) {
        selectedFontFamilyValue = fontFamilySelect.value;
      }
      if (fontSizeSelect) {
        selectedFontSizeValue = fontSizeSelect.value;
      }
      const span = document.createElement("span");
      span.style.fontFamily = attrs.fontFamily || selectedFontFamilyValue;
      span.style.fontSize = attrs.fontSize || selectedFontSizeValue;
      if (attrs.fontColor && typeof attrs.fontColor === "string") {
        span.style.color = attrs.fontColor;
      }
      if (attrs.bgColor && typeof attrs.bgColor === "string") {
        span.style.backgroundColor = attrs.bgColor;
      }
      if (attrs.hyperlink && typeof attrs.hyperlink === "string") {
        const a = document.createElement("a");
        a.href = ensureProtocol(attrs.hyperlink);
        a.appendChild(textNode);
        textNode = a;
      }
      span.appendChild(textNode);
      textNode = span;
      fragment.appendChild(textNode);
      if (index < lines.length - 1) {
        fragment.appendChild(document.createElement("br"));
      }
    });
    return fragment;
  }
};
var editorView_default = EditorView;

// ../core/dist/view/toolbarView.js
var ToolbarView = class extends events_default {
  constructor(container) {
    super();
    this.container = container;
    this.setupButtons();
  }
  setupButtons() {
    this.container.querySelectorAll("button").forEach((button) => {
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });
    });
    this.container.addEventListener("click", (e) => {
      const target = e.target;
      const btn = target.closest("button");
      if (btn) {
        const action = btn.getAttribute("data-action");
        if (action) {
          this.emit("toolbarAction", action);
        }
      }
    });
  }
  updateActiveStates(attributes) {
    this.container.querySelectorAll("button").forEach((btn) => {
      const action = btn.getAttribute("data-action");
      let isActive = false;
      if (action === "bold" && attributes.bold)
        isActive = true;
      if (action === "italic" && attributes.italic)
        isActive = true;
      if (action === "underline" && attributes.underline)
        isActive = true;
      if (action === "strikethrough" && attributes.strikethrough)
        isActive = true;
      if (action === "hyperlink" && attributes.hyperlink)
        isActive = true;
      if (action === "undo" && attributes.undo)
        isActive = true;
      if (action === "redo" && attributes.redo)
        isActive = true;
      btn.classList.toggle("active", isActive);
    });
    this.container.querySelectorAll("select").forEach((select) => {
      const action = select.getAttribute("data-action");
      if (action === "fontFamily" && attributes.fontFamily)
        select.value = attributes.fontFamily;
      if (action === "fontSize" && attributes.fontSize)
        select.value = attributes.fontSize;
    });
    if (attributes.fontColor) {
      const fontColorPicker = document.getElementById("fontColorPicker");
      if (fontColorPicker) {
        fontColorPicker.value = attributes.fontColor;
        fontColorPicker.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    if (attributes.bgColor) {
      const fontColorPicker = document.getElementById("bgColorPicker");
      if (fontColorPicker) {
        fontColorPicker.value = attributes.bgColor;
        fontColorPicker.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }
};
var toolbarView_default = ToolbarView;

// ../core/dist/constants/strings.js
var strings = {
  TOOLBAR_CLASSNAME: "toolbar",
  TOOLBAR_ID: "toolbar",
  EDITOR_CLASSNAME: "editor",
  EDITOR_ID: "editor",
  EDITOR_ELEMENT_NT_FOUND: "Editor element not found or incorrect element type.",
  FONT_FAMILY_SELECT_ID: "fontFamily",
  FONT_SIZE_SELECT_ID: "fontSize",
  FONT_COLOR_WRAPPER_ID: "fontColorWrapper",
  FONT_COLOR_ID: "fontColor",
  FONT_COLOR_PICKER_WRAPPER_ID: "colorWrapper",
  FONT_COLOR_PICKER_ID: "fontColorPicker",
  FONT_COLOR_RESET_ID: "colorResetFont",
  BG_COLOR_WRAPPER_ID: "bgColorWrapper",
  BG_COLOR_ID: "bgColor",
  BG_COLOR_PICKER_WRAPPER_ID: "colorBgWrapper",
  BG_COLOR_RESET_ID: "colorResetBG",
  BG_COLOR_PICKER_ID: "bgColorPicker",
  GET_HTML_BUTTON_ID: "getHtmlButton",
  LOAD_HTML_BUTTON_ID: "loadHtmlButton",
  HYPERLINK_CONTAINER_ID: "hyperlink-container",
  HYPERLINK_INPUT_ID: "hyperlink-input",
  HYPERLINK_PLACEHOLDER: "Enter a URL...",
  HYPERLINK_APPLY_BTN_ID: "apply-hyperlink",
  HYPERLINK_CANCEL_BTN_ID: "cancel-hyperlink",
  VIEW_HYPERLINK_CONTAINER_ID: "hyperlink-container-view",
  VIEW_HYPERLINK_LABEL_ID: "hyperlink-view-span",
  VIEW_HYPERLINK_ANCHOR_ID: "hyperlink-view-link",
  TEMPORARY_SELECTION_HIGHLIGHT_CLASS: "temporary-selection-highlight",
  PARAGRAPH_BLOCK_CLASS: "paragraph-block",
  IMAGE_CROSS_CLASS: "image-cross",
  TEST_HTML_CODE: `<div data-id="data-id-1734604240404" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> ajsh diujaksdajsh diujaksdajsh </span></span></span></div><div data-id="data-id-1739430551701" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> diujaksdasd </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(163, 67, 67);"><strong>98hasiudasdh 98</strong></span></span></span></div><div data-id="data-id-1739430553412" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong> </strong></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">This is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"><em>t</em></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"> this is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"><em>test work</em></span></span></span></div><div data-id="data-id-1739430554776" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">This is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><em>test work.</em></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> this is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong>test work</strong></span></span></span></div><div data-id="data-id-1739430558023" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong><em> uj09asujdi</em></strong></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank"><strong><em>odiodiooias </em></strong></a></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank"><strong>diodiodio</strong></a></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank">oias</a></span></span></span></div><div data-id="data-id-1739430556280" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> da90 uasd y98asiodoiasda90 uasd y9</span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">8asiodoiasda90 uasd y98asioda</span></span></span></div><div data-id="data-id-1739430559464" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> sdjasdjasdja9sudoija9sudoija9sudoija90sdoa90sdoa90sdo</span></span></span></div>`,
  POPUP_TOOLBAR_CLASSNAME: "popup-toolbar",
  POPUP_TOOLBAR_ID: "popup-toolbar",
  TOAST_ID: "ti-toast",
  TOAST_SHOW_CLASS: "ti-toast--show",
  TOAST_DEFAULT_MESSAGE: "HTML copied to clipboard",
  TOAST_DEFAULT_DURATION_MS: 2e3
};

// ../core/dist/handlers/hyperlink.js
var HyperlinkHandler = class {
  constructor(editorContainer, editorView, document2) {
    this.savedSelection = null;
    this.clickOutsideHandler = null;
    this.editorContainer = editorContainer;
    this.editorView = editorView;
    this.document = document2;
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
        } else if (commonLink !== pieceLink) {
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
      hyperlinkContainer.style.display = "block";
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let rect = null;
        if (range && typeof range.getBoundingClientRect === "function") {
          rect = range.getBoundingClientRect();
        } else if (range && typeof range.getClientRects === "function") {
          const list = (_a = range.getClientRects) === null || _a === void 0 ? void 0 : _a.call(range);
          rect = list && list.length ? list[0] : null;
        }
        if (!rect || Number.isNaN(rect.top) && Number.isNaN(rect.left)) {
          rect = this.editorView.container.getBoundingClientRect();
        }
        const scrollY = (window === null || window === void 0 ? void 0 : window.scrollY) || 0;
        const scrollX = (window === null || window === void 0 ? void 0 : window.scrollX) || 0;
        hyperlinkContainer.style.top = `${((_b = rect.bottom) !== null && _b !== void 0 ? _b : rect.top) + scrollY + 5}px`;
        hyperlinkContainer.style.left = `${((_c = rect.left) !== null && _c !== void 0 ? _c : 0) + scrollX}px`;
      }
      hyperlinkInput.value = existingLink || "";
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
        hyperlinkContainer.style.display = "none";
      };
      applyButton.onclick = applyHyperlinkAction;
      hyperlinkInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyHyperlinkAction();
        }
      };
      cancelButton.onclick = () => {
        this.removeHyperlink(dataIdsSnapshot);
        hyperlinkContainer.style.display = "none";
      };
    }
  }
  highlightSelection() {
    this.removeHighlightSelection();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
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
    highlights === null || highlights === void 0 ? void 0 : highlights.forEach((span) => {
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
            this.document.formatAttribute(countS, countE, "hyperlink", normalizedUrl);
          }
        });
      } else {
        this.document.formatAttribute(start, end, "hyperlink", normalizedUrl);
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
            this.document.formatAttribute(countS, countE, "hyperlink", false);
          }
        });
      } else {
        this.document.formatAttribute(start, end, "hyperlink", false);
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
      document.addEventListener("click", this.clickOutsideHandler);
    }, 100);
  }
  removeClickOutsideListener() {
    if (this.clickOutsideHandler) {
      document.removeEventListener("click", this.clickOutsideHandler);
      this.clickOutsideHandler = null;
    }
  }
  showHyperlinkViewButton(link) {
    var _a, _b, _c;
    const viewHyperlinkContainer = document.getElementById(strings.VIEW_HYPERLINK_CONTAINER_ID);
    const hyperLinkAnchor = document.getElementById(strings.VIEW_HYPERLINK_ANCHOR_ID);
    if (viewHyperlinkContainer && hyperLinkAnchor) {
      viewHyperlinkContainer.style.display = "block";
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let rect = null;
        if (range && typeof range.getBoundingClientRect === "function") {
          rect = range.getBoundingClientRect();
        } else if (range && typeof range.getClientRects === "function") {
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
      hyperlinkContainer.style.display = "none";
    }
    this.removeClickOutsideListener();
  }
};
var hyperlink_default = HyperlinkHandler;

// ../core/dist/utils/parseHtml.js
function parseHtmlToPieces(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return extractPiecesFromNode(doc.body, {
    bold: false,
    italic: false,
    underline: false,
    hyperlink: false
  });
}
function extractPiecesFromNode(node, inheritedAttrs) {
  let currentAttrs = Object.assign({}, inheritedAttrs);
  const pieces = [];
  if (node instanceof HTMLElement) {
    if (node.tagName === "A") {
      const href = node.getAttribute("href");
      if (href) {
        currentAttrs.hyperlink = href;
      }
    }
    if (node.tagName === "STRONG" || node.tagName === "B")
      currentAttrs.bold = true;
    if (node.tagName === "EM" || node.tagName === "I")
      currentAttrs.italic = true;
    if (node.tagName === "U")
      currentAttrs.underline = true;
    node.childNodes.forEach((child) => {
      pieces.push(...extractPiecesFromNode(child, currentAttrs));
    });
  } else if (node instanceof Text) {
    const text = node.nodeValue || "";
    if (text.trim() !== "") {
      pieces.push(new piece_default(text, Object.assign({}, currentAttrs)));
    }
  }
  return pieces;
}

// ../core/dist/assets/icons.ts
var icons = {
  bold: `<svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                <title>Bold</title>
                <path d="M17.061 11.22A4.46 4.46 0 0 0 18 8.5C18 6.019 15.981 4 13.5 4H6v15h8c2.481 0 4.5-2.019 4.5-4.5a4.48 4.48 0 0 0-1.439-3.28zM13.5 7c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5H9V7h4.5zm.5 9H9v-3h5c.827 0 1.5.673 1.5 1.5S14.827 16 14 16z"></path>
            </svg>`,
  italic: `<svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                <title>Italic</title>
                <path d="M19 7V4H9v3h2.868L9.012 17H5v3h10v-3h-2.868l2.856-10z"></path>
            </svg>`,
  underline: `<svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" height="18" 
                    viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">
                    <title>Underline</title>
                    <path d="M5 18h14v2H5zM6 4v6c0 3.309 2.691 6 6 6s6-2.691 6-6V4h-2v6c0 2.206-1.794 4-4 4s-4-1.794-4-4V4H6z"></path>
                </svg>`,
  strikethrough: `<svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        style="fill: rgba(0, 0, 0, 1);">
        <title>Strikethrough</title>
        <path d="M5 12.5h14v-1H5v1zm7-7c-2.21 0-4 1.79-4 4h2a2 2 0 1 1 4 0c0 1.1-.9 2-2 2h-1v2h1a4 4 0 0 0 0-8zm0 14c2.21 0 4-1.79 4-4h-2a2 2 0 1 1-4 0c0-1.1.9-2 2-2h1v-2h-1a4 4 0 0 0 0 8z"/>
    </svg>`,
  subscript: `<svg 
                xmlns="http://www.w3.org/2000/svg" 
                    width="18" height="18" 
                    viewBox="0 0 24 24">
                    <title>Subscript</title>
                    <path fill="currentColor" d="M19 20v-3h3v-1h-3v-1h4v3h-3v1h3v1zM5.875 18l4.625-7.275L6.2 4h2.65l3.1 5h.1l3.075-5H17.8l-4.325 6.725L18.125 18H15.45l-3.4-5.425h-.1L8.55 18z"/>
                </svg>`,
  superscript: `<svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24">
                    <title>Superscript</title>
                    <path fill="currentColor" d="M19 9V6h3V5h-3V4h4v3h-3v1h3v1zM5.875 20l4.625-7.275L6.2 6h2.65l3.1 5h.1l3.075-5H17.8l-4.325 6.725L18.125 20H15.45l-3.4-5.425h-.1L8.55 20z"/>
                </svg>`,
  left_align: `<svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24">
                    <title>Left Align</title>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M4.5 12h8m-8 6.25h15m-15-12.5h15"/>
                </svg>`,
  center_align: `<svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24">
                    <title>Center Align</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M6 18h12"/>
                </svg>`,
  right_align: `<svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24">
                    <title>Right Align</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M19.5 12h-8m8-6.25h-15m15 12.5h-15"/></svg>`,
  justify: `<svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 20 20">
                <title>Justify</title><path fill="currentColor" d="M2 4.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.25m0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.25m.75 4.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5z"/>
            </svg>`,
  bullet_list: `<svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 16 16">
                    <title>Bullet List</title><path fill="currentColor" d="M2 4.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2M2 9a1 1 0 1 0 0-2a1 1 0 0 0 0 2m1 3.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M5.5 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM5 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 8m.5 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/></svg>`,
  numbered_list: `<svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 512 512">
                    <title>Numbererd List</title>
                    <path fill="currentColor" d="M184 80h288v32H184zm0 160h288v32H184zm0 160h288v32H184zm-64-240V40H56v32h32v88zM56 262.111V312h80v-32H91.777L136 257.889V192H56v32h48v14.111zM56 440v32h80V344H56v32h48v16H80v32h24v16z"/>
                </svg>`,
  insert_table: `<svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 20 20">
                    <title>Insert Table</title>
                    <path fill="currentColor" d="M1.364 5.138v12.02h17.272V5.138zM.909 1.5h18.182c.502 0 .909.4.909.895v15.21a.9.9 0 0 1-.91.895H.91c-.503 0-.91-.4-.91-.895V2.395C0 1.9.407 1.5.91 1.5m5.227 1.759c0-.37.306-.671.682-.671s.682.3.682.671v13.899c0 .37-.305.67-.682.67a.676.676 0 0 1-.682-.67zm6.96-.64c.377 0 .682.3.682.67v4.995h4.91c.377 0 .683.301.683.672c0 .37-.306.671-.682.671l-4.911-.001v3.062h5.002c.377 0 .682.3.682.671c0 .37-.305.671-.682.671h-5.002v3.158a.676.676 0 0 1-.682.671a.676.676 0 0 1-.681-.67l-.001-3.159H1.001a.676.676 0 0 1-.682-.67c0-.371.305-.672.682-.672h11.413V9.626L.909 9.627a.676.676 0 0 1-.682-.671c0-.37.306-.671.682-.671l11.505-.001V3.289c0-.37.306-.67.682-.67"/>
                </svg>`,
  insert_layout: `<svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 256 256">
                    <title>Insert Layout</title>
                    <path fill="currentColor" d="M216 42H40a14 14 0 0 0-14 14v144a14 14 0 0 0 14 14h176a14 14 0 0 0 14-14V56a14 14 0 0 0-14-14M40 54h176a2 2 0 0 1 2 2v42H38V56a2 2 0 0 1 2-2m-2 146v-90h60v92H40a2 2 0 0 1-2-2m178 2H110v-92h108v90a2 2 0 0 1-2 2"/>
                </svg>`,
  heading: `<svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24">
                <title>Heading</title>
                <path fill="currentColor" d="M17 11V4h2v17h-2v-8H7v8H5V4h2v7z"/>
            </svg>`,
  hyperlink: `<svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24">
                <title>Hyperlink</title>
                <path fill="currentColor" d="M14.78 3.653a3.936 3.936 0 1 1 5.567 5.567l-3.627 3.627a3.936 3.936 0 0 1-5.88-.353a.75.75 0 0 0-1.18.928a5.436 5.436 0 0 0 8.12.486l3.628-3.628a5.436 5.436 0 1 0-7.688-7.688l-3 3a.75.75 0 0 0 1.06 1.061z"/>
                <path fill="currentColor" d="M7.28 11.153a3.936 3.936 0 0 1 5.88.353a.75.75 0 0 0 1.18-.928a5.436 5.436 0 0 0-8.12-.486L2.592 13.72a5.436 5.436 0 1 0 7.688 7.688l3-3a.75.75 0 1 0-1.06-1.06l-3 3a3.936 3.936 0 0 1-5.567-5.568z"/>
            </svg>`,
  image: `<svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 16 16">
            <title>Insert Image</title>
            <path fill="currentColor" d="M6 5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m9-4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm-3.448 6.134l-3.76 2.769a.5.5 0 0 1-.436.077l-.087-.034l-1.713-.87L1 11.8V14h14V9.751zM15 2H1v8.635l4.28-2.558a.5.5 0 0 1 .389-.054l.094.037l1.684.855l3.813-2.807a.5.5 0 0 1 .52-.045l.079.05L15 8.495z"/>
        </svg>`
};

// ../core/dist/config/editorConfig.js
var featureGroups = {
  dropdowns: ["fontFamily", "fontSize"],
  colors: ["fontColor", "bgColor"],
  formatting: ["bold", "italic", "underline", "strikethrough"],
  alignment: ["alignLeft", "alignCenter", "alignRight"],
  lists: ["unorderedList", "orderedList"],
  media: ["hyperlink", "image"],
  utility: ["getHtmlContent", "loadHtmlContent"]
};
function createSeparator() {
  const separator = document.createElement("div");
  separator.className = "toolbar-separator";
  return separator;
}
function getFeatureGroup(feature) {
  for (const [group, features] of Object.entries(featureGroups)) {
    if (features.includes(feature))
      return group;
  }
  return null;
}
function createEditor(editorId, config) {
  const mainEditorId = strings.EDITOR_ID;
  const toolbarId = strings.TOOLBAR_ID;
  const popupToolbarId = strings.POPUP_TOOLBAR_ID;
  const allowedFontFamily = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Verdana"
  ];
  const allowedFontSizes = ["12px", "14px", "16px", "18px", "20px"];
  const container = document.getElementById(editorId);
  if (!container)
    throw new Error(strings.EDITOR_ELEMENT_NT_FOUND);
  container.classList.add("editor-container");
  const toolbar = document.createElement("div");
  toolbar.className = strings.TOOLBAR_CLASSNAME;
  toolbar.id = toolbarId;
  container.appendChild(toolbar);
  if (!(config === null || config === void 0 ? void 0 : config.showToolbar))
    toolbar.style.display = "none";
  const editor = document.createElement("div");
  editor.id = mainEditorId;
  editor.className = strings.EDITOR_CLASSNAME;
  editor.contentEditable = "true";
  container.appendChild(editor);
  const featureLabels = {
    bold: "<strong>B</strong>",
    italic: "<em>I</em>",
    underline: "<u>U</u>",
    hyperlink: "&#128279;",
    alignLeft: "&#8676;",
    alignCenter: "&#8596;",
    alignRight: "&#8677;",
    unorderedList: "&#8226;",
    orderedList: "1.",
    fontFamily: "fontFamily",
    fontSize: "fontSize",
    fontColor: "A",
    subscript: "X<sub>2</sub>",
    superscript: "X<sup>2</sup>",
    justify: "&#8644;",
    insert_table: "&#8866;",
    insert_layout: "&#10064;",
    heading: "H",
    image: "&#128247;",
    colors: "&#127912;"
  };
  const featureTitles = {
    bold: "Bold (Ctrl+B)",
    italic: "Italic (Ctrl+I)",
    underline: "Underline (Ctrl+U)",
    strikethrough: "Strikethrough",
    hyperlink: "Insert Link (Ctrl+H)",
    alignLeft: "Align Left (Ctrl+L)",
    alignCenter: "Align Center (Ctrl+E)",
    alignRight: "Align Right (Ctrl+R)",
    unorderedList: "Bullet List",
    orderedList: "Numbered List",
    fontColor: "Text Color",
    bgColor: "Highlight Color",
    image: "Insert Image",
    getHtmlContent: "Get HTML",
    loadHtmlContent: "Load HTML"
  };
  const featuresWithPngIcon = [
    { feature: "alignLeft", id: "alignLeft", icon: icons.left_align },
    { feature: "alignCenter", id: "alignCenter", icon: icons.center_align },
    { feature: "alignRight", id: "alignRight", icon: icons.right_align },
    { feature: "unorderedList", id: "unorderedList", icon: icons.bullet_list },
    { feature: "orderedList", id: "orderedList", icon: icons.numbered_list },
    { feature: "hyperlink", id: "hyperlink", icon: icons.hyperlink },
    {
      feature: "strikethrough",
      id: "strikethrough",
      icon: icons.strikethrough
    }
  ];
  const createSelect = (id, options) => {
    const select = document.createElement("select");
    select.dataset.action = id;
    select.id = id;
    options.forEach((optionValue) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      select.appendChild(option);
    });
    return select;
  };
  const popupToolbar = document.createElement("div");
  popupToolbar.id = popupToolbarId;
  popupToolbar.className = strings.POPUP_TOOLBAR_CLASSNAME;
  popupToolbar.style.display = "none";
  container.appendChild(popupToolbar);
  if (config.popupFeatures) {
    config.popupFeatures.forEach((feature, index) => {
      if (index > 0 && feature === "hyperlink") {
        popupToolbar.appendChild(createSeparator());
      }
      const featureData = featuresWithPngIcon.find((item) => item.feature === feature) || { icon: featureLabels[feature] || feature };
      const button = document.createElement("button");
      button.dataset.action = feature;
      button.innerHTML = featureData.icon;
      button.dataset.tooltip = featureTitles[feature] || feature.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
      popupToolbar.appendChild(button);
    });
  }
  let lastGroup = null;
  config.features.forEach((feature, index) => {
    const currentGroup = getFeatureGroup(feature);
    if (index > 0 && currentGroup && lastGroup && currentGroup !== lastGroup) {
      toolbar.appendChild(createSeparator());
    }
    lastGroup = currentGroup;
    if (feature === "fontFamily") {
      const fontFamilySelect = createSelect(strings.FONT_FAMILY_SELECT_ID, allowedFontFamily);
      toolbar.appendChild(fontFamilySelect);
    } else if (feature === "fontSize") {
      const fontSizeSelect = createSelect(strings.FONT_SIZE_SELECT_ID, allowedFontSizes);
      toolbar.appendChild(fontSizeSelect);
    } else if (feature === "fontColor") {
      if (document.getElementById(strings.FONT_COLOR_WRAPPER_ID))
        return;
      const span = document.createElement("span");
      span.id = strings.FONT_COLOR_WRAPPER_ID;
      span.style.display = "inline-flex";
      span.style.alignItems = "center";
      span.style.position = "relative";
      span.style.gap = "4px";
      const button = document.createElement("button");
      button.id = strings.FONT_COLOR_ID;
      button.type = "button";
      button.dataset.tooltip = featureTitles["fontColor"] || "Text Color";
      button.innerHTML = '<span style="font-weight: bold; font-size: 14px; position: relative; display: inline-block; padding: 2px 4px;">A<span style="position: absolute; bottom: 0; left: 2px; right: 2px; height: 3px; background-color: #000000; border-radius: 1px;" id="fontColorIndicator"></span></span>';
      span.appendChild(button);
      const span1 = document.createElement("div");
      span1.id = strings.FONT_COLOR_PICKER_WRAPPER_ID;
      span1.style.display = "none";
      span1.style.position = "absolute";
      span1.style.top = "100%";
      span1.style.left = "0";
      span1.style.marginTop = "4px";
      span1.style.zIndex = "1000";
      span1.style.backgroundColor = "#ffffff";
      span1.style.border = "1px solid #d1d1d1";
      span1.style.borderRadius = "4px";
      span1.style.padding = "8px";
      span1.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
      span1.style.width = "135px";
      const fontColorPicker = document.createElement("input");
      fontColorPicker.type = "color";
      fontColorPicker.id = strings.FONT_COLOR_PICKER_ID;
      fontColorPicker.setAttribute("data-action", "fontColor");
      fontColorPicker.style.width = "100%";
      fontColorPicker.style.height = "32px";
      fontColorPicker.style.border = "1px solid #d1d1d1";
      fontColorPicker.style.borderRadius = "4px";
      fontColorPicker.style.cursor = "pointer";
      fontColorPicker.style.marginBottom = "8px";
      fontColorPicker.value = "#000000";
      span1.appendChild(fontColorPicker);
      const resetButton = document.createElement("button");
      resetButton.id = strings.FONT_COLOR_RESET_ID;
      resetButton.type = "button";
      resetButton.textContent = "Reset";
      resetButton.style.display = "block";
      resetButton.style.width = "100%";
      resetButton.style.padding = "6px 12px";
      resetButton.style.fontSize = "12px";
      resetButton.style.border = "1px solid #000000";
      resetButton.style.borderRadius = "4px";
      resetButton.style.backgroundColor = "#f8f8f8";
      resetButton.style.cursor = "pointer";
      resetButton.style.transition = "background-color 0.2s";
      resetButton.onmouseenter = () => resetButton.style.backgroundColor = "#e8e8e8";
      resetButton.onmouseleave = () => resetButton.style.backgroundColor = "#f8f8f8";
      span1.appendChild(resetButton);
      span.appendChild(span1);
      toolbar.appendChild(span);
    } else if (feature === "bgColor") {
      if (document.getElementById(strings.BG_COLOR_WRAPPER_ID))
        return;
      const span = document.createElement("span");
      span.id = strings.BG_COLOR_WRAPPER_ID;
      span.style.display = "inline-flex";
      span.style.alignItems = "center";
      span.style.position = "relative";
      span.style.gap = "4px";
      const button = document.createElement("button");
      button.id = strings.BG_COLOR_ID;
      button.type = "button";
      button.dataset.tooltip = featureTitles["bgColor"] || "Highlight Color";
      button.innerHTML = '<span style="font-weight: bold; font-size: 14px; position: relative; display: inline-block; padding: 2px 4px;">B<span style="position: absolute; bottom: 0; left: 2px; right: 2px; height: 3px; background-color: #ffffff;" id="bgColorIndicator"></span></span>';
      span.appendChild(button);
      const span1 = document.createElement("div");
      span1.id = strings.BG_COLOR_PICKER_WRAPPER_ID;
      span1.style.display = "none";
      span1.style.position = "absolute";
      span1.style.top = "100%";
      span1.style.left = "0";
      span1.style.marginTop = "4px";
      span1.style.zIndex = "1000";
      span1.style.backgroundColor = "#ffffff";
      span1.style.border = "1px solid #000000";
      span1.style.borderRadius = "4px";
      span1.style.padding = "8px";
      span1.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
      span1.style.width = "135px";
      const bgColorPicker = document.createElement("input");
      bgColorPicker.setAttribute("data-action", "bgColor");
      bgColorPicker.type = "color";
      bgColorPicker.id = strings.BG_COLOR_PICKER_ID;
      bgColorPicker.style.width = "100%";
      bgColorPicker.style.height = "32px";
      bgColorPicker.style.border = "1px solid #000000ff";
      bgColorPicker.style.borderRadius = "4px";
      bgColorPicker.style.cursor = "pointer";
      bgColorPicker.style.marginBottom = "8px";
      bgColorPicker.value = "#ffffff";
      span1.appendChild(bgColorPicker);
      const resetButton = document.createElement("button");
      resetButton.id = strings.BG_COLOR_RESET_ID;
      resetButton.type = "button";
      resetButton.textContent = "Reset";
      resetButton.style.display = "block";
      resetButton.style.width = "100%";
      resetButton.style.padding = "6px 12px";
      resetButton.style.fontSize = "12px";
      resetButton.style.border = "1px solid #d1d1d1";
      resetButton.style.borderRadius = "4px";
      resetButton.style.backgroundColor = "#f8f8f8";
      resetButton.style.cursor = "pointer";
      resetButton.style.transition = "background-color 0.2s";
      resetButton.onmouseenter = () => resetButton.style.backgroundColor = "#e8e8e8";
      resetButton.onmouseleave = () => resetButton.style.backgroundColor = "#f8f8f8";
      span1.appendChild(resetButton);
      span.appendChild(span1);
      toolbar.appendChild(span);
    } else if (feature === "getHtmlContent") {
      const button = document.createElement("button");
      button.id = strings.GET_HTML_BUTTON_ID;
      button.type = "button";
      button.textContent = "Get HTML";
      button.dataset.tooltip = featureTitles["getHtmlContent"] || "Get HTML";
      toolbar.appendChild(button);
    } else if (feature === "loadHtmlContent") {
      const button = document.createElement("button");
      button.id = strings.LOAD_HTML_BUTTON_ID;
      button.type = "button";
      button.textContent = "Load HTML";
      button.dataset.tooltip = featureTitles["loadHtmlContent"] || "Load HTML";
      toolbar.appendChild(button);
    } else if (featuresWithPngIcon.map((item) => item.feature).includes(feature)) {
      const featureData = featuresWithPngIcon.find((item) => item.feature === feature);
      const button = document.createElement("button");
      button.id = feature;
      button.dataset.action = feature;
      button.innerHTML = (featureData === null || featureData === void 0 ? void 0 : featureData.icon) || "";
      button.dataset.tooltip = featureTitles[feature] || feature;
      toolbar.appendChild(button);
    } else {
      const button = document.createElement("button");
      button.dataset.action = feature;
      button.innerHTML = featureLabels[feature] || feature;
      button.id = feature;
      button.dataset.tooltip = featureTitles[feature] || feature.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
      toolbar.appendChild(button);
    }
  });
  const hyperlinkContainer = document.createElement("div");
  hyperlinkContainer.id = strings.HYPERLINK_CONTAINER_ID;
  hyperlinkContainer.style.display = "none";
  const hyperlinkInput = document.createElement("input");
  hyperlinkInput.type = "text";
  hyperlinkInput.id = strings.HYPERLINK_INPUT_ID;
  hyperlinkInput.placeholder = strings.HYPERLINK_PLACEHOLDER;
  const applyButton = document.createElement("button");
  applyButton.id = strings.HYPERLINK_APPLY_BTN_ID;
  applyButton.textContent = "Link";
  const cancelButton = document.createElement("button");
  cancelButton.id = strings.HYPERLINK_CANCEL_BTN_ID;
  cancelButton.textContent = "Unlink";
  hyperlinkContainer.appendChild(hyperlinkInput);
  hyperlinkContainer.appendChild(applyButton);
  hyperlinkContainer.appendChild(cancelButton);
  toolbar.appendChild(hyperlinkContainer);
  const viewHyperlinkContainer = document.createElement("div");
  viewHyperlinkContainer.id = strings.VIEW_HYPERLINK_CONTAINER_ID;
  viewHyperlinkContainer.style.display = "none";
  const hyperLinkViewSpan = document.createElement("span");
  hyperLinkViewSpan.id = strings.VIEW_HYPERLINK_LABEL_ID;
  hyperLinkViewSpan.innerHTML = "Visit URL : ";
  const hyperLinkAnchor = document.createElement("a");
  hyperLinkAnchor.id = strings.VIEW_HYPERLINK_ANCHOR_ID;
  hyperLinkAnchor.href = "";
  hyperLinkAnchor.target = "_blank";
  viewHyperlinkContainer.appendChild(hyperLinkViewSpan);
  viewHyperlinkContainer.appendChild(hyperLinkAnchor);
  toolbar.appendChild(viewHyperlinkContainer);
  return { mainEditorId, toolbarId, popupToolbarId };
}

// #style-inject:#style-inject
function styleInject(css, { insertAt } = {}) {
  if (!css || typeof document === "undefined") return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// ../core/dist/styles/text-igniter.css
styleInject(`.editor-container {
  border: none;
  padding: 0;
  border-radius: 12px;
}
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 12px;
  margin-bottom: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.toolbar-separator {
  width: 1px;
  height: 24px;
  background: #e5e7eb;
  margin: 0 8px;
}
.toolbar button {
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 32px;
  height: 32px;
}
.toolbar button:hover {
  background: #f3f4f6;
}
.toolbar button:hover#fontColor,
.toolbar button:hover#bgColor {
  background: transparent !important;
}
.toolbar button[data-tooltip]:hover#fontColor,
.toolbar button[data-tooltip]:hover#bgColor {
  background: transparent !important;
}
.toolbar button.active {
  background: #e5e7eb;
  color: #111827;
}
.toolbar button svg {
  width: 18px;
  height: 18px;
  display: block;
}
.toolbar button[data-tooltip],
.toolbar select[data-tooltip],
.popup-toolbar button[data-tooltip] {
  position: relative;
}
.toolbar button[data-tooltip]::before,
.toolbar select[data-tooltip]::before,
.popup-toolbar button[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  padding: 8px 12px;
  background: #1f2937;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.toolbar button[data-tooltip]::after,
.toolbar select[data-tooltip]::after,
.popup-toolbar button[data-tooltip]::after {
  content: "";
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  border: 5px solid transparent;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.toolbar button[data-tooltip]:hover::before,
.toolbar button[data-tooltip]:hover::after,
.toolbar select[data-tooltip]:hover::before,
.toolbar select[data-tooltip]:hover::after,
.popup-toolbar button[data-tooltip]:hover::before,
.popup-toolbar button[data-tooltip]:hover::after {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
#fontFamily,
#fontSize {
  padding: 6px 12px;
  padding-right: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  transition: all 0.15s ease;
  appearance: none;
  -webkit-appearance: none;
}
#fontFamily:hover,
#fontSize:hover {
  border-color: #d1d5db;
  background-color: #f9fafb;
}
#fontFamily:focus,
#fontSize:focus {
  outline: none;
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.15);
}
#fontFamily {
  min-width: 130px;
}
#fontSize {
  min-width: 75px;
}
#editor {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px 24px;
  min-height: 200px;
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  background: #fff;
  margin-top: 12px;
  font-size: 15px;
  line-height: 1.6;
  color: #1f2937;
}
#editor:focus {
  border-color: #d1d5db;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
}
.paragraph-block {
  padding: 2px 0;
  margin: 0;
}
#fontColor,
#bgColor {
  font-size: 15px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}
#fontColor::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  border-radius: 2px;
}
#bgColor::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  border-radius: 2px;
}
#fontColorPicker,
#bgColorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  height: 20px;
  width: 20px;
  cursor: pointer;
  border-radius: 4px;
}
#fontColorWrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}
#hyperlink-container,
#hyperlink-container-view {
  position: absolute;
  display: none;
  z-index: 1000;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
}
#hyperlink-input {
  width: 220px;
  margin-right: 8px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.15s ease;
}
#hyperlink-input:focus {
  outline: none;
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.15);
}
#apply-hyperlink,
#cancel-hyperlink {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
}
#apply-hyperlink {
  background: #1f2937;
  color: white;
}
#apply-hyperlink:hover {
  background: #000000;
}
#cancel-hyperlink {
  background: #f3f4f6;
  color: #000000;
}
#cancel-hyperlink:hover {
  background: #e5e7eb;
}
.temporary-selection-highlight {
  background-color: rgba(59, 130, 246, 0.3);
}
.popup-toolbar {
  position: absolute;
  z-index: 1001;
  background: #fff;
  border-radius: 10px;
  padding: 6px 8px;
  display: none;
  align-items: center;
  gap: 2px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}
.popup-toolbar button {
  background: transparent;
  border: none;
  color: #000000;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.popup-toolbar button:hover {
  background: #f3f4f6;
}
.popup-toolbar button.active {
  background: #e5e7eb;
}
.popup-toolbar button svg {
  width: 16px;
  height: 16px;
  display: block;
}
.popup-toolbar .toolbar-separator {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
}
.ti-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  background: #1f2937;
  color: #fff;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  z-index: 2000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
.ti-toast.ti-toast--show {
  opacity: 1;
}
.text-igniter a {
  color: #2563eb;
  text-decoration: underline;
  text-decoration-color: rgba(37, 99, 235, 0.3);
  text-underline-offset: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.text-igniter a:hover {
  color: #1d4ed8;
  text-decoration-color: rgba(37, 99, 235, 0.6);
}
.text-igniter a:visited {
  color: #7c3aed;
}
.link-popup {
  position: absolute;
  background: #1f2937;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: none;
  animation: fadeIn 0.15s ease;
  flex-direction: row;
  gap: 2px;
}
.link-popup button {
  background: transparent;
  color: white;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s ease;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.link-popup button:hover {
  background: rgba(255, 255, 255, 0.1);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
#editor img {
  max-width: 100%;
  border-radius: 8px;
  margin: 8px 0;
}
#editor .image-float-right {
  float: right;
  margin: 0 0 12px 16px;
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
#editor .image-float-left {
  float: left;
  margin: 0 16px 12px 0;
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
`);

// ../core/dist/HtmlToJsonParser.js
var HtmlToJsonParser = class {
  constructor(htmlString) {
    this.htmlString = htmlString;
    this.doc = new DOMParser().parseFromString(htmlString, "text/html");
  }
  parse() {
    const elements = this.doc.body.children;
    let jsonData = [];
    Array.from(elements).forEach((element, i) => {
      const _element = this.parseElement(element);
      console.log(element, "element parse", i, _element);
      jsonData.push(_element);
    });
    console.log(jsonData, "element--jsondata");
    return jsonData;
  }
  parseElement(element) {
    const dataId = element.getAttribute("data-id") || "";
    const className = element.className || "paragraph-block";
    const alignment = element.style.textAlign || "left";
    let listType = null;
    let listStart = null;
    let parentId = null;
    if (element.tagName === "UL") {
      listType = "ul";
    } else if (element.tagName === "OL") {
      listType = "ol";
      listStart = parseInt(element.getAttribute("start") || "1", 10);
    }
    let pieces = [];
    if (listType) {
      this.parseListItems(element, pieces);
    } else {
      this.parseParagraphText(element, pieces);
    }
    return Object.assign(Object.assign(Object.assign({
      dataId,
      class: className,
      alignment,
      pieces
    }, listType ? { listType } : {}), listStart !== null ? { listStart } : {}), parentId !== null ? { parentId } : {});
  }
  parseListItems(element, pieces) {
    const listItems = element.querySelectorAll("li");
    listItems.forEach((li) => {
      const piece = this.extractTextAttributes(li);
      if (piece)
        pieces.push(new piece_default(piece.text, piece.attributes));
    });
  }
  parseParagraphText(element, pieces) {
    const spans = element.querySelectorAll("span");
    const uniquePieces = /* @__PURE__ */ new Map();
    spans.forEach((span) => {
      const piece = this.extractTextAttributes(span);
      console.log(piece, "piece parseParagraphText span", span.textContent, span.style.color);
      if (piece) {
        const existingPiece = uniquePieces.get(piece.text);
        if (existingPiece) {
          existingPiece.attributes.bold = existingPiece.attributes.bold || piece.attributes.bold;
          existingPiece.attributes.italic = existingPiece.attributes.italic || piece.attributes.italic;
          existingPiece.attributes.underline = existingPiece.attributes.underline || piece.attributes.underline;
          existingPiece.attributes.fontFamily = piece.attributes.fontFamily || existingPiece.attributes.fontFamily;
          existingPiece.attributes.fontSize = piece.attributes.fontSize || existingPiece.attributes.fontSize;
          existingPiece.attributes.fontColor = piece.attributes.fontColor || existingPiece.attributes.fontColor;
          existingPiece.attributes.bgColor = piece.attributes.bgColor || existingPiece.attributes.bgColor;
        } else {
          uniquePieces.set(piece.text, Object.assign({}, piece));
        }
      }
    });
    uniquePieces.forEach((uniquePiece) => {
      pieces.push(new piece_default(uniquePiece.text, uniquePiece.attributes));
    });
    console.log(pieces, "pieces--parseParagraphText (merged)");
  }
  extractTextAttributes(node) {
    var _a;
    const text = node.textContent || "";
    if (!text)
      return null;
    console.log("extractTextAttributes node", node, node.style.color);
    return {
      text,
      attributes: {
        bold: node.querySelector("b, strong") !== null,
        italic: node.querySelector("i, em") !== null,
        underline: node.querySelector("u") !== null,
        undo: false,
        redo: false,
        fontFamily: node.style.fontFamily || "Arial",
        fontSize: node.style.fontSize || "12px",
        hyperlink: node.querySelector("a") ? (_a = node.querySelector("a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href") : false,
        fontColor: node.style.color,
        bgColor: node.style.backgroundColor
      }
    };
  }
  rgbToHex(rgb, isBackground = false) {
    const rgbArray = rgb.match(/\d+/g);
    if (!rgbArray || rgbArray.length < 3)
      return null;
    const hex = rgbArray.map((x) => {
      const value = parseInt(x);
      if (value < 0 || value > 255)
        return "00";
      return value.toString(16).padStart(2, "0");
    }).join("");
    if (!isBackground && hex === "000000") {
      return null;
    }
    return `#${hex}`;
  }
};
var HtmlToJsonParser_default = HtmlToJsonParser;

// ../core/dist/handlers/image.js
var ImageHandler = class {
  constructor(editor, document2) {
    this.editor = editor;
    this.document = document2;
    this.isImageHighlighted = false;
    this.highLightedImageDataId = "";
    this.currentCursorLocation = 0;
    this.isCrossIconVisible = false;
  }
  setEditorView(editorView) {
    this.editorView = editorView;
  }
  insertImage() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();
    fileInput.onchange = () => {
      const file = fileInput.files ? fileInput.files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          var _a;
          const dataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
          this.insertImageAtCursor(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    };
  }
  insertImageAtCursor(dataUrl) {
    if (!dataUrl)
      return;
    const [start, end] = getSelectionRange(this.editorView);
    if (end > start) {
      this.document.deleteRange(start, end, this.document.selectedBlockId);
    }
    this.insertImageAtPosition(dataUrl, start, this.document.selectedBlockId);
  }
  setCursorPostion(postion, dataId) {
    if (typeof postion !== "number" || !dataId)
      return;
    const div = document.querySelector(`[data-id="${dataId}"]`);
    if (!div)
      return;
    if (typeof div.focus === "function")
      div.focus();
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      if (div.firstChild) {
        range.setStart(div.firstChild, postion);
      } else {
        const textNode = document.createTextNode("");
        div.appendChild(textNode);
        range.setStart(textNode, 0);
      }
      range.collapse(true);
      sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
      sel === null || sel === void 0 ? void 0 : sel.addRange(range);
    }, 0);
  }
  insertImageAtPosition(dataUrl, position, dataId) {
    if (!dataUrl || typeof position !== "number" || !this.editorView)
      return;
    console.log(dataUrl, position, dataId, "vicky insertImageAtPosition", this.document.blocks);
    const uniqueId1 = `data-id-${Date.now()}-${Math.random() * 1e3}`;
    const uniqueId2 = `data-id-${Date.now()}-${Math.random() * 1e3}`;
    const uniqueId3 = `data-id-${Date.now()}-${Math.random() * 1e3}`;
    const newImageBlock = {
      dataId: uniqueId1,
      class: strings.PARAGRAPH_BLOCK_CLASS,
      pieces: [new piece_default(" ")],
      type: "image",
      image: dataUrl
    };
    const newTextBlock = {
      dataId: uniqueId2,
      class: strings.PARAGRAPH_BLOCK_CLASS,
      pieces: [new piece_default(" ")],
      type: "text"
    };
    let selectedBlockId = this.document.selectedBlockId;
    const indexOfCurrentBlock = this.document.blocks.findIndex((block) => block.dataId === this.document.selectedBlockId);
    let newBlocks = [];
    const { remainingText, piece } = extractTextFromDataId(selectedBlockId || "", this.document);
    console.log(selectedBlockId || "", this.document, "extractTextFromDataId-vicky", remainingText, piece);
    const extractedContent = " " + remainingText;
    let updatedBlock = this.document.blocks;
    if (extractedContent.length > 0) {
      const _extractedContent = remainingText.split(" ");
      let _pieces = [];
      if (_extractedContent[0] !== "" || _extractedContent[1] !== void 0) {
        if (piece.length === 1) {
          _pieces = [new piece_default(extractedContent, piece[0].attributes)];
        } else {
          _pieces.push(new piece_default(" " + _extractedContent[0] + " ", piece[0].attributes));
          if (piece.length >= 2) {
            piece.forEach((obj, i) => {
              if (i !== 0) {
                _pieces.push(obj);
              }
            });
          }
        }
      } else {
        _pieces = [new piece_default(" ")];
      }
      console.log(this.document.selectedBlockId, "uniqueId3 extractTextFromDataId-vicky", uniqueId3);
      updatedBlock = addBlockAfter(this.document.blocks, this.document.selectedBlockId || "", {
        dataId: uniqueId3,
        class: strings.PARAGRAPH_BLOCK_CLASS,
        pieces: _pieces,
        type: "text"
      });
    }
    this.document.blocks = updatedBlock;
    this.document.deleteRange(this.currentCursorLocation, this.currentCursorLocation + remainingText.length, this.document.selectedBlockId, this.document.currentOffset);
    if (this.document.blocks.length > indexOfCurrentBlock + 1) {
      this.document.blocks.forEach((block, idx) => {
        newBlocks.push(block);
        if (idx === indexOfCurrentBlock)
          newBlocks.push(newImageBlock);
        else if (selectedBlockId === this.document.selectedBlockId)
          selectedBlockId = block.dataId;
      });
    } else {
      newBlocks = [...this.document.blocks, newImageBlock, newTextBlock];
      selectedBlockId = newTextBlock.dataId;
    }
    this.document.blocks = newBlocks;
    this.editorView.render();
    this.document.selectedBlockId = selectedBlockId;
    const div = document.querySelector(`[data-id="${selectedBlockId}"]`);
    div.focus();
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      if (div.firstChild) {
        range.setStart(div.firstChild, 1);
      } else {
        const textNode = document.createTextNode("");
        div.appendChild(textNode);
        range.setStart(textNode, 0);
      }
      range.collapse(true);
      sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
      sel === null || sel === void 0 ? void 0 : sel.addRange(range);
    }, 0);
  }
  createImageFragment(imageUrl, dataId) {
    if (!imageUrl || !dataId)
      return document.createDocumentFragment();
    const fragment = document.createDocumentFragment();
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.maxWidth = "30%";
    img.setAttribute("contenteditable", "false");
    fragment.appendChild(img);
    const span = document.createElement("span");
    span.setAttribute("contenteditable", "false");
    span.appendChild(fragment);
    img.addEventListener("click", () => this.addStyleToImage(dataId));
    return span;
  }
  addStyleToImage(dataId) {
    if (!dataId)
      return;
    if (!this.isCrossIconVisible) {
      const div = document.querySelector(`[data-id="${dataId}"]`);
      const span = div === null || div === void 0 ? void 0 : div.querySelector("span");
      if (span)
        span.style.position = "relative";
      const img = div === null || div === void 0 ? void 0 : div.querySelector("img");
      if (img) {
        img.style.border = "2px solid blue";
      }
      const cross = document.createElement("div");
      cross.className = strings.IMAGE_CROSS_CLASS;
      cross.innerHTML = "x";
      Object.assign(cross.style, {
        position: "absolute",
        top: "0",
        left: "50%",
        transform: "translate(-50%, 0)",
        background: "#fff",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "3px solid blue",
        zIndex: "999"
      });
      cross.addEventListener("mouseover", () => cross.style.border = "3px solid black");
      cross.addEventListener("mouseout", () => cross.style.border = "3px solid blue");
      cross.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteImage();
      });
      span === null || span === void 0 ? void 0 : span.appendChild(cross);
      this.isImageHighlighted = true;
      this.highLightedImageDataId = dataId;
      this.isCrossIconVisible = true;
    }
  }
  clearImageStyling() {
    if (!this.highLightedImageDataId)
      return;
    const div = document.querySelector(`[data-id="${this.highLightedImageDataId}"]`);
    if (div) {
      const span = div.querySelector("span");
      span === null || span === void 0 ? void 0 : span.removeAttribute("style");
      const img = span === null || span === void 0 ? void 0 : span.querySelector("img");
      if (img) {
        img.removeAttribute("style");
      }
      const cross = span === null || span === void 0 ? void 0 : span.querySelector(`.${strings.IMAGE_CROSS_CLASS}`);
      cross === null || cross === void 0 ? void 0 : cross.remove();
      this.highLightedImageDataId = "";
    }
    this.isCrossIconVisible = false;
  }
  deleteImage() {
    if (!this.highLightedImageDataId)
      return;
    this.document.blocks = this.document.blocks.filter((block) => block.dataId !== this.highLightedImageDataId);
    this.highLightedImageDataId = "";
    this.isImageHighlighted = false;
    this.clearImageStyling();
    this.document.emit("documentChanged", this);
  }
};

// ../core/dist/handlers/undoRedoManager.js
var UndoRedoManager = class {
  constructor(document2, editorView) {
    this.snapshotUndoStack = [];
    this.snapshotRedoStack = [];
    this.maxSnapshots = 5e3;
    this.document = document2;
    this.editorView = editorView;
  }
  createSnapshot() {
    const [start, end] = getSelectionRange(this.editorView);
    return {
      blocks: JSON.parse(JSON.stringify(this.document.blocks)),
      dataIds: [...this.document.dataIds],
      selectedBlockId: this.document.selectedBlockId,
      currentOffset: this.document.currentOffset,
      selection: this.getCurrentSelection(),
      cursorPosition: start
    };
  }
  getCurrentSelection() {
    const sel = saveSelection(this.document.editorView.container);
    return sel ? { start: sel.start, end: sel.end } : { start: 0, end: 0 };
  }
  saveUndoSnapshot() {
    const snapshot = this.createSnapshot();
    console.log("Saving snapshot:", snapshot.cursorPosition, "Stack length:", this.snapshotUndoStack.length);
    this.snapshotUndoStack.push(snapshot);
    if (this.snapshotUndoStack.length > this.maxSnapshots) {
      this.snapshotUndoStack.shift();
    }
    this.snapshotRedoStack = [];
  }
  restoreSnapshot(snapshot) {
    this.document.blocks = snapshot.blocks;
    this.document.dataIds = snapshot.dataIds;
    this.document._selectedBlockId = snapshot.selectedBlockId;
    this.document.currentOffset = snapshot.currentOffset;
    for (let block of this.document.blocks) {
      if (block.pieces && Array.isArray(block.pieces)) {
        block.pieces = block.pieces.map((piece) => new piece_default(piece.text, piece.attributes));
      }
    }
    this.document.emit("documentChanged", this.document);
    setTimeout(() => {
      this.document.setCursorPosition(snapshot.cursorPosition || 0);
    }, 0);
  }
  undo() {
    console.log("UNDO - Undo stack length:", this.snapshotUndoStack.length);
    console.log("UNDO - Redo stack length:", this.snapshotRedoStack.length);
    if (this.snapshotUndoStack.length === 0)
      return;
    const currentSnapshot = this.createSnapshot();
    this.snapshotRedoStack.push(currentSnapshot);
    if (this.snapshotRedoStack.length > this.maxSnapshots) {
      this.snapshotRedoStack.shift();
    }
    const snapshot = this.snapshotUndoStack.pop();
    if (snapshot) {
      console.log("UNDO - Restoring cursor position:", snapshot.cursorPosition);
      this.restoreSnapshot(snapshot);
    }
  }
  redo() {
    if (this.snapshotRedoStack.length === 0)
      return;
    const currentSnapshot = this.createSnapshot();
    this.snapshotUndoStack.push(currentSnapshot);
    if (this.snapshotUndoStack.length > this.maxSnapshots) {
      this.snapshotUndoStack.shift();
    }
    const snapshot = this.snapshotRedoStack.pop();
    if (snapshot) {
      this.restoreSnapshot(snapshot);
    }
  }
};

// ../core/dist/view/popupToolbarView.js
var PopupToolbarView = class extends events_default {
  constructor(container) {
    super();
    this.container = container;
    this.setupButtons();
  }
  setupButtons() {
    this.container.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    this.container.addEventListener("click", (e) => {
      const target = e.target;
      const btn = target.closest("button");
      if (btn) {
        const action = btn.getAttribute("data-action");
        if (action) {
          this.emit("popupAction", action);
        }
      }
    });
  }
  show(selection) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      this.hide();
      return;
    }
    this.container.style.display = "flex";
    const popupWidth = this.container.offsetWidth;
    const popupHeight = this.container.offsetHeight;
    let top = rect.top + window.scrollY - popupHeight - 8;
    let left = rect.left + window.scrollX + rect.width / 2 - popupWidth / 2;
    if (top < window.scrollY) {
      top = rect.bottom + window.scrollY + 8;
    }
    if (left < 0) {
      left = 5;
    }
    this.container.style.top = `${top}px`;
    this.container.style.left = `${left}px`;
  }
  hide() {
    this.container.style.display = "none";
  }
  updateActiveStates(attributes) {
    this.container.querySelectorAll("button").forEach((btn) => {
      const action = btn.getAttribute("data-action");
      let isActive = false;
      if (action === "bold" && attributes.bold)
        isActive = true;
      if (action === "italic" && attributes.italic)
        isActive = true;
      if (action === "underline" && attributes.underline)
        isActive = true;
      if (action === "strikethrough" && attributes.strikethrough)
        isActive = true;
      if (action === "hyperlink" && attributes.hyperlink)
        isActive = true;
      btn.classList.toggle("active", isActive);
    });
  }
};
var popupToolbarView_default = PopupToolbarView;

// ../core/dist/view/linkPopupView.js
var LinkPopupView = class {
  constructor() {
    this.linkElement = null;
    this.createPopup();
  }
  setCallbacks(onOpenClick, onUnlinkClick) {
    this.onOpenClick = onOpenClick;
    this.onUnlinkClick = onUnlinkClick;
  }
  createPopup() {
    this.popup = document.createElement("div");
    this.popup.className = "link-popup";
    this.popup.style.cssText = `
      position: absolute;
      background: #000;
      border-radius: 4px;
      padding: 2px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.5);
      z-index: 1000;
      display: none;
    `;
    const openBtn = this.createButton("Open", "\u{1F517}");
    const unlinkBtn = this.createButton("Unlink", "\u2715");
    openBtn.addEventListener("click", () => this.handleOpenClick());
    unlinkBtn.addEventListener("click", () => this.handleUnlinkClick());
    this.popup.appendChild(openBtn);
    this.popup.appendChild(unlinkBtn);
    document.body.appendChild(this.popup);
  }
  createButton(text, icon) {
    const button = document.createElement("button");
    button.innerHTML = `${icon}`;
    button.title = text;
    button.style.cssText = `
      background: transparent;
      color: white;
      border: none;
      padding: 4px;
      margin: 0 1px;
      border-radius: 2px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.1s;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    button.addEventListener("mouseenter", () => {
      button.style.background = "#333";
    });
    button.addEventListener("mouseleave", () => {
      button.style.background = "transparent";
    });
    return button;
  }
  handleOpenClick() {
    if (this.linkElement && this.onOpenClick) {
      this.onOpenClick(this.linkElement.href);
    }
  }
  handleUnlinkClick() {
    if (this.onUnlinkClick && this.linkElement) {
      this.onUnlinkClick(this.linkElement);
    }
  }
  show(linkElement, x, y) {
    this.linkElement = linkElement;
    const rect = linkElement.getBoundingClientRect();
    this.popup.style.left = `${rect.left + window.scrollX}px`;
    this.popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
    this.popup.style.display = "flex";
    this.popup.style.opacity = "0";
    this.popup.style.transform = "translateY(-2px)";
    requestAnimationFrame(() => {
      this.popup.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out";
      this.popup.style.opacity = "1";
      this.popup.style.transform = "translateY(0)";
    });
  }
  hide() {
    if (this.popup.style.display !== "none") {
      this.popup.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out";
      this.popup.style.opacity = "0";
      this.popup.style.transform = "translateY(-2px)";
      setTimeout(() => {
        this.popup.style.display = "none";
        this.popup.style.transition = "";
      }, 100);
    }
  }
  isPopup(element) {
    return this.popup.contains(element);
  }
  isVisible() {
    return this.popup.style.display !== "none";
  }
};
var linkPopupView_default = LinkPopupView;

// ../core/dist/TextIgniter.js
var TextIgniter = class extends events_default {
  constructor(editorId, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    super();
    this.savedSelection = null;
    this.debounceTimer = null;
    const { mainEditorId, toolbarId, popupToolbarId } = createEditor(editorId, config);
    this.editorContainer = document.getElementById(mainEditorId) || null;
    this.toolbarContainer = document.getElementById(toolbarId) || null;
    const popupToolbarContainer = document.getElementById(popupToolbarId) || null;
    if (!this.editorContainer || !this.toolbarContainer || !popupToolbarContainer) {
      throw new Error("Editor element not found or incorrect element type.");
    }
    this.document = new textDocument_default();
    this.editorView = new editorView_default(this.editorContainer, this.document);
    this.toolbarView = new toolbarView_default(this.toolbarContainer);
    this.popupToolbarView = new popupToolbarView_default(popupToolbarContainer);
    this.linkPopupView = new linkPopupView_default();
    this.hyperlinkHandler = new hyperlink_default(this.editorContainer, this.editorView, this.document);
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
      hyperlink: false
    };
    this.manualOverride = false;
    this.lastPiece = null;
    this.toolbarView.on("toolbarAction", (action, dataId = []) => this.handleToolbarAction(action, dataId));
    this.popupToolbarView.on("popupAction", (action) => this.handleToolbarAction(action));
    this.document.on("documentChanged", () => this.editorView.render());
    this.document.on("documentChanged", () => {
      var _a2;
      const htmlContent = this.document.getHtmlContent();
      this.emit("contentChange", {
        html: htmlContent,
        text: ((_a2 = this.editorContainer) === null || _a2 === void 0 ? void 0 : _a2.textContent) || ""
      });
    });
    this.editorContainer.addEventListener("keydown", (e) => {
      this.syncCurrentAttributesWithCursor();
      this.handleKeydown(e);
    });
    this.editorContainer.addEventListener("keyup", () => this.syncCurrentAttributesWithCursor());
    this.editorContainer.addEventListener("blur", () => {
      this.hyperlinkHandler.hideHyperlinkViewButton();
    });
    document.addEventListener("mouseup", () => {
      this.syncCurrentAttributesWithCursor();
      const dataId = this.document.getAllSelectedDataIds();
      console.log(dataId, "dataId lntgerr");
    });
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        this.document.dataIds = [];
        this.document.selectAll = false;
      }
    });
    (_a = document.getElementById("fontColor")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
      e.stopPropagation();
      const colorWrapper = document.getElementById("colorWrapper");
      const fontColorPicker = document.getElementById("fontColorPicker");
      if (!colorWrapper || !fontColorPicker)
        return;
      const isVisible = colorWrapper.style.display === "block";
      if (isVisible) {
        colorWrapper.style.display = "none";
      } else {
        colorWrapper.style.display = "block";
      }
    });
    (_b = document.getElementById("fontColorPicker")) === null || _b === void 0 ? void 0 : _b.addEventListener("input", (event) => {
      const selectedColor = event.target.value;
      const [start, end] = this.getSelectionRange();
      const indicator = document.getElementById("fontColorIndicator");
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
      } else {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          this.document.applyFontColor(start, end, selectedColor);
        }, 300);
      }
    });
    (_c = document.getElementById("colorResetFont")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
      const fontColorPicker = document.getElementById("fontColorPicker");
      const indicator = document.getElementById("fontColorIndicator");
      if (fontColorPicker) {
        fontColorPicker.value = "#000000";
        if (indicator) {
          indicator.style.backgroundColor = "#000000";
        }
        fontColorPicker.dispatchEvent(new Event("input"));
      }
    });
    document.addEventListener("click", (e) => {
      var _a2;
      const target = e.target;
      const colorWrapper = document.getElementById("colorWrapper");
      const colorBgWrapper = document.getElementById("colorBgWrapper");
      const fontColorBtn = document.getElementById("fontColor");
      const bgColorBtn = document.getElementById("bgColor");
      if (colorWrapper && !target.closest("#colorWrapper") && target !== fontColorBtn && !(fontColorBtn === null || fontColorBtn === void 0 ? void 0 : fontColorBtn.contains(target))) {
        colorWrapper.style.display = "none";
      }
      if (colorBgWrapper && !target.closest("#colorBgWrapper") && target !== bgColorBtn && !(bgColorBtn === null || bgColorBtn === void 0 ? void 0 : bgColorBtn.contains(target))) {
        colorBgWrapper.style.display = "none";
      }
      if (!((_a2 = this.editorContainer) === null || _a2 === void 0 ? void 0 : _a2.contains(target)) && !target.closest(".hyperlink-popup")) {
        this.hyperlinkHandler.hideHyperlinkViewButton();
      }
    });
    (_d = document.getElementById("bgColor")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", (e) => {
      e.stopPropagation();
      const colorBgWrapper = document.getElementById("colorBgWrapper");
      const bgColorPicker = document.getElementById("bgColorPicker");
      if (!colorBgWrapper || !bgColorPicker)
        return;
      const isVisible = colorBgWrapper.style.display === "block";
      if (isVisible) {
        colorBgWrapper.style.display = "none";
      } else {
        colorBgWrapper.style.display = "block";
      }
    });
    (_e = document.getElementById("bgColorPicker")) === null || _e === void 0 ? void 0 : _e.addEventListener("input", (event) => {
      const selectedColor = event.target.value;
      const [start, end] = this.getSelectionRange();
      const indicator = document.getElementById("bgColorIndicator");
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
      } else {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          this.document.applyBgColor(start, end, selectedColor);
        }, 300);
      }
    });
    (_f = document.getElementById("colorResetBG")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => {
      const bgColorPicker = document.getElementById("bgColorPicker");
      const indicator = document.getElementById("bgColorIndicator");
      if (bgColorPicker) {
        bgColorPicker.value = "#ffffff";
        if (indicator) {
          indicator.style.backgroundColor = "#ffffff";
        }
        bgColorPicker.dispatchEvent(new Event("input"));
      }
    });
    (_g = document.getElementById("getHtmlButton")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", (e) => {
      const htmlString = this.document.getHtmlContent(true);
      console.log("Editor HTML Content:", htmlString);
      this.htmlToJsonParser = new HtmlToJsonParser_default(htmlString);
      const jsonOutput = this.htmlToJsonParser.parse();
      console.log("htmltoJson", JSON.stringify(jsonOutput, null, 2), jsonOutput);
      this.showAcknowledgement("HTML copied to clipboard", 2e3);
    });
    (_h = document.getElementById("loadHtmlButton")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", (e) => {
      this.undoRedoManager.saveUndoSnapshot();
      const str = strings.TEST_HTML_CODE;
      this.htmlToJsonParser = new HtmlToJsonParser_default(str);
      console.log(this.htmlToJsonParser, "this.htmlToJsonParser");
      const jsonOutput = this.htmlToJsonParser.parse();
      this.document.blocks = jsonOutput;
      this.document.dataIds[0] = jsonOutput[0].dataId;
      this.document.selectedBlockId = "data-id-1734604240404";
      this.document.emit("documentChanged", this);
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
      console.log("blocks", this.document.blocks, this.document.dataIds, this.document.currentOffset);
      console.log("htmltoJson", JSON.stringify(jsonOutput, null, 2), jsonOutput);
    });
    (_j = document.getElementById("fontFamily")) === null || _j === void 0 ? void 0 : _j.addEventListener("change", (e) => {
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
      } else {
        this.document.setFontFamily(start, end, fontFamily);
      }
    });
    (_k = document.getElementById("fontSize")) === null || _k === void 0 ? void 0 : _k.addEventListener("change", (e) => {
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
      } else {
        this.document.setFontSize(start, end, fontSize);
      }
    });
    (_l = document.getElementById("alignLeft")) === null || _l === void 0 ? void 0 : _l.addEventListener("click", () => {
      console.log("alignment alignLeft", this.document.dataIds);
      this.document.dataIds.forEach((obj) => this.document.setAlignment("left", obj));
    });
    (_m = document.getElementById("alignCenter")) === null || _m === void 0 ? void 0 : _m.addEventListener("click", () => {
      console.log("alignment alignCenter", this.document.dataIds);
      this.document.dataIds.forEach((obj) => this.document.setAlignment("center", obj));
    });
    (_o = document.getElementById("alignRight")) === null || _o === void 0 ? void 0 : _o.addEventListener("click", () => {
      console.log("alignment alignRight", this.document.dataIds);
      this.document.dataIds.forEach((obj) => this.document.setAlignment("right", obj));
    });
    this.editorContainer.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        const key = e.key.toLowerCase();
        if (["b", "i", "u", "h"].includes(key)) {
          e.preventDefault();
          let action = "b";
          switch (key) {
            case "b":
              action = "bold";
              break;
            case "i":
              action = "italic";
              break;
            case "u":
              action = "underline";
              break;
            case "h":
              action = "hyperlink";
              break;
            default:
              break;
          }
          this.handleToolbarAction(action);
        }
        if (key === "z") {
          e.preventDefault();
          this.undoRedoManager.undo();
        } else if (key === "y") {
          e.preventDefault();
          this.undoRedoManager.redo();
        }
        if (key === "a") {
          const dataId = this.document.handleCtrlASelection();
          this.document.selectAll = true;
          console.log("Selected text is inside element with data-id:", dataId);
        }
        if (e.key === "l") {
          e.preventDefault();
          this.document.setAlignment("left", this.document.selectedBlockId);
        } else if (e.key === "e") {
          e.preventDefault();
          this.document.setAlignment("center", this.document.selectedBlockId);
        } else if (e.key === "r") {
          e.preventDefault();
          this.document.setAlignment("right", this.document.selectedBlockId);
        }
      }
    });
    document.addEventListener("selectionchange", this.handleSelectionChange.bind(this));
    this.editorContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target.tagName === "A" || target.closest("a")) {
        e.preventDefault();
        e.stopPropagation();
        const linkElement = target.tagName === "A" ? target : target.closest("a");
        this.showLinkPopup(linkElement, e.clientX, e.clientY);
      } else {
        this.hideLinkPopup();
      }
    });
    document.addEventListener("click", (e) => {
      if (!this.linkPopupView.isPopup(e.target)) {
        this.hideLinkPopup();
      }
    });
    this.document.emit("documentChanged", this.document);
    this.editorContainer.addEventListener("paste", (e) => {
      var _a2, _b2;
      this.undoRedoManager.saveUndoSnapshot();
      e.preventDefault();
      const html = (_a2 = e.clipboardData) === null || _a2 === void 0 ? void 0 : _a2.getData("text/html");
      const [start, end] = this.getSelectionRange();
      if (end > start) {
        this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
      }
      let piecesToInsert = [];
      if (html) {
        piecesToInsert = parseHtmlToPieces(html);
      } else {
        const text = ((_b2 = e.clipboardData) === null || _b2 === void 0 ? void 0 : _b2.getData("text/plain")) || "";
        const segments = detectUrlsInText(text);
        piecesToInsert = segments.map((segment) => {
          if (segment.isUrl && segment.url) {
            return new piece_default(segment.text, Object.assign(Object.assign({}, this.currentAttributes), { hyperlink: segment.url }));
          } else {
            return new piece_default(segment.text, Object.assign({}, this.currentAttributes));
          }
        });
      }
      let offset = start;
      for (const p of piecesToInsert) {
        this.document.insertAt(p.text, Object.assign({}, p.attributes), offset, this.document.selectedBlockId, 0, "", "batch");
        offset += p.text.length;
      }
      this.setCursorPosition(offset);
    });
    this.editorContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    this.editorContainer.addEventListener("drop", (e) => {
      var _a2, _b2;
      e.preventDefault();
      this.undoRedoManager.saveUndoSnapshot();
      const html = (_a2 = e.dataTransfer) === null || _a2 === void 0 ? void 0 : _a2.getData("text/html");
      const [start, end] = this.getSelectionRange();
      if (end > start) {
        this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
      }
      let piecesToInsert = [];
      if (html) {
        piecesToInsert = parseHtmlToPieces(html);
      } else {
        const text = ((_b2 = e.dataTransfer) === null || _b2 === void 0 ? void 0 : _b2.getData("text/plain")) || "";
        piecesToInsert = [new piece_default(text, Object.assign({}, this.currentAttributes))];
      }
      let offset = start;
      for (const p of piecesToInsert) {
        this.document.insertAt(p.text, Object.assign({}, p.attributes), offset, this.document.selectedBlockId, 0, "", "batch");
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
      case "orderedList":
        if (this.document.dataIds.length > 1) {
          this.document.toggleOrderedListForMultipleBlocks(this.document.dataIds);
        } else {
          const currentBlockId = this.document.selectedBlockId || this.document.dataIds[0];
          this.document.toggleOrderedList(currentBlockId);
        }
        this.document.updateOrderedListNumbers();
        break;
      case "unorderedList":
        this.document.dataIds.forEach((id) => {
          this.document.toggleUnorderedList(id);
        });
        break;
      case "image":
        this.imageHandler.insertImage();
        break;
      default:
        if (start < end) {
          this.undoRedoManager.saveUndoSnapshot();
          switch (action) {
            case "bold":
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
              } else {
                this.document.toggleBoldRange(start, end);
              }
              break;
            case "italic":
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
              } else {
                this.document.toggleItalicRange(start, end);
              }
              break;
            case "underline":
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
              } else {
                this.document.toggleUnderlineRange(start, end);
              }
              break;
            case "strikethrough":
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
              } else {
                this.document.toggleStrikethroughRange(start, end);
              }
              break;
            case "hyperlink":
              this.hyperlinkHandler.hanldeHyperlinkClick(start, end, this.document.currentOffset, this.document.selectedBlockId, this.document.blocks);
              break;
          }
        } else {
          this.currentAttributes[action] = !this.currentAttributes[action];
          this.manualOverride = true;
        }
        break;
    }
    this.toolbarView.updateActiveStates(this.currentAttributes);
  }
  handleSelectionChange() {
    var _a, _b;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !((_a = this.editorContainer) === null || _a === void 0 ? void 0 : _a.contains(selection.anchorNode))) {
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
    } else {
      this.document.getAllSelectedDataIds();
      if (this.document.dataIds.length === this.document.blocks.length && this.document.blocks.length > 0) {
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
    const parentBlock = ((_b = range.startContainer.parentElement) === null || _b === void 0 ? void 0 : _b.closest("[data-id]")) || range.startContainer;
    if (parentBlock instanceof HTMLElement) {
      this.document.selectedBlockId = parentBlock.getAttribute("data-id") || (range.startContainer instanceof HTMLElement ? range.startContainer.getAttribute("data-id") : null);
    }
    this.syncCurrentAttributesWithCursor();
  }
  handleKeydown(e) {
    var _a, _b;
    const [start, end] = this.getSelectionRange();
    this.imageHandler.currentCursorLocation = start;
    if (e.key === "Enter") {
      e.preventDefault();
      this.undoRedoManager.saveUndoSnapshot();
      const uniqueId = `data-id-${Date.now()}`;
      const currentBlockIndex = this.document.blocks.findIndex((block) => block.dataId === this.document.selectedBlockId);
      const currentBlock = this.document.blocks[currentBlockIndex];
      const lastPiece = ((_a = currentBlock === null || currentBlock === void 0 ? void 0 : currentBlock.pieces) === null || _a === void 0 ? void 0 : _a.length) > 0 ? currentBlock.pieces[currentBlock.pieces.length - 1] : null;
      const lastPieceAttributes = lastPiece ? Object.assign({}, lastPiece.attributes) : {
        fontFamily: "Arial",
        fontSize: "16px",
        fontColor: "#000000",
        bgColor: "#ffffff",
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false
      };
      if (currentBlock && currentBlock.type === "image") {
        this.document.blocks.splice(currentBlockIndex + 1, 0, {
          dataId: uniqueId,
          class: "paragraph-block",
          pieces: [new piece_default("\u200B", lastPieceAttributes)],
          type: "text"
        });
        this.document.emit("documentChanged", this);
        this.imageHandler.setCursorPostion(1, uniqueId);
      } else if (currentBlock && (currentBlock.listType === "ol" || currentBlock.listType === "ul" || currentBlock.listType === "li")) {
        let newBlock = {
          dataId: uniqueId,
          class: "paragraph-block",
          pieces: [new piece_default("\u200B", lastPieceAttributes)],
          type: "text"
        };
        let listParentId = "";
        if (currentBlock.listType === "ol") {
          newBlock.listType = "li";
          newBlock.listStart = currentBlock.listStart + 1;
          newBlock.parentId = currentBlock.dataId;
          listParentId = currentBlock.dataId;
        } else if (currentBlock.listType === "li") {
          newBlock.listType = "li";
          newBlock.listStart = currentBlock.listStart + 1;
          newBlock.parentId = currentBlock.parentId;
          listParentId = currentBlock.parentId;
        } else if (currentBlock.listType === "ul") {
          newBlock.listType = "ul";
          newBlock.parentId = currentBlock.parentId || currentBlock.dataId;
        }
        this.document.blocks.splice(currentBlockIndex + 1, 0, newBlock);
        if (currentBlock.listType === "ol" || currentBlock.listType === "li") {
          for (let i = currentBlockIndex + 2; i < this.document.blocks.length; i++) {
            const block = this.document.blocks[i];
            if (block.listType === "li" && block.parentId === listParentId) {
              block.listStart += 1;
            } else {
              break;
            }
          }
        }
      } else {
        const cursorBlock = this.getCurrentCursorBlock();
        const cursorBlockId = cursorBlock === null || cursorBlock === void 0 ? void 0 : cursorBlock.toString();
        if (cursorBlockId && currentBlock && currentBlock.type === "text") {
          const cursorOffset = start - this.document.currentOffset;
          const beforePieces = [];
          const afterPieces = [];
          let offset = 0;
          for (const piece of currentBlock.pieces) {
            const pieceEnd = offset + piece.text.length;
            if (pieceEnd <= cursorOffset) {
              beforePieces.push(piece.clone());
            } else if (offset >= cursorOffset) {
              afterPieces.push(piece.clone());
            } else {
              const splitPoint = cursorOffset - offset;
              const beforeText = piece.text.slice(0, splitPoint);
              const afterText = piece.text.slice(splitPoint);
              if (beforeText) {
                beforePieces.push(new piece_default(beforeText, Object.assign({}, piece.attributes)));
              }
              if (afterText) {
                afterPieces.push(new piece_default(afterText, Object.assign({}, piece.attributes)));
              }
            }
            offset = pieceEnd;
          }
          currentBlock.pieces = beforePieces.length > 0 ? beforePieces : [new piece_default("\u200B", lastPieceAttributes)];
          const newPieces = afterPieces.length > 0 ? afterPieces : [new piece_default("\u200B", lastPieceAttributes)];
          const updatedBlock = this.addBlockAfter(this.document.blocks, cursorBlockId, {
            dataId: uniqueId,
            class: "paragraph-block",
            pieces: newPieces,
            type: "text"
          });
          this.document.blocks = updatedBlock;
        } else {
          this.document.blocks.push({
            dataId: uniqueId,
            class: "paragraph-block",
            pieces: [new piece_default("\u200B", lastPieceAttributes)],
            type: "text"
          });
        }
      }
      this.syncCurrentAttributesWithCursor();
      this.editorView.render();
      this.setCursorPosition(end + 1, uniqueId);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      if (this.imageHandler.isImageHighlighted) {
        const currentBlockIndex = this.document.blocks.findIndex((block) => block.dataId === this.imageHandler.highLightedImageDataId);
        this.imageHandler.deleteImage();
        this.imageHandler.setCursorPostion(1, this.document.blocks[currentBlockIndex - 1].dataId);
        return;
      }
      const selection = window.getSelection();
      console.log(selection, "selection lntgerr");
      const isAllTextSelected = this.document.selectAll || this.document.dataIds.length === this.document.blocks.length && this.document.dataIds.length > 0;
      if ((isAllTextSelected || this.document.dataIds.length > 1) && !((_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.isCollapsed)) {
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
            class: "paragraph-block",
            pieces: [new piece_default(" ")],
            type: "text"
          });
          targetBlockId = newId;
          cursorPos = 0;
          this.editorView.render();
        } else if (deletedIndex < this.document.blocks.length) {
          targetBlockId = this.document.blocks[deletedIndex].dataId;
          cursorPos = 0;
        } else {
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
        console.log(index, "index lntgerr");
        const chkBlock = document.querySelector(`[data-id="${this.document.selectedBlockId}"]`);
        if (chkBlock === null) {
          let listStart = 0;
          console.log(listStart, " listStart lntgerr");
          const _blocks = this.document.blocks.map((block, index2) => {
            if ((block === null || block === void 0 ? void 0 : block.listType) !== void 0 || (block === null || block === void 0 ? void 0 : block.listType) !== null) {
              if ((block === null || block === void 0 ? void 0 : block.listType) === "ol") {
                listStart = 1;
                block.listStart = 1;
              } else if ((block === null || block === void 0 ? void 0 : block.listType) === "li") {
                listStart = listStart + 1;
                block.listStart = listStart;
              }
            }
            return block;
          });
          console.log(_blocks, "blocks lntgerr");
          this.document.emit("documentChanged", this);
        }
      } else if (start === end && start > 0) {
        this.document.deleteRange(start - 1, start, this.document.selectedBlockId, this.document.currentOffset, true);
        this.setCursorPosition(start - 1);
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (end > start) {
        this.undoRedoManager.saveUndoSnapshot();
        this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset, false);
      }
      console.log("insertat", e.key, this.currentAttributes, start, this.document.selectedBlockId, this.document.currentOffset, "", "", !e.isTrusted || false);
      this.document.insertAt(e.key, this.currentAttributes, start, this.document.selectedBlockId, this.document.currentOffset, "", "", !e.isTrusted || false);
      this.setCursorPosition(start + 1);
    } else if (e.key === "Delete") {
      e.preventDefault();
      if (start === end) {
        this.undoRedoManager.saveUndoSnapshot();
        if (end > start) {
          const adjustedOffset = Math.min(this.document.currentOffset, start);
          this.document.deleteRange(start, end, this.document.selectedBlockId, adjustedOffset);
          this.setCursorPosition(start);
        } else if (end > start) {
          this.undoRedoManager.saveUndoSnapshot();
          this.document.deleteRange(start, end, this.document.selectedBlockId);
          return;
        }
        const blockIndex = this.document.blocks.findIndex((block2) => block2.dataId === this.document.selectedBlockId);
        if (blockIndex === -1)
          return;
        const block = this.document.blocks[blockIndex];
        const blockTextLength = block.pieces.reduce((acc, p) => acc + p.text.length, 0);
        const relPos = start - this.document.currentOffset;
        if (relPos < blockTextLength) {
          this.document.deleteRange(start, start + 1, this.document.selectedBlockId, this.document.currentOffset, false);
          this.setCursorPosition(start);
        } else if (end > start) {
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
    console.log("selection::", selection);
    if (!selection || selection.rangeCount === 0) {
      return { remainingText: "", piece: null };
    }
    const range = selection.getRangeAt(0);
    const cursorNode = range.startContainer;
    let fText = "";
    let count = 0;
    console.log(count, "count lntgerr");
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
      return { remainingText: "", piece: null };
    }
    if (!element.contains(cursorNode)) {
      console.error(`Cursor is not inside the element with data-id "${dataId}".`);
      return { remainingText: "", piece: null };
    }
    const fullText = fText;
    const cursorOffset = textPosition === null || textPosition === void 0 ? void 0 : textPosition.offset;
    const remainingText = fullText.slice(cursorOffset);
    const newContent = fullText.slice(0, cursorOffset);
    element.textContent = newContent;
    return { remainingText, piece: _piece };
  }
  getCurrentCursorBlock() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }
    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    const elementWithId = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
    let dataIdElement = null;
    if (elementWithId && elementWithId instanceof Element) {
      dataIdElement = elementWithId.closest("[data-id]");
    }
    return (dataIdElement === null || dataIdElement === void 0 ? void 0 : dataIdElement.getAttribute("data-id")) || null;
  }
  addBlockAfter(data, targetDataId, newBlock) {
    const targetIndex = data.findIndex((block) => block.dataId === targetDataId);
    if (targetIndex === -1) {
      console.error(`Block with dataId "${targetDataId}" not found.`);
      return data;
    }
    const updatedData = [
      ...data.slice(0, targetIndex + 1),
      newBlock,
      ...data.slice(targetIndex + 1)
    ];
    return updatedData;
  }
  syncCurrentAttributesWithCursor() {
    var _a;
    const [start, end] = this.getSelectionRange();
    console.log("log1", { start, end });
    const blockIndex = this.document.blocks.findIndex((block) => block.dataId === this.document.selectedBlockId);
    if (((_a = this.document.blocks[blockIndex]) === null || _a === void 0 ? void 0 : _a.type) === "image") {
      this.imageHandler.addStyleToImage(this.document.selectedBlockId || "");
    } else {
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
            bgColor: piece.attributes.bgColor
          };
          this.toolbarView.updateActiveStates(this.currentAttributes);
          this.popupToolbarView.updateActiveStates(this.currentAttributes);
        }
        this.hyperlinkHandler.hideHyperlinkViewButton();
      } else {
        this.hyperlinkHandler.hideHyperlinkViewButton();
        if (!this.manualOverride) {
          this.currentAttributes = {
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            hyperlink: false
          };
          this.toolbarView.updateActiveStates(this.currentAttributes);
          this.popupToolbarView.updateActiveStates(this.currentAttributes);
        }
        this.lastPiece = null;
      }
    } else {
      this.hyperlinkHandler.hideHyperlinkViewButton();
      const allBold = this.document.isRangeEntirelyAttribute(start, end, "bold");
      const allItalic = this.document.isRangeEntirelyAttribute(start, end, "italic");
      const allUnderline = this.document.isRangeEntirelyAttribute(start, end, "underline");
      const allStrikethrough = this.document.isRangeEntirelyAttribute(start, end, "strikethrough");
      this.currentAttributes = {
        bold: allBold,
        italic: allItalic,
        underline: allUnderline,
        strikethrough: allStrikethrough,
        hyperlink: false
      };
      this.toolbarView.updateActiveStates(this.currentAttributes);
      this.popupToolbarView.updateActiveStates(this.currentAttributes);
    }
  }
  setCursorPosition(position, dataId = "") {
    if (dataId === "")
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
    while (node = nodeStack.pop()) {
      if (node.nodeType === 3) {
        const textNode = node;
        const nextCharIndex = charIndex + textNode.length;
        if (position >= charIndex && position <= nextCharIndex) {
          range.setStart(textNode, position - charIndex);
          range.collapse(true);
          break;
        }
        charIndex = nextCharIndex;
      } else if (node.tagName === "BR") {
        if (position === charIndex) {
          range.setStartBefore(node);
          range.collapse(true);
          break;
        }
        charIndex++;
      } else {
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
  showAcknowledgement(message, durationMs = 2e3) {
    const existing = document.getElementById(strings.TOAST_ID);
    if (existing) {
      existing.remove();
    }
    const toast = document.createElement("div");
    toast.id = strings.TOAST_ID;
    toast.className = "ti-toast";
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
    window.open(url, "_blank");
    this.hideLinkPopup();
  }
  unlinkText(linkElement) {
    this.undoRedoManager.saveUndoSnapshot();
    const linkText = linkElement.textContent || "";
    const documentText = this.editorView.container.textContent || "";
    const linkIndex = documentText.indexOf(linkText);
    if (linkIndex !== -1) {
      this.document.formatAttribute(linkIndex, linkIndex + linkText.length, "hyperlink", false);
      this.editorView.render();
    }
    this.hideLinkPopup();
  }
  onContentChange(callback) {
    this.on("contentChange", callback);
  }
  getContent() {
    return this.document.getHtmlContent() || "";
  }
  getTextContent() {
    var _a;
    return ((_a = this.editorContainer) === null || _a === void 0 ? void 0 : _a.textContent) || "";
  }
};
window.TextIgniter = TextIgniter;

// src/component/TextIgniterComponent.ts
var TextIgniterComponent = class extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
    this.config = {};
    this.template = `<div id="editor-container"></div>`;
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
  }
  static get observedAttributes() {
    return ["config"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "config" && newValue !== oldValue) {
      try {
        console.log(newValue);
        const parsedConfig = JSON.parse(newValue);
        this.config = parsedConfig;
        this.initializeEditor();
      } catch (e) {
        console.error("Failed to parse config: ", e);
      }
    }
  }
  connectedCallback() {
    if (this.initialized) {
      return;
    }
    this.initializeEditor();
  }
  initializeEditor() {
    var _a;
    if (this.initialized) {
      return;
    }
    const editorContainer = (_a = this.querySelector("#editor-container")) == null ? void 0 : _a.id;
    if (!editorContainer) {
      console.error("Editor element not found inside the DOM.");
      return;
    }
    try {
      this.initialized = true;
      this.textIgniter = new TextIgniter(
        editorContainer,
        this.config
      );
      this.textIgniter.onContentChange((data) => {
        const event = new CustomEvent("content-change", {
          detail: data,
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(event);
      });
    } catch (error) {
      console.error("Failed to initialize TextIgniter:", error);
      this.initialized = false;
    }
  }
};
if (!customElements.get("text-igniter")) {
  customElements.define("text-igniter", TextIgniterComponent);
}
export {
  TextIgniterComponent
};
//# sourceMappingURL=index.js.map
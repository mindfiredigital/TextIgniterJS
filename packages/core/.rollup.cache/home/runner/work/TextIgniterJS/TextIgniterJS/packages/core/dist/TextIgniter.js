/* eslint-disable no-unused-vars */
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
export class TextIgniter {
  constructor(editorId, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    this.savedSelection = null;
    this.debounceTimer = null;
    const { mainEditorId, toolbarId } = createEditor(editorId, config);
    this.editorContainer = document.getElementById(mainEditorId) || null;
    this.toolbarContainer = document.getElementById(toolbarId) || null;
    if (!this.editorContainer || !this.toolbarContainer) {
      throw new Error('Editor element not found or incorrect element type.');
    }
    this.document = new TextDocument();
    this.editorView = new EditorView(this.editorContainer, this.document);
    this.toolbarView = new ToolbarView(this.toolbarContainer);
    this.hyperlinkHandler = new HyperlinkHandler(
      this.editorContainer,
      this.editorView,
      this.document
    );
    this.imageHandler = new ImageHandler(this.editorContainer, this.document);
    this.undoRedoManager = new UndoRedoManager(this.document, this.editorView);
    this.editorView.setImageHandler(this.imageHandler);
    this.imageHandler.setEditorView(this.editorView);
    this.document.setEditorView(this.editorView);
    this.document.setUndoRedoManager(this.undoRedoManager);
    this.hyperlinkHandler.setUndoRedoManager(this.undoRedoManager);
    this.currentAttributes = {
      bold: false,
      italic: false,
      underline: false,
      undo: false,
      redo: false,
      hyperlink: false,
    };
    this.manualOverride = false;
    this.lastPiece = null;
    this.toolbarView.on('toolbarAction', (action, dataId = []) =>
      this.handleToolbarAction(action, dataId)
    );
    this.document.on('documentChanged', () => this.editorView.render());
    this.editorContainer.addEventListener('keydown', e => {
      this.syncCurrentAttributesWithCursor();
      this.handleKeydown(e);
    });
    this.editorContainer.addEventListener('keyup', () =>
      this.syncCurrentAttributesWithCursor()
    );
    this.editorContainer.addEventListener('blur', () => {
      this.hyperlinkHandler.hideHyperlinkViewButton();
    });
    document.addEventListener('mouseup', () => {
      this.syncCurrentAttributesWithCursor();
    });
    (_a = document.getElementById('fontColor')) === null || _a === void 0
      ? void 0
      : _a.addEventListener('click', e => {
          const fontColorPicker = document.getElementById('fontColorPicker');
          fontColorPicker.style.display = 'inline';
          const colorWrapper = document.getElementById('colorWrapper');
          // Get the button's position (x, y)
          const rect = e.target.getBoundingClientRect();
          const x = rect.left + window.scrollX; // Adjust for scrolling
          const y = rect.bottom + window.scrollY; // Position below the button
          const resetButton = document.getElementById('colorResetFont');
          resetButton.style.display = 'inline-block';
          resetButton.addEventListener('click', () => {
            fontColorPicker.value = '#000000';
            resetButton.style.display = 'none';
          });
          // Position the color picker
          colorWrapper.style.position = 'absolute';
          colorWrapper.style.left = `${x - 2}px`;
          colorWrapper.style.top = `${y - 15}px`;
          colorWrapper.style.display = 'block'; // Show the color picker
          fontColorPicker.click();
          if (fontColorPicker) {
            fontColorPicker.addEventListener('input', event => {
              const selectedColor = event.target.value;
              const [start, end] = this.getSelectionRange();
              if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach(block => {
                  if (this.document.dataIds.includes(block.dataId)) {
                    this.document.selectedBlockId = block.dataId;
                    let countE = 0;
                    block.pieces.forEach(obj => {
                      countE += obj.text.length;
                    });
                    let countS = start - countE;
                    this.document.applyFontColor(countS, countE, selectedColor);
                  }
                });
              } else {
                if (this.debounceTimer) {
                  clearTimeout(this.debounceTimer); // Clear previous timer
                }
                this.debounceTimer = setTimeout(() => {
                  this.document.applyFontColor(start, end, selectedColor);
                }, 300);
              }
            });
          }
        });
    (_b = document.getElementById('bgColor')) === null || _b === void 0
      ? void 0
      : _b.addEventListener('click', e => {
          const bgColorPicker = document.getElementById('bgColorPicker');
          bgColorPicker.style.display = 'inline';
          const colorBgWrapper = document.getElementById('colorBgWrapper');
          // Get the button's position (x, y)
          const rect = e.target.getBoundingClientRect();
          const x = rect.left + window.scrollX; // Adjust for scrolling
          const y = rect.bottom + window.scrollY; // Position below the button
          const resetButton = document.getElementById('colorResetBG');
          resetButton.style.display = 'inline-block';
          resetButton.addEventListener('click', () => {
            bgColorPicker.value = '#ffffff';
            resetButton.style.display = 'none';
            console.log(y, 'resetb');
          });
          // Position the color picker
          colorBgWrapper.style.position = 'absolute';
          colorBgWrapper.style.left = `${x - 2}px`;
          colorBgWrapper.style.top = `${y - 15}px`;
          colorBgWrapper.style.display = 'block'; // Show the color picker
          bgColorPicker.click();
          if (bgColorPicker) {
            bgColorPicker.addEventListener('input', event => {
              const selectedColor = event.target.value;
              const [start, end] = this.getSelectionRange();
              if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach(block => {
                  if (this.document.dataIds.includes(block.dataId)) {
                    this.document.selectedBlockId = block.dataId;
                    let countE = 0;
                    block.pieces.forEach(obj => {
                      countE += obj.text.length;
                    });
                    let countS = start - countE;
                    this.document.applyBgColor(countS, countE, selectedColor);
                  }
                });
              } else {
                if (this.debounceTimer) {
                  clearTimeout(this.debounceTimer); // Clear previous timer
                }
                this.debounceTimer = setTimeout(() => {
                  this.document.applyBgColor(start, end, selectedColor);
                }, 300);
              }
              // this.document.applyFontColor(start, end, selectedColor);
            });
          }
        });
    (_c = document.getElementById('getHtmlButton')) === null || _c === void 0
      ? void 0
      : _c.addEventListener('click', e => {
          const htmlString = this.document.getHtmlContent();
          console.log('Editor HTML Content:', htmlString);
          this.htmlToJsonParser = new HtmlToJsonParser(htmlString);
          const jsonOutput = this.htmlToJsonParser.parse();
          console.log(
            'htmltoJson',
            JSON.stringify(jsonOutput, null, 2),
            jsonOutput
          );
        });
    (_d = document.getElementById('loadHtmlButton')) === null || _d === void 0
      ? void 0
      : _d.addEventListener('click', e => {
          // const htmlString = this.document.getHtmlContent();
          this.undoRedoManager.saveUndoSnapshot();
          const str = strings.TEST_HTML_CODE;
          this.htmlToJsonParser = new HtmlToJsonParser(str);
          console.log(this.htmlToJsonParser, 'this.htmlToJsonParser');
          const jsonOutput = this.htmlToJsonParser.parse();
          this.document.blocks = jsonOutput;
          this.document.dataIds[0] = jsonOutput[0].dataId;
          this.document.selectedBlockId = 'data-id-1734604240404';
          this.document.emit('documentChanged', this);
          // eslint-disable-next-line no-unused-vars
          const [start, end] = this.getSelectionRange();
          this.document.blocks.forEach(block => {
            if (this.document.dataIds.includes(block.dataId)) {
              this.document.selectedBlockId = block.dataId;
              let countE = 0;
              block.pieces.forEach(obj => {
                countE += obj.text.length;
              });
              let countS = start - countE;
              this.document.setFontSize(countS, countE, block.fontSize);
            }
          });
          console.log(
            'blocks',
            this.document.blocks,
            this.document.dataIds,
            this.document.currentOffset
          );
          console.log(
            'htmltoJson',
            JSON.stringify(jsonOutput, null, 2),
            jsonOutput
          );
        });
    (_e = document.getElementById('fontFamily')) === null || _e === void 0
      ? void 0
      : _e.addEventListener('change', e => {
          this.undoRedoManager.saveUndoSnapshot();
          const fontFamily = e.target.value;
          const [start, end] = this.getSelectionRange();
          if (this.document.dataIds.length > 1) {
            this.document.blocks.forEach(block => {
              if (this.document.dataIds.includes(block.dataId)) {
                this.document.selectedBlockId = block.dataId;
                let countE = 0;
                block.pieces.forEach(obj => {
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
    (_f = document.getElementById('fontSize')) === null || _f === void 0
      ? void 0
      : _f.addEventListener('change', e => {
          this.undoRedoManager.saveUndoSnapshot();
          const fontSize = e.target.value;
          const [start, end] = this.getSelectionRange();
          if (this.document.dataIds.length > 1) {
            this.document.blocks.forEach(block => {
              if (this.document.dataIds.includes(block.dataId)) {
                this.document.selectedBlockId = block.dataId;
                let countE = 0;
                block.pieces.forEach(obj => {
                  countE += obj.text.length;
                });
                let countS = start - countE;
                this.document.setFontSize(countS, countE, fontSize);
              }
            });
          } else {
            this.document.setFontSize(start, end, fontSize);
          }
          // this.document.setFontSize(start, end, fontSize);
        });
    (_g = document.getElementById('alignLeft')) === null || _g === void 0
      ? void 0
      : _g.addEventListener('click', () => {
          this.document.dataIds.forEach(obj =>
            this.document.setAlignment('left', obj)
          );
          // this.document.setAlignment('left', this.document.selectedBlockId);
        });
    (_h = document.getElementById('alignCenter')) === null || _h === void 0
      ? void 0
      : _h.addEventListener('click', () => {
          this.document.dataIds.forEach(obj =>
            this.document.setAlignment('center', obj)
          );
          // this.document.setAlignment('center', this.document.selectedBlockId);
        });
    (_j = document.getElementById('alignRight')) === null || _j === void 0
      ? void 0
      : _j.addEventListener('click', () => {
          this.document.dataIds.forEach(obj =>
            this.document.setAlignment('right', obj)
          );
          // this.document.setAlignment('right', this.document.selectedBlockId);
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
          // const [start, end] = this.getSelectionRange();
          this.undoRedoManager.undo();
          // this.document.undo();
          // if (this.document.undoStack.length > 0)
          // this.setCursorPosition(start - 1);
          // console.log("undoStack", this.document.undoStack)
          // console.log("redoStack", this.document.redoStack)
        } else if (key === 'y') {
          e.preventDefault();
          // const [start, end] = this.getSelectionRange();
          // this.document.redo();
          this.undoRedoManager.redo();
          // if (this.document.redoStack.length > 0)
          // this.setCursorPosition(start + 1);
          // console.log("undoStack", this.document.undoStack)
          // console.log("redoStack", this.document.redoStack)
        }
        if (key === 'a') {
          // e.preventDefault();
          const dataId = this.document.handleCtrlASelection();
          this.document.selectAll = true;
          console.log('Selected text is inside element with data-id:', dataId);
        }
        if (e.key === 'l') {
          e.preventDefault();
          this.document.setAlignment('left', this.document.selectedBlockId);
        } else if (e.key === 'e') {
          e.preventDefault();
          this.document.setAlignment('center', this.document.selectedBlockId);
        } else if (e.key === 'r') {
          e.preventDefault();
          this.document.setAlignment('right', this.document.selectedBlockId);
        }
        // console.log('undo', this.document.undoStack, 'redo', this.document.redoStack);
      }
    });
    document.addEventListener(
      'selectionchange',
      this.handleSelectionChange.bind(this)
    );
    this.document.emit('documentChanged', this.document);
    this.editorContainer.addEventListener('paste', e => {
      var _a, _b;
      this.undoRedoManager.saveUndoSnapshot();
      e.preventDefault();
      const html =
        (_a = e.clipboardData) === null || _a === void 0
          ? void 0
          : _a.getData('text/html');
      const [start, end] = this.getSelectionRange();
      if (end > start) {
        this.document.deleteRange(start, end);
      }
      let piecesToInsert = [];
      if (html) {
        piecesToInsert = parseHtmlToPieces(html);
      } else {
        const text =
          ((_b = e.clipboardData) === null || _b === void 0
            ? void 0
            : _b.getData('text/plain')) || '';
        piecesToInsert = [
          new Piece(text, Object.assign({}, this.currentAttributes)),
        ];
      }
      let offset = start;
      for (const p of piecesToInsert) {
        this.document.insertAt(
          p.text,
          Object.assign({}, p.attributes),
          offset,
          this.document.selectedBlockId
        );
        offset += p.text.length;
      }
      this.setCursorPosition(offset);
    });
    this.editorContainer.addEventListener('dragover', e => {
      e.preventDefault();
    });
    this.editorContainer.addEventListener('drop', e => {
      var _a, _b;
      e.preventDefault();
      const html =
        (_a = e.dataTransfer) === null || _a === void 0
          ? void 0
          : _a.getData('text/html');
      const [start, end] = this.getSelectionRange();
      if (end > start) {
        this.document.deleteRange(start, end);
      }
      let piecesToInsert = [];
      if (html) {
        piecesToInsert = parseHtmlToPieces(html);
      } else {
        const text =
          ((_b = e.dataTransfer) === null || _b === void 0
            ? void 0
            : _b.getData('text/plain')) || '';
        piecesToInsert = [
          new Piece(text, Object.assign({}, this.currentAttributes)),
        ];
      }
      let offset = start;
      for (const p of piecesToInsert) {
        this.document.insertAt(
          p.text,
          Object.assign({}, p.attributes),
          offset,
          this.document.selectedBlockId
        );
        offset += p.text.length;
      }
      this.setCursorPosition(offset);
    });
  }
  getSelectionRange() {
    const sel = saveSelection(this.editorView.container);
    if (!sel) return [0, 0];
    return [sel.start, sel.end];
  }
  // Function to apply selected color
  applyFontColor(color) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;
    // Apply color to pieces
    // this.applyFontColor(selection, color);
  }
  // Toolbar action handler
  handleToolbarAction(action, dataId = []) {
    const [start, end] = this.getSelectionRange();
    switch (action) {
      case 'orderedList':
        // Toggle ordered list for each selected block
        this.document.dataIds.forEach(id => {
          this.document.toggleOrderedList(id);
        });
        // Recalculate numbering for contiguous ordered list blocks
        this.document.updateOrderedListNumbers();
        break;
      case 'unorderedList':
        this.document.dataIds.forEach(id => {
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
                this.document.blocks.forEach(block => {
                  if (this.document.dataIds.includes(block.dataId)) {
                    this.document.selectedBlockId = block.dataId;
                    let countE = 0;
                    block.pieces.forEach(obj => {
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
            case 'italic':
              if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach(block => {
                  if (this.document.dataIds.includes(block.dataId)) {
                    this.document.selectedBlockId = block.dataId;
                    let countE = 0;
                    block.pieces.forEach(obj => {
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
            case 'underline':
              if (this.document.dataIds.length > 1) {
                this.document.blocks.forEach(block => {
                  if (this.document.dataIds.includes(block.dataId)) {
                    this.document.selectedBlockId = block.dataId;
                    let countE = 0;
                    block.pieces.forEach(obj => {
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
            // case 'undo':
            //   this.document.undo();
            //   break;
            // case 'redo':
            //   this.document.redo();
            //   break;
            case 'hyperlink':
              this.hyperlinkHandler.hanldeHyperlinkClick(
                start,
                end,
                this.document.currentOffset,
                this.document.selectedBlockId,
                this.document.blocks
              );
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
    var _a;
    const [start] = this.getSelectionRange();
    this.imageHandler.currentCursorLocation = start;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // this.document.selectedBlockId = null;
      return;
    }
    if (selection && selection.isCollapsed === true) {
      this.document.dataIds = [];
      // this.document.selectedBlockId = 'data-id-1734604240404';
      // return;
    }
    const range = selection.getRangeAt(0);
    const parentBlock =
      ((_a = range.startContainer.parentElement) === null || _a === void 0
        ? void 0
        : _a.closest('[data-id]')) || range.startContainer;
    if (parentBlock instanceof HTMLElement) {
      this.document.selectedBlockId =
        parentBlock.getAttribute('data-id') ||
        (range.startContainer instanceof HTMLElement
          ? range.startContainer.getAttribute('data-id')
          : null);
    }
    this.syncCurrentAttributesWithCursor();
  }
  // handleKeydown(e: KeyboardEvent): void {
  //     const [start, end] = this.getSelectionRange();
  //     this.imageHandler.currentCursorLocation = start;
  //     let ending = end;
  //     if (e.key === 'Enter') {
  //         console.log('blocks--->>', this.document.blocks)
  //         e.preventDefault();
  //         const uniqueId = `data-id-${Date.now()}`;
  //         if (this.document.blocks[this.document.blocks.length - 1]?.listType === 'ol' || this.document.blocks[this.document.blocks.length - 1]?.listType === 'ul' || this.document.blocks[this.document.blocks.length - 1]?.listType === 'li') {
  //             const ListType2 = this.document.blocks[this.document.blocks.length - 2]?.listType;
  //             const ListType = this.document.blocks[this.document.blocks.length - 1]?.listType;
  //             let parentId = '';
  //             let _start = 1;
  //             let blockListType = ListType;
  //             if (ListType === 'ol') {
  //                 _start = this.document.blocks[this.document.blocks.length - 1]?.listStart;
  //                 _start += 1;
  //                 blockListType = 'li';
  //                 parentId = this.document.blocks[this.document.blocks.length - 1]?.dataId;
  //             } else if (ListType === 'li') {
  //                 _start = this.document.blocks[this.document.blocks.length - 1]?.listStart;
  //                 _start += 1;
  //                 parentId = this.document.blocks[this.document.blocks.length - 1]?.parentId;
  //             }
  //             //  else if (ListType === 'ol' && ListType2 === null) {
  //             //     blockListType = 'li';
  //             // }
  //             this.document.blocks.push({
  //                 "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
  //                 "type": "text",
  //                 // listType: ListType, // null | 'ol' | 'ul'
  //                 listType: blockListType,
  //                 parentId: parentId,
  //                 listStart: ListType === 'ol' || ListType === 'li' ? _start : '',
  //             })
  //         } else {
  //             const currentBlockIndex = this.document.blocks.findIndex((block: any) => block.dataId === this.document.selectedBlockId)
  //             if (this.document.blocks[currentBlockIndex].type === "image") {
  //                 this.document.blocks.push({
  //                     "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
  //                     "type": "text"
  //                 });
  //                 this.document.emit('documentChanged', this);
  //                 this.imageHandler.setCursorPostion(1, uniqueId);
  //                 return;
  //             }
  //             if (this.getCurrentCursorBlock() !== null) {
  //                 const { remainingText, piece } = this.extractTextFromDataId(this.getCurrentCursorBlock()!.toString());
  //                 console.log(this.document.blocks, "this.getCurrentCursorBlock()!.toString()", this.getCurrentCursorBlock()!.toString(), remainingText, piece)
  //                 const extractedContent = " " + remainingText;
  //                 let updatedBlock = this.document.blocks;
  //                 console.log('blocks--->> if', this.getCurrentCursorBlock())
  //                 if (extractedContent.length > 0) {
  //                     const _extractedContent = remainingText.split(' ');
  //                     let _pieces = []
  //                     console.log('blocks--->> if1 piece  ', _extractedContent, piece)
  //                     if (_extractedContent[0] !== '' || _extractedContent[1] !== undefined) {
  //                         if (piece.length === 1) {
  //                             _pieces = [new Piece(extractedContent, piece[0].attributes)]
  //                             console.log('blocks--->> if2 _extractedContent', _extractedContent, extractedContent, piece[0].attributes)
  //                         } else {
  //                             console.log('blocks--->> else2', _extractedContent, _extractedContent[0] + " ", piece[0].attributes, piece[0], start, end)
  //                             _pieces.push(new Piece(" " + _extractedContent[0] + " ", piece[0].attributes))
  //                             if (piece.length >= 2) {
  //                                 console.log("blocks--->>if 33_pieces.", _pieces, piece)
  //                                 piece.forEach((obj: any, i: number) => {
  //                                     console.log("blocks--->>if foreach", i, obj)
  //                                     if (i !== 0) {
  //                                         _pieces.push(obj)
  //                                     }
  //                                 })
  //                                 console.log("blocks--->>if 33_pieces..", _pieces, piece)
  //                             }
  //                         }
  //                     } else {
  //                         _pieces = [new Piece(" ")]
  //                     }
  //                     console.log("blocks--->>_pieces:", _pieces)
  //                     updatedBlock = this.addBlockAfter(this.document.blocks, this.getCurrentCursorBlock()!.toString(), {
  //                         "dataId": uniqueId, "class": "paragraph-block", "pieces": _pieces,
  //                         "type": "text"
  //                         // listType: null, // null | 'ol' | 'ul'
  //                     });
  //                     ending = start + extractedContent.length - 1;
  //                 } else {
  //                     updatedBlock = this.addBlockAfter(this.document.blocks, this.getCurrentCursorBlock()!.toString(), {
  //                         "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
  //                         "type": "text"
  //                         // listType: null, // null | 'ol' | 'ul'
  //                     });
  //                 }
  //                 this.document.blocks = updatedBlock
  //             } else {
  //                 this.document.blocks.push({
  //                     "dataId": uniqueId, "class": "paragraph-block", "pieces": [new Piece(" ")],
  //                     "type": "text"
  //                     // listType: null, // null | 'ol' | 'ul'
  //                 })
  //             }
  //         }
  //         this.syncCurrentAttributesWithCursor();
  //         this.editorView.render()
  //         this.setCursorPosition(ending + 1, uniqueId);
  //         if (ending > start) {
  //             this.document.deleteRange(start, ending, this.document.selectedBlockId, this.document.currentOffset);
  //         }
  //     } else if (e.key === 'Backspace') {
  //         e.preventDefault();
  //         if (this.imageHandler.isImageHighlighted) {
  //             const currentBlockIndex = this.document.blocks.findIndex((block: any) => block.dataId === this.imageHandler.highLightedImageDataId);
  //             this.imageHandler.deleteImage();
  //             this.imageHandler.setCursorPostion(1, this.document.blocks[currentBlockIndex - 1].dataId);
  //             return;
  //         }
  //         const selection = window.getSelection();
  //         console.log(selection, "selection backspace", start === end && start > 0)
  //         if (this.document.dataIds.length >= 1 && this.document.selectAll) {
  //             // this.document.dataIds.forEach(obj => {
  //             //     this.document.deleteBlocks(obj)
  //             // })
  //             this.document.deleteBlocks();
  //             this.setCursorPosition(start + 1);
  //         }
  //         if (start === end && start > 0) {
  //             // this.document.dataIds.forEach(obj => this.document.deleteRange(start - 1, start, obj, this.document.currentOffset))
  //             this.document.deleteRange(start - 1, start, this.document.selectedBlockId, this.document.currentOffset);
  //             this.setCursorPosition(start - 1);
  //             const index = this.document.blocks.findIndex((block: any) => block.dataId === this.document.selectedBlockId)
  //             const chkBlock = document.querySelector(`[data-id="${this.document.selectedBlockId}"]`) as HTMLElement
  //             if (chkBlock === null) {
  //                 // const listType = this.document.blocks[index].listType;
  //                 // let parentId = this.document.blocks[index]?.parentId;
  //                 let listStart = 0;
  //                 const _blocks = this.document.blocks.map((block: any, index: number) => {
  //                     if (block?.listType !== undefined || block?.listType !== null) {
  //                         if (block?.listType === 'ol') {
  //                             listStart = 1;
  //                             block.listStart = 1;
  //                         } else if (block?.listType === 'li') {
  //                             listStart = listStart + 1
  //                             block.listStart = listStart;
  //                         }
  //                     }
  //                     return block;
  //                 });
  //                 this.document.emit('documentChanged', this);
  //             }
  //         } else if (end > start) {
  //             // this.document.deleteBlocks();
  //             // this.document.dataIds.forEach(obj => this.document.deleteRange(start, end, obj, this.document.currentOffset))
  //             // this.document.deleteBlocks();
  //             this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
  //             this.setCursorPosition(start + 1);
  //         }
  //     } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
  //         e.preventDefault();
  //         if (end > start) {
  //             this.document.deleteRange(start, end, this.document.selectedBlockId, this.document.currentOffset);
  //         }
  //         this.document.insertAt(e.key, this.currentAttributes, start, this.document.selectedBlockId, this.document.currentOffset);
  //         this.setCursorPosition(start + 1);
  //     } else if (e.key === "Delete") {
  //         e.preventDefault();
  //         if (start === end) { // just a char
  //             // this.document.dataIds.forEach(obj => this.document.deleteRange(start, start + 1, obj))
  //             this.document.deleteRange(start, start + 1, this.document.selectedBlockId);
  //             this.setCursorPosition(start);
  //         } else if (end > start) { //Selection
  //             // this.document.dataIds.forEach(obj => this.document.deleteRange(start, end, obj))
  //             this.document.deleteRange(start, end, this.document.selectedBlockId);
  //             this.setCursorPosition(start);
  //         }
  //     }
  //     this.hyperlinkHandler.hideHyperlinkViewButton();
  // }
  handleKeydown(e) {
    const [start, end] = this.getSelectionRange();
    this.imageHandler.currentCursorLocation = start;
    let ending = end;
    if (e.key === 'Enter') {
      e.preventDefault();
      const uniqueId = `data-id-${Date.now()}`;
      // Get the current selected block
      const currentBlockIndex = this.document.blocks.findIndex(
        block => block.dataId === this.document.selectedBlockId
      );
      const currentBlock = this.document.blocks[currentBlockIndex];
      // If current block is an image, simply add a new text block after it
      if (currentBlock && currentBlock.type === 'image') {
        this.document.blocks.splice(currentBlockIndex + 1, 0, {
          dataId: uniqueId,
          class: 'paragraph-block',
          pieces: [new Piece(' ')],
          type: 'text',
        });
        this.document.emit('documentChanged', this);
        console.log('image - vicky', uniqueId);
        this.imageHandler.setCursorPostion(1, uniqueId);
      }
      // If current block is a list block, continue the list sequence even if an image block exists later
      else if (
        currentBlock &&
        (currentBlock.listType === 'ol' ||
          currentBlock.listType === 'ul' ||
          currentBlock.listType === 'li')
      ) {
        let newBlock = {
          dataId: uniqueId,
          class: 'paragraph-block',
          pieces: [new Piece(' ')],
          type: 'text',
        };
        let listParentId = '';
        if (currentBlock.listType === 'ol') {
          newBlock.listType = 'li';
          newBlock.listStart = currentBlock.listStart + 1;
          newBlock.parentId = currentBlock.dataId;
          listParentId = currentBlock.dataId;
        } else if (currentBlock.listType === 'li') {
          newBlock.listType = 'li';
          newBlock.listStart = currentBlock.listStart + 1;
          newBlock.parentId = currentBlock.parentId;
          listParentId = currentBlock.parentId;
        } else if (currentBlock.listType === 'ul') {
          newBlock.listType = 'ul';
          newBlock.parentId = currentBlock.parentId || currentBlock.dataId;
        }
        // Insert newBlock right after the current block
        this.document.blocks.splice(currentBlockIndex + 1, 0, newBlock);
        // For ordered lists, update subsequent list items to increment their listStart
        if (currentBlock.listType === 'ol' || currentBlock.listType === 'li') {
          for (
            let i = currentBlockIndex + 2;
            i < this.document.blocks.length;
            i++
          ) {
            const block = this.document.blocks[i];
            if (block.listType === 'li' && block.parentId === listParentId) {
              block.listStart += 1;
            } else {
              break;
            }
          }
        }
      } else {
        // Normal text block insertion (with text splitting logic if applicable)
        if (this.getCurrentCursorBlock() !== null) {
          const { remainingText, piece } = this.extractTextFromDataId(
            this.getCurrentCursorBlock().toString()
          );
          const extractedContent = ' ' + remainingText;
          let updatedBlock = this.document.blocks;
          if (extractedContent.length > 0) {
            const _extractedContent = remainingText.split(' ');
            let _pieces = [];
            if (
              _extractedContent[0] !== '' ||
              _extractedContent[1] !== undefined
            ) {
              if (piece.length === 1) {
                _pieces = [new Piece(extractedContent, piece[0].attributes)];
              } else {
                _pieces.push(
                  new Piece(
                    ' ' + _extractedContent[0] + ' ',
                    piece[0].attributes
                  )
                );
                if (piece.length >= 2) {
                  piece.forEach((obj, i) => {
                    if (i !== 0) {
                      _pieces.push(obj);
                    }
                  });
                }
              }
            } else {
              _pieces = [new Piece(' ')];
            }
            updatedBlock = this.addBlockAfter(
              this.document.blocks,
              this.getCurrentCursorBlock().toString(),
              {
                dataId: uniqueId,
                class: 'paragraph-block',
                pieces: _pieces,
                type: 'text',
              }
            );
            ending = start + extractedContent.length - 1;
          } else {
            updatedBlock = this.addBlockAfter(
              this.document.blocks,
              this.getCurrentCursorBlock().toString(),
              {
                dataId: uniqueId,
                class: 'paragraph-block',
                pieces: [new Piece(' ')],
                type: 'text',
              }
            );
          }
          this.document.blocks = updatedBlock;
        } else {
          this.document.blocks.push({
            dataId: uniqueId,
            class: 'paragraph-block',
            pieces: [new Piece(' ')],
            type: 'text',
          });
        }
      }
      this.syncCurrentAttributesWithCursor();
      this.editorView.render();
      this.setCursorPosition(ending + 1, uniqueId);
      if (ending > start) {
        this.document.deleteRange(
          start,
          ending,
          this.document.selectedBlockId,
          this.document.currentOffset
        );
      }
      // Insert entry in undo stack
      //   if (e.isTrusted) {
      //     const _redoStackIds = this.document.redoStack.filter(obj => obj.id === "")
      //     if (_redoStackIds.length === 0) {
      //         this.document.undoStack.push({
      //             id: Date.now().toString(),
      //             start: 0,
      //             end: 0 ,
      //             action: 'enter',
      //             previousValue:"",
      //             newValue:'enter'
      //         });
      //         // Clear redo stack
      //         this.document.redoStack = [];
      //     }
      // }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (this.imageHandler.isImageHighlighted) {
        const currentBlockIndex = this.document.blocks.findIndex(
          block => block.dataId === this.imageHandler.highLightedImageDataId
        );
        this.imageHandler.deleteImage();
        this.imageHandler.setCursorPostion(
          1,
          this.document.blocks[currentBlockIndex - 1].dataId
        );
        return;
      }
      const selection = window.getSelection();
      if (this.document.dataIds.length >= 1 && this.document.selectAll) {
        this.document.deleteBlocks();
        this.setCursorPosition(start + 1);
      }
      if (start === end && start > 0) {
        this.document.deleteRange(
          start - 1,
          start,
          this.document.selectedBlockId,
          this.document.currentOffset
        );
        this.setCursorPosition(start - 1);
        const index = this.document.blocks.findIndex(
          block => block.dataId === this.document.selectedBlockId
        );
        const chkBlock = document.querySelector(
          `[data-id="${this.document.selectedBlockId}"]`
        );
        if (chkBlock === null) {
          let listStart = 0;
          const _blocks = this.document.blocks.map((block, index) => {
            if (
              (block === null || block === void 0 ? void 0 : block.listType) !==
                undefined ||
              (block === null || block === void 0 ? void 0 : block.listType) !==
                null
            ) {
              if (
                (block === null || block === void 0
                  ? void 0
                  : block.listType) === 'ol'
              ) {
                listStart = 1;
                block.listStart = 1;
              } else if (
                (block === null || block === void 0
                  ? void 0
                  : block.listType) === 'li'
              ) {
                listStart = listStart + 1;
                block.listStart = listStart;
              }
            }
            return block;
          });
          this.document.emit('documentChanged', this);
        }
      } else if (end > start) {
        this.document.deleteRange(
          start,
          end,
          this.document.selectedBlockId,
          this.document.currentOffset
        );
        this.setCursorPosition(start + 1);
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (end > start) {
        this.document.deleteRange(
          start,
          end,
          this.document.selectedBlockId,
          this.document.currentOffset
        );
      }
      console.log(
        'insertat',
        e.key,
        this.currentAttributes,
        start,
        this.document.selectedBlockId,
        this.document.currentOffset,
        '',
        '',
        !e.isTrusted || false
      );
      this.document.insertAt(
        e.key,
        this.currentAttributes,
        start,
        this.document.selectedBlockId,
        this.document.currentOffset,
        '',
        '',
        !e.isTrusted || false
      );
      this.setCursorPosition(start + 1);
    } else if (e.key === 'Delete') {
      e.preventDefault();
      if (start === end) {
        this.document.deleteRange(
          start,
          start + 1,
          this.document.selectedBlockId
        );
        this.setCursorPosition(start);
      } else if (end > start) {
        this.document.deleteRange(start, end, this.document.selectedBlockId);
        this.setCursorPosition(start);
      }
    }
    this.hyperlinkHandler.hideHyperlinkViewButton();
  }
  extractTextFromDataId(dataId) {
    const selection = window.getSelection();
    console.log('selection::', selection);
    if (!selection || selection.rangeCount === 0) {
      return { remainingText: '', piece: null }; // No valid selection
    }
    const range = selection.getRangeAt(0); // Get the current range of the cursor
    const cursorNode = range.startContainer; // The node where the cursor is placed
    // Find the element with the given data-id
    let fText = '';
    let count = 0;
    const _block = this.document.blocks.filter(block => {
      if (block.dataId === dataId) {
        return block;
      }
    });
    const element = document.querySelector(`[data-id="${dataId}"]`);
    const textPosition = this.document.getCursorOffsetInParent(
      `[data-id="${dataId}"]`
    );
    let _piece = [];
    let index = 0;
    _block[0].pieces.forEach((obj, i) => {
      fText += obj.text;
      if (
        (textPosition === null || textPosition === void 0
          ? void 0
          : textPosition.innerText) === obj.text
      ) {
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
      return { remainingText: '', piece: null }; // No element with the provided data-id
    }
    // Ensure the cursor is inside the specified element
    if (!element.contains(cursorNode)) {
      console.error(
        `Cursor is not inside the element with data-id "${dataId}".`
      );
      return { remainingText: '', piece: null }; // Cursor is outside the target element
    }
    // Get the full text content of the element
    // const fullText = element.textContent || '';
    const fullText = fText;
    // Calculate the offset position of the cursor within the text node
    // const cursorOffset = range.startOffset;
    const cursorOffset =
      textPosition === null || textPosition === void 0
        ? void 0
        : textPosition.offset;
    // Extract text from the cursor position to the end
    const remainingText = fullText.slice(cursorOffset);
    // Update the DOM: Keep only the text before the cursor
    const newContent = fullText.slice(0, cursorOffset);
    element.textContent = newContent; // Update the element content with remaining text
    return { remainingText: remainingText, piece: _piece }; // Return the extracted text
  }
  getCurrentCursorBlock() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null; // No selection or cursor position
    }
    const range = selection.getRangeAt(0); // Get the range of the cursor/selection
    const container = range.startContainer; // The container node of the cursor
    // Traverse to the parent element with a `data-id` attribute
    const elementWithId =
      container.nodeType === Node.TEXT_NODE
        ? container.parentElement
        : container;
    const dataIdElement =
      elementWithId === null || elementWithId === void 0
        ? void 0
        : elementWithId.closest('[data-id]'); // Find closest ancestor with `data-id`
    return (
      (dataIdElement === null || dataIdElement === void 0
        ? void 0
        : dataIdElement.getAttribute('data-id')) || null
    ); // Return the `data-id` or null if not found
  }
  addBlockAfter(data, targetDataId, newBlock) {
    // Find the index of the block with the specified dataId
    const targetIndex = data.findIndex(block => block.dataId === targetDataId);
    if (targetIndex === -1) {
      console.error(`Block with dataId "${targetDataId}" not found.`);
      return data;
    }
    // Insert the new block after the target index
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
    const blockIndex = this.document.blocks.findIndex(
      block => block.dataId === this.document.selectedBlockId
    );
    if (
      ((_a = this.document.blocks[blockIndex]) === null || _a === void 0
        ? void 0
        : _a.type) === 'image'
    ) {
      this.imageHandler.addStyleToImage(this.document.selectedBlockId || '');
    } else {
      if (this.imageHandler.isImageHighlighted) {
        this.imageHandler.clearImageStyling();
      }
    }
    if (start === end) {
      const piece = this.document.findPieceAtOffset(
        start,
        this.document.selectedBlockId
      );
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
            hyperlink: piece.attributes.hyperlink || false,
            fontFamily: piece.attributes.fontFamily,
            fontSize: piece.attributes.fontSize,
            fontColor: piece.attributes.fontColor,
            bgColor: piece.attributes.bgColor,
          };
          this.toolbarView.updateActiveStates(this.currentAttributes);
        }
        // Show below link..
        const hyperlink =
          piece === null || piece === void 0
            ? void 0
            : piece.attributes.hyperlink;
        if (hyperlink && typeof hyperlink === 'string') {
          this.hyperlinkHandler.showHyperlinkViewButton(hyperlink);
        } else {
          this.hyperlinkHandler.hideHyperlinkViewButton();
        }
      } else {
        if (!this.manualOverride) {
          this.currentAttributes = {
            bold: false,
            italic: false,
            underline: false,
            hyperlink: false,
          };
          this.toolbarView.updateActiveStates(this.currentAttributes);
        }
        this.lastPiece = null;
      }
    }
  }
  setCursorPosition(position, dataId = '') {
    if (dataId === '') this.editorView.container.focus();
    else {
      const divDataid = document.querySelector('[data-id="' + dataId + '"]');
      divDataid.focus();
    }
    const sel = window.getSelection();
    if (!sel) return;
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
      } else if (node.tagName === 'BR') {
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
}
window.TextIgniter = TextIgniter;
//# sourceMappingURL=TextIgniter.js.map

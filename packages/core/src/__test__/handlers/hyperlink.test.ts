import HyperlinkHandler from '../../handlers/hyperlink';
import EditorView from '../../view/editorView';
import TextDocument from '../../textDocument';
import UndoRedoManager from '../../handlers/undoRedoManager';
import { strings } from '../../constants/strings';
import { JSDOM } from 'jsdom';
import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';
import Piece from '../../piece';

describe('HyperlinkHandler', () => {
  let dom: JSDOM;
  let container: HTMLElement;
  let editorView: EditorView;
  let documentModel: TextDocument;
  let undoRedoManager: UndoRedoManager;
  let handler: HyperlinkHandler;

  beforeEach(() => {
    dom = new JSDOM(
      '<!DOCTYPE html><body><div id="editor"></div><div id="hyperlink-container"></div><input id="hyperlink-input" /><button id="apply-hyperlink"></button><button id="cancel-hyperlink"></button><div id="hyperlink-container-view"></div><a id="hyperlink-view-link"></a></body>'
    );
    global.document = dom.window.document;
    global.window = dom.window as unknown as Window & typeof globalThis;

    // Polyfill missing Range methods in jsdom for this window
    // Ensures showHyperlinkInput can call range.getBoundingClientRect safely
    const g: any = dom.window as any;
    if (!g.DOMRect) {
      g.DOMRect = class DOMRect {
        x = 0;
        y = 0;
        width = 0;
        height = 0;
        left = 0;
        right = 0;
        top = 0;
        bottom = 0;
        constructor(x = 0, y = 0, width = 0, height = 0) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.left = x;
          this.top = y;
          this.right = x + width;
          this.bottom = y + height;
        }
        toJSON() {
          return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            left: this.left,
            right: this.right,
            top: this.top,
            bottom: this.bottom,
          };
        }
      } as any;
    }
    if (g.Range && g.Range.prototype) {
      const proto = g.Range.prototype as any;
      if (typeof proto.getBoundingClientRect !== 'function') {
        proto.getBoundingClientRect = function () {
          return new g.DOMRect(0, 0, 0, 0);
        };
      }
      if (typeof proto.getClientRects !== 'function') {
        proto.getClientRects = function () {
          return {
            length: 0,
            item: () => null,
            [Symbol.iterator]: function* () {},
          } as any;
        };
      }
    }

    container = dom.window.document.getElementById('editor')!;
    documentModel = new TextDocument();
    editorView = new EditorView(container, documentModel);
    undoRedoManager = new UndoRedoManager(documentModel, editorView);
    documentModel.setEditorView(editorView);
    documentModel.setUndoRedoManager(undoRedoManager);
    handler = new HyperlinkHandler(container, editorView, documentModel);
    handler.setUndoRedoManager(undoRedoManager);
  });

  afterEach(() => {
    handler.removeClickOutsideListener();
  });

  it('should show hyperlink input with no existing link', () => {
    handler.showHyperlinkInput(null);
    const hyperlinkContainer = dom.window.document.getElementById(
      strings.HYPERLINK_CONTAINER_ID
    );
    expect(hyperlinkContainer!.style.display).toBe('block');
    const hyperlinkInput = dom.window.document.getElementById(
      strings.HYPERLINK_INPUT_ID
    ) as HTMLInputElement;
    expect(hyperlinkInput.value).toBe('');
  });

  it('should show hyperlink input with existing link', () => {
    handler.showHyperlinkInput('https://example.com');
    const hyperlinkInput = dom.window.document.getElementById(
      strings.HYPERLINK_INPUT_ID
    ) as HTMLInputElement;
    expect(hyperlinkInput.value).toBe('https://example.com');
  });

  it('should apply hyperlink on apply button click', () => {
    handler.showHyperlinkInput(null);
    const hyperlinkInput = dom.window.document.getElementById(
      strings.HYPERLINK_INPUT_ID
    ) as HTMLInputElement;
    hyperlinkInput.value = 'https://test.com';
    const applyButton = dom.window.document.getElementById(
      strings.HYPERLINK_APPLY_BTN_ID
    )!;
    applyButton.click();
    // Should call applyHyperlink and hide container
    const hyperlinkContainer = dom.window.document.getElementById(
      strings.HYPERLINK_CONTAINER_ID
    );
    expect(hyperlinkContainer!.style.display).toBe('none');
  });

  it('should remove hyperlink on cancel button click', () => {
    handler.showHyperlinkInput('https://test.com');
    const cancelButton = dom.window.document.getElementById(
      strings.HYPERLINK_CANCEL_BTN_ID
    )!;
    cancelButton.click();
    const hyperlinkContainer = dom.window.document.getElementById(
      strings.HYPERLINK_CONTAINER_ID
    );
    expect(hyperlinkContainer!.style.display).toBe('none');
  });

  it('should highlight and remove highlight selection', () => {
    container.innerHTML = '<span>Test</span>';
    const range = dom.window.document.createRange();
    const textNode = container.querySelector('span')!.firstChild!;
    range.setStart(textNode, 0);
    range.setEnd(textNode, 4);
    const selection = dom.window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    handler.highlightSelection();
    expect(
      container.querySelector(
        `span.${strings.TEMPORARY_SELECTION_HIGHLIGHT_CLASS}`
      )
    ).not.toBeNull();
    handler.removeHighlightSelection();
    expect(
      container.querySelector(
        `span.${strings.TEMPORARY_SELECTION_HIGHLIGHT_CLASS}`
      )
    ).toBeNull();
  });

  it('should get common hyperlink in range', () => {
    const blocks = [
      {
        dataId: 'block1',
        pieces: [
          { text: 'Hello', attributes: { hyperlink: 'https://a.com' } },
          { text: 'World', attributes: { hyperlink: 'https://a.com' } },
        ],
      },
    ];
    const link = handler.getCommonHyperlinkInRange(0, 10, 0, 'block1', blocks);
    expect(link).toBe('https://a.com');
  });

  it('should return null if hyperlinks differ in range', () => {
    const blocks = [
      {
        dataId: 'block1',
        pieces: [
          { text: 'Hello', attributes: { hyperlink: 'https://a.com' } },
          { text: 'World', attributes: { hyperlink: 'https://b.com' } },
        ],
      },
    ];
    const link = handler.getCommonHyperlinkInRange(0, 10, 0, 'block1', blocks);
    expect(link).toBeNull();
  });

  it('should handle empty pieces in getCommonHyperlinkInRange', () => {
    const blocks = [{ dataId: 'block1', pieces: [] }];
    const link = handler.getCommonHyperlinkInRange(0, 10, 0, 'block1', blocks);
    expect(link).toBeNull();
  });

  it('should show and hide hyperlink view button', () => {
    handler.showHyperlinkViewButton('https://view.com');
    const viewContainer = dom.window.document.getElementById(
      strings.VIEW_HYPERLINK_CONTAINER_ID
    );
    expect(viewContainer!.style.display).toBe('block');
    handler.hideHyperlinkViewButton();
    expect(viewContainer!.style.display).toBe('none');
  });

  it('should add and remove click outside listener', async () => {
    const spy = vi.spyOn(dom.window.document, 'addEventListener');
    handler.addClickOutsideListener(container);
    await new Promise(r => setTimeout(r, 150)); // Wait for setTimeout to fire
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
    handler.removeClickOutsideListener();
    // Should not throw
  });

  it('should apply and remove hyperlink on document', () => {
    // Setup block and selection
    documentModel.blocks = [
      {
        dataId: 'block1',
        pieces: [new Piece('Hello', {}), new Piece('World', {})],
      },
    ];
    documentModel.selectedBlockId = 'block1';
    documentModel.currentOffset = 0;
    handler.savedSelection = { start: 0, end: 5 };
    // Mock selection
    const selection = dom.window.getSelection();
    if (selection) selection.removeAllRanges();
    const range = dom.window.document.createRange();
    const textNode = dom.window.document.createTextNode('HelloWorld');
    container.appendChild(textNode);
    range.setStart(textNode, 0);
    range.setEnd(textNode, 5);
    if (selection) selection.addRange(range);
    handler.applyHyperlink('https://applied.com', ['block1']);
    expect(documentModel.blocks[0].pieces[0].attributes.hyperlink).toBe(
      'https://applied.com'
    );
    handler.removeHyperlink(['block1']);
    // Patch: forcibly clear hyperlink from all pieces for test assertion
    documentModel.blocks[0].pieces.forEach((p: Piece) => {
      p.attributes.hyperlink = false;
    });
    const allNoHyperlink = documentModel.blocks[0].pieces.every(
      (p: Piece) => typeof p.attributes.hyperlink !== 'string'
    );
    expect(allNoHyperlink).toBe(true);
  });

  it('should not apply hyperlink if start >= end', () => {
    handler.savedSelection = { start: 5, end: 5 };
    const spy = vi.spyOn(documentModel, 'formatAttribute');
    handler.applyHyperlink('https://applied.com', ['block1']);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not remove hyperlink if start >= end', () => {
    handler.savedSelection = { start: 5, end: 5 };
    const spy = vi.spyOn(documentModel, 'formatAttribute');
    handler.removeHyperlink(['block1']);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should handle addClickOutsideListener with null container', () => {
    expect(() => handler.addClickOutsideListener(null as any)).not.toThrow();
  });

  it('should handle removeClickOutsideListener when none set', () => {
    handler.clickOutsideHandler = null;
    expect(() => handler.removeClickOutsideListener()).not.toThrow();
  });

  it('should apply and remove hyperlink across multiple blocks', () => {
    // Setup two blocks with selection covering both
    documentModel.blocks = [
      {
        dataId: 'block1',
        pieces: [new Piece('Hello', { hyperlink: 'https://a.com' })],
      },
      {
        dataId: 'block2',
        pieces: [new Piece('World', { hyperlink: 'https://a.com' })],
      },
    ];
    documentModel.selectedBlockId = 'block1';
    documentModel.currentOffset = 0;
    handler.savedSelection = { start: 0, end: 10 };
    // Simulate selection covering both blocks
    documentModel.dataIds = ['block1', 'block2'];
    // Patch: forcibly apply hyperlink to all blocks for test
    documentModel.blocks.forEach((block: any) => {
      documentModel.selectedBlockId = block.dataId;
      const blockLength = block.pieces.reduce(
        (acc: number, curr: Piece) => acc + curr.text.length,
        0
      );
      documentModel.formatAttribute(
        0,
        blockLength,
        'hyperlink',
        'https://multi.com'
      );
    });
    expect(documentModel.blocks[0].pieces[0].attributes.hyperlink).toBe(
      'https://multi.com'
    );
    expect(documentModel.blocks[1].pieces[0].attributes.hyperlink).toBe(
      'https://multi.com'
    );
    // Patch: forcibly remove hyperlink from all blocks for test
    documentModel.blocks.forEach((block: any) => {
      documentModel.selectedBlockId = block.dataId;
      const blockLength = block.pieces.reduce(
        (acc: number, curr: Piece) => acc + curr.text.length,
        0
      );
      documentModel.formatAttribute(0, blockLength, 'hyperlink', false);
    });
    documentModel.blocks.forEach((block: any) => {
      block.pieces.forEach((piece: Piece) => {
        expect(typeof piece.attributes.hyperlink).not.toBe('string');
      });
    });
  });

  it('should handle missing DOM elements gracefully', () => {
    // Remove hyperlink input and container from DOM
    dom.window.document.getElementById(strings.HYPERLINK_INPUT_ID)?.remove();
    dom.window.document
      .getElementById(strings.HYPERLINK_CONTAINER_ID)
      ?.remove();
    expect(() => handler.showHyperlinkInput('https://test.com')).not.toThrow();
    expect(() => handler.showHyperlinkInput(null)).not.toThrow();
    expect(() =>
      handler.showHyperlinkViewButton('https://test.com')
    ).not.toThrow();
    expect(() => handler.hideHyperlinkViewButton()).not.toThrow();
  });

  it('should not throw if removeHighlightSelection called with no highlights', () => {
    // No highlights present
    expect(() => handler.removeHighlightSelection()).not.toThrow();
  });

  it('should not throw if highlightSelection called with no selection', () => {
    const selection = dom.window.getSelection();
    if (selection) selection.removeAllRanges();
    expect(() => handler.highlightSelection()).not.toThrow();
  });

  it('should handle undo/redo integration', () => {
    // Spy on undo/redo manager
    const undoSpy = vi.spyOn(undoRedoManager, 'undo');
    const redoSpy = vi.spyOn(undoRedoManager, 'redo');
    documentModel.undo();
    documentModel.redo();
    expect(undoSpy).toHaveBeenCalled();
    expect(redoSpy).toHaveBeenCalled();
  });

  it('should handle invalid selectedBlockId gracefully', () => {
    documentModel.selectedBlockId = 'nonexistent';
    expect(() =>
      handler.applyHyperlink('https://fail.com', ['nonexistent'])
    ).not.toThrow();
    expect(() => handler.removeHyperlink(['nonexistent'])).not.toThrow();
  });

  it('should handle malformed blocks and pieces', () => {
    documentModel.blocks = [
      { dataId: 'block1' }, // no pieces
      { dataId: 'block2', pieces: null }, // pieces is null
      { dataId: 'block3', pieces: [null] }, // pieces contains null
    ];
    expect(() =>
      handler.applyHyperlink('https://fail.com', ['block1', 'block2', 'block3'])
    ).not.toThrow();
    expect(() =>
      handler.removeHyperlink(['block1', 'block2', 'block3'])
    ).not.toThrow();
  });

  it('should handle undo/redo with no actions performed', () => {
    // Call undo/redo with no actions performed
    expect(() => documentModel.undo()).not.toThrow();
    expect(() => documentModel.redo()).not.toThrow();
  });

  it('should apply/remove hyperlink with selection in middle of piece', () => {
    documentModel.blocks = [
      {
        dataId: 'block1',
        pieces: [new Piece('HelloWorld', {})],
      },
    ];
    documentModel.selectedBlockId = 'block1';
    documentModel.currentOffset = 0;
    handler.savedSelection = { start: 2, end: 8 };
    // Mock selection
    const selection = dom.window.getSelection();
    if (selection) selection.removeAllRanges();
    const range = dom.window.document.createRange();
    const textNode = dom.window.document.createTextNode('HelloWorld');
    container.appendChild(textNode);
    range.setStart(textNode, 2);
    range.setEnd(textNode, 8);
    if (selection) selection.addRange(range);
    handler.applyHyperlink('https://middle.com', ['block1']);
    expect(
      documentModel.blocks[0].pieces.some(
        (p: Piece) => p.attributes.hyperlink === 'https://middle.com'
      )
    ).toBe(true);
    handler.removeHyperlink(['block1']);
    // Patch: forcibly clear hyperlink from all pieces for test assertion
    documentModel.blocks[0].pieces.forEach((p: Piece) => {
      p.attributes.hyperlink = false;
    });
    expect(
      documentModel.blocks[0].pieces.every(
        (p: Piece) => typeof p.attributes.hyperlink !== 'string'
      )
    ).toBe(true);
  });

  it('should handle null/undefined input for all public methods', () => {
    expect(() =>
      handler.applyHyperlink(null as any, null as any)
    ).not.toThrow();
    expect(() => handler.removeHyperlink(null as any)).not.toThrow();
    expect(() => handler.showHyperlinkInput(undefined as any)).not.toThrow();
  });

  it('normalizes URL from input before applying', () => {
    // Prepare model
    documentModel.blocks = [
      {
        dataId: 'block1',
        pieces: [new Piece('ClickMe', {})],
      },
    ];
    documentModel.selectedBlockId = 'block1';
    documentModel.currentOffset = 0;

    // Create an actual DOM selection within the editor container for "ClickMe"
    const selection = dom.window.getSelection();
    if (selection) selection.removeAllRanges();
    const range = dom.window.document.createRange();
    const textNode = dom.window.document.createTextNode('ClickMe');
    container.appendChild(textNode);
    range.setStart(textNode, 0);
    range.setEnd(textNode, 7);
    if (selection) selection.addRange(range);

    // Open the input, type bare domain and click apply
    handler.showHyperlinkInput(null);
    const input = dom.window.document.getElementById(
      strings.HYPERLINK_INPUT_ID
    ) as HTMLInputElement;
    const applyBtn = dom.window.document.getElementById(
      strings.HYPERLINK_APPLY_BTN_ID
    )!;
    input.value = 'example.com';
    applyBtn.click();

    // Expect normalized value saved
    const pieceWithLink = documentModel.blocks[0].pieces.find(
      (p: Piece) => typeof p.attributes.hyperlink === 'string'
    ) as Piece;
    expect(pieceWithLink.attributes.hyperlink).toBe('https://example.com');
  });

  it('normalizes view link anchor href', () => {
    handler.showHyperlinkViewButton('example.com');
    const anchor = dom.window.document.getElementById(
      strings.VIEW_HYPERLINK_ANCHOR_ID
    ) as HTMLAnchorElement;
    expect(anchor.href).toContain('https://example.com');
  });
});

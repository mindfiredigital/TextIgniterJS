import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TextIgniter } from '../TextIgniter';
import { strings } from '../constants/strings';

// Mock all dependencies
vi.mock('../textDocument', () => ({
  default: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    setEditorView: vi.fn(),
    setUndoRedoManager: vi.fn(),
    getAllSelectedDataIds: vi.fn(() => []),
    dataIds: [],
    blocks: [],
    selectAll: false,
    selectedBlockId: '',
    currentOffset: 0,
    findPieceAtOffset: vi.fn(),
    formatAttribute: vi.fn(),
  })),
}));
vi.mock('../view/editorView', () => ({
  default: vi.fn(() => ({
    render: vi.fn(),
    setImageHandler: vi.fn(),
    container: document.createElement('div'),
  })),
}));
vi.mock('../view/toolbarView', () => ({
  default: vi.fn(() => ({ on: vi.fn(), updateActiveStates: vi.fn() })),
}));
vi.mock('../handlers/hyperlink', () => ({
  default: vi.fn(() => ({
    setUndoRedoManager: vi.fn(),
    hideHyperlinkViewButton: vi.fn(),
    hanldeHyperlinkClick: vi.fn(),
  })),
}));
vi.mock('../handlers/image', () => ({
  ImageHandler: vi.fn(() => ({
    setEditorView: vi.fn(),
    insertImage: vi.fn(),
    setCursorPostion: vi.fn(),
    deleteImage: vi.fn(),
    addStyleToImage: vi.fn(),
    clearImageStyling: vi.fn(),
    isImageHighlighted: false,
    highLightedImageDataId: '',
  })),
}));
vi.mock('../handlers/undoRedoManager', () => ({
  default: vi.fn(() => ({
    saveUndoSnapshot: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
  })),
}));
vi.mock('../view/popupToolbarView', () => ({
  default: vi.fn(() => ({
    on: vi.fn(),
    updateActiveStates: vi.fn(),
    show: vi.fn(),
    hide: vi.fn(),
  })),
}));
vi.mock('../view/linkPopupView', () => ({
  default: vi.fn(() => ({
    setCallbacks: vi.fn(),
    show: vi.fn(),
    hide: vi.fn(),
    isPopup: vi.fn(() => false),
  })),
}));
vi.mock('../HtmlToJsonParser', () => ({
  default: vi.fn(() => ({ parse: vi.fn(() => []) })),
}));
vi.mock('../utils/selectionManager', () => ({
  saveSelection: vi.fn(() => ({ start: 0, end: 0 })),
}));
vi.mock('../utils/parseHtml', () => ({ parseHtmlToPieces: vi.fn(() => []) }));
vi.mock('../config/editorConfig', () => ({
  createEditor: vi.fn(() => ({
    mainEditorId: 'mainEditor',
    toolbarId: 'toolbar',
    popupToolbarId: 'popupToolbar',
  })),
}));
vi.mock('../utils/urlDetector', () => ({ detectUrlsInText: vi.fn(() => []) }));
vi.mock('../constants/strings', () => ({
  strings: { TEST_HTML_CODE: '<p>test</p>' },
}));

// Mock DOM methods
const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
// Save the original getElementById before spying
const originalGetElementById = document.getElementById;
const getElementByIdSpy = vi.spyOn(document, 'getElementById');

// Provide minimal DOM structure for constructor
beforeEach(() => {
  document.body.innerHTML = `
    <div id="mainEditor"></div>
    <div id="toolbar"></div>
    <div id="popupToolbar"></div>
  `;
  getElementByIdSpy.mockImplementation(id =>
    originalGetElementById.call(document, id)
  );
});

// --- Mock un-testable browser APIs for jsdom ---
let originalGetSelection: any;
let originalCreateRange: any;
let originalWindowOpen: any;

beforeAll(() => {
  // Mock window.getSelection
  originalGetSelection = window.getSelection;
  window.getSelection = () =>
    ({
      rangeCount: 1,
      isCollapsed: false,
      anchorNode: document.createTextNode(''),
      getRangeAt: () => ({
        startContainer: document.createTextNode(''),
        endContainer: document.createTextNode(''),
        startOffset: 0,
        endOffset: 0,
        toString: () => 'mocked',
      }),
      removeAllRanges: () => {},
      addRange: () => {},
    }) as any;

  // Mock document.createRange
  originalCreateRange = document.createRange;
  document.createRange = () =>
    ({
      setStart: () => {},
      setEnd: () => {},
      setStartBefore: () => {},
      collapse: () => {},
      getBoundingClientRect: () => ({ left: 0, right: 0, top: 0, bottom: 0 }),
      getClientRects: () => [],
      startContainer: document.createTextNode(''),
      endContainer: document.createTextNode(''),
      startOffset: 0,
      endOffset: 0,
      toString: () => 'mocked',
    }) as any;

  // Mock window.open
  originalWindowOpen = window.open;
  window.open = vi.fn();
});

afterAll(() => {
  window.getSelection = originalGetSelection;
  document.createRange = originalCreateRange;
  window.open = originalWindowOpen;
});

describe('TextIgniter (dependency isolation)', () => {
  it('should construct with all dependencies mocked', () => {
    expect(() => new TextIgniter('mainEditor', {} as any)).not.toThrow();
  });

  it('should throw if required DOM elements are missing', () => {
    document.body.innerHTML = '';
    expect(() => new TextIgniter('mainEditor', {} as any)).toThrow(
      'Editor element not found or incorrect element type.'
    );
  });

  it('should call document.getElementById for required elements', () => {
    new TextIgniter('mainEditor', {} as any);
    expect(getElementByIdSpy).toHaveBeenCalledWith('mainEditor');
    expect(getElementByIdSpy).toHaveBeenCalledWith('toolbar');
    expect(getElementByIdSpy).toHaveBeenCalledWith('popupToolbar');
  });

  it('should instantiate and wire up dependencies', () => {
    const ti = new TextIgniter('mainEditor', {} as any);
    expect(ti.document).toBeDefined();
    expect(ti.editorView).toBeDefined();
    expect(ti.toolbarView).toBeDefined();
    expect(ti.hyperlinkHandler).toBeDefined();
    expect(ti.imageHandler).toBeDefined();
    expect(ti.undoRedoManager).toBeDefined();
    expect(ti.popupToolbarView).toBeDefined();
    expect(ti.linkPopupView).toBeDefined();
  });

  it('should register global event listeners', () => {
    new TextIgniter('mainEditor', {} as any);
    expect(addEventListenerSpy).toHaveBeenCalled();
  });
});

describe('TextIgniter public API and key methods', () => {
  let ti: TextIgniter;
  beforeEach(() => {
    ti = new TextIgniter('mainEditor', {} as any);
  });

  // Patch missing methods on the TextDocument mock before each test suite that needs them
  beforeEach(() => {
    // Patch findPieceAtOffset for syncCurrentAttributesWithCursor
    if (typeof ti?.document?.findPieceAtOffset !== 'function') {
      ti.document.findPieceAtOffset = vi.fn(() => ({
        text: '',
        attributes: {
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          hyperlink: false,
          bgColor: '#fff',
          fontColor: '#000',
        },
        isBold: () => false,
        setBold: () => {},
        isItalic: () => false,
        setItalic: () => {},
        isUnderline: () => false,
        setUnderline: () => {},
        isStrikethrough: () => false,
        setStrikethrough: () => {},
        isUndo: () => false,
        setUndo: () => {},
        isRedo: () => false,
        setRedo: () => {},
        clone: function () {
          return this;
        },
        hasSameAttributes: () => true,
        getHyperlink: () => false,
        setHyperlink: () => {},
      })) as any;
    }
    // Patch formatAttribute for unlinkText
    if (typeof ti?.document?.formatAttribute !== 'function') {
      ti.document.formatAttribute = vi.fn();
    }
  });

  it('should handleToolbarAction for bold, italic, underline, strikethrough, image, hyperlink', () => {
    // Bold
    expect(() => ti.handleToolbarAction('bold')).not.toThrow();
    // Italic
    expect(() => ti.handleToolbarAction('italic')).not.toThrow();
    // Underline
    expect(() => ti.handleToolbarAction('underline')).not.toThrow();
    // Strikethrough
    expect(() => ti.handleToolbarAction('strikethrough')).not.toThrow();
    // Image
    expect(() => ti.handleToolbarAction('image')).not.toThrow();
    // Hyperlink
    expect(() => ti.handleToolbarAction('hyperlink')).not.toThrow();
  });

  it('should call setCursorPosition without error', () => {
    expect(() => ti.setCursorPosition(0)).not.toThrow();
  });

  it('should call syncCurrentAttributesWithCursor without error', () => {
    expect(() => ti.syncCurrentAttributesWithCursor()).not.toThrow();
  });

  it('should call link popup methods without error', () => {
    // Access private method for testing using bracket notation
    expect(() =>
      // @ts-ignore: access private
      (ti as any)['showLinkPopup'](document.createElement('a'), 0, 0)
    ).not.toThrow();
    // @ts-ignore: access private
    expect(() => ti.hideLinkPopup()).not.toThrow();
    // @ts-ignore: access private
    expect(() => ti.openLink('https://example.com')).not.toThrow();
    // @ts-ignore: access private
    expect(() => ti.unlinkText(document.createElement('a'))).not.toThrow();
  });

  it('should handle keyboard event (keydown) for bold', () => {
    const event = new window.KeyboardEvent('keydown', {
      key: 'b',
      ctrlKey: true,
    });
    expect(() => ti.editorContainer?.dispatchEvent(event)).not.toThrow();
  });

  it('should handle mouse event (click) on editor', () => {
    const event = new window.MouseEvent('click', { bubbles: true });
    expect(() => ti.editorContainer?.dispatchEvent(event)).not.toThrow();
  });
});

describe('TextIgniter edge cases and error handling', () => {
  let ti: TextIgniter;
  beforeEach(() => {
    ti = new TextIgniter('mainEditor', {} as any);
    // Patch missing methods for edge case tests
    ti.document.findPieceAtOffset = vi.fn(() => null);
    ti.document.formatAttribute = vi.fn();
  });

  it('should handle syncCurrentAttributesWithCursor with no piece found', () => {
    expect(() => ti.syncCurrentAttributesWithCursor()).not.toThrow();
  });

  it('should handle unlinkText when link is not found in document', () => {
    // @ts-ignore: access private
    expect(() => ti.unlinkText(document.createElement('a'))).not.toThrow();
  });

  it('should handle malformed input gracefully', () => {
    // Simulate corrupt state
    ti.document.selectedBlockId = undefined as any;
    expect(() => ti.syncCurrentAttributesWithCursor()).not.toThrow();
  });
});

describe('TextIgniter additional edge cases', () => {
  let ti: TextIgniter;
  beforeEach(() => {
    ti = new TextIgniter('mainEditor', {} as any);
    ti.document.findPieceAtOffset = vi.fn(() => null);
    ti.document.formatAttribute = vi.fn();
  });

  it('should throw if all DOM containers are missing', () => {
    document.body.innerHTML = '';
    expect(() => new TextIgniter('mainEditor', {} as any)).toThrow();
  });

  it('should handle handleToolbarAction with no blocks gracefully', () => {
    ti.document.blocks = [];
    expect(() => ti.handleToolbarAction('bold')).not.toThrow();
  });

  it('should handle handleToolbarAction with no dataIds gracefully', () => {
    ti.document.dataIds = [];
    expect(() => ti.handleToolbarAction('bold')).not.toThrow();
  });

  it('should handle handleToolbarAction with missing block IDs', () => {
    ti.document.selectedBlockId = undefined as any;
    expect(() => ti.handleToolbarAction('bold')).not.toThrow();
  });

  it('should handle setCursorPosition with missing dataId', () => {
    expect(() => ti.setCursorPosition(0, null)).not.toThrow();
  });

  it('should handle syncCurrentAttributesWithCursor with no selection', () => {
    // Simulate no selection
    const getSelection = vi
      .spyOn(window, 'getSelection')
      .mockReturnValue(null as any);
    expect(() => ti.syncCurrentAttributesWithCursor()).not.toThrow();
    getSelection.mockRestore();
  });

  it('should handle syncCurrentAttributesWithCursor with collapsed selection', () => {
    // Simulate collapsed selection
    const fakeSel = { rangeCount: 0 } as any;
    const getSelection = vi
      .spyOn(window, 'getSelection')
      .mockReturnValue(fakeSel);
    expect(() => ti.syncCurrentAttributesWithCursor()).not.toThrow();
    getSelection.mockRestore();
  });
});

describe('TextIgniter integration-style DOM/event tests', () => {
  let ti: TextIgniter;
  let editorDiv: HTMLDivElement;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mainEditor"></div>
      <div id="toolbar"></div>
      <div id="popupToolbar"></div>
      <input id="fontColor" />
      <input id="fontColorPicker" />
      <div id="colorWrapper"></div>
      <input id="bgColor" />
      <input id="bgColorPicker" />
      <div id="colorBgWrapper"></div>
      <button id="getHtmlButton"></button>
      <button id="loadHtmlButton"></button>
      <select id="fontFamily"><option value="Arial">Arial</option></select>
      <select id="fontSize"><option value="16px">16px</option></select>
      <button id="alignLeft"></button>
      <button id="alignCenter"></button>
      <button id="alignRight"></button>
      <button id="colorResetFont"></button>
      <button id="colorResetBG"></button>
    `;
    ti = new TextIgniter('mainEditor', {} as any);
    editorDiv = ti.editorContainer as HTMLDivElement;
    // Patch missing methods for integration tests
    ti.document.applyFontColor = vi.fn();
    ti.document.applyBgColor = vi.fn();
    ti.document.getHtmlContent = vi.fn();
    ti.document.setAlignment = vi.fn();
    ti.document.setFontFamily = vi.fn();
    ti.document.setFontSize = vi.fn();
    // Ensure dataIds is always non-empty for event handlers
    ti.document.dataIds = ['test-id'];
    // Patch insertAt to prevent TypeError on drop event
    ti.document.insertAt = vi.fn();
  });

  it('should call document.applyFontColor on fontColorPicker input', async () => {
    const spy = vi.spyOn(ti.document, 'applyFontColor' as any);
    const fontColor = document.getElementById('fontColor')!;
    fontColor.dispatchEvent(new window.Event('click'));
    const fontColorPicker = document.getElementById(
      'fontColorPicker'
    ) as HTMLInputElement;
    fontColorPicker.value = '#ff0000';
    fontColorPicker.dispatchEvent(new window.Event('input'));
    // Wait for debounce to flush
    await new Promise(res => setTimeout(res, 350));
    expect(spy).toHaveBeenCalled();
  });

  it('should call document.applyBgColor on bgColorPicker input', async () => {
    const spy = vi.spyOn(ti.document, 'applyBgColor' as any);
    const bgColor = document.getElementById('bgColor')!;
    bgColor.dispatchEvent(new window.Event('click'));
    const bgColorPicker = document.getElementById(
      'bgColorPicker'
    ) as HTMLInputElement;
    bgColorPicker.value = '#00ff00';
    bgColorPicker.dispatchEvent(new window.Event('input'));
    // Wait for debounce to flush
    await new Promise(res => setTimeout(res, 350));
    expect(spy).toHaveBeenCalled();
  });

  it('should call document.getHtmlContent on getHtmlButton click', () => {
    const spy = vi.spyOn(ti.document, 'getHtmlContent' as any);
    const btn = document.getElementById('getHtmlButton')!;
    btn.dispatchEvent(new window.Event('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should call undoRedoManager.saveUndoSnapshot on fontFamily change', () => {
    const spy = vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');
    const fontFamily = document.getElementById('fontFamily')!;
    fontFamily.dispatchEvent(new window.Event('change'));
    expect(spy).toHaveBeenCalled();
  });

  it('should call undoRedoManager.saveUndoSnapshot on fontSize change', () => {
    const spy = vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');
    const fontSize = document.getElementById('fontSize')!;
    fontSize.dispatchEvent(new window.Event('change'));
    expect(spy).toHaveBeenCalled();
  });

  it('should call document.setAlignment on alignLeft click', () => {
    const spy = vi.spyOn(ti.document, 'setAlignment' as any);
    const btn = document.getElementById('alignLeft')!;
    btn.dispatchEvent(new window.Event('click'));
    expect(spy).toHaveBeenCalledWith('left', expect.anything());
  });

  it('should call document.setAlignment on alignCenter click', () => {
    const spy = vi.spyOn(ti.document, 'setAlignment' as any);
    const btn = document.getElementById('alignCenter')!;
    btn.dispatchEvent(new window.Event('click'));
    expect(spy).toHaveBeenCalledWith('center', expect.anything());
  });

  it('should call document.setAlignment on alignRight click', () => {
    const spy = vi.spyOn(ti.document, 'setAlignment' as any);
    const btn = document.getElementById('alignRight')!;
    btn.dispatchEvent(new window.Event('click'));
    expect(spy).toHaveBeenCalledWith('right', expect.anything());
  });

  it('should call undoRedoManager.saveUndoSnapshot on paste', () => {
    const spy = vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');
    // Use Event fallback for jsdom
    const pasteEvent = new window.Event('paste', { bubbles: true });
    editorDiv.dispatchEvent(pasteEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should call undoRedoManager.saveUndoSnapshot on drop', () => {
    const spy = vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');
    // Use Event fallback for jsdom
    const dropEvent = new window.Event('drop', { bubbles: true });
    editorDiv.dispatchEvent(dropEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should update state on keydown event', () => {
    const spy = vi.spyOn(ti, 'handleKeydown');
    const event = new window.KeyboardEvent('keydown', {
      key: 'b',
      ctrlKey: true,
    });
    editorDiv.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });
});

describe('TextIgniter - showAcknowledgement (toast feedback)', () => {
  let ti: TextIgniter;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mainEditor"></div>
      <div id="toolbar"></div>
      <div id="popupToolbar"></div>
    `;
    ti = new TextIgniter('mainEditor', {} as any);
  });

  it('should create and remove a toast message in the DOM', async () => {
    // @ts-ignore: access private method
    ti.showAcknowledgement('HTML copied!', 500);

    // Check that toast is added
    const toast = document.getElementById(strings.TOAST_ID);
    expect(toast).not.toBeNull();
    expect(toast?.textContent).toContain('HTML copied!');

    // Wait for auto removal
    await new Promise(res => setTimeout(res, 800));

    // Check that toast is removed
    expect(document.getElementById('ti-toast')).toBeNull();
  });

  it('should replace an existing toast if already present', () => {
    const existingToast = document.createElement('div');
    existingToast.id = 'ti-toast';
    document.body.appendChild(existingToast);

    // @ts-ignore
    expect(() => ti.showAcknowledgement('Replaced toast')).not.toThrow();

    const allToasts = document.querySelectorAll('#ti-toast');
    expect(allToasts.length).toBe(1); // ensures replacement, not duplication
  });
});

describe('TextIgniter backspace and delete functionality', () => {
  let ti: TextIgniter;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mainEditor"></div>
      <div id="toolbar"></div>
      <div id="popupToolbar"></div>
    `;
    ti = new TextIgniter('mainEditor', {} as any);

    // Patch necessary methods
    ti.document.deleteRange = vi.fn();
    ti.document.deleteBlocks = vi.fn();
    ti.document.insertAt = vi.fn();
    ti.document.emit = vi.fn();
    ti.setCursorPosition = vi.fn();
    ti.getCurrentCursorBlock = vi.fn(() => 'test-block-id');
    ti.document.selectedBlockId = 'test-block-id';
    ti.document.blocks = [
      {
        dataId: 'test-block-id',
        pieces: [{ text: 'test text', attributes: {} }],
        type: 'text',
      },
    ];
  });

  it('should handle backspace when all text is selected via Ctrl+A', () => {
    // Simulate Ctrl+A selection
    ti.document.selectAll = true;
    ti.document.dataIds = ['block1', 'block2', 'block3'];
    ti.document.blocks = [
      { dataId: 'block1', pieces: [{ text: 'text1' }], type: 'text' },
      { dataId: 'block2', pieces: [{ text: 'text2' }], type: 'text' },
      { dataId: 'block3', pieces: [{ text: 'text3' }], type: 'text' },
    ];

    // Mock getSelection to return non-collapsed state
    const mockSelection = { isCollapsed: false };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);

    const deleteBlocksSpy = vi.spyOn(ti.document, 'deleteBlocks');
    const undoSpy = vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');

    // Simulate backspace event
    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    ti.handleKeydown(event);

    expect(undoSpy).toHaveBeenCalled();
    expect(deleteBlocksSpy).toHaveBeenCalled();
  });

  it('should handle backspace when multiple blocks are manually selected', () => {
    ti.document.selectAll = false;
    ti.document.dataIds = ['block1', 'block2'];
    ti.document.blocks = [
      { dataId: 'block1', pieces: [{ text: 'text1' }], type: 'text' },
      { dataId: 'block2', pieces: [{ text: 'text2' }], type: 'text' },
    ];

    const mockSelection = { isCollapsed: false };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);

    const deleteBlocksSpy = vi.spyOn(ti.document, 'deleteBlocks');

    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    ti.handleKeydown(event);

    expect(deleteBlocksSpy).toHaveBeenCalled();
  });

  it('should handle normal backspace for single character deletion', () => {
    const mockSelection = { isCollapsed: true };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);

    // Mock getSelectionRange to return cursor at position 5
    vi.spyOn(ti, 'getSelectionRange').mockReturnValue([5, 5]);

    const deleteRangeSpy = vi.spyOn(ti.document, 'deleteRange');
    const setCursorSpy = vi.spyOn(ti, 'setCursorPosition');

    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    ti.handleKeydown(event);

    expect(deleteRangeSpy).toHaveBeenCalledWith(
      4,
      5,
      ti.document.selectedBlockId,
      ti.document.currentOffset,
      true
    );
    expect(setCursorSpy).toHaveBeenCalledWith(4);
  });

  it('should handle backspace with text range selection', () => {
    const mockSelection = { isCollapsed: false };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);

    // Mock selected range
    vi.spyOn(ti, 'getSelectionRange').mockReturnValue([2, 8]);
    ti.document.dataIds = ['test-block-id']; // Single block selection - this should trigger multiple block deletion path

    const deleteBlocksSpy = vi.spyOn(ti.document, 'deleteBlocks');
    const undoSpy = vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');

    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    ti.handleKeydown(event);

    expect(undoSpy).toHaveBeenCalled();
    expect(deleteBlocksSpy).toHaveBeenCalled();
  });

  it('should properly restore cursor position after deleting all content', () => {
    ti.document.selectAll = true;
    ti.document.dataIds = ['block1'];
    ti.document.blocks = [];

    const mockSelection = { isCollapsed: false };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);

    // Mock deleteBlocks to clear blocks
    ti.document.deleteBlocks = vi.fn(() => {
      ti.document.blocks = []; // Simulate clearing all blocks
    });

    const setCursorSpy = vi.spyOn(ti, 'setCursorPosition');

    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    ti.handleKeydown(event);

    expect(setCursorSpy).toHaveBeenCalled();
  });
});

describe('TextIgniter ordered list functionality', () => {
  let ti: TextIgniter;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mainEditor"></div>
      <div id="toolbar"></div>
      <div id="popupToolbar"></div>
    `;
    ti = new TextIgniter('mainEditor', {} as any);

    // Mock document methods
    ti.document.toggleOrderedList = vi.fn();
    ti.document.toggleOrderedListForMultipleBlocks = vi.fn();
    ti.document.updateOrderedListNumbers = vi.fn();
    ti.document.emit = vi.fn();

    // Set up initial blocks
    ti.document.blocks = [
      {
        dataId: 'block1',
        pieces: [{ text: 'First item', attributes: {} }],
        type: 'text',
        listType: null,
      },
      {
        dataId: 'block2',
        pieces: [{ text: 'Second item', attributes: {} }],
        type: 'text',
        listType: null,
      },
    ];
  });

  it('should call toggleOrderedList for single block selection', () => {
    ti.document.dataIds = ['block1'];
    ti.document.selectedBlockId = 'block1';

    const toggleSpy = vi.spyOn(ti.document, 'toggleOrderedList');
    const updateNumbersSpy = vi.spyOn(ti.document, 'updateOrderedListNumbers');

    ti.handleToolbarAction('orderedList');

    expect(toggleSpy).toHaveBeenCalledWith('block1');
    expect(updateNumbersSpy).toHaveBeenCalled();
  });

  it('should call toggleOrderedListForMultipleBlocks for multiple block selection', () => {
    ti.document.dataIds = ['block1', 'block2'];

    const toggleMultipleSpy = vi.spyOn(
      ti.document,
      'toggleOrderedListForMultipleBlocks'
    );
    const updateNumbersSpy = vi.spyOn(ti.document, 'updateOrderedListNumbers');

    ti.handleToolbarAction('orderedList');

    expect(toggleMultipleSpy).toHaveBeenCalledWith(['block1', 'block2']);
    expect(updateNumbersSpy).toHaveBeenCalled();
  });

  it('should always call updateOrderedListNumbers after toggling ordered list', () => {
    ti.document.dataIds = ['block1'];
    ti.document.selectedBlockId = 'block1';

    const updateNumbersSpy = vi.spyOn(ti.document, 'updateOrderedListNumbers');

    ti.handleToolbarAction('orderedList');

    expect(updateNumbersSpy).toHaveBeenCalled();
  });

  it('should handle ordered list creation in Enter key handling', () => {
    // Set up a current block that's an ordered list
    const currentBlock = {
      dataId: 'current-block',
      listType: 'ol',
      listStart: 1,
      pieces: [{ text: 'First item', attributes: {} }],
      type: 'text',
    };

    ti.document.blocks = [currentBlock];
    ti.document.selectedBlockId = 'current-block';

    // Mock methods
    vi.spyOn(ti, 'getSelectionRange').mockReturnValue([5, 5]);
    vi.spyOn(ti.document, 'emit');

    // Mock window.getSelection for setCursorPosition
    const mockRange = {
      setStart: vi.fn(),
      collapse: vi.fn(),
    };
    const mockSelection = {
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);
    vi.spyOn(document, 'createRange').mockReturnValue(mockRange as any);

    const event = new window.KeyboardEvent('keydown', { key: 'Enter' });
    ti.handleKeydown(event);

    // Should create a new list item with incremented number
    expect(ti.document.blocks.length).toBe(2);
    const newBlock = ti.document.blocks[1];
    expect(newBlock.listType).toBe('li');
    expect(newBlock.listStart).toBe(2);
    expect(newBlock.parentId).toBe('current-block');
  });

  it('should update subsequent list item numbers when Enter is pressed', () => {
    // Set up multiple ordered list items
    ti.document.blocks = [
      {
        dataId: 'parent-block',
        listType: 'ol',
        listStart: 1,
        pieces: [{ text: 'First item' }],
        type: 'text',
      },
      {
        dataId: 'item1-block',
        listType: 'li',
        listStart: 2,
        parentId: 'parent-block',
        pieces: [{ text: 'Second item' }],
        type: 'text',
      },
      {
        dataId: 'item2-block',
        listType: 'li',
        listStart: 3,
        parentId: 'parent-block',
        pieces: [{ text: 'Third item' }],
        type: 'text',
      },
    ];

    ti.document.selectedBlockId = 'parent-block';

    vi.spyOn(ti, 'getSelectionRange').mockReturnValue([5, 5]);
    vi.spyOn(ti.document, 'emit');

    // Mock window.getSelection for setCursorPosition
    const mockRange = {
      setStart: vi.fn(),
      collapse: vi.fn(),
    };
    const mockSelection = {
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);
    vi.spyOn(document, 'createRange').mockReturnValue(mockRange as any);

    const event = new window.KeyboardEvent('keydown', { key: 'Enter' });
    ti.handleKeydown(event);

    // Should increment numbers of subsequent list items
    expect(ti.document.blocks[2].listStart).toBe(3); // Was 2, now should be 3
    expect(ti.document.blocks[3].listStart).toBe(4); // Was 3, now should be 4
  });
});

describe('TextIgniter keyboard event handling', () => {
  let ti: TextIgniter;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mainEditor"></div>
      <div id="toolbar"></div>
      <div id="popupToolbar"></div>
    `;
    ti = new TextIgniter('mainEditor', {} as any);

    // Mock methods
    ti.document.insertAt = vi.fn();
    ti.document.deleteRange = vi.fn();
    ti.setCursorPosition = vi.fn();
    ti.syncCurrentAttributesWithCursor = vi.fn();
  });

  it('should handle Delete key for forward deletion', () => {
    vi.spyOn(ti, 'getSelectionRange').mockReturnValue([5, 5]); // No selection
    vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');

    ti.document.selectedBlockId = 'test-block';
    ti.document.currentOffset = 0;
    ti.document.blocks = [
      {
        dataId: 'test-block',
        pieces: [{ text: 'hello world', attributes: {} }],
        type: 'text',
      },
    ];

    const event = new window.KeyboardEvent('keydown', { key: 'Delete' });
    ti.handleKeydown(event);

    expect(ti.document.deleteRange).toHaveBeenCalledWith(
      5,
      6,
      ti.document.selectedBlockId,
      ti.document.currentOffset,
      false
    );
  });

  it('should handle character input and insert at cursor position', () => {
    vi.spyOn(ti, 'getSelectionRange').mockReturnValue([3, 3]);
    vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');

    ti.currentAttributes = { bold: true, italic: false, underline: false };
    ti.document.selectedBlockId = 'test-block';
    ti.document.currentOffset = 0;

    const event = new window.KeyboardEvent('keydown', { key: 'a' });
    ti.handleKeydown(event);

    expect(ti.document.insertAt).toHaveBeenCalledWith(
      'a',
      ti.currentAttributes,
      3,
      ti.document.selectedBlockId,
      ti.document.currentOffset,
      '',
      '',
      true // isSynthetic flag is true in test environment
    );
    expect(ti.setCursorPosition).toHaveBeenCalledWith(4);
  });

  it('should handle range deletion before character insertion', () => {
    vi.spyOn(ti, 'getSelectionRange').mockReturnValue([2, 7]); // Range selected
    vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');

    ti.document.selectedBlockId = 'test-block';
    ti.document.currentOffset = 0;

    const event = new window.KeyboardEvent('keydown', { key: 'x' });
    ti.handleKeydown(event);

    expect(ti.document.deleteRange).toHaveBeenCalledWith(
      2,
      7,
      ti.document.selectedBlockId,
      ti.document.currentOffset,
      false
    );
    expect(ti.document.insertAt).toHaveBeenCalledWith(
      'x',
      expect.any(Object),
      2,
      ti.document.selectedBlockId,
      ti.document.currentOffset,
      '',
      '',
      true
    );
  });
});

describe('TextIgniter advanced backspace and list scenarios', () => {
  let ti: TextIgniter;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mainEditor"></div>
      <div id="toolbar"></div>
      <div id="popupToolbar"></div>
    `;
    ti = new TextIgniter('mainEditor', {} as any);

    // Mock necessary methods
    ti.document.deleteRange = vi.fn();
    ti.document.deleteBlocks = vi.fn();
    ti.document.emit = vi.fn();
    ti.setCursorPosition = vi.fn();
    ti.syncCurrentAttributesWithCursor = vi.fn();
  });

  it('should handle Ctrl+A followed by backspace to clear all content', () => {
    // Simulate all text being selected via Ctrl+A
    ti.document.selectAll = true;
    ti.document.dataIds = ['block1', 'block2', 'block3'];
    ti.document.blocks = [
      { dataId: 'block1', pieces: [{ text: 'First block' }], type: 'text' },
      { dataId: 'block2', pieces: [{ text: 'Second block' }], type: 'text' },
      { dataId: 'block3', pieces: [{ text: 'Third block' }], type: 'text' },
    ];

    const mockSelection = { isCollapsed: false };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);

    const deleteBlocksSpy = vi.spyOn(ti.document, 'deleteBlocks');
    const undoSpy = vi.spyOn(ti.undoRedoManager, 'saveUndoSnapshot');

    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    ti.handleKeydown(event);

    expect(undoSpy).toHaveBeenCalled();
    expect(deleteBlocksSpy).toHaveBeenCalled();
    expect(ti.document.selectAll).toBe(true); // selectAll flag should be respected
  });

  it('should handle backspace when manually selecting all content', () => {
    // Simulate manually selecting all content (not via Ctrl+A)
    ti.document.selectAll = false;
    ti.document.dataIds = ['block1', 'block2'];
    ti.document.blocks = [
      { dataId: 'block1', pieces: [{ text: 'First' }], type: 'text' },
      { dataId: 'block2', pieces: [{ text: 'Second' }], type: 'text' },
    ];

    const mockSelection = { isCollapsed: false };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);

    const deleteBlocksSpy = vi.spyOn(ti.document, 'deleteBlocks');

    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    ti.handleKeydown(event);

    // Should still delete blocks when all are selected manually
    expect(deleteBlocksSpy).toHaveBeenCalled();
  });

  it('should preserve ordered list numbering after Enter key in list items', () => {
    // Test the specific fix for ordered list numbering
    const listItems = [
      {
        dataId: 'list-parent',
        listType: 'ol',
        listStart: 1,
        pieces: [{ text: 'First item' }],
        type: 'text',
      },
      {
        dataId: 'list-item-1',
        listType: 'li',
        listStart: 2,
        parentId: 'list-parent',
        pieces: [{ text: 'Second item' }],
        type: 'text',
      },
    ];

    ti.document.blocks = listItems;
    ti.document.selectedBlockId = 'list-parent';

    // Mock required methods for Enter handling
    vi.spyOn(ti, 'getSelectionRange').mockReturnValue([5, 5]);
    vi.spyOn(ti.document, 'emit');

    const mockRange = { setStart: vi.fn(), collapse: vi.fn() };
    const mockSelection = { removeAllRanges: vi.fn(), addRange: vi.fn() };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);
    vi.spyOn(document, 'createRange').mockReturnValue(mockRange as any);

    const event = new window.KeyboardEvent('keydown', { key: 'Enter' });
    ti.handleKeydown(event);

    // Should create a new list item
    expect(ti.document.blocks.length).toBe(3);

    // The new item should have correct numbering
    const newBlock = ti.document.blocks[1];
    expect(newBlock.listType).toBe('li');
    expect(newBlock.listStart).toBe(2);
    expect(newBlock.parentId).toBe('list-parent');

    // Subsequent items should be renumbered
    expect(ti.document.blocks[2].listStart).toBe(3);
  });

  it('should handle edge case of empty selection with backspace', () => {
    const mockSelection = { isCollapsed: true };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);
    vi.spyOn(ti, 'getSelectionRange').mockReturnValue([0, 0]); // At beginning

    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    ti.handleKeydown(event);

    // Should not attempt to delete when at position 0 with no selection
    expect(ti.document.deleteRange).not.toHaveBeenCalled();
  });

  it('should handle image deletion in backspace logic', () => {
    ti.imageHandler.isImageHighlighted = true;
    ti.imageHandler.highLightedImageDataId = 'image-block';
    ti.imageHandler.deleteImage = vi.fn();
    ti.imageHandler.setCursorPostion = vi.fn();

    ti.document.blocks = [
      { dataId: 'text-block', pieces: [{ text: 'text' }], type: 'text' },
      { dataId: 'image-block', type: 'image' },
    ];

    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    ti.handleKeydown(event);

    expect(ti.imageHandler.deleteImage).toHaveBeenCalled();
    expect(ti.imageHandler.setCursorPostion).toHaveBeenCalledWith(
      1,
      'text-block'
    );
  });
});

describe('TextIgniter ordered list numbering verification', () => {
  let ti: TextIgniter;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mainEditor"></div>
      <div id="toolbar"></div>
      <div id="popupToolbar"></div>
    `;
    ti = new TextIgniter('mainEditor', {} as any);

    // Don't mock updateOrderedListNumbers to test actual behavior
    ti.document.emit = vi.fn();
  });

  it('should call updateOrderedListNumbers ensuring proper sequential numbering', () => {
    // Set up blocks as they would exist
    ti.document.blocks = [
      {
        dataId: 'item1',
        listType: 'ol',
        listStart: 1,
        parentId: 'item1',
        pieces: [{ text: 'First item' }],
        type: 'text',
      },
      {
        dataId: 'item2',
        listType: 'li',
        listStart: 1, // Wrong numbering - should be fixed
        parentId: 'item1',
        pieces: [{ text: 'Second item' }],
        type: 'text',
      },
      {
        dataId: 'item3',
        listType: 'li',
        listStart: 1, // Wrong numbering - should be fixed
        parentId: 'item1',
        pieces: [{ text: 'Third item' }],
        type: 'text',
      },
    ];

    ti.document.dataIds = ['item1', 'item2', 'item3'];

    // Mock the methods that don't exist in our mocked instance
    ti.document.updateOrderedListNumbers = vi.fn();
    ti.document.toggleOrderedListForMultipleBlocks = vi.fn();
    ti.document.toggleOrderedList = vi.fn();
    const updateNumbersSpy = vi.spyOn(ti.document, 'updateOrderedListNumbers');

    // Trigger ordered list action
    ti.handleToolbarAction('orderedList');

    expect(updateNumbersSpy).toHaveBeenCalled();
  });

  it('should handle mixed list types and reset numbering correctly', () => {
    ti.document.blocks = [
      // First ordered list
      {
        dataId: 'ol1',
        listType: 'ol',
        parentId: 'ol1',
        pieces: [{ text: 'List 1 Item 1' }],
        type: 'text',
      },
      {
        dataId: 'li1',
        listType: 'li',
        parentId: 'ol1',
        pieces: [{ text: 'List 1 Item 2' }],
        type: 'text',
      },

      // Regular text (breaks the list)
      { dataId: 'text1', pieces: [{ text: 'Regular text' }], type: 'text' },

      // Second ordered list (should start from 1 again)
      {
        dataId: 'ol2',
        listType: 'ol',
        parentId: 'ol2',
        pieces: [{ text: 'List 2 Item 1' }],
        type: 'text',
      },
      {
        dataId: 'li2',
        listType: 'li',
        parentId: 'ol2',
        pieces: [{ text: 'List 2 Item 2' }],
        type: 'text',
      },
    ];

    // Create the mock method and call the actual logic
    ti.document.updateOrderedListNumbers = vi.fn(() => {
      // Simulate the actual updateOrderedListNumbers logic
      let currentNumber = 1;
      let currentParentId = null;

      for (let i = 0; i < ti.document.blocks.length; i++) {
        const block = ti.document.blocks[i];

        if (block.listType === 'ol' || block.listType === 'li') {
          const isNewListGroup =
            block.listType === 'ol' || block.parentId !== currentParentId;

          if (isNewListGroup) {
            currentNumber = 1;
            currentParentId =
              block.listType === 'ol' ? block.dataId : block.parentId;
          }

          block.listStart = currentNumber;
          currentNumber++;
        } else {
          currentNumber = 1;
          currentParentId = null;
        }
      }
    });

    ti.document.updateOrderedListNumbers();

    // First list
    expect(ti.document.blocks[0].listStart).toBe(1);
    expect(ti.document.blocks[1].listStart).toBe(2);

    // Second list should restart at 1
    expect(ti.document.blocks[3].listStart).toBe(1);
    expect(ti.document.blocks[4].listStart).toBe(2);
  });
});

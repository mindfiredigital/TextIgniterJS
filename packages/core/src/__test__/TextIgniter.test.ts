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
      }));
    }
    // Patch formatAttribute for unlinkText
    if (typeof ti?.document?.formatAttribute !== 'function') {
      ti.document.formatAttribute = vi.fn();
    }
  });

  it('should handleToolbarAction for bold, italic, underline, image, hyperlink', () => {
    // Bold
    expect(() => ti.handleToolbarAction('bold')).not.toThrow();
    // Italic
    expect(() => ti.handleToolbarAction('italic')).not.toThrow();
    // Underline
    expect(() => ti.handleToolbarAction('underline')).not.toThrow();
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
    // @ts-ignore: access private
    expect(() =>
      // @ts-ignore: access private
      ti.showLinkPopup(document.createElement('a'), 0, 0)
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

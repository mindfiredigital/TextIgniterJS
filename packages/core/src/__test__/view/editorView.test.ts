import { describe, it, expect, beforeEach } from 'vitest';
import EditorView from '../../view/editorView';
import TextDocument from '../../textDocument';
import Piece from '../../piece';

class MockImageHandler {
  createImageFragment(image: string, dataId: string) {
    const img = document.createElement('img');
    img.src = image;
    img.setAttribute('data-id', dataId);
    return img;
  }
}

describe('EditorView', () => {
  let container: HTMLElement;
  let documentModel: TextDocument;
  let editorView: EditorView;
  let imageHandler: MockImageHandler;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    documentModel = new TextDocument();
    editorView = new EditorView(container, documentModel);
    imageHandler = new MockImageHandler();
    editorView.setImageHandler(imageHandler as any);
  });

  it('renders a text block with correct attributes', () => {
    documentModel.blocks = [
      {
        type: 'text',
        dataId: 'block-1',
        class: 'paragraph-block',
        alignment: 'center',
        pieces: [
          new Piece('Hello', {
            bold: true,
            italic: true,
            underline: true,
            fontFamily: 'Courier',
            fontSize: '20px',
            fontColor: '#123456',
            bgColor: '#654321',
          }),
        ],
      },
    ];
    editorView.render();
    const block = container.querySelector('[data-id="block-1"]') as HTMLElement;
    expect(block).toBeTruthy();
    expect(block.style.textAlign).toBe('center');
    const outerSpan = block.querySelector('span');
    expect(outerSpan?.style.fontFamily).toBe('Courier');
    expect(outerSpan?.style.fontSize).toBe('20px');
    // Find the span with color and background color
    const allSpans = block.querySelectorAll('span');
    let colorFound = false;
    let bgFound = false;
    allSpans.forEach(span => {
      // Log actual style values for debugging
      console.log(
        'span color:',
        span.style.color,
        'span bg:',
        span.style.backgroundColor
      );
      // Accept both hex and rgb formats
      if (
        span.style.color === '#123456' ||
        span.style.color === 'rgb(18, 52, 86)'
      )
        colorFound = true;
      if (
        span.style.backgroundColor === 'rgb(101, 67, 33)' ||
        span.style.backgroundColor === '#654321'
      )
        bgFound = true;
    });
    expect(colorFound).toBe(true);
    expect(bgFound).toBe(true);
  });

  it('renders an image block', () => {
    documentModel.blocks = [
      {
        type: 'image',
        dataId: 'img-1',
        class: 'image-block',
        alignment: 'left',
        image: 'test.png',
        pieces: [],
      },
    ];
    editorView.render();
    const block = container.querySelector('[data-id="img-1"]');
    expect(block).toBeTruthy();
    expect(block?.querySelector('img')).toBeTruthy();
    expect(block?.querySelector('img')?.src).toContain('test.png');
  });

  it('renders ordered list block with correct start', () => {
    documentModel.blocks = [
      {
        type: 'text',
        dataId: 'ol-1',
        class: 'paragraph-block',
        alignment: 'left',
        listType: 'ol',
        listStart: 5,
        pieces: [new Piece('Item 1')],
      },
    ];
    editorView.render();
    const ol = container.querySelector('ol');
    expect(ol).toBeTruthy();
    expect(ol?.getAttribute('start')).toBe('5');
    expect(ol?.querySelector('li')).toBeTruthy();
  });

  it('renders unordered list block', () => {
    documentModel.blocks = [
      {
        type: 'text',
        dataId: 'ul-1',
        class: 'paragraph-block',
        alignment: 'left',
        listType: 'ul',
        pieces: [new Piece('Item 1')],
      },
    ];
    editorView.render();
    const ul = container.querySelector('ul');
    expect(ul).toBeTruthy();
    expect(ul?.querySelector('li')).toBeTruthy();
  });

  it('renders multiple blocks', () => {
    documentModel.blocks = [
      {
        type: 'text',
        dataId: 'block-1',
        class: 'paragraph-block',
        alignment: 'left',
        pieces: [new Piece('Text 1')],
      },
      {
        type: 'image',
        dataId: 'img-2',
        class: 'image-block',
        alignment: 'center',
        image: 'img2.png',
        pieces: [],
      },
    ];
    editorView.render();
    expect(container.querySelector('[data-id="block-1"]')).toBeTruthy();
    expect(container.querySelector('[data-id="img-2"]')).toBeTruthy();
  });
});

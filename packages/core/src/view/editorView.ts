import Piece from '../piece';
import TextDocument from '../textDocument';
import { saveSelection, restoreSelection } from '../utils/selectionManager';
import { ImageHandler } from '../handlers/image';
class EditorView {
  container: HTMLElement;
  document: TextDocument;
  imageHandler!: ImageHandler;

  constructor(container: HTMLElement, document: TextDocument) {
    this.container = container;
    this.document = document;
  }

  setImageHandler(imageHandler: ImageHandler) {
    this.imageHandler = imageHandler;
  }

  render(): void {
    const savedSel = saveSelection(this.container);
    this.container.innerHTML = '';
    // Create a wrapper div with a unique data-id

    this.document.blocks.forEach((block: any) => {
      if (block.dataId !== '') {
        let wrapperDiv: HTMLElement;

        // If block is an image, ignore list handling.
        if (block.type === 'image') {
          wrapperDiv = document.createElement('div');
          wrapperDiv.setAttribute('data-id', block.dataId);
          wrapperDiv.setAttribute('class', block.class);
          wrapperDiv.setAttribute('type', block.type);
          wrapperDiv.style.textAlign = block.alignment || 'left';
          if (block.image) {
            // Guard: imageHandler must exist and have createImageFragment
            if (
              this.imageHandler &&
              typeof this.imageHandler.createImageFragment === 'function'
            ) {
              wrapperDiv.appendChild(
                this.imageHandler.createImageFragment(block.image, block.dataId)
              );
            } else {
              // Fallback: just render img
              const img = document.createElement('img');
              img.src = block.image;
              wrapperDiv.appendChild(img);
            }
          }
        } else {
          // For text blocks, use list wrappers if needed.
          if (block.listType === 'ol' || block.listType === 'li') {
            wrapperDiv = document.createElement('ol');
            wrapperDiv.setAttribute(
              'start',
              block?.listStart?.toString() || '1'
            );
          } else if (block.listType === 'ul') {
            wrapperDiv = document.createElement('ul');
          } else {
            wrapperDiv = document.createElement('div');
          }
          wrapperDiv.setAttribute('data-id', block.dataId);
          wrapperDiv.setAttribute('class', block.class);
          wrapperDiv.setAttribute('type', block.type);
          wrapperDiv.style.textAlign = block.alignment || 'left';

          // Guard: block.pieces must be an array
          if (Array.isArray(block.pieces)) {
            if (
              block.listType === 'ol' ||
              block.listType === 'ul' ||
              block.listType === 'li'
            ) {
              const li = document.createElement('li');
              block.pieces.forEach((piece: Piece) => {
                li.appendChild(this.renderPiece(piece));
              });
              wrapperDiv.appendChild(li);
            } else {
              block.pieces.forEach((piece: Piece) => {
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

  renderPiece(piece: Piece): DocumentFragment {
    const lines = piece.text.split('\n');
    return this.wrapAttributes(lines, piece.attributes);
  }

  wrapAttributes(
    lines: string[],
    attrs: {
      bold: boolean;
      italic: boolean;
      underline: boolean;
      strikethrough?: boolean;
      fontFamily?: string;
      fontSize?: string;
      hyperlink?: string | boolean;
      fontColor?: string;
      bgColor?: string;
    }
  ): DocumentFragment {
    const fragment = document.createDocumentFragment();
    lines.forEach((line, index) => {
      let textNode: Node = document.createTextNode(line);
      if (attrs.strikethrough) {
        const s = document.createElement('s');
        s.appendChild(textNode);
        textNode = s;
      }
      if (attrs.underline) {
        const u = document.createElement('u');
        u.appendChild(textNode);
        textNode = u;
      }
      if (attrs.italic) {
        const em = document.createElement('em');
        em.appendChild(textNode);
        textNode = em;
      }
      if (attrs.bold) {
        const strong = document.createElement('strong');
        strong.appendChild(textNode);
        textNode = strong;
      }

      // Wrap with a span to apply font family and size
      const fontFamilySelect = document.getElementById(
        'fontFamily'
      ) as HTMLSelectElement;
      const fontSizeSelect = document.getElementById(
        'fontSize'
      ) as HTMLSelectElement;
      let selectedFontFamilyValue = 'Arial';
      let selectedFontSizeValue = '16px';

      if (fontFamilySelect) {
        selectedFontFamilyValue = fontFamilySelect.value; // Get the selected value
      }

      if (fontSizeSelect) {
        selectedFontSizeValue = fontSizeSelect.value; // Get the selected value
      }

      // Create a single span for all styles
      const span = document.createElement('span');
      span.style.fontFamily = attrs.fontFamily || selectedFontFamilyValue;
      span.style.fontSize = attrs.fontSize || selectedFontSizeValue;
      if (attrs.fontColor && typeof attrs.fontColor === 'string') {
        span.style.color = attrs.fontColor;
      }
      if (attrs.bgColor && typeof attrs.bgColor === 'string') {
        span.style.backgroundColor = attrs.bgColor;
      }
      // Apply hyperlink
      if (attrs.hyperlink && typeof attrs.hyperlink === 'string') {
        const a = document.createElement('a');
        a.href = attrs.hyperlink;
        a.appendChild(textNode);
        textNode = a;
      }
      span.appendChild(textNode);
      textNode = span;
      fragment.appendChild(textNode);
      if (index < lines.length - 1) {
        fragment.appendChild(document.createElement('br'));
      }
    });
    return fragment;
  }
}

export default EditorView;

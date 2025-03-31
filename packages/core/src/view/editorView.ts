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
            wrapperDiv.appendChild(
              this.imageHandler.createImageFragment(block.image, block.dataId)
            );
          }
        } else {
          // For text blocks, use list wrappers if needed.
          if (block.listType === 'ol' || block.listType === 'li') {
            wrapperDiv = document.createElement('ol');
            wrapperDiv.setAttribute('start', block?.listStart.toString());
          } else if (block.listType === 'ul') {
            wrapperDiv = document.createElement('ul');
          } else {
            wrapperDiv = document.createElement('div');
          }
          wrapperDiv.setAttribute('data-id', block.dataId);
          wrapperDiv.setAttribute('class', block.class);
          wrapperDiv.setAttribute('type', block.type);
          wrapperDiv.style.textAlign = block.alignment || 'left';

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

      if (attrs.hyperlink && typeof attrs.hyperlink === 'string') {
        const a = document.createElement('a');
        a.href = attrs.hyperlink;
        a.target = '_blank'; //For new tab
        a.appendChild(textNode);
        textNode = a;
      }
      if (attrs.fontColor && typeof attrs.fontColor === 'string') {
        const span = document.createElement('span');
        console.log(lines, 'attrs.fontColor', attrs.fontColor);
        span.style.color = attrs.fontColor;
        span.appendChild(textNode);
        textNode = span;
      }

      if (attrs.bgColor && typeof attrs.bgColor === 'string') {
        const span = document.createElement('span');
        span.style.backgroundColor = attrs.bgColor;
        span.appendChild(textNode);
        textNode = span;
      }

      const span = document.createElement('span');
      span.style.fontFamily = attrs.fontFamily || selectedFontFamilyValue;
      span.style.fontSize = attrs.fontSize || selectedFontSizeValue;
      // span.style.color = attrs.fontColor || selectedFontColor;
      span.appendChild(textNode);

      fragment.appendChild(span);
      if (index < lines.length - 1) {
        fragment.appendChild(document.createElement('br'));
      }
    });
    return fragment;
  }
}

export default EditorView;

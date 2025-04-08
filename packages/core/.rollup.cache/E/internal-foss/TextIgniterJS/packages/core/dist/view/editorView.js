import { saveSelection, restoreSelection } from '../utils/selectionManager';
class EditorView {
  constructor(container, document) {
    this.container = container;
    this.document = document;
  }
  setImageHandler(imageHandler) {
    this.imageHandler = imageHandler;
  }
  render() {
    const savedSel = saveSelection(this.container);
    this.container.innerHTML = '';
    this.document.blocks.forEach(block => {
      if (block.dataId !== '') {
        let wrapperDiv;
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
          if (block.listType === 'ol' || block.listType === 'li') {
            wrapperDiv = document.createElement('ol');
            wrapperDiv.setAttribute(
              'start',
              block === null || block === void 0
                ? void 0
                : block.listStart.toString()
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
          if (
            block.listType === 'ol' ||
            block.listType === 'ul' ||
            block.listType === 'li'
          ) {
            const li = document.createElement('li');
            block.pieces.forEach(piece => {
              li.appendChild(this.renderPiece(piece));
            });
            wrapperDiv.appendChild(li);
          } else {
            block.pieces.forEach(piece => {
              wrapperDiv.appendChild(this.renderPiece(piece));
            });
          }
        }
        this.container.appendChild(wrapperDiv);
      }
    });
    restoreSelection(this.container, savedSel);
  }
  renderPiece(piece) {
    const lines = piece.text.split('\n');
    return this.wrapAttributes(lines, piece.attributes);
  }
  wrapAttributes(lines, attrs) {
    const fragment = document.createDocumentFragment();
    lines.forEach((line, index) => {
      let textNode = document.createTextNode(line);
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
      const fontFamilySelect = document.getElementById('fontFamily');
      const fontSizeSelect = document.getElementById('fontSize');
      let selectedFontFamilyValue = 'Arial';
      let selectedFontSizeValue = '16px';
      if (fontFamilySelect) {
        selectedFontFamilyValue = fontFamilySelect.value;
      }
      if (fontSizeSelect) {
        selectedFontSizeValue = fontSizeSelect.value;
      }
      if (attrs.hyperlink && typeof attrs.hyperlink === 'string') {
        const a = document.createElement('a');
        a.href = attrs.hyperlink;
        a.target = '_blank';
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
//# sourceMappingURL=editorView.js.map

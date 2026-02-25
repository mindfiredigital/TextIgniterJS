import { saveSelection, restoreSelection } from '../utils/selectionManager';
import { ensureProtocol } from '../utils/urlDetector';
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
        this.document.blocks.forEach((block) => {
            var _a;
            if (block.dataId !== '') {
                let wrapperDiv;
                if (block.type === 'image') {
                    wrapperDiv = document.createElement('div');
                    wrapperDiv.setAttribute('data-id', block.dataId);
                    wrapperDiv.setAttribute('class', block.class);
                    wrapperDiv.setAttribute('type', block.type);
                    wrapperDiv.style.textAlign = block.alignment || 'left';
                    if (block.image) {
                        if (this.imageHandler &&
                            typeof this.imageHandler.createImageFragment === 'function') {
                            wrapperDiv.appendChild(this.imageHandler.createImageFragment(block.image, block.dataId));
                        }
                        else {
                            const img = document.createElement('img');
                            img.src = block.image;
                            wrapperDiv.appendChild(img);
                        }
                    }
                }
                else {
                    if (block.listType === 'ol' || block.listType === 'li') {
                        wrapperDiv = document.createElement('ol');
                        wrapperDiv.setAttribute('start', ((_a = block === null || block === void 0 ? void 0 : block.listStart) === null || _a === void 0 ? void 0 : _a.toString()) || '1');
                    }
                    else if (block.listType === 'ul') {
                        wrapperDiv = document.createElement('ul');
                    }
                    else {
                        wrapperDiv = document.createElement('div');
                    }
                    wrapperDiv.setAttribute('data-id', block.dataId);
                    wrapperDiv.setAttribute('class', block.class);
                    wrapperDiv.setAttribute('type', block.type);
                    wrapperDiv.style.textAlign = block.alignment || 'left';
                    if (Array.isArray(block.pieces)) {
                        if (block.listType === 'ol' ||
                            block.listType === 'ul' ||
                            block.listType === 'li') {
                            const li = document.createElement('li');
                            block.pieces.forEach((piece) => {
                                li.appendChild(this.renderPiece(piece));
                            });
                            wrapperDiv.appendChild(li);
                        }
                        else {
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
        const lines = piece.text.split('\n');
        return this.wrapAttributes(lines, piece.attributes);
    }
    wrapAttributes(lines, attrs) {
        const fragment = document.createDocumentFragment();
        lines.forEach((line, index) => {
            let textNode = document.createTextNode(line);
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
            const span = document.createElement('span');
            span.style.fontFamily = attrs.fontFamily || selectedFontFamilyValue;
            span.style.fontSize = attrs.fontSize || selectedFontSizeValue;
            if (attrs.fontColor && typeof attrs.fontColor === 'string') {
                span.style.color = attrs.fontColor;
            }
            if (attrs.bgColor && typeof attrs.bgColor === 'string') {
                span.style.backgroundColor = attrs.bgColor;
            }
            if (attrs.hyperlink && typeof attrs.hyperlink === 'string') {
                const a = document.createElement('a');
                a.href = ensureProtocol(attrs.hyperlink);
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

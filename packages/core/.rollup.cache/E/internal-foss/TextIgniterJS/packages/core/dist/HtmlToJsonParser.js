import Piece from './piece';
class HtmlToJsonParser {
  constructor(htmlString) {
    this.htmlString = htmlString;
    this.doc = new DOMParser().parseFromString(htmlString, 'text/html');
  }
  parse() {
    const elements = this.doc.body.children;
    let jsonData = [];
    Array.from(elements).forEach((element, i) => {
      const _element = this.parseElement(element);
      console.log(element, 'element parse', i, _element);
      jsonData.push(_element);
    });
    console.log(jsonData, 'element--jsondata');
    return jsonData;
  }
  parseElement(element) {
    const dataId = element.getAttribute('data-id') || '';
    const className = element.className || 'paragraph-block';
    const alignment = element.style.textAlign || 'left';
    let listType = null;
    let listStart = null;
    let parentId = null;
    if (element.tagName === 'UL') {
      listType = 'ul';
    } else if (element.tagName === 'OL') {
      listType = 'ol';
      listStart = parseInt(element.getAttribute('start') || '1', 10);
    }
    let pieces = [];
    if (listType) {
      this.parseListItems(element, pieces);
    } else {
      this.parseParagraphText(element, pieces);
    }
    return Object.assign(
      Object.assign(
        Object.assign(
          { dataId, class: className, alignment, pieces },
          listType ? { listType } : {}
        ),
        listStart !== null ? { listStart } : {}
      ),
      parentId !== null ? { parentId } : {}
    );
  }
  parseListItems(element, pieces) {
    const listItems = element.querySelectorAll('li');
    listItems.forEach(li => {
      const piece = this.extractTextAttributes(li);
      if (piece) pieces.push(new Piece(piece.text, piece.attributes));
    });
  }
  parseParagraphText(element, pieces) {
    const spans = element.querySelectorAll('span');
    const uniquePieces = new Map();
    spans.forEach(span => {
      const piece = this.extractTextAttributes(span);
      console.log(
        piece,
        'piece parseParagraphText span',
        span.textContent,
        span.style.color
      );
      if (piece) {
        const existingPiece = uniquePieces.get(piece.text);
        if (existingPiece) {
          existingPiece.attributes.bold =
            existingPiece.attributes.bold || piece.attributes.bold;
          existingPiece.attributes.italic =
            existingPiece.attributes.italic || piece.attributes.italic;
          existingPiece.attributes.underline =
            existingPiece.attributes.underline || piece.attributes.underline;
          existingPiece.attributes.fontFamily =
            piece.attributes.fontFamily || existingPiece.attributes.fontFamily;
          existingPiece.attributes.fontSize =
            piece.attributes.fontSize || existingPiece.attributes.fontSize;
          existingPiece.attributes.fontColor =
            piece.attributes.fontColor || existingPiece.attributes.fontColor;
          existingPiece.attributes.bgColor =
            piece.attributes.bgColor || existingPiece.attributes.bgColor;
        } else {
          uniquePieces.set(piece.text, Object.assign({}, piece));
        }
      }
    });
    uniquePieces.forEach(uniquePiece => {
      pieces.push(new Piece(uniquePiece.text, uniquePiece.attributes));
    });
    console.log(pieces, 'pieces--parseParagraphText (merged)');
  }
  extractTextAttributes(node) {
    var _a;
    const text = node.textContent || '';
    if (!text) return null;
    console.log('extractTextAttributes node', node, node.style.color);
    return {
      text,
      attributes: {
        bold: node.querySelector('b, strong') !== null,
        italic: node.querySelector('i, em') !== null,
        underline: node.querySelector('u') !== null,
        undo: false,
        redo: false,
        fontFamily: node.style.fontFamily || 'Arial',
        fontSize: node.style.fontSize || '12px',
        hyperlink: node.querySelector('a')
          ? (_a = node.querySelector('a')) === null || _a === void 0
            ? void 0
            : _a.getAttribute('href')
          : false,
        fontColor: node.style.color,
        bgColor: node.style.backgroundColor,
      },
    };
  }
  rgbToHex(rgb, isBackground = false) {
    const rgbArray = rgb.match(/\d+/g);
    if (!rgbArray || rgbArray.length < 3) return null;
    const hex = rgbArray
      .map(x => {
        const value = parseInt(x);
        if (value < 0 || value > 255) return '00';
        return value.toString(16).padStart(2, '0');
      })
      .join('');
    if (!isBackground && hex === '000000') {
      return null;
    }
    return `#${hex}`;
  }
}
export default HtmlToJsonParser;
//# sourceMappingURL=HtmlToJsonParser.js.map

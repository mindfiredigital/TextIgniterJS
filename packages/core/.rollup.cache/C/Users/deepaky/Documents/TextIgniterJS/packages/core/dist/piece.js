class Piece {
  constructor(text, attributes = {}) {
    this.text = text;
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontSizeSelect = document.getElementById('fontSize');
    let selectedFontFamilyValue = 'Arial';
    let selectedFontSizeValue = '16px';
    let selectedFontColor = document.getElementById('fontColorPicker');
    let selectedBgColor = document.getElementById('bgColorPicker');
    if (fontFamilySelect) {
      selectedFontFamilyValue = fontFamilySelect.value; // Get the selected value
    }
    if (fontSizeSelect) {
      selectedFontSizeValue = fontSizeSelect.value; // Get the selected value
    }
    this.attributes = {
      bold: attributes.bold || false,
      italic: attributes.italic || false,
      underline: attributes.underline || false,
      undo: attributes.undo || false,
      redo: attributes.redo || false,
      fontFamily: attributes.fontFamily || selectedFontFamilyValue, // Default font family
      fontSize: attributes.fontSize || selectedFontSizeValue, // Default font size
      hyperlink: attributes.hyperlink || false,
      fontColor: attributes.fontColor || selectedFontColor.value,
      bgColor: attributes.bgColor || selectedBgColor.value,
    };
  }
  isBold() {
    return this.attributes.bold;
  }
  setBold(v) {
    this.attributes.bold = v;
  }
  isItalic() {
    return this.attributes.italic;
  }
  isUndo() {
    return this.attributes.undo;
  }
  isRedo() {
    return this.attributes.redo;
  }
  setItalic(v) {
    this.attributes.italic = v;
  }
  isUnderline() {
    return this.attributes.underline;
  }
  setUnderline(v) {
    this.attributes.underline = v;
  }
  setUndo(v) {
    this.attributes.undo = v;
  }
  setRedo(v) {
    this.attributes.redo = v;
  }
  clone() {
    return new Piece(this.text, Object.assign({}, this.attributes));
  }
  hasSameAttributes(other) {
    return (
      this.attributes.bold === other.attributes.bold &&
      this.attributes.italic === other.attributes.italic &&
      this.attributes.underline === other.attributes.underline &&
      this.attributes.undo === other.attributes.undo &&
      this.attributes.redo === other.attributes.redo &&
      this.attributes.fontFamily === other.attributes.fontFamily &&
      this.attributes.fontSize === other.attributes.fontSize &&
      this.attributes.italic === other.attributes.italic &&
      this.attributes.underline === other.attributes.underline &&
      this.attributes.hyperlink === other.attributes.hyperlink &&
      this.attributes.fontColor === other.attributes.fontColor &&
      this.attributes.bgColor === other.attributes.bgColor
    );
  }
  getHyperlink() {
    return this.attributes.hyperlink || false;
  }
  setHyperlink(url) {
    this.attributes.hyperlink = url;
  }
}
export default Piece;
//# sourceMappingURL=piece.js.map

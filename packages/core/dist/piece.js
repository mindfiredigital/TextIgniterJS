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
            selectedFontFamilyValue = fontFamilySelect.value;
        }
        if (fontSizeSelect) {
            selectedFontSizeValue = fontSizeSelect.value;
        }
        const fontColorValue = attributes.fontColor ||
            (selectedFontColor ? selectedFontColor.value : '#000000');
        const bgColorValue = attributes.bgColor ||
            (selectedBgColor ? selectedBgColor.value : '#ffffff');
        this.attributes = {
            bold: attributes.bold || false,
            italic: attributes.italic || false,
            underline: attributes.underline || false,
            strikethrough: attributes.strikethrough || false,
            undo: attributes.undo || false,
            redo: attributes.redo || false,
            fontFamily: attributes.fontFamily || selectedFontFamilyValue,
            fontSize: attributes.fontSize || selectedFontSizeValue,
            hyperlink: attributes.hyperlink || false,
            fontColor: fontColorValue,
            bgColor: bgColorValue,
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
    isStrikethrough() {
        return this.attributes.strikethrough || false;
    }
    setStrikethrough(v) {
        this.attributes.strikethrough = v;
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
        return (this.attributes.bold === other.attributes.bold &&
            this.attributes.italic === other.attributes.italic &&
            this.attributes.underline === other.attributes.underline &&
            (this.attributes.strikethrough || false) ===
                (other.attributes.strikethrough || false) &&
            this.attributes.undo === other.attributes.undo &&
            this.attributes.redo === other.attributes.redo &&
            this.attributes.fontFamily === other.attributes.fontFamily &&
            this.attributes.fontSize === other.attributes.fontSize &&
            this.attributes.italic === other.attributes.italic &&
            this.attributes.underline === other.attributes.underline &&
            this.attributes.hyperlink === other.attributes.hyperlink &&
            this.attributes.fontColor === other.attributes.fontColor &&
            this.attributes.bgColor === other.attributes.bgColor);
    }
    getHyperlink() {
        return this.attributes.hyperlink || false;
    }
    setHyperlink(url) {
        this.attributes.hyperlink = url;
    }
}
export default Piece;

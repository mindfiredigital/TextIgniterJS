class Piece {
  text: string;
  attributes: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough?: boolean;
    undo?: boolean;
    redo?: boolean;
    fontFamily?: string;
    fontSize?: string;
    hyperlink?: string | boolean;
    fontColor?: string;
    bgColor: string;
  };
  constructor(
    text: string,
    attributes: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
      undo?: boolean;
      redo?: boolean;
      fontFamily?: string;
      fontSize?: string;
      hyperlink?: string | boolean;
      fontColor?: string;
      bgColor?: string;
    } = {}
  ) {
    this.text = text;
    const fontFamilySelect = document.getElementById(
      'fontFamily'
    ) as HTMLSelectElement;
    const fontSizeSelect = document.getElementById(
      'fontSize'
    ) as HTMLSelectElement;
    let selectedFontFamilyValue = 'Arial';
    let selectedFontSizeValue = '16px';
    let selectedFontColor = document.getElementById(
      'fontColorPicker'
    ) as HTMLInputElement;
    let selectedBgColor = document.getElementById(
      'bgColorPicker'
    ) as HTMLInputElement;
    if (fontFamilySelect) {
      selectedFontFamilyValue = fontFamilySelect.value; // Get the selected value
    }

    if (fontSizeSelect) {
      selectedFontSizeValue = fontSizeSelect.value; // Get the selected value
    }
    // Use default color values if DOM elements are missing
    const fontColorValue =
      attributes.fontColor ||
      (selectedFontColor ? selectedFontColor.value : '#000000');
    const bgColorValue =
      attributes.bgColor ||
      (selectedBgColor ? selectedBgColor.value : '#ffffff');
    this.attributes = {
      bold: attributes.bold || false,
      italic: attributes.italic || false,
      underline: attributes.underline || false,
      strikethrough: attributes.strikethrough || false,
      undo: attributes.undo || false,
      redo: attributes.redo || false,
      fontFamily: attributes.fontFamily || selectedFontFamilyValue, // Default font family
      fontSize: attributes.fontSize || selectedFontSizeValue, // Default font size
      hyperlink: attributes.hyperlink || false,
      fontColor: fontColorValue,
      bgColor: bgColorValue,
    };
  }
  isBold(): boolean {
    return this.attributes.bold;
  }
  setBold(v: boolean): void {
    this.attributes.bold = v;
  }
  isItalic(): boolean {
    return this.attributes.italic;
  }
  isUndo(): boolean | undefined {
    return this.attributes.undo;
  }
  isRedo(): boolean | undefined {
    return this.attributes.redo;
  }

  setItalic(v: boolean): void {
    this.attributes.italic = v;
  }
  isUnderline(): boolean {
    return this.attributes.underline;
  }
  setUnderline(v: boolean): void {
    this.attributes.underline = v;
  }
  isStrikethrough(): boolean {
    return this.attributes.strikethrough || false;
  }
  setStrikethrough(v: boolean): void {
    this.attributes.strikethrough = v;
  }
  setUndo(v: boolean): void {
    this.attributes.undo = v;
  }
  setRedo(v: boolean): void {
    this.attributes.redo = v;
  }

  clone(): Piece {
    return new Piece(this.text, { ...this.attributes });
  }
  hasSameAttributes(other: Piece): boolean {
    return (
      this.attributes.bold === other.attributes.bold &&
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
      this.attributes.bgColor === other.attributes.bgColor
    );
  }
  getHyperlink(): string | boolean {
    return this.attributes.hyperlink || false;
  }
  setHyperlink(url: string | boolean): void {
    this.attributes.hyperlink = url;
  }

  // getFontColor(): string | undefined {
  //     return this.attributes.fontColor
  // }

  // setFontColor(fontColor: string): void {
  //     this.attributes.fontColor = fontColor
  // }
}

export default Piece;

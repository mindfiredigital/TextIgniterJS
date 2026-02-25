import Piece from '../piece';

describe('Piece', () => {
  beforeEach(() => {
    // Mock DOM elements for font/color pickers
    document.body.innerHTML = `
      <select id="fontFamily"><option value="Arial" selected>Arial</option></select>
      <select id="fontSize"><option value="16px" selected>16px</option></select>
      <input id="fontColorPicker" value="#123456" />
      <input id="bgColorPicker" value="#abcdef" />
    `;
  });

  it('should initialize with default attributes if none provided', () => {
    const piece = new Piece('test');
    expect(piece.text).toBe('test');
    expect(piece.attributes.bold).toBe(false);
    expect(piece.attributes.italic).toBe(false);
    expect(piece.attributes.underline).toBe(false);
    expect(piece.attributes.undo).toBe(false);
    expect(piece.attributes.redo).toBe(false);
    expect(piece.attributes.fontFamily).toBe('Arial');
    expect(piece.attributes.fontSize).toBe('16px');
    expect(piece.attributes.hyperlink).toBe(false);
    expect(piece.attributes.fontColor).toBe('#123456');
    expect(piece.attributes.bgColor).toBe('#abcdef');
  });

  it('should override attributes if provided', () => {
    const piece = new Piece('abc', {
      bold: true,
      italic: true,
      underline: true,
      undo: true,
      redo: true,
      fontFamily: 'Times',
      fontSize: '20px',
      hyperlink: 'http://x',
      fontColor: '#fff',
      bgColor: '#000',
    });
    expect(piece.attributes.bold).toBe(true);
    expect(piece.attributes.italic).toBe(true);
    expect(piece.attributes.underline).toBe(true);
    expect(piece.attributes.undo).toBe(true);
    expect(piece.attributes.redo).toBe(true);
    expect(piece.attributes.fontFamily).toBe('Times');
    expect(piece.attributes.fontSize).toBe('20px');
    expect(piece.attributes.hyperlink).toBe('http://x');
    expect(piece.attributes.fontColor).toBe('#fff');
    expect(piece.attributes.bgColor).toBe('#000');
  });

  it('should get/set bold, italic, underline, undo, redo', () => {
    const piece = new Piece('x');
    piece.setBold(true);
    expect(piece.isBold()).toBe(true);
    piece.setItalic(true);
    expect(piece.isItalic()).toBe(true);
    piece.setUnderline(true);
    expect(piece.isUnderline()).toBe(true);
    piece.setUndo(true);
    expect(piece.isUndo()).toBe(true);
    piece.setRedo(true);
    expect(piece.isRedo()).toBe(true);
  });

  it('should clone itself with same text and attributes', () => {
    const piece = new Piece('clone', { bold: true, fontColor: '#f00' });
    const clone = piece.clone();
    expect(clone).not.toBe(piece);
    expect(clone.text).toBe('clone');
    expect(clone.attributes.bold).toBe(true);
    expect(clone.attributes.fontColor).toBe('#f00');
  });

  it('should compare attributes correctly', () => {
    const a = new Piece('a', { bold: true, fontColor: '#f00' });
    const b = new Piece('b', { bold: true, fontColor: '#f00' });
    const c = new Piece('c', { bold: false, fontColor: '#f00' });
    expect(a.hasSameAttributes(b)).toBe(true);
    expect(a.hasSameAttributes(c)).toBe(false);
  });

  it('should get/set hyperlink', () => {
    const piece = new Piece('h');
    expect(piece.getHyperlink()).toBe(false);
    piece.setHyperlink('http://foo');
    expect(piece.getHyperlink()).toBe('http://foo');
    piece.setHyperlink(false);
    expect(piece.getHyperlink()).toBe(false);
  });

  it('should use default color if DOM color pickers are missing', () => {
    document.body.innerHTML = '';
    const piece = new Piece('colorless');
    expect(piece.attributes.fontColor).toBe('#000000');
    expect(piece.attributes.bgColor).toBe('#ffffff');
  });
});

// htmltojsonparser.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import HtmlToJsonParser from '../HtmlToJsonParser';
//import Piece from '../piece';

function mockDomSelects() {
  // Mock the presence of DOM selects/inputs for Piece
  const fontFamily = document.createElement('select');
  fontFamily.id = 'fontFamily';
  fontFamily.innerHTML = '<option value="Arial" selected>Arial</option>';
  document.body.append(fontFamily);

  const fontSize = document.createElement('select');
  fontSize.id = 'fontSize';
  fontSize.innerHTML = '<option value="16px" selected>16px</option>';
  document.body.append(fontSize);

  const fontColorPicker = document.createElement('input');
  fontColorPicker.id = 'fontColorPicker';
  fontColorPicker.value = '#000000';
  document.body.append(fontColorPicker);

  const bgColorPicker = document.createElement('input');
  bgColorPicker.id = 'bgColorPicker';
  bgColorPicker.value = '#ffffff';
  document.body.append(bgColorPicker);
}

describe('HtmlToJsonParser', () => {
  beforeEach(() => {
    document.body.innerHTML = ''; // Clean up DOM
    mockDomSelects();
  });

  it('parses a simple paragraph with no spans', () => {
    const html = `<div data-id="test-id-1" class="paragraph-block" style="text-align:left;">Hello world</div>`;
    const parser = new HtmlToJsonParser(html);
    const json = parser.parse();
    expect(json).toHaveLength(1);
    expect(json[0].dataId).toBe('test-id-1');
    expect(json[0].class).toBe('paragraph-block');
    expect(json[0].alignment).toBe('left');
    expect(json[0].pieces).toEqual([]); // No spans, so empty
  });

  it('parses spans with font styles', () => {
    const html = `
      <div data-id="abc" class="paragraph-block" style="text-align: left;">
        <span style="font-family: Arial; font-size: 14px; color: rgb(255,0,0); background-color: rgb(10,20,30);">
          Hello
        </span>
        <span style="font-family: serif; font-size: 18px; color: rgb(0, 255, 0); background-color: rgb(20,30,40);">
          World
        </span>
      </div>
    `;
    const parser = new HtmlToJsonParser(html);
    const json = parser.parse();
    expect(json).toHaveLength(1);
    expect(json[0].pieces).toHaveLength(2);

    // Check the first piece
    const first = json[0].pieces[0];
    expect(first.text.trim()).toBe('Hello');
    expect(first.attributes.fontFamily).toBe('Arial');
    expect(first.attributes.fontSize).toBe('14px');
    expect(first.attributes.fontColor.replace(/\s+/g, '')).toBe('rgb(255,0,0)');
    expect(first.attributes.bgColor.replace(/\s+/g, '')).toBe('rgb(10,20,30)');

    // Check the second piece
    const second = json[0].pieces[1];
    expect(second.text.trim()).toBe('World');
    expect(second.attributes.fontFamily).toBe('serif');
    expect(second.attributes.fontSize).toBe('18px');
    expect(second.attributes.fontColor.replace(/\s+/g, '')).toBe(
      'rgb(0,255,0)'
    );
    expect(second.attributes.bgColor.replace(/\s+/g, '')).toBe('rgb(20,30,40)');
  });

  it('recognizes bold, italic, and underline', () => {
    const html = `
      <div data-id="xyz" class="paragraph-block" style="text-align: left;">
        <span><b>Bold</b></span>
        <span><i>Italic</i></span>
        <span><u>Underline</u></span>
        <span>Normal</span>
      </div>
    `;
    const parser = new HtmlToJsonParser(html);
    const pieces = parser.parse()[0].pieces;

    expect(pieces[0].text.trim()).toBe('Bold');
    expect(pieces[0].attributes.bold).toBe(true);

    expect(pieces[1].text.trim()).toBe('Italic');
    expect(pieces[1].attributes.italic).toBe(true);

    expect(pieces[2].text.trim()).toBe('Underline');
    expect(pieces[2].attributes.underline).toBe(true);

    expect(pieces[3].text.trim()).toBe('Normal');
    expect(pieces[3].attributes.bold).toBe(false);
    expect(pieces[3].attributes.italic).toBe(false);
    expect(pieces[3].attributes.underline).toBe(false);
  });

  it('parses unordered lists', () => {
    const html = `
      <ul data-id="ul-id">
        <li><span>First</span></li>
        <li><span>Second</span></li>
      </ul>
    `;
    const parser = new HtmlToJsonParser(html);
    const json = parser.parse();
    expect(json[0].dataId).toBe('ul-id');
    expect(json[0].listType).toBe('ul');
    expect(json[0].pieces).toHaveLength(2);
    expect(json[0].pieces[0].text.trim()).toBe('First');
    expect(json[0].pieces[1].text.trim()).toBe('Second');
  });

  it('parses ordered lists with "start" attribute', () => {
    const html = `
      <ol data-id="ol-id" start="5">
        <li><span>Alpha</span></li>
        <li><span>Beta</span></li>
      </ol>
    `;
    const parser = new HtmlToJsonParser(html);
    const json = parser.parse();
    expect(json[0].listType).toBe('ol');
    expect(json[0].listStart).toBe(5);
    expect(json[0].pieces[0].text.trim()).toBe('Alpha');
    expect(json[0].pieces[1].text.trim()).toBe('Beta');
  });

  it('handles missing data-id, class, and alignment gracefully', () => {
    const html = `<div><span>Text content</span></div>`;
    const parser = new HtmlToJsonParser(html);
    const json = parser.parse();
    expect(json[0].dataId).toBe('');
    expect(json[0].class).toBe('paragraph-block'); // fallback default
    expect(json[0].alignment).toBe('left');
  });

  it('handles color conversions with rgbToHex', () => {
    const parser = new HtmlToJsonParser('<div></div>');
    expect(parser.rgbToHex('rgb(255, 255, 255)')).toBe('#ffffff');
    expect(parser.rgbToHex('rgb(100, 200, 150)')).toBe('#64c896');
    expect(parser.rgbToHex('rgb(0,0,0)', false)).toBe(null);
    expect(parser.rgbToHex('rgb(0,0,0)', true)).toBe('#000000'); // For bgColor, allow black
    expect(parser.rgbToHex('not-a-color')).toBe(null);
  });
});

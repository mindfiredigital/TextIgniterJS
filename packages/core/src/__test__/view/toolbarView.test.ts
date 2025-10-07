import { describe, it, beforeEach, expect, vi } from 'vitest';
import ToolbarView from '../../view/toolbarView';

function makeButton(action?: string) {
  const btn = document.createElement('button');
  if (action) btn.setAttribute('data-action', action);
  return btn;
}

function makeSelect(action: string, opts: string[] = []) {
  const sel = document.createElement('select');
  sel.setAttribute('data-action', action);
  opts.forEach(v => {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = v;
    sel.appendChild(o);
  });
  return sel;
}

describe('ToolbarView', () => {
  let container: HTMLElement;
  let view: ToolbarView;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('updateActiveStates activates strikethrough button when strikethrough is true', () => {
    const strike = makeButton('strikethrough');
    container.appendChild(strike);
    view = new ToolbarView(container);
    view.updateActiveStates({
      bold: false,
      italic: false,
      underline: false,
      strikethrough: true,
    });
    expect(strike.classList.contains('active')).toBe(true);
    view.updateActiveStates({
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
    });
    expect(strike.classList.contains('active')).toBe(false);
  });

  it('adds mouse down listeners to all buttons', () => {
    const b1 = makeButton('bold');
    container.appendChild(b1);

    const preventSpy = vi.fn();
    b1.addEventListener('mousedown', preventSpy);
    view = new ToolbarView(container);

    const evt = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    b1.dispatchEvent(evt);
    expect(evt.defaultPrevented).toBe(true);
  });

  it("emits 'toolbarAction' on data-action button click", () => {
    const b1 = makeButton('italic');
    container.appendChild(b1);
    view = new ToolbarView(container);

    const spy = vi.spyOn(view, 'emit');
    b1.click();
    expect(spy).toHaveBeenCalledWith('toolbarAction', 'italic');
  });

  it('does not emit if no button or data-action', () => {
    const div = document.createElement('div');
    container.appendChild(div);
    const b = makeButton();
    container.appendChild(b);
    view = new ToolbarView(container);
    const spy = vi.spyOn(view, 'emit');
    div.click();
    b.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('updateActiveStates updates bold/italic/underline/hyperlink/undo/redo class', () => {
    const bold = makeButton('bold');
    const italic = makeButton('italic');
    const underline = makeButton('underline');
    const link = makeButton('hyperlink');
    const undo = makeButton('undo');
    const redo = makeButton('redo');
    container.append(bold, italic, underline, link, undo, redo);
    view = new ToolbarView(container);

    // Inactivate all, then toggle on some
    view.updateActiveStates({
      bold: true,
      italic: false,
      underline: true,
      hyperlink: true,
      undo: false,
      redo: true,
    });
    expect(bold.classList.contains('active')).toBe(true);
    expect(italic.classList.contains('active')).toBe(false);
    expect(underline.classList.contains('active')).toBe(true);
    expect(link.classList.contains('active')).toBe(true);
    expect(undo.classList.contains('active')).toBe(false);
    expect(redo.classList.contains('active')).toBe(true);
  });

  it('updateActiveStates updates selects for fontFamily and fontSize', () => {
    const sel1 = makeSelect('fontFamily', ['Arial', 'Courier']);
    const sel2 = makeSelect('fontSize', ['10px', '20px']);
    container.append(sel1, sel2);
    view = new ToolbarView(container);

    view.updateActiveStates({
      bold: false,
      italic: false,
      underline: false,
      fontFamily: 'Courier',
      fontSize: '20px',
    });
    expect(sel1.value).toBe('Courier');
    expect(sel2.value).toBe('20px');
  });

  it('updateActiveStates sets color pickers, dispatches input', () => {
    // Font color
    const fc = document.createElement('input');
    fc.type = 'color';
    fc.id = 'fontColorPicker';
    document.body.appendChild(fc);

    // BG color
    const bc = document.createElement('input');
    bc.type = 'color';
    bc.id = 'bgColorPicker';
    document.body.appendChild(bc);

    view = new ToolbarView(container);

    const fontInputSpy = vi.fn();
    fc.addEventListener('input', fontInputSpy);
    const bgInputSpy = vi.fn();
    bc.addEventListener('input', bgInputSpy);

    view.updateActiveStates({
      bold: false,
      italic: false,
      underline: false,
      fontColor: '#aabbcc',
      bgColor: '#112233',
    });
    expect(fc.value).toBe('#aabbcc');
    expect(fontInputSpy).toHaveBeenCalled();
    expect(bc.value).toBe('#112233');
    expect(bgInputSpy).toHaveBeenCalled();
  });

  it('does nothing if no pickers/selects present', () => {
    view = new ToolbarView(container);
    // Should not throw
    expect(() =>
      view.updateActiveStates({
        bold: false,
        italic: false,
        underline: false,
        fontColor: '#aaaaaa',
        bgColor: '#bbbbbb',
      })
    ).not.toThrow();
  });

  it('handles missing attribute keys without throwing', () => {
    // Add some buttons and selects
    container.appendChild(makeButton('bold'));
    container.appendChild(makeSelect('fontFamily', ['Serif', 'Sans']));
    view = new ToolbarView(container);
    // Should not throw and should deactivate all
    expect(() =>
      view.updateActiveStates({
        bold: false,
        italic: false,
        underline: false,
      })
    ).not.toThrow();
  });
});

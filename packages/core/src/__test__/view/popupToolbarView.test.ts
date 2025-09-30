import { describe, it, beforeEach, expect, vi } from 'vitest';
import PopupToolbarView from '../../view/popupToolbarView';

function makeButton(action?: string) {
  const btn = document.createElement('button');
  if (action) btn.setAttribute('data-action', action);
  return btn;
}

describe('PopupToolbarView', () => {
  let container: HTMLElement;
  let view: PopupToolbarView;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
    view = new PopupToolbarView(container);
  });

  it('prevents mousedown on toolbar', () => {
    const e = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const preventDefault = vi.spyOn(e, 'preventDefault');
    container.dispatchEvent(e);
    expect(preventDefault).toHaveBeenCalled();
  });

  it("emits 'popupAction' when button with data-action is clicked", () => {
    const action = 'bold';
    const btn = makeButton(action);
    container.appendChild(btn);

    const emitSpy = vi.spyOn(view, 'emit');
    btn.click();
    expect(emitSpy).toHaveBeenCalledWith('popupAction', action);
  });

  it('does not emit for button lacking data-action', () => {
    const btn = makeButton();
    container.appendChild(btn);
    const emitSpy = vi.spyOn(view, 'emit');
    btn.click();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('does not emit when any non-button element is clicked', () => {
    const div = document.createElement('div');
    container.appendChild(div);
    const emitSpy = vi.spyOn(view, 'emit');
    div.click();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('show() displays and positions above selection when possible', () => {
    const range = document.createRange();
    const span = document.createElement('span');
    span.textContent = 'hello';
    document.body.appendChild(span);
    range.selectNode(span);
    // Mock `getBoundingClientRect`
    range.getBoundingClientRect = () =>
      ({
        left: 10,
        top: 100,
        right: 110,
        bottom: 120,
        width: 100,
        height: 20,
        x: 10,
        y: 100,
        toJSON: () => {},
      }) as DOMRect;
    container.style.width = '50px';
    container.style.height = '30px';
    // Also mock offset sizes
    Object.defineProperty(container, 'offsetWidth', { value: 50 });
    Object.defineProperty(container, 'offsetHeight', { value: 30 });

    view.show({ getRangeAt: () => range } as any);
    expect(container.style.display).toBe('flex');
    expect(parseFloat(container.style.top)).toBeLessThan(100 + window.scrollY);
  });

  it('show() flips below if positioned off top', () => {
    const range = document.createRange();
    const span = document.createElement('span');
    document.body.appendChild(span);
    range.selectNode(span);
    range.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        right: 10,
        bottom: 0,
        width: 10,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }) as DOMRect;

    Object.defineProperty(container, 'offsetWidth', { value: 20 });
    Object.defineProperty(container, 'offsetHeight', { value: 12 });

    view.show({ getRangeAt: () => range } as any);

    // Was flipped below selection
    expect(parseFloat(container.style.top)).toBeGreaterThanOrEqual(8);
  });

  it('show() hides for zero-width/height selections', () => {
    const range = document.createRange();
    range.getBoundingClientRect = () =>
      ({
        left: 5,
        top: 10,
        right: 5,
        bottom: 10,
        width: 0,
        height: 0,
        x: 5,
        y: 10,
        toJSON: () => {},
      }) as DOMRect;
    const hideSpy = vi.spyOn(view, 'hide');
    view.show({ getRangeAt: () => range } as any);
    expect(container.style.display).toBe('none');
    expect(hideSpy).toHaveBeenCalled();
  });

  it('hide() sets container display to none', () => {
    container.style.display = 'flex';
    view.hide();
    expect(container.style.display).toBe('none');
  });

  it("updateActiveStates toggles 'active' on proper buttons", () => {
    const boldBtn = makeButton('bold');
    const italicBtn = makeButton('italic');
    const underlineBtn = makeButton('underline');
    const linkBtn = makeButton('hyperlink');
    const noneBtn = makeButton();
    container.append(boldBtn, italicBtn, underlineBtn, linkBtn, noneBtn);

    view.updateActiveStates({
      bold: true,
      italic: false,
      underline: true,
      hyperlink: true,
    });

    expect(boldBtn.classList.contains('active')).toBe(true);
    expect(italicBtn.classList.contains('active')).toBe(false);
    expect(underlineBtn.classList.contains('active')).toBe(true);
    expect(linkBtn.classList.contains('active')).toBe(true);
    expect(noneBtn.classList.contains('active')).toBe(false);
  });

  it('updateActiveStates works when attributes object is empty', () => {
    const b = makeButton('bold');
    container.appendChild(b);
    view.updateActiveStates({
      bold: false,
      italic: false,
      underline: false,
      hyperlink: false,
    });
    expect(b.classList.contains('active')).toBe(false);
  });
});

import { describe, it, beforeEach, expect, vi } from 'vitest';
import LinkPopupView from '../../view/linkPopupView';

function getButton(popup: HTMLElement, title: string) {
  return Array.from(popup.querySelectorAll('button')).find(
    btn => btn.title === title
  );
}

describe('LinkPopupView', () => {
  let view: LinkPopupView;
  let link: HTMLAnchorElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    view = new LinkPopupView();
    link = document.createElement('a');
    link.href = 'https://example.com/test';
    link.textContent = 'Test';
    document.body.appendChild(link);
  });

  it('creates a popup with buttons', () => {
    const popup = document.body.querySelector('.link-popup') as HTMLElement;
    expect(popup).not.toBeNull();
    expect(getButton(popup, 'Open')).toBeTruthy();
    expect(getButton(popup, 'Unlink')).toBeTruthy();
    expect(popup.style.display).toBe('none');
  });

  it('calls open callback when Open button clicked', () => {
    const onOpen = vi.fn();
    view.setCallbacks(onOpen, vi.fn());
    view.show(link, 0, 0);
    const popup = document.body.querySelector('.link-popup') as HTMLElement;
    const openBtn = getButton(popup, 'Open')!;
    openBtn.click();
    expect(onOpen).toHaveBeenCalledWith('https://example.com/test');
  });

  it('calls unlink callback when Unlink button clicked', () => {
    const onUnlink = vi.fn();
    view.setCallbacks(vi.fn(), onUnlink);
    view.show(link, 0, 0);
    const popup = document.body.querySelector('.link-popup') as HTMLElement;
    const unlinkBtn = getButton(popup, 'Unlink')!;
    unlinkBtn.click();
    expect(onUnlink).toHaveBeenCalledWith(link);
  });

  it('show positions popup below link and sets visible', () => {
    // Fake boundingClientRect
    link.getBoundingClientRect = () =>
      ({
        left: 50,
        top: 100,
        right: 150,
        bottom: 120,
        width: 100,
        height: 20,
        x: 50,
        y: 100,
        toJSON: () => {},
      }) as DOMRect;

    view.show(link, 0, 0);
    const popup = document.body.querySelector('.link-popup') as HTMLElement;
    expect(popup.style.left).toBe('50px');
    expect(popup.style.top).toBe('125px');
    expect(popup.style.display).toBe('flex');
    expect(view.isVisible()).toBe(true);
  });

  it('hide sets popup to invisible after animation', async () => {
    view.show(link, 0, 0);
    const popup = document.body.querySelector('.link-popup') as HTMLElement;
    view.hide();
    expect(popup.style.display).toBe('flex');
    await new Promise(r => setTimeout(r, 120));
    expect(popup.style.display).toBe('none');
    expect(view.isVisible()).toBe(false);
  });

  it('isPopup identifies popup elements', () => {
    view.show(link, 0, 0);
    const popup = document.body.querySelector('.link-popup') as HTMLElement;
    const openBtn = getButton(popup, 'Open')!;
    expect(view.isPopup(openBtn)).toBe(true);
    expect(view.isPopup(document.createElement('div'))).toBe(false);
  });

  it('isVisible returns true only when popup is visible', () => {
    expect(view.isVisible()).toBe(false);
    view.show(link, 0, 0);
    expect(view.isVisible()).toBe(true);
    view.hide();
    setTimeout(() => {
      expect(view.isVisible()).toBe(false);
    }, 150);
  });
});

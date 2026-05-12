import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import EmojiPickerView from '../../view/emojiPickerView';
import { EMOJI_CATEGORIES } from '../../constants/emojis';

describe('EmojiPickerView', () => {
  let emojiPicker: EmojiPickerView;
  let container: HTMLElement;

  beforeEach(() => {
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        clear: vi.fn(() => {
          store = {};
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    container = document.createElement('div');
    document.body.appendChild(container);
    emojiPicker = new EmojiPickerView();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('creates the popup element', () => {
    const popup = (emojiPicker as any).popup;
    expect(popup).toBeDefined();
    expect(popup.style.display).toBe('');
    expect(popup.querySelector('.emoji_grid')).toBeDefined();
    expect(popup.querySelector('.emoji_serch')).toBeDefined();
  });

  it('opens and closes the picker', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    emojiPicker.open(button);
    expect(emojiPicker.getIsOpen()).toBe(true);
    expect((emojiPicker as any).popup.style.display).toBe('flex');

    emojiPicker.close();
    expect(emojiPicker.getIsOpen()).toBe(false);
    expect((emojiPicker as any).popup.style.display).toBe('none');
  });

  it('renders emojis correctly on open', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    emojiPicker.open(button);
    const gridArea = (emojiPicker as any).gridArea;
    expect(gridArea.children.length).toBeGreaterThan(0);
    expect(gridArea.textContent).toContain(EMOJI_CATEGORIES[0].label);
  });

  it('filters emojis based on search query', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    emojiPicker.open(button);

    const searchInput = (emojiPicker as any).searchInput;
    searchInput.value = 'smile';
    searchInput.dispatchEvent(new Event('input'));

    const gridArea = (emojiPicker as any).gridArea;
    expect(gridArea.textContent).toContain('Results for "smile"');
  });

  it('triggers callback on emoji selection', () => {
    const callback = vi.fn();
    emojiPicker.onSelect(callback);

    const button = document.createElement('button');
    document.body.appendChild(button);
    emojiPicker.open(button);

    const emojiButton = (emojiPicker as any).gridArea.querySelector('button');
    expect(emojiButton).toBeDefined();

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    emojiButton?.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it('closes when clicking outside the popup', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    emojiPicker.open(button);
    expect(emojiPicker.getIsOpen()).toBe(true);

    const outsideEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(outsideEvent);

    expect(emojiPicker.getIsOpen()).toBe(false);
  });

  it('saves recently used emoji to localStorage', () => {
    const callback = vi.fn();
    emojiPicker.onSelect(callback);

    const button = document.createElement('button');
    document.body.appendChild(button);
    emojiPicker.open(button);

    const emojiButton = (emojiPicker as any).gridArea.querySelector('button');
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    emojiButton?.dispatchEvent(event);

    expect(window.localStorage.setItem).toHaveBeenCalled();
  });
});

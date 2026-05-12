import { EMOJI_CATEGORIES } from '../constants/emojis';
import { EmojiItem } from '../types/emoji.type';

const RECENT_KEY = 'recent_emojies';
const MAX_RECENT = 24;

class EmojiPickerView {
  private popup: HTMLElement;
  private gridArea: HTMLElement;
  private searchInput: HTMLInputElement;
  private onSelectCallback?: (char: string) => void;
  private isOpen: boolean = false;

  constructor() {
    this.popup = this.buildPopup();
    this.gridArea = this.popup.querySelector('.emoji_grid') as HTMLElement;
    this.searchInput = this.popup.querySelector(
      '.emoji_serch'
    ) as HTMLInputElement;
    document.body.appendChild(this.popup);

    // in outside click close the modal
    document.addEventListener('mousedown', e => {
      if (this.isOpen && !this.popup.contains(e.target as Node)) {
        const clickedBtn = (e.target as HTMLElement).closest(
          '[data-action="emoji"]'
        );
        if (!clickedBtn) this.close();
      }
    });
  }

  onSelect(cb: (char: string) => void) {
    this.onSelectCallback = cb;
  }

  open(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const popupWidth = 320;
    let left = rect.left + window.scrollX;
    if (left + popupWidth > window.innerWidth - 8) {
      left = window.innerWidth - popupWidth - 8;
    }
    const top = rect.bottom + window.scrollY + 4;

    this.popup.style.left = `${left}px`;
    this.popup.style.top = `${top}px`;
    this.popup.style.display = 'flex';
    this.isOpen = true;

    // reset the state
    this.searchInput.value = '';
    this.renderGrid('');
  }

  close() {
    this.popup.style.display = 'none';
    this.isOpen = false;
  }

  getIsOpen() {
    return this.isOpen;
  }

  private buildPopup(): HTMLElement {
    const popup = document.createElement('div');
    popup.style.cssText = `
      position: absolute;
      display: none;
      flex-direction: column;
      width: 320px;
      max-height: 380px;
      background: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 10px;
      box-shadow: 0 6px 24px rgba(0,0,0,0.14);
      z-index: 9999;
      overflow: hidden;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-bottom: 1px solid #f0f0f0;
      background: #fafafa;
    `;

    const search = document.createElement('input');
    search.type = 'text';
    search.placeholder = '🔍 Search emojis or :shortcode:';
    search.className = 'emoji_serch';
    search.style.cssText = `
      flex: 1;
      padding: 6px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 13px;
      outline: none;
      background: #fff;
    `;
    search.addEventListener('input', () =>
      this.renderGrid(search.value.trim())
    );

    header.appendChild(search);

    const gridArea = document.createElement('div');
    gridArea.className = 'emoji_grid';
    gridArea.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 10px 12px 12px;
    `;

    popup.appendChild(header);
    popup.appendChild(gridArea);

    return popup;
  }

  private getRecentEmojis(): EmojiItem[] {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveRecentEmoji(item: EmojiItem) {
    const recents = this.getRecentEmojis().filter(e => e.char !== item.char);
    recents.unshift(item);
    if (recents.length > MAX_RECENT) recents.length = MAX_RECENT;
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recents));
    } catch (e) {
      console.error('Problem occur in saving emojies', e);
    }
  }

  private resolveChar(item: EmojiItem): string {
    return item.char;
  }

  private renderGrid(query: string) {
    this.gridArea.innerHTML = '';
    const q = query.toLowerCase().replace(/^:/, '').replace(/:$/, '');

    const renderCategory = (label: string, items: EmojiItem[]) => {
      if (!items.length) return;

      const section = document.createElement('div');
      section.style.marginBottom = '12px';

      const title = document.createElement('div');
      title.textContent = label;
      title.style.cssText = `
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #999;
        margin-bottom: 6px;
      `;
      section.appendChild(title);

      const grid = document.createElement('div');
      grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 2px;
      `;

      items.forEach(item => {
        const char = this.resolveChar(item);
        const btn = document.createElement('button');
        btn.textContent = char;
        btn.title = `${item.name}  ${item.shortcode}`;
        btn.style.cssText = `
          font-size: 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          padding: 4px;
          line-height: 1.2;
          transition: background 0.1s;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        btn.addEventListener(
          'mouseenter',
          () => (btn.style.background = '#f0f0f0')
        );
        btn.addEventListener(
          'mouseleave',
          () => (btn.style.background = 'transparent')
        );
        btn.addEventListener('mousedown', e => {
          e.preventDefault();
          this.saveRecentEmoji(item);
          this.onSelectCallback?.(char);
        });
        grid.appendChild(btn);
      });

      section.appendChild(grid);
      this.gridArea.appendChild(section);
    };

    if (!q) {
      const recents = this.getRecentEmojis();
      renderCategory('Recently Used', recents);
      EMOJI_CATEGORIES.forEach(cat => renderCategory(cat.label, cat.items));
    } else {
      const results: EmojiItem[] = [];
      EMOJI_CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
          if (item.name.includes(q) || item.shortcode.includes(q)) {
            results.push(item);
          }
        });
      });
      renderCategory(`Results for "${q}"`, results);
    }

    if (!this.gridArea.querySelector('button')) {
      const empty = document.createElement('div');
      empty.textContent = 'No emojis found';
      empty.style.cssText =
        'text-align: center; color: #aaa; padding: 24px 0; font-size: 13px;';
      this.gridArea.appendChild(empty);
    }
  }
}

export default EmojiPickerView;

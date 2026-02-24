import { CurrentAttributeDTO } from '../TextIgniter';
import EventEmitter from '../utils/events';

class PopupToolbarView extends EventEmitter {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.setupButtons();
  }

  setupButtons(): void {
    this.container.addEventListener('mousedown', e => {
      // Prevent mousedown from blurring the editor selection
      e.preventDefault();
    });

    this.container.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const btn = target.closest('button');
      if (btn) {
        const action = btn.getAttribute('data-action');
        if (action) {
          this.emit('popupAction', action);
        }
      }
    });
  }

  show(selection: Selection): void {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Don't show for empty selections
    if (rect.width === 0 && rect.height === 0) {
      this.hide();
      return;
    }

    this.container.style.display = 'flex';
    const popupWidth = this.container.offsetWidth;
    const popupHeight = this.container.offsetHeight;

    // Position above the selection, centered horizontally.
    let top = rect.top + window.scrollY - popupHeight - 8;
    let left = rect.left + window.scrollX + rect.width / 2 - popupWidth / 2;

    // Adjust if it goes off-screen
    if (top < window.scrollY) {
      top = rect.bottom + window.scrollY + 8; // Flip below
    }
    if (left < 0) {
      left = 5;
    }

    this.container.style.top = `${top}px`;
    this.container.style.left = `${left}px`;
  }

  hide(): void {
    this.container.style.display = 'none';
  }

  updateActiveStates(attributes: CurrentAttributeDTO): void {
    this.container.querySelectorAll('button').forEach(btn => {
      const action = btn.getAttribute('data-action');
      let isActive = false;
      if (action === 'bold' && attributes.bold) isActive = true;
      if (action === 'italic' && attributes.italic) isActive = true;
      if (action === 'underline' && attributes.underline) isActive = true;
      if (action === 'strikethrough' && attributes.strikethrough)
        isActive = true;
      if (action === 'hyperlink' && attributes.hyperlink) isActive = true;
      btn.classList.toggle('active', isActive);
    });
  }
}

export default PopupToolbarView;

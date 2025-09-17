// Link popup view component
class LinkPopupView {
  private popup!: HTMLElement;
  private linkElement: HTMLAnchorElement | null = null;
  private onOpenClick?: (url: string) => void;
  private onUnlinkClick?: (linkElement: HTMLAnchorElement) => void;

  constructor() {
    this.createPopup();
  }

  setCallbacks(
    onOpenClick: (url: string) => void,
    onUnlinkClick: (linkElement: HTMLAnchorElement) => void
  ): void {
    this.onOpenClick = onOpenClick;
    this.onUnlinkClick = onUnlinkClick;
  }

  private createPopup(): void {
    this.popup = document.createElement('div');
    this.popup.className = 'link-popup';
    this.popup.style.cssText = `
      position: absolute;
      background: #000;
      border-radius: 4px;
      padding: 2px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.5);
      z-index: 1000;
      display: none;
    `;

    // Create buttons
    const openBtn = this.createButton('Open', '🔗');
    const unlinkBtn = this.createButton('Unlink', '✕');

    openBtn.addEventListener('click', () => this.handleOpenClick());
    unlinkBtn.addEventListener('click', () => this.handleUnlinkClick());

    this.popup.appendChild(openBtn);
    this.popup.appendChild(unlinkBtn);

    document.body.appendChild(this.popup);
  }

  private createButton(text: string, icon: string): HTMLElement {
    const button = document.createElement('button');
    button.innerHTML = `${icon}`;
    // Show text on hover
    button.title = text;
    button.style.cssText = `
      background: transparent;
      color: white;
      border: none;
      padding: 4px;
      margin: 0 1px;
      border-radius: 2px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.1s;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.background = '#333';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'transparent';
    });

    return button;
  }

  private handleOpenClick(): void {
    if (this.linkElement && this.onOpenClick) {
      this.onOpenClick(this.linkElement.href);
    }
  }

  private handleUnlinkClick(): void {
    if (this.onUnlinkClick && this.linkElement) {
      this.onUnlinkClick(this.linkElement);
    }
  }

  show(linkElement: HTMLAnchorElement, x: number, y: number): void {
    this.linkElement = linkElement;

    // Position the popup at bottom left of the link element
    const rect = linkElement.getBoundingClientRect();
    this.popup.style.left = `${rect.left + window.scrollX}px`;
    this.popup.style.top = `${rect.bottom + window.scrollY + 5}px`; // Position below the link

    this.popup.style.display = 'flex';

    // Add fade-in animation
    this.popup.style.opacity = '0';
    this.popup.style.transform = 'translateY(-2px)';

    requestAnimationFrame(() => {
      this.popup.style.transition =
        'opacity 0.1s ease-in-out, transform 0.1s ease-in-out';
      this.popup.style.opacity = '1';
      this.popup.style.transform = 'translateY(0)';
    });
  }

  hide(): void {
    if (this.popup.style.display !== 'none') {
      this.popup.style.transition =
        'opacity 0.1s ease-in-out, transform 0.1s ease-in-out';
      this.popup.style.opacity = '0';
      this.popup.style.transform = 'translateY(-2px)';

      setTimeout(() => {
        this.popup.style.display = 'none';
        this.popup.style.transition = '';
      }, 100);
    }
  }

  isPopup(element: HTMLElement): boolean {
    return this.popup.contains(element);
  }

  isVisible(): boolean {
    return this.popup.style.display !== 'none';
  }
}

export default LinkPopupView;

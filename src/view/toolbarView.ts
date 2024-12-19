import EventEmitter from "../utils/events";

class ToolbarView extends EventEmitter {
    container: HTMLElement;
    constructor(container: HTMLElement) {
        super();
        this.container = container;
        this.setupButtons();
    }

    setupButtons(): void {
        this.container.querySelectorAll('button').forEach(button => {
            button.addEventListener('mousedown', (e) => {
                e.preventDefault(); 
            });
        });

        this.container.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('button');
            if (btn) {
                const action = btn.getAttribute('data-action');
                if (action) {
                    this.emit('toolbarAction', action);
                }
            }
        });
    }

    updateActiveStates(attributes: { bold: boolean; italic: boolean; underline: boolean }): void {
        this.container.querySelectorAll('button').forEach(btn => {
            const action = btn.getAttribute('data-action');
            let isActive = false;
            if (action === 'bold' && attributes.bold) isActive = true;
            if (action === 'italic' && attributes.italic) isActive = true;
            if (action === 'underline' && attributes.underline) isActive = true;
            btn.classList.toggle('active', isActive);
        });
    }
}

export default ToolbarView;
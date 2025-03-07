import { CurrentAttributeDTO } from "..";
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

    updateActiveStates(attributes: CurrentAttributeDTO): void {
        this.container.querySelectorAll('button').forEach(btn => {
            const action = btn.getAttribute('data-action');
        
            let isActive = false;
            if (action === 'bold' && attributes.bold) isActive = true;
            if (action === 'italic' && attributes.italic) isActive = true;
            if (action === 'underline' && attributes.underline) isActive = true;
            if (action === 'hyperlink' && attributes.hyperlink) isActive = true;
            if (action === 'undo' && attributes.undo) isActive = true;
            if (action === 'redo' && attributes.redo) isActive = true;
            btn.classList.toggle('active', isActive);
        });
        this.container.querySelectorAll('select').forEach(select => {
            const action = select.getAttribute('data-action');
            if(action === 'fontFamily' && attributes.fontFamily) select.value = attributes.fontFamily;
            if(action === 'fontSize' && attributes.fontSize) select.value = attributes.fontSize;
        });

        if (attributes.fontColor){
            const fontColorPicker = document.getElementById('fontColorPicker') as HTMLInputElement;
            if (fontColorPicker) {
                fontColorPicker.value = attributes.fontColor;
                fontColorPicker.dispatchEvent(new Event('input', { bubbles: true }));
            } 
        }
        
        if (attributes.bgColor){
            const fontColorPicker = document.getElementById('bgColorPicker') as HTMLInputElement;
            if (fontColorPicker) {
                fontColorPicker.value = attributes.bgColor;
                fontColorPicker.dispatchEvent(new Event('input', { bubbles: true }));
            } 
        }

    }
}

export default ToolbarView;
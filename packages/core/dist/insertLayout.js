import { icons } from './assets/icons';
import Piece from './piece';
export class InsertLayoutHandler {
    constructor(editor, document) {
        this.modal = null;
        this.activeLayout = null;
        this.editor = editor;
        this.document = document;
        this.setupClickOutsideListener();
    }
    openLayoutModal() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
        const backdrop = document.createElement('div');
        backdrop.className = 'table_modal';
        backdrop.id = 'layout_modal';
        const modal = document.createElement('div');
        modal.className = 'main_modal layout_main_modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Insert Layout');
        const header = document.createElement('div');
        header.className = 'main_modal_header';
        const title = document.createElement('h3');
        title.className = 'main_modal_title';
        title.textContent = 'Insert Layout';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'main_modal_close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.innerHTML = icons.close_icon;
        closeBtn.onclick = () => this.closeModal();
        header.appendChild(title);
        header.appendChild(closeBtn);
        const body = document.createElement('div');
        body.className = 'main_modal_body';
        const presetsLabel = document.createElement('label');
        presetsLabel.textContent = 'Preset Splits';
        presetsLabel.className = 'input_label';
        presetsLabel.style.display = 'block';
        presetsLabel.style.marginBottom = '8px';
        const presetsContainer = document.createElement('div');
        presetsContainer.style.display = 'flex';
        presetsContainer.style.flexWrap = 'wrap';
        presetsContainer.style.gap = '8px';
        presetsContainer.style.marginBottom = '16px';
        const presets = [
            { label: 'Single', cols: 1, widths: [100] },
            { label: '50 - 50', cols: 2, widths: [50, 50] },
            { label: '60 - 40', cols: 2, widths: [60, 40] },
            { label: '40 - 60', cols: 2, widths: [40, 60] },
            { label: '33 - 33 - 33', cols: 3, widths: [33.33, 33.33, 33.33] },
            { label: '25 - 50 - 25', cols: 3, widths: [25, 50, 25] },
        ];
        presets.forEach(preset => {
            const btn = document.createElement('button');
            btn.className = 'modal_close_button modal_close_button_secondary';
            btn.style.padding = '4px 8px';
            btn.style.fontSize = '12px';
            btn.textContent = preset.label;
            btn.onclick = () => {
                this.insertLayout(preset.cols, preset.widths);
                this.closeModal();
            };
            presetsContainer.appendChild(btn);
        });
        const customLabel = document.createElement('label');
        customLabel.textContent = 'Or Custom Splits (comma separated %)';
        customLabel.className = 'input_label';
        customLabel.style.display = 'block';
        customLabel.style.marginBottom = '8px';
        const customInput = document.createElement('input');
        customInput.type = 'text';
        customInput.className = 'modal_inputs';
        customInput.placeholder = 'e.g. 20, 60, 20';
        customInput.style.width = '100%';
        body.appendChild(presetsLabel);
        body.appendChild(presetsContainer);
        body.appendChild(customLabel);
        body.appendChild(customInput);
        const footer = document.createElement('div');
        footer.className = 'main_modal_footer';
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'modal_close_button modal_close_button_secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.type = 'button';
        cancelBtn.onclick = () => this.closeModal();
        const insertBtn = document.createElement('button');
        insertBtn.className = 'modal_close_button modal_close_button_primary';
        insertBtn.textContent = 'Insert Custom';
        insertBtn.type = 'button';
        insertBtn.onclick = () => {
            const val = customInput.value.trim();
            if (!val) {
                this.insertLayout(2, [50, 50]);
            }
            else {
                const parts = val
                    .split(',')
                    .map(s => parseFloat(s.trim()))
                    .filter(n => !isNaN(n));
                if (parts.length > 0) {
                    const sum = parts.reduce((a, b) => a + b, 0);
                    const widths = parts.map(p => (p / sum) * 100);
                    this.insertLayout(widths.length, widths);
                }
                else {
                    this.insertLayout(2, [50, 50]);
                }
            }
            this.closeModal();
        };
        footer.appendChild(cancelBtn);
        footer.appendChild(insertBtn);
        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        backdrop.appendChild(modal);
        backdrop.addEventListener('click', e => {
            if (e.target === backdrop)
                this.closeModal();
        });
        document.body.appendChild(backdrop);
        this.modal = backdrop;
        requestAnimationFrame(() => {
            backdrop.classList.add('table_modal_visible');
        });
    }
    closeModal() {
        if (!this.modal)
            return;
        this.modal.classList.remove('table_modal_visible');
        setTimeout(() => {
            var _a;
            (_a = this.modal) === null || _a === void 0 ? void 0 : _a.remove();
            this.modal = null;
        }, 200);
    }
    insertLayout(columns, widths) {
        const layoutId = `data-id-${Date.now()}`;
        const afterId = `data-id-${Date.now() + 1}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'layout_wrapper';
        wrapper.setAttribute('data-type', 'layout');
        wrapper.setAttribute('data-id', layoutId);
        wrapper.setAttribute('contenteditable', 'false');
        const controls = document.createElement('div');
        controls.className = 'table_controls';
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'table_delete_button';
        deleteBtn.innerHTML = icons.close_icon;
        deleteBtn.onclick = () => {
            const index = this.document.blocks.findIndex((b) => b.dataId === layoutId);
            if (index !== -1) {
                this.document.blocks.splice(index, 1);
                if (this.document.selectedBlockId === layoutId) {
                    this.document.selectedBlockId = null;
                }
                this.document.emit('documentChanged', this.document);
            }
        };
        controls.appendChild(deleteBtn);
        wrapper.appendChild(controls);
        const layoutDiv = document.createElement('div');
        layoutDiv.className = 'layout_container';
        layoutDiv.style.display = 'flex';
        layoutDiv.style.width = '100%';
        layoutDiv.style.gap = '10px';
        for (let i = 0; i < columns; i++) {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'layout_column tblCell';
            columnDiv.style.flex = `0 0 calc(${widths[i]}% - ${((columns - 1) * 10) / columns}px)`;
            columnDiv.style.border = '1px dashed #ccc';
            columnDiv.style.padding = '10px';
            columnDiv.style.minHeight = '40px';
            columnDiv.style.boxSizing = 'border-box';
            columnDiv.contentEditable = 'true';
            columnDiv.setAttribute('data-placeholder', `Column ${i + 1}`);
            this.setupCellEvents(columnDiv);
            layoutDiv.appendChild(columnDiv);
        }
        wrapper.appendChild(layoutDiv);
        let insertIndex = this.document.blocks.length;
        if (this.document.selectedBlockId) {
            const idx = this.document.blocks.findIndex((b) => b.dataId === this.document.selectedBlockId);
            if (idx !== -1)
                insertIndex = idx + 1;
        }
        const layoutBlock = {
            dataId: layoutId,
            type: 'layout',
            element: wrapper,
        };
        const afterBlock = {
            dataId: afterId,
            type: 'text',
            class: 'paragraph-block',
            pieces: [
                new Piece('\u200B', {
                    bold: false,
                    italic: false,
                    underline: false,
                    strikethrough: false,
                    hyperlink: false,
                }),
            ],
        };
        this.document.blocks.splice(insertIndex, 0, layoutBlock, afterBlock);
        this.document.selectedBlockId = layoutId;
        this.document.currentOffset = 0;
        this.document.emit('documentChanged', this.document);
        setTimeout(() => {
            const firstCell = wrapper.querySelector('.layout_column');
            if (firstCell) {
                firstCell.focus();
                this.setActiveLayout(wrapper.querySelector('.layout_container'));
            }
        }, 0);
    }
    setupCellEvents(cell) {
        cell.addEventListener('focus', () => {
            const layout = cell.closest('.layout_container');
            if (layout)
                this.setActiveLayout(layout);
            cell.classList.add('tblCell_focused');
        });
        cell.addEventListener('blur', () => {
            cell.classList.remove('tblCell_focused');
        });
        cell.addEventListener('keydown', (e) => {
            var _a;
            const ke = e;
            if (ke.key === 'Tab') {
                ke.preventDefault();
                ke.stopPropagation();
                const allCells = Array.from(((_a = cell
                    .closest('.layout_container')) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.layout_column')) || []);
                const idx = allCells.indexOf(cell);
                if (!ke.shiftKey) {
                    if (idx < allCells.length - 1) {
                        allCells[idx + 1].focus();
                        this.selectAllInCell(allCells[idx + 1]);
                    }
                    else {
                        const wrapper = cell.closest('.layout_wrapper');
                        const afterEl = wrapper === null || wrapper === void 0 ? void 0 : wrapper.nextElementSibling;
                        if (afterEl) {
                            afterEl.focus();
                            this.clearLayoutActive();
                        }
                    }
                }
                else {
                    if (idx > 0) {
                        allCells[idx - 1].focus();
                        this.selectAllInCell(allCells[idx - 1]);
                    }
                }
            }
            if (ke.key === 'Enter' && !ke.shiftKey) {
                ke.stopPropagation();
            }
            if (ke.key === 'Backspace' || ke.key === 'Delete') {
                ke.stopPropagation();
            }
            if (ke.key.length === 1 && !ke.ctrlKey && !ke.metaKey && !ke.altKey) {
                ke.stopPropagation();
            }
        });
    }
    selectAllInCell(cell) {
        const sel = window.getSelection();
        if (!sel)
            return;
        const range = document.createRange();
        range.selectNodeContents(cell);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    setActiveLayout(layout) {
        document.querySelectorAll('.layout_active').forEach(t => {
            if (t !== layout)
                t.classList.remove('layout_active');
        });
        layout.classList.add('layout_active');
        this.activeLayout = layout;
    }
    clearLayoutActive() {
        if (this.activeLayout) {
            this.activeLayout.classList.remove('layout_active');
            this.activeLayout = null;
        }
    }
    setupClickOutsideListener() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const isInsideLayout = target.closest('.layout_wrapper') !== null;
            const isInsideModal = target.closest('#layout_modal') !== null;
            if (!isInsideLayout && !isInsideModal) {
                this.clearLayoutActive();
            }
        }, true);
        document.addEventListener('focusin', (e) => {
            const target = e.target;
            if (!target.closest('.layout_wrapper')) {
                this.clearLayoutActive();
            }
        }, true);
    }
}

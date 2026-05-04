import { icons } from './assets/icons';
import Piece from './piece';

declare const katex: any;

export class InsertMathHandler {
  private editor: HTMLDivElement;
  private document: any;
  private modal: HTMLDivElement | null = null;
  private isKatexLoaded = false;
  private editingBlockId: string | null = null;

  constructor(editor: HTMLDivElement, document: any) {
    this.editor = editor;
    this.document = document;
    this.loadKatex();
  }

  private loadKatex() {
    if (typeof katex !== 'undefined') {
      this.isKatexLoaded = true;
      return;
    }

    if (document.getElementById('katex-js')) return;

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.id = 'katex-js';
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.onload = () => {
      this.isKatexLoaded = true;
    };
    document.head.appendChild(script);
  }

  public openMathModal(existingLatex = '', blockId: string | null = null) {
    if (!this.isKatexLoaded) {
      alert(
        'Math rendering engine is still loading. Please try again in a moment.'
      );
      return;
    }

    this.editingBlockId = blockId;

    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'table_modal';
    backdrop.id = 'math_modal';

    const modal = document.createElement('div');
    modal.className = 'main_modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Insert Equation');
    modal.style.width = '400px';
    modal.style.height = 'auto';
    modal.style.maxHeight = '90vh';
    modal.style.inset = 'auto';
    modal.style.position = 'relative';
    modal.style.margin = 'auto';

    const header = document.createElement('div');
    header.className = 'main_modal_header';

    const title = document.createElement('h3');
    title.className = 'main_modal_title';
    title.textContent = this.editingBlockId
      ? 'Edit Equation'
      : 'Insert Equation';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'main_modal_close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = icons.close_icon;
    closeBtn.onclick = () => this.closeModal();

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.className = 'main_modal_body';

    const label = document.createElement('label');
    label.textContent = 'LaTeX Input:';
    label.className = 'input_label';
    label.style.display = 'block';
    label.style.marginBottom = '8px';

    const input = document.createElement('textarea');
    input.className = 'modal_inputs';
    input.style.width = '100%';
    input.style.height = '80px';
    input.style.resize = 'vertical';
    input.placeholder = 'e.g. c = \\pm\\sqrt{a^2 + b^2}';
    input.value = existingLatex;

    const previewLabel = document.createElement('label');
    previewLabel.textContent = 'Preview:';
    previewLabel.className = 'input_label';
    previewLabel.style.display = 'block';
    previewLabel.style.marginTop = '16px';
    previewLabel.style.marginBottom = '8px';

    const previewPane = document.createElement('div');
    previewPane.style.padding = '10px';
    previewPane.style.border = '1px solid #ccc';
    previewPane.style.borderRadius = '4px';
    previewPane.style.minHeight = '50px';
    previewPane.style.display = 'flex';
    previewPane.style.alignItems = 'center';
    previewPane.style.justifyContent = 'center';
    previewPane.style.overflowX = 'auto';

    const renderPreview = () => {
      try {
        katex.render(input.value || 'Preview', previewPane, {
          throwOnError: false,
        });
      } catch (e) {
        console.error('error', e);
        previewPane.textContent = 'Invalid LaTeX';
      }
    };

    input.addEventListener('input', renderPreview);

    body.appendChild(label);
    body.appendChild(input);
    body.appendChild(previewLabel);
    body.appendChild(previewPane);

    const footer = document.createElement('div');
    footer.className = 'main_modal_footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'modal_close_button modal_close_button_secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.type = 'button';
    cancelBtn.onclick = () => this.closeModal();

    const insertBtn = document.createElement('button');
    insertBtn.className = 'modal_close_button modal_close_button_primary';
    insertBtn.textContent = 'Apply Equation';
    insertBtn.type = 'button';
    insertBtn.onclick = () => {
      if (input.value.trim()) {
        this.insertEquation(input.value.trim());
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
      if (e.target === backdrop) this.closeModal();
    });

    document.body.appendChild(backdrop);
    this.modal = backdrop as unknown as HTMLDivElement;

    requestAnimationFrame(() => {
      backdrop.classList.add('table_modal_visible');
      input.focus();
      renderPreview();
    });
  }

  private closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('table_modal_visible');
    setTimeout(() => {
      this.modal?.remove();
      this.modal = null;
      this.editingBlockId = null;
    }, 200);
  }

  private insertEquation(latex: string) {
    const html = katex.renderToString(latex, { output: 'mathml' });

    if (this.editingBlockId) {
      const block = this.document.blocks.find(
        (b: any) => b.dataId === this.editingBlockId
      );
      if (block && block.element) {
        const mathNode = block.element.querySelector('.math_node');
        if (mathNode) {
          mathNode.innerHTML = html;
          mathNode.dataset.latex = latex;
        }
      }
      this.document.emit('documentChanged', this.document);
      return;
    }

    const blockId = `data-id-${Date.now()}`;
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-id', blockId);
    wrapper.setAttribute('contenteditable', 'false');
    wrapper.style.display = 'inline-block';
    wrapper.style.margin = '4px';
    wrapper.style.cursor = 'pointer';

    const mathNode = document.createElement('span');
    mathNode.className = 'math_node';
    mathNode.dataset.latex = latex;
    mathNode.innerHTML = html;

    wrapper.onclick = e => {
      e.stopPropagation();
      this.openMathModal(latex, blockId);
    };

    wrapper.appendChild(mathNode);

    let insertIndex = this.document.blocks.length;
    if (this.document.selectedBlockId) {
      const idx = this.document.blocks.findIndex(
        (b: any) => b.dataId === this.document.selectedBlockId
      );
      if (idx !== -1) insertIndex = idx + 1;
    }

    const mathBlock = {
      dataId: blockId,
      type: 'math',
      element: wrapper,
    };

    const afterBlock = {
      dataId: `data-id-${Date.now() + 1}`,
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

    this.document.blocks.splice(insertIndex, 0, mathBlock, afterBlock);
    this.document.selectedBlockId = afterBlock.dataId;
    this.document.currentOffset = 0;

    this.document.emit('documentChanged', this.document);
  }
}

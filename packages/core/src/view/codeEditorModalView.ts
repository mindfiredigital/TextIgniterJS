export class CodeEditorModalView {
  private container: HTMLDivElement;
  private textArea: HTMLTextAreaElement;
  private lineNumbers: HTMLDivElement;
  private pre: HTMLPreElement;
  private codeHighlight: HTMLElement;
  private copyBtn: HTMLButtonElement;
  private saveBtn: HTMLButtonElement;
  private cancelBtn: HTMLButtonElement;

  private currentLanguage: string = '';
  private onSaveCallback: ((code: string) => void) | null = null;
  private onCloseCallback: (() => void) | null = null;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'code_editor_modal';
    this.container.style.display = 'none';

    const modalContent = document.createElement('div');
    modalContent.className = 'code_editor_modal_content';

    const header = document.createElement('div');
    header.className = 'code_editor_modal_header';

    const title = document.createElement('span');
    title.className = 'code_editor_modal_title';

    const headerActions = document.createElement('div');
    headerActions.className = 'code_editor_modal_actions';

    this.copyBtn = document.createElement('button');
    this.copyBtn.className = 'copy_editor_btn';
    this.copyBtn.innerText = 'Copy';
    this.copyBtn.onclick = () => this.handleCopy();

    this.saveBtn = document.createElement('button');
    this.saveBtn.className = 'copy_editor_btn copy_editor_btn--primary';
    this.saveBtn.innerText = 'Save';
    this.saveBtn.onclick = () => this.handleSave();

    this.cancelBtn = document.createElement('button');
    this.cancelBtn.className = 'copy_editor_btn copy_editor_btn--cancel';
    this.cancelBtn.innerText = 'Cancel';
    this.cancelBtn.onclick = () => this.handleClose();

    headerActions.appendChild(this.copyBtn);
    headerActions.appendChild(this.saveBtn);
    headerActions.appendChild(this.cancelBtn);

    header.appendChild(title);
    header.appendChild(headerActions);

    const editorWrapper = document.createElement('div');
    editorWrapper.className = 'editor_moal_wrapper';

    this.lineNumbers = document.createElement('div');
    this.lineNumbers.className = 'editor_moal_line_number';

    this.pre = document.createElement('pre');
    this.pre.className = 'editor_modal_pre_block';
    this.pre.setAttribute('aria-hidden', 'true');

    this.codeHighlight = document.createElement('code');
    this.codeHighlight.className = 'modal_editor_highlight';
    this.pre.appendChild(this.codeHighlight);

    this.textArea = document.createElement('textarea');
    this.textArea.className = 'modal_editor_text_area';
    this.textArea.spellcheck = false;

    editorWrapper.appendChild(this.lineNumbers);
    editorWrapper.appendChild(this.pre);
    editorWrapper.appendChild(this.textArea);

    modalContent.appendChild(header);
    modalContent.appendChild(editorWrapper);
    this.container.appendChild(modalContent);
    document.body.appendChild(this.container);

    this.attachEventListeners();
  }

  private attachEventListeners() {
    this.textArea.addEventListener('input', () => {
      this.syncHighlight();
      // this.updateLineNumbers();
    });

    this.textArea.addEventListener('scroll', () => {
      this.pre.scrollTop = this.textArea.scrollTop;
      this.pre.scrollLeft = this.textArea.scrollLeft;
      this.lineNumbers.scrollTop = this.textArea.scrollTop;
    });

    this.textArea.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textArea.selectionStart;
        const end = this.textArea.selectionEnd;
        this.textArea.value =
          this.textArea.value.substring(0, start) +
          '  ' +
          this.textArea.value.substring(end);
        this.textArea.selectionStart = this.textArea.selectionEnd = start + 2;
        this.syncHighlight();
      }
    });

    this.container.addEventListener('click', e => {
      if (e.target === this.container) this.handleClose();
    });
  }

  private syncHighlight() {
    const escaped = this.textArea.value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    this.codeHighlight.innerHTML = escaped + '\n';
  }

  // private updateLineNumbers() {
  //   const count = this.textArea.value.split('\n').length;
  //   this.lineNumbers.innerHTML = Array.from(
  //     { length: count },
  //     (_, i) => `<span>${i + 1}</span>`
  //   ).join('');
  // }

  private handleCopy() {
    navigator.clipboard.writeText(this.textArea.value).then(() => {
      const orig = this.copyBtn.innerText;
      this.copyBtn.innerText = 'Copied!';
      setTimeout(() => (this.copyBtn.innerText = orig), 2000);
    });
  }

  private handleSave() {
    if (this.onSaveCallback) this.onSaveCallback(this.textArea.value);
    this.close();
  }

  private handleClose() {
    if (this.onCloseCallback) this.onCloseCallback();
    this.close();
  }

  public open(
    code: string,
    language: string,
    onSave: (code: string) => void,
    onClose: () => void
  ) {
    this.currentLanguage = language;
    this.onSaveCallback = onSave;
    this.onCloseCallback = onClose;

    const title = this.container.querySelector(
      '.code_editor_modal_title'
    ) as HTMLSpanElement;
    title.innerText = language || 'text';

    this.textArea.value = code;
    this.syncHighlight();
    // this.updateLineNumbers();

    this.container.style.display = 'flex';
    setTimeout(() => this.textArea.focus(), 50);
  }

  public close() {
    this.container.style.display = 'none';
    this.textArea.value = '';
    this.currentLanguage = '';
  }
}

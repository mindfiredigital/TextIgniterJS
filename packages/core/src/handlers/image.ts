import { getSelectionRange } from '../utils/selectionManager';
import EditorView from '../view/editorView';
import TextDocument from '../textDocument';
import Piece from '../piece';
import {
  extractTextFromDataId,
  addBlockAfter,
} from '../utils/selectionManager';
import { strings } from '../constants/strings';

export class ImageHandler {
  private editor: HTMLElement;
  private editorView!: EditorView;
  private document: TextDocument;
  public isImageHighlighted: boolean;
  public highLightedImageDataId: string;
  public currentCursorLocation: number;
  public isCrossIconVisible: boolean;

  constructor(editor: HTMLElement, document: TextDocument) {
    this.editor = editor;
    this.document = document;
    this.isImageHighlighted = false;
    this.highLightedImageDataId = '';
    this.currentCursorLocation = 0;
    this.isCrossIconVisible = false;
  }

  setEditorView(editorView: EditorView) {
    this.editorView = editorView;
  }

  public insertImage(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();
    fileInput.onchange = () => {
      const file = fileInput.files ? fileInput.files[0] : null;
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          const dataUrl = e.target?.result as string;
          this.insertImageAtCursor(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    };
  }

  public insertImageAtCursor(dataUrl: string): void {
    const [start, end] = getSelectionRange(this.editorView);
    console.log(start, end, 'vicky insertImage', dataUrl);
    if (end > start) {
      this.document.deleteRange(start, end, this.document.selectedBlockId);
    }
    this.insertImageAtPosition(dataUrl, start, this.document.selectedBlockId);
  }

  public setCursorPostion(postion: number, dataId: string): void {
    const div = document.querySelector(`[data-id="${dataId}"]`) as HTMLElement;
    div.focus();
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      if (div.firstChild) {
        range.setStart(div.firstChild, postion);
      } else {
        const textNode = document.createTextNode('');
        div.appendChild(textNode);
        range.setStart(textNode, 0);
      }
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }, 0);
  }

  public insertImageAtPosition(
    dataUrl: string,
    position: number,
    dataId: string | null
  ): void {
    console.log(
      dataUrl,
      position,
      dataId,
      'vicky insertImageAtPosition',
      this.document.blocks
    );
    const uniqueId1 = `data-id-${Date.now()}-${Math.random() * 1000}`;
    const uniqueId2 = `data-id-${Date.now()}-${Math.random() * 1000}`;
    const uniqueId3 = `data-id-${Date.now()}-${Math.random() * 1000}`;
    const newImageBlock = {
      dataId: uniqueId1,
      class: strings.PARAGRAPH_BLOCK_CLASS,
      pieces: [new Piece(' ')],
      type: 'image',
      image: dataUrl,
    };
    const newTextBlock = {
      dataId: uniqueId2,
      class: strings.PARAGRAPH_BLOCK_CLASS,
      pieces: [new Piece(' ')],
      type: 'text',
    };

    let selectedBlockId = this.document.selectedBlockId;
    const indexOfCurrentBlock = this.document.blocks.findIndex(
      (block: any) => block.dataId === this.document.selectedBlockId
    );
    let newBlocks: any[] = [];

    const { remainingText, piece } = extractTextFromDataId(
      selectedBlockId || '',
      this.document
    );
    console.log(
      selectedBlockId || '',
      this.document,
      'extractTextFromDataId-vicky',
      remainingText,
      piece
    );
    const extractedContent = ' ' + remainingText;
    let updatedBlock = this.document.blocks;

    if (extractedContent.length > 0) {
      const _extractedContent = remainingText.split(' ');
      let _pieces = [];
      if (_extractedContent[0] !== '' || _extractedContent[1] !== undefined) {
        if (piece.length === 1) {
          _pieces = [new Piece(extractedContent, piece[0].attributes)];
        } else {
          _pieces.push(
            new Piece(' ' + _extractedContent[0] + ' ', piece[0].attributes)
          );
          if (piece.length >= 2) {
            piece.forEach((obj: any, i: number) => {
              if (i !== 0) {
                _pieces.push(obj);
              }
            });
          }
        }
      } else {
        _pieces = [new Piece(' ')];
      }
      console.log(
        this.document.selectedBlockId,
        'uniqueId3 extractTextFromDataId-vicky',
        uniqueId3
      );
      updatedBlock = addBlockAfter(
        this.document.blocks,
        this.document.selectedBlockId || '',
        {
          dataId: uniqueId3,
          class: strings.PARAGRAPH_BLOCK_CLASS,
          pieces: _pieces,
          type: 'text',
        }
      );
    }
    this.document.blocks = updatedBlock;

    this.document.deleteRange(
      this.currentCursorLocation,
      this.currentCursorLocation + remainingText.length,
      this.document.selectedBlockId,
      this.document.currentOffset
    );

    if (this.document.blocks.length > indexOfCurrentBlock + 1) {
      this.document.blocks.forEach((block: any, idx: number) => {
        newBlocks.push(block);
        if (idx === indexOfCurrentBlock) newBlocks.push(newImageBlock);
        else if (selectedBlockId === this.document.selectedBlockId)
          selectedBlockId = block.dataId;
      });
    } else {
      newBlocks = [...this.document.blocks, newImageBlock, newTextBlock];
      selectedBlockId = newTextBlock.dataId;
    }

    this.document.blocks = newBlocks;
    this.editorView.render();
    this.document.selectedBlockId = selectedBlockId;

    const div = document.querySelector(
      `[data-id="${selectedBlockId}"]`
    ) as HTMLElement;
    div.focus();

    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      if (div.firstChild) {
        range.setStart(div.firstChild, 1);
      } else {
        const textNode = document.createTextNode('');
        div.appendChild(textNode);
        range.setStart(textNode, 0);
      }
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }, 0);
  }

  public createImageFragment(imageUrl: string, dataId: string) {
    const fragment = document.createDocumentFragment();
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '30%';
    img.setAttribute('contenteditable', 'false');
    fragment.appendChild(img);

    const span = document.createElement('span');
    span.setAttribute('contenteditable', 'false');
    span.appendChild(fragment);
    img.addEventListener('click', () => this.addStyleToImage(dataId));
    return span;
  }

  public addStyleToImage(dataId: string) {
    if (!this.isCrossIconVisible) {
      const div = document.querySelector(
        `[data-id="${dataId}"]`
      ) as HTMLElement;
      const span = div?.querySelector('span');
      if (span) span.style.position = 'relative';
      const img = div?.querySelector('img');
      if (img) {
        img.style.border = '2px solid blue';
      }
      const cross = document.createElement('div');
      cross.className = strings.IMAGE_CROSS_CLASS;
      cross.innerHTML = 'x';
      Object.assign(cross.style, {
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        background: '#fff',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '3px solid blue',
        zIndex: '999',
      });
      cross.addEventListener(
        'mouseover',
        () => (cross.style.border = '3px solid black')
      );
      cross.addEventListener(
        'mouseout',
        () => (cross.style.border = '3px solid blue')
      );
      cross.addEventListener('click', e => {
        e.stopPropagation();
        this.deleteImage();
      });
      span?.appendChild(cross);
      this.isImageHighlighted = true;
      this.highLightedImageDataId = dataId;
      this.isCrossIconVisible = true;
    }
  }

  public clearImageStyling() {
    const div = document.querySelector(
      `[data-id="${this.highLightedImageDataId}"]`
    ) as HTMLElement;
    if (div) {
      const span = div.querySelector('span');
      span?.removeAttribute('style');
      const img = span?.querySelector('img');
      if (img) {
        img.removeAttribute('style');
      }
      const cross = span?.querySelector(`.${strings.IMAGE_CROSS_CLASS}`);
      cross?.remove();
      this.highLightedImageDataId = '';
    }
    this.isCrossIconVisible = false;
  }

  public deleteImage() {
    this.document.blocks = this.document.blocks.filter(
      (block: any) => block.dataId !== this.highLightedImageDataId
    );
    this.highLightedImageDataId = '';
    this.isImageHighlighted = false;
    this.clearImageStyling();
    this.document.emit('documentChanged', this);
  }
}

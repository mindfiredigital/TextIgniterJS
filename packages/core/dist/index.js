'use strict';
class t {
  constructor() {
    this.events = {};
  }
  on(t, e) {
    this.events[t] || (this.events[t] = []), this.events[t].push(e);
  }
  emit(t, e) {
    this.events[t] && this.events[t].forEach(t => t(e));
  }
}
class e {
  constructor(t, e = {}) {
    this.text = t;
    const n = document.getElementById('fontFamily'),
      i = document.getElementById('fontSize');
    let o = 'Arial',
      s = '16px',
      l = document.getElementById('fontColorPicker'),
      a = document.getElementById('bgColorPicker');
    n && (o = n.value),
      i && (s = i.value),
      (this.attributes = {
        bold: e.bold || !1,
        italic: e.italic || !1,
        underline: e.underline || !1,
        undo: e.undo || !1,
        redo: e.redo || !1,
        fontFamily: e.fontFamily || o,
        fontSize: e.fontSize || s,
        hyperlink: e.hyperlink || !1,
        fontColor: e.fontColor || l.value,
        bgColor: e.bgColor || a.value,
      });
  }
  isBold() {
    return this.attributes.bold;
  }
  setBold(t) {
    this.attributes.bold = t;
  }
  isItalic() {
    return this.attributes.italic;
  }
  isUndo() {
    return this.attributes.undo;
  }
  isRedo() {
    return this.attributes.redo;
  }
  setItalic(t) {
    this.attributes.italic = t;
  }
  isUnderline() {
    return this.attributes.underline;
  }
  setUnderline(t) {
    this.attributes.underline = t;
  }
  setUndo(t) {
    this.attributes.undo = t;
  }
  setRedo(t) {
    this.attributes.redo = t;
  }
  clone() {
    return new e(this.text, Object.assign({}, this.attributes));
  }
  hasSameAttributes(t) {
    return (
      this.attributes.bold === t.attributes.bold &&
      this.attributes.italic === t.attributes.italic &&
      this.attributes.underline === t.attributes.underline &&
      this.attributes.undo === t.attributes.undo &&
      this.attributes.redo === t.attributes.redo &&
      this.attributes.fontFamily === t.attributes.fontFamily &&
      this.attributes.fontSize === t.attributes.fontSize &&
      this.attributes.italic === t.attributes.italic &&
      this.attributes.underline === t.attributes.underline &&
      this.attributes.hyperlink === t.attributes.hyperlink &&
      this.attributes.fontColor === t.attributes.fontColor &&
      this.attributes.bgColor === t.attributes.bgColor
    );
  }
  getHyperlink() {
    return this.attributes.hyperlink || !1;
  }
  setHyperlink(t) {
    this.attributes.hyperlink = t;
  }
}
class n extends t {
  get selectedBlockId() {
    return this._selectedBlockId;
  }
  set selectedBlockId(t) {
    if (this._selectedBlockId !== t) {
      this._selectedBlockId = t;
      const e = this.getCursorOffset(document.querySelector('[id="editor"]')),
        n = this.getCursorOffset(
          document.querySelector('[data-id="' + t + '"]')
        );
      this.currentOffset = e - n;
    }
  }
  constructor() {
    super(),
      (this.dataIds = []),
      (this.selectAll = !1),
      (this._selectedBlockId = null),
      (this.pieces = [new e('')]),
      (this.blocks = [
        {
          type: 'text',
          dataId: 'data-id-1734604240404',
          class: 'paragraph-block',
          alignment: 'left',
          pieces: [new e(' ')],
        },
      ]),
      (this.selectedBlockId = 'data-id-1734604240404'),
      (this.currentOffset = 0);
  }
  setEditorView(t) {
    this.editorView = t;
  }
  getPlainText() {
    return this.pieces.map(t => t.text).join('');
  }
  setUndoRedoManager(t) {
    this.undoRedoManager = t;
  }
  insertAt(t, n, i, o = '', s = 0, l = '', a = '', r = !1) {
    r || this.undoRedoManager.saveUndoSnapshot(),
      console.log('inserted,', { start: i, text: t }),
      console.log('inserted,', this.blocks);
    let d = 0,
      c = [],
      h = !1,
      u = 0;
    o &&
      ((u = this.blocks.findIndex(t => t.dataId === o)),
      (d = this.currentOffset));
    for (let o of this.blocks[u].pieces) {
      const s = d + o.text.length;
      if (!h && i <= s) {
        const s = i - d;
        s > 0 &&
          c.push(new e(o.text.slice(0, s), Object.assign({}, o.attributes))),
          c.push(
            new e(t, {
              bold: n.bold || !1,
              italic: n.italic || !1,
              underline: n.underline || !1,
              hyperlink: n.hyperlink || !1,
            })
          ),
          s < o.text.length &&
            c.push(new e(o.text.slice(s), Object.assign({}, o.attributes))),
          (h = !0);
      } else c.push(o.clone());
      d = s;
    }
    if (!h) {
      const i = c[c.length - 1];
      i &&
      i.hasSameAttributes(
        new e('', {
          bold: n.bold || !1,
          italic: n.italic || !1,
          underline: n.underline || !1,
          hyperlink: n.hyperlink || !1,
        })
      )
        ? (i.text += t)
        : c.push(
            new e(t, {
              bold: n.bold || !1,
              italic: n.italic || !1,
              underline: n.underline || !1,
              hyperlink: n.hyperlink || !1,
            })
          );
    }
    const g = this.mergePieces(c);
    (this.blocks[u].pieces = g),
      console.log({ position: i }),
      this.emit('documentChanged', this);
  }
  deleteRange(t, n, i = '', o = 0) {
    if ((console.log('deleted2,', { start: t, end: n }), t === n)) return;
    let s = [],
      l = 0,
      a = 0,
      r = !1;
    ('' === i && null === i) ||
      ((a = this.blocks.findIndex(t => t.dataId === i)), (l = o));
    let d = 0;
    if (t === l) {
      d = a - 1 >= 0 && 'image' === this.blocks[a - 1].type ? a - 2 : a - 1;
      for (let t of this.blocks[d].pieces) s.push(t.clone()), (r = !0);
    }
    for (let i of this.blocks[a].pieces) {
      const o = l + i.text.length;
      if (o <= t || l >= n) s.push(i.clone());
      else {
        const a = l,
          r = i.text;
        t > a &&
          t < o &&
          s.push(new e(r.slice(0, t - a), Object.assign({}, i.attributes))),
          n < o &&
            s.push(new e(r.slice(n - a), Object.assign({}, i.attributes)));
      }
      l = o;
    }
    const c = this.mergePieces(s);
    r
      ? ((this.blocks[d].pieces = c),
        (this.blocks[a].pieces = [new e(' ')]),
        (this.blocks = this.blocks.filter((t, e) => {
          if (e !== a) return t;
        })))
      : (this.blocks[a].pieces = c),
      0 === c.length &&
        this.blocks.length > 1 &&
        (this.blocks = this.blocks.filter(t => 0 !== t.pieces.length)),
      this.emit('documentChanged', this);
  }
  deleteBlocks() {
    (this.blocks = this.blocks.filter(t => {
      if (!this.dataIds.includes(t.dataId)) return t;
    })),
      (this.dataIds = []),
      (this.selectAll = !1),
      0 === this.blocks.length &&
        this.blocks.push({
          dataId: 'data-id-1734604240404',
          class: 'paragraph-block',
          pieces: [new e(' ')],
        }),
      this.emit('documentChanged', this);
  }
  getSelectedTextDataId() {
    const t = window.getSelection();
    if (!t || 0 === t.rangeCount) return null;
    const e = t.getRangeAt(0).startContainer,
      n = (e.nodeType === Node.TEXT_NODE ? e.parentElement : e).closest(
        '[data-id]'
      );
    return (null == n ? void 0 : n.getAttribute('data-id')) || null;
  }
  getAllSelectedDataIds() {
    var t;
    const e = window.getSelection();
    if (!e || 0 === e.rangeCount) return [];
    const n = e.getRangeAt(0),
      i = [],
      o = document.createNodeIterator(
        n.commonAncestorContainer,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
      );
    let s;
    for (; (s = o.nextNode()); )
      if (n.intersectsNode(s)) {
        const e = s.nodeType === Node.TEXT_NODE ? s.parentElement : s,
          n =
            null === (t = null == e ? void 0 : e.closest('[data-id]')) ||
            void 0 === t
              ? void 0
              : t.getAttribute('data-id');
        n && !i.includes(n) && i.push(n);
      }
    return (this.dataIds = i), console.log('selected id 3', this.dataIds, i), i;
  }
  handleCtrlASelection() {
    const t = [],
      e = document.getElementById('editor');
    if (e) {
      e.querySelectorAll('[data-id]').forEach(e => {
        const n = e.getAttribute('data-id');
        n && !t.includes(n) && t.push(n);
      });
    }
    return (this.dataIds = t), console.log('selected id 2', this.dataIds, t), t;
  }
  getSelectedDataIds() {
    const t = window.getSelection();
    if (!t || 0 === t.rangeCount) return [];
    const e = t.getRangeAt(0),
      n = [],
      i = e.startContainer,
      o = e.endContainer,
      s = this.getDataIdFromNode(i),
      l = this.getDataIdFromNode(o);
    return (
      s && !n.includes(s) && n.push(s),
      l && !n.includes(l) && n.push(l),
      (this.dataIds = n),
      console.log('selected id 1', this.dataIds, n),
      n
    );
  }
  getDataIdFromNode(t) {
    var e;
    const n = t.nodeType === Node.TEXT_NODE ? t.parentElement : t;
    return (
      (null === (e = null == n ? void 0 : n.closest('[data-id]')) ||
      void 0 === e
        ? void 0
        : e.getAttribute('data-id')) || null
    );
  }
  getCursorOffset(t) {
    const e = window.getSelection();
    if (!e || 0 === e.rangeCount) return -1;
    const n = e.getRangeAt(0);
    let i = 0;
    const o = t => {
      if (t === n.startContainer) return (i += n.startOffset), !0;
      t.nodeType === Node.TEXT_NODE && (i += (t.textContent || '').length);
      for (const e of Array.from(t.childNodes)) if (o(e)) return !0;
      return !1;
    };
    return o(t), i;
  }
  formatAttribute(t, n, i, o) {
    console.log('formatAttribute', t, n, i, o);
    let s = [],
      l = 0,
      a = -1;
    ('' === this.selectedBlockId && null === this.selectedBlockId) ||
      ((a = this.blocks.findIndex(t => t.dataId === this.selectedBlockId)),
      (l = this.currentOffset));
    for (let r of this.blocks[a].pieces) {
      const a = l + r.text.length;
      if (a <= t || l >= n) s.push(r.clone());
      else {
        const a = l,
          d = r.text,
          c = Math.max(t - a, 0),
          h = Math.min(n - a, d.length);
        c > 0 && s.push(new e(d.slice(0, c), Object.assign({}, r.attributes)));
        const u = new e(d.slice(c, h), Object.assign({}, r.attributes));
        ((('bold' !== i &&
          'italic' !== i &&
          'underline' !== i &&
          'undo' !== i &&
          'redo' !== i &&
          'hyperlink' !== i) ||
          'boolean' != typeof o) &&
          (('fontFamily' !== i &&
            'fontSize' !== i &&
            'hyperlink' !== i &&
            'fontColor' !== i &&
            'bgColor' !== i) ||
            'string' != typeof o)) ||
          (u.attributes[i] = o),
          s.push(u),
          h < d.length &&
            s.push(new e(d.slice(h), Object.assign({}, r.attributes)));
      }
      l = a;
    }
    const r = this.mergePieces(s);
    (this.blocks[a].pieces = r), this.emit('documentChanged', this);
  }
  toggleOrderedList(t, e = '') {
    const n = this.blocks.findIndex(e => e.dataId === t);
    if (-1 === n) return;
    const i = this.blocks[n];
    'ol' === i.listType || 'li' === i.listType
      ? ((i.listType = null), (i.listStart = void 0), (i.parentId = void 0))
      : ((i.listType = 'ol'), (i.listStart = 1), (i.parentId = i.dataId)),
      this.emit('documentChanged', this);
  }
  toggleUnorderedList(t) {
    const e = this.blocks.findIndex(e => e.dataId === t);
    if (-1 === e) return;
    const n = this.blocks[e];
    (n.listType = 'ul' === n.listType ? null : 'ul'),
      this.emit('documentChanged', this);
  }
  updateOrderedListNumbers() {
    let t = 1,
      e = null;
    for (let n = 0; n < this.blocks.length; n++) {
      const i = this.blocks[n];
      'ol' === i.listType || 'li' === i.listType
        ? (('ol' !== i.listType && i.parentId === e) ||
            ((t = 1), (e = 'ol' === i.listType ? i.dataId : i.parentId)),
          (i.listStart = t),
          t++)
        : ((t = 1), (e = null));
    }
    this.emit('documentChanged', this);
  }
  undo() {
    console.log('undo'), this.undoRedoManager.undo();
  }
  redo() {
    this.undoRedoManager.redo(), console.log('redo');
  }
  setCursorPosition(t, e = '') {
    var n;
    if ('' !== e) {
      const t = document.querySelector(`[data-id="${e}"]`);
      if (!t)
        return void console.warn(`Element with data-id="${e}" not found.`);
      setTimeout(() => t.focus(), 0);
    } else this.editorView.container.focus();
    const i = window.getSelection();
    if (!i) return;
    const o = document.createRange();
    let s = 0;
    const l = [this.editorView.container];
    let a;
    const r =
      (null === (n = this.editorView.container.textContent) || void 0 === n
        ? void 0
        : n.length) || 0;
    if (!(t < 0 || t > r)) {
      for (; (a = l.pop()); )
        if (3 === a.nodeType) {
          const e = a,
            n = s + e.length;
          if (t >= s && t <= n) {
            o.setStart(e, Math.min(t - s, e.length)), o.collapse(!0);
            break;
          }
          s = n;
        } else if ('BR' === a.tagName) {
          if (t === s) {
            o.setStartBefore(a), o.collapse(!0);
            break;
          }
          s++;
        } else {
          const t = a;
          let e = t.childNodes.length;
          for (; e--; ) l.push(t.childNodes[e]);
        }
      i.removeAllRanges(), i.addRange(o);
    }
  }
  toggleBoldRange(t, e, n = '') {
    const i = this.isRangeEntirelyAttribute(t, e, 'bold');
    this.formatAttribute(t, e, 'bold', !i);
  }
  toggleItalicRange(t, e, n = '') {
    const i = this.isRangeEntirelyAttribute(t, e, 'italic');
    this.formatAttribute(t, e, 'italic', !i);
  }
  toggleUnderlineRange(t, e, n = '') {
    const i = this.isRangeEntirelyAttribute(t, e, 'underline');
    this.formatAttribute(t, e, 'underline', !i);
  }
  toggleUndoRange(t, e, n = '') {
    const i = this.isRangeEntirelyAttribute(t, e, 'undo');
    this.formatAttribute(t, e, 'undo', !i);
  }
  toggleRedoRange(t, e) {
    const n = this.isRangeEntirelyAttribute(t, e, 'redo');
    this.formatAttribute(t, e, 'redo', !n);
  }
  applyFontColor(t, e, n, i = '') {
    t < e &&
      (this.formatAttribute(t, e, 'fontColor', n),
      console.log('applyFontColor-color', n, t, e));
  }
  applyBgColor(t, e, n, i = '') {
    t < e && this.formatAttribute(t, e, 'bgColor', n);
  }
  isRangeEntirelyAttribute(t, e, n) {
    let i = this.currentOffset,
      o = !0;
    if ('' !== this.selectedBlockId) {
      const s = this.blocks.findIndex(t => t.dataId === this.selectedBlockId);
      for (let l of this.blocks[s].pieces) {
        const s = i + l.text.length;
        if (s > t && i < e && !l.attributes[n]) {
          o = !1;
          break;
        }
        i = s;
      }
    }
    return o;
  }
  mergePieces(t) {
    let e = [];
    for (let n of t) {
      const t = e[e.length - 1];
      t && t.hasSameAttributes(n) ? (t.text += n.text) : e.push(n);
    }
    return e;
  }
  findPieceAtOffset(t, e = '') {
    let n = 0;
    if (e)
      for (let i of this.blocks) {
        const o = i.pieces.reduce((t, e) => t + e.text.length, 0);
        if (i.dataId == e) {
          let e = null;
          for (let o of i.pieces) {
            const i = n,
              s = i + o.text.length;
            if (t >= i && t < s) return t === i && e ? e : o;
            (e = o), (n = s);
          }
        } else n += o;
      }
    return null;
  }
  setFontFamily(t, e, n) {
    this.formatAttribute(t, e, 'fontFamily', n);
  }
  setFontSize(t, e, n) {
    this.formatAttribute(t, e, 'fontSize', n);
  }
  setAlignment(t, e) {
    const n = this.blocks.find(t => t.dataId === e);
    n && ((n.alignment = t), this.emit('documentChanged', this));
  }
  getHtmlContent() {
    const t = document.getElementById('editor');
    if (!t) return void console.error('Editor container not found.');
    const e = t.innerHTML;
    return (
      navigator.clipboard
        .writeText(e)
        .then(() => {
          console.log('HTML copied to clipboard!');
        })
        .catch(t => console.error('Failed to copy HTML:', t)),
      e
    );
  }
  getCursorOffsetInParent(t) {
    var e;
    console.log('textPosition -1:vicky', t);
    const n = document.querySelector(t);
    if (!n) return null;
    const i = window.getSelection();
    if (!i || 0 === i.rangeCount) return null;
    const o = i.getRangeAt(0);
    if (!n.contains(o.startContainer)) return null;
    let s = 0,
      l = null;
    const a = document.createTreeWalker(n, NodeFilter.SHOW_TEXT, null);
    let r = null;
    for (; a.nextNode(); ) {
      const t = a.currentNode;
      if (
        (console.log(t, 'textPosition - currentNode: vicky'),
        t === o.startContainer)
      ) {
        (s += o.startOffset), (l = t), (r = t.parentElement);
        break;
      }
      s +=
        (null === (e = t.textContent) || void 0 === e ? void 0 : e.length) || 0;
    }
    return (
      console.log(
        {
          offset: s,
          childNode: l,
          innerHTML: r.innerHTML,
          innerText: r.innerText,
        },
        'textPosition - return values: vicky'
      ),
      {
        offset: s,
        childNode: l,
        innerHTML: r.innerHTML,
        innerText: r.innerText,
      }
    );
  }
}
function i(t) {
  const e = window.getSelection();
  if (!e || 0 === e.rangeCount) return null;
  const n = e.getRangeAt(0),
    i = n.cloneRange();
  i.selectNodeContents(t), i.setEnd(n.startContainer, n.startOffset);
  const o = i.toString().length;
  i.setEnd(n.endContainer, n.endOffset);
  return { start: o, end: i.toString().length };
}
function o(t, e) {
  if (!e) return;
  let n = 0;
  const i = document.createRange();
  i.setStart(t, 0), i.collapse(!0);
  const o = [t];
  let s,
    l = !1,
    a = !1;
  for (; !a && (s = o.pop()); )
    if (3 === s.nodeType) {
      const t = s,
        o = n + t.length;
      !l &&
        e.start >= n &&
        e.start <= o &&
        (i.setStart(t, e.start - n), (l = !0)),
        l && e.end >= n && e.end <= o && (i.setEnd(t, e.end - n), (a = !0)),
        (n = o);
    } else if ('BR' === s.tagName)
      l || e.start !== n || (i.setStartBefore(s), (l = !0)),
        l && e.end === n && (i.setEndBefore(s), (a = !0)),
        n++;
    else {
      const t = s;
      let e = t.childNodes.length;
      for (; e--; ) o.push(t.childNodes[e]);
    }
  const r = window.getSelection();
  r && (r.removeAllRanges(), r.addRange(i));
}
function s(t) {
  const e = i(t.container);
  return e ? [e.start, e.end] : [0, 0];
}
class l {
  constructor(t, e) {
    (this.container = t), (this.document = e);
  }
  setImageHandler(t) {
    this.imageHandler = t;
  }
  render() {
    const t = i(this.container);
    (this.container.innerHTML = ''),
      this.document.blocks.forEach(t => {
        if ('' !== t.dataId) {
          let e;
          if ('image' === t.type)
            (e = document.createElement('div')),
              e.setAttribute('data-id', t.dataId),
              e.setAttribute('class', t.class),
              e.setAttribute('type', t.type),
              (e.style.textAlign = t.alignment || 'left'),
              t.image &&
                e.appendChild(
                  this.imageHandler.createImageFragment(t.image, t.dataId)
                );
          else if (
            ('ol' === t.listType || 'li' === t.listType
              ? ((e = document.createElement('ol')),
                e.setAttribute(
                  'start',
                  null == t ? void 0 : t.listStart.toString()
                ))
              : (e =
                  'ul' === t.listType
                    ? document.createElement('ul')
                    : document.createElement('div')),
            e.setAttribute('data-id', t.dataId),
            e.setAttribute('class', t.class),
            e.setAttribute('type', t.type),
            (e.style.textAlign = t.alignment || 'left'),
            'ol' === t.listType || 'ul' === t.listType || 'li' === t.listType)
          ) {
            const n = document.createElement('li');
            t.pieces.forEach(t => {
              n.appendChild(this.renderPiece(t));
            }),
              e.appendChild(n);
          } else
            t.pieces.forEach(t => {
              e.appendChild(this.renderPiece(t));
            });
          this.container.appendChild(e);
        }
      }),
      o(this.container, t);
  }
  renderPiece(t) {
    const e = t.text.split('\n');
    return this.wrapAttributes(e, t.attributes);
  }
  wrapAttributes(t, e) {
    const n = document.createDocumentFragment();
    return (
      t.forEach((i, o) => {
        let s = document.createTextNode(i);
        if (e.underline) {
          const t = document.createElement('u');
          t.appendChild(s), (s = t);
        }
        if (e.italic) {
          const t = document.createElement('em');
          t.appendChild(s), (s = t);
        }
        if (e.bold) {
          const t = document.createElement('strong');
          t.appendChild(s), (s = t);
        }
        const l = document.getElementById('fontFamily'),
          a = document.getElementById('fontSize');
        let r = 'Arial',
          d = '16px';
        if (
          (l && (r = l.value),
          a && (d = a.value),
          e.hyperlink && 'string' == typeof e.hyperlink)
        ) {
          const t = document.createElement('a');
          (t.href = e.hyperlink),
            (t.target = '_blank'),
            t.appendChild(s),
            (s = t);
        }
        if (e.fontColor && 'string' == typeof e.fontColor) {
          const n = document.createElement('span');
          console.log(t, 'attrs.fontColor', e.fontColor),
            (n.style.color = e.fontColor),
            n.appendChild(s),
            (s = n);
        }
        if (e.bgColor && 'string' == typeof e.bgColor) {
          const t = document.createElement('span');
          (t.style.backgroundColor = e.bgColor), t.appendChild(s), (s = t);
        }
        const c = document.createElement('span');
        (c.style.fontFamily = e.fontFamily || r),
          (c.style.fontSize = e.fontSize || d),
          c.appendChild(s),
          n.appendChild(c),
          o < t.length - 1 && n.appendChild(document.createElement('br'));
      }),
      n
    );
  }
}
class a extends t {
  constructor(t) {
    super(), (this.container = t), this.setupButtons();
  }
  setupButtons() {
    this.container.querySelectorAll('button').forEach(t => {
      t.addEventListener('mousedown', t => {
        t.preventDefault();
      });
    }),
      this.container.addEventListener('click', t => {
        const e = t.target.closest('button');
        if (e) {
          const t = e.getAttribute('data-action');
          t && this.emit('toolbarAction', t);
        }
      });
  }
  updateActiveStates(t) {
    if (
      (this.container.querySelectorAll('button').forEach(e => {
        const n = e.getAttribute('data-action');
        let i = !1;
        'bold' === n && t.bold && (i = !0),
          'italic' === n && t.italic && (i = !0),
          'underline' === n && t.underline && (i = !0),
          'hyperlink' === n && t.hyperlink && (i = !0),
          'undo' === n && t.undo && (i = !0),
          'redo' === n && t.redo && (i = !0),
          e.classList.toggle('active', i);
      }),
      this.container.querySelectorAll('select').forEach(e => {
        const n = e.getAttribute('data-action');
        'fontFamily' === n && t.fontFamily && (e.value = t.fontFamily),
          'fontSize' === n && t.fontSize && (e.value = t.fontSize);
      }),
      t.fontColor)
    ) {
      const e = document.getElementById('fontColorPicker');
      e &&
        ((e.value = t.fontColor),
        e.dispatchEvent(new Event('input', { bubbles: !0 })));
    }
    if (t.bgColor) {
      const e = document.getElementById('bgColorPicker');
      e &&
        ((e.value = t.bgColor),
        e.dispatchEvent(new Event('input', { bubbles: !0 })));
    }
  }
}
const r = {
  TOOLBAR_CLASSNAME: 'toolbar',
  TOOLBAR_ID: 'toolbar',
  EDITOR_CLASSNAME: 'editor',
  EDITOR_ID: 'editor',
  EDITOR_ELEMENT_NT_FOUND:
    'Editor element not found or incorrect element type.',
  FONT_FAMILY_SELECT_ID: 'fontFamily',
  FONT_SIZE_SELECT_ID: 'fontSize',
  FONT_COLOR_WRAPPER_ID: 'fontColorWrapper',
  FONT_COLOR_ID: 'fontColor',
  FONT_COLOR_PICKER_WRAPPER_ID: 'colorWrapper',
  FONT_COLOR_PICKER_ID: 'fontColorPicker',
  FONT_COLOR_RESET_ID: 'colorResetFont',
  BG_COLOR_WRAPPER_ID: 'bgColorWrapper',
  BG_COLOR_ID: 'bgColor',
  BG_COLOR_PICKER_WRAPPER_ID: 'colorBgWrapper',
  BG_COLOR_RESET_ID: 'colorResetBG',
  BG_COLOR_PICKER_ID: 'bgColorPicker',
  GET_HTML_BUTTON_ID: 'getHtmlButton',
  LOAD_HTML_BUTTON_ID: 'loadHtmlButton',
  HYPERLINK_CONTAINER_ID: 'hyperlink-container',
  HYPERLINK_INPUT_ID: 'hyperlink-input',
  HYPERLINK_PLACEHOLDER: 'Enter a URL...',
  HYPERLINK_APPLY_BTN_ID: 'apply-hyperlink',
  HYPERLINK_CANCEL_BTN_ID: 'cancel-hyperlink',
  VIEW_HYPERLINK_CONTAINER_ID: 'hyperlink-container-view',
  VIEW_HYPERLINK_LABEL_ID: 'hyperlink-view-span',
  VIEW_HYPERLINK_ANCHOR_ID: 'hyperlink-view-link',
  TEMPORARY_SELECTION_HIGHLIGHT_CLASS: 'temporary-selection-highlight',
  PARAGRAPH_BLOCK_CLASS: 'paragraph-block',
  IMAGE_CROSS_CLASS: 'image-cross',
  TEST_HTML_CODE:
    '<div data-id="data-id-1734604240404" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> ajsh diujaksdajsh diujaksdajsh </span></span></span></div><div data-id="data-id-1739430551701" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> diujaksdasd </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong>asdh </strong></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(163, 67, 67);"><strong>98hasiudasdh 98</strong></span></span></span></div><div data-id="data-id-1739430553412" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong> </strong></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">This is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><em>t</em></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"><em>est work.</em></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"> this is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"><em>test work</em></span></span></span></div><div data-id="data-id-1739430554776" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">This is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><em>test work.</em></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> this is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong>test work</strong></span></span></span></div><div data-id="data-id-1739430558023" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong><em> uj09asujdi</em></strong></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank"><strong><em>odiodiooias </em></strong></a></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank"><strong>diodiodio</strong></a></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank">oias</a></span></span></span></div><div data-id="data-id-1739430556280" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> da90 uasd y98asiodoiasda90 uasd y9</span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">8asiodoiasda90 uasd y98asioda</span></span></span></div><div data-id="data-id-1739430559464" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> sdjasdjasdja9sudoija9sudoija9sudoija90sdoa90sdoa90sdo</span></span></span></div>',
};
class d {
  constructor(t, e, n) {
    (this.savedSelection = null),
      (this.editorContainer = t),
      (this.editorView = e),
      (this.document = n);
  }
  setUndoRedoManager(t) {
    this.undoRedoManager = t;
  }
  hanldeHyperlinkClick(t, e, n, i, o) {
    const s = this.getCommonHyperlinkInRange(t, e, n, i, o);
    this.showHyperlinkInput(s);
  }
  getCommonHyperlinkInRange(t, e, n, i, o) {
    let s = n,
      l = 0;
    i && (l = o.findIndex(t => t.dataId === i));
    const a = o[l].pieces;
    let r = null;
    for (let n of a) {
      const i = s + n.text.length;
      if (i > t && s < e) {
        const t = n.attributes.hyperlink || null;
        if (null === r) r = t;
        else if (r !== t) return null;
      }
      s = i;
    }
    return r;
  }
  showHyperlinkInput(t) {
    const e = document.getElementById(r.HYPERLINK_CONTAINER_ID),
      n = document.getElementById(r.HYPERLINK_INPUT_ID),
      o = document.getElementById(r.HYPERLINK_APPLY_BTN_ID),
      s = document.getElementById(r.HYPERLINK_CANCEL_BTN_ID);
    if (e && n && o && s) {
      e.style.display = 'block';
      const l = window.getSelection();
      if (l && l.rangeCount > 0) {
        const t = l.getRangeAt(0).getBoundingClientRect();
        (e.style.top = `${t.bottom + window.scrollY + 5}px`),
          (e.style.left = `${t.left + window.scrollX}px`);
      }
      (n.value = t || ''),
        (this.savedSelection = i(this.editorView.container)),
        this.highlightSelection(),
        n.focus(),
        (o.onclick = null),
        (s.onclick = null);
      const a = this.document.dataIds;
      (o.onclick = () => {
        const t = n.value.trim();
        t && this.applyHyperlink(t, a), (e.style.display = 'none');
      }),
        (s.onclick = () => {
          this.removeHyperlink(a), (e.style.display = 'none');
        });
    }
  }
  highlightSelection() {
    this.removeHighlightSelection();
    const t = window.getSelection();
    if (t && t.rangeCount > 0) {
      const e = t.getRangeAt(0),
        n = document.createElement('span');
      (n.className = r.TEMPORARY_SELECTION_HIGHLIGHT_CLASS),
        n.appendChild(e.extractContents()),
        e.insertNode(n),
        t.removeAllRanges();
      const i = document.createRange();
      i.selectNodeContents(n), t.addRange(i);
    }
  }
  removeHighlightSelection() {
    var t;
    const e =
      null === (t = this.editorContainer) || void 0 === t
        ? void 0
        : t.querySelectorAll(`span.${r.TEMPORARY_SELECTION_HIGHLIGHT_CLASS}`);
    null == e ||
      e.forEach(t => {
        const e = t.parentNode;
        if (e) {
          for (; t.firstChild; ) e.insertBefore(t.firstChild, t);
          e.removeChild(t);
        }
      });
  }
  applyHyperlink(t, e) {
    this.undoRedoManager.saveUndoSnapshot(),
      this.removeHighlightSelection(),
      o(this.editorView.container, this.savedSelection);
    const [n, i] = s(this.editorView);
    n < i &&
      (e.length > 1
        ? this.document.blocks.forEach(i => {
            if (e.includes(i.dataId)) {
              this.document.selectedBlockId = i.dataId;
              let e = 0;
              i.pieces.forEach(t => {
                e += t.text.length;
              });
              let o = n - e;
              this.document.formatAttribute(o, e, 'hyperlink', t);
            }
          })
        : this.document.formatAttribute(n, i, 'hyperlink', t),
      this.editorView.render(),
      o(this.editorView.container, this.savedSelection),
      this.editorView.container.focus()),
      (this.savedSelection = null);
  }
  removeHyperlink(t) {
    this.undoRedoManager.saveUndoSnapshot(),
      this.removeHighlightSelection(),
      o(this.editorView.container, this.savedSelection);
    const [e, n] = s(this.editorView);
    e < n &&
      (t.length > 1
        ? this.document.blocks.forEach(n => {
            if (t.includes(n.dataId)) {
              this.document.selectedBlockId = n.dataId;
              let t = 0;
              n.pieces.forEach(e => {
                t += e.text.length;
              });
              let i = e - t;
              this.document.formatAttribute(i, t, 'hyperlink', !1);
            }
          })
        : this.document.formatAttribute(e, n, 'hyperlink', !1),
      this.editorView.render(),
      o(this.editorView.container, this.savedSelection),
      this.editorView.container.focus()),
      (this.savedSelection = null);
  }
  showHyperlinkViewButton(t) {
    const e = document.getElementById(r.VIEW_HYPERLINK_CONTAINER_ID),
      n = document.getElementById(r.VIEW_HYPERLINK_ANCHOR_ID);
    if (e && n) {
      e.style.display = 'block';
      const i = window.getSelection();
      if (i && i.rangeCount > 0) {
        const t = i.getRangeAt(0).getBoundingClientRect();
        (t.width > 0 || t.height > 0) &&
          ((e.style.top = `${t.bottom + window.scrollY + 5}px`),
          (e.style.left = `${t.left + window.scrollX}px`));
      }
      t && ((n.innerText = t), (n.href = t));
    }
  }
  hideHyperlinkViewButton() {
    const t = document.getElementById(r.VIEW_HYPERLINK_CONTAINER_ID);
    t && (t.style.display = 'none');
  }
}
function c(t) {
  return h(new DOMParser().parseFromString(t, 'text/html').body, {
    bold: !1,
    italic: !1,
    underline: !1,
  });
}
function h(t, n) {
  let i = Object.assign({}, n);
  const o = [];
  if (t instanceof HTMLElement)
    ('STRONG' !== t.tagName && 'B' !== t.tagName) || (i.bold = !0),
      ('EM' !== t.tagName && 'I' !== t.tagName) || (i.italic = !0),
      'U' === t.tagName && (i.underline = !0),
      t.childNodes.forEach(t => {
        o.push(...h(t, i));
      });
  else if (t instanceof Text) {
    const n = t.nodeValue || '';
    '' !== n.trim() && o.push(new e(n, Object.assign({}, i)));
  }
  return o;
}
const u = {
  bold: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">\n                <title>Bold</title>\n                <path d="M17.061 11.22A4.46 4.46 0 0 0 18 8.5C18 6.019 15.981 4 13.5 4H6v15h8c2.481 0 4.5-2.019 4.5-4.5a4.48 4.48 0 0 0-1.439-3.28zM13.5 7c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5H9V7h4.5zm.5 9H9v-3h5c.827 0 1.5.673 1.5 1.5S14.827 16 14 16z"></path>\n            </svg>',
  italic:
    '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">\n                <title>Italic</title>\n                <path d="M19 7V4H9v3h2.868L9.012 17H5v3h10v-3h-2.868l2.856-10z"></path>\n            </svg>',
  underline:
    '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" height="18" \n                    viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">\n                    <title>Underline</title>\n                    <path d="M5 18h14v2H5zM6 4v6c0 3.309 2.691 6 6 6s6-2.691 6-6V4h-2v6c0 2.206-1.794 4-4 4s-4-1.794-4-4V4H6z"></path>\n                </svg>',
  subscript:
    '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                    width="18" height="18" \n                    viewBox="0 0 24 24">\n                    <title>Subscript</title>\n                    <path fill="currentColor" d="M19 20v-3h3v-1h-3v-1h4v3h-3v1h3v1zM5.875 18l4.625-7.275L6.2 4h2.65l3.1 5h.1l3.075-5H17.8l-4.325 6.725L18.125 18H15.45l-3.4-5.425h-.1L8.55 18z"/>\n                </svg>',
  superscript:
    '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Superscript</title>\n                    <path fill="currentColor" d="M19 9V6h3V5h-3V4h4v3h-3v1h3v1zM5.875 20l4.625-7.275L6.2 6h2.65l3.1 5h.1l3.075-5H17.8l-4.325 6.725L18.125 20H15.45l-3.4-5.425h-.1L8.55 20z"/>\n                </svg>',
  left_align:
    '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Left Align</title>\n                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M4.5 12h8m-8 6.25h15m-15-12.5h15"/>\n                </svg>',
  center_align:
    '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Center Align</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M6 18h12"/>\n                </svg>',
  right_align:
    '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Right Align</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M19.5 12h-8m8-6.25h-15m15 12.5h-15"/></svg>',
  justify:
    '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 20 20">\n                <title>Justify</title><path fill="currentColor" d="M2 4.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.25m0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.25m.75 4.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5z"/>\n            </svg>',
  bullet_list:
    '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 16 16">\n                    <title>Bullet List</title><path fill="currentColor" d="M2 4.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2M2 9a1 1 0 1 0 0-2a1 1 0 0 0 0 2m1 3.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M5.5 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM5 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 8m.5 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/></svg>',
  numbered_list:
    '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 512 512">\n                    <title>Numbererd List</title>\n                    <path fill="currentColor" d="M184 80h288v32H184zm0 160h288v32H184zm0 160h288v32H184zm-64-240V40H56v32h32v88zM56 262.111V312h80v-32H91.777L136 257.889V192H56v32h48v14.111zM56 440v32h80V344H56v32h48v16H80v32h24v16z"/>\n                </svg>',
  insert_table:
    '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 20 20">\n                    <title>Insert Table</title>\n                    <path fill="currentColor" d="M1.364 5.138v12.02h17.272V5.138zM.909 1.5h18.182c.502 0 .909.4.909.895v15.21a.9.9 0 0 1-.91.895H.91c-.503 0-.91-.4-.91-.895V2.395C0 1.9.407 1.5.91 1.5m5.227 1.759c0-.37.306-.671.682-.671s.682.3.682.671v13.899c0 .37-.305.67-.682.67a.676.676 0 0 1-.682-.67zm6.96-.64c.377 0 .682.3.682.67v4.995h4.91c.377 0 .683.301.683.672c0 .37-.306.671-.682.671l-4.911-.001v3.062h5.002c.377 0 .682.3.682.671c0 .37-.305.671-.682.671h-5.002v3.158a.676.676 0 0 1-.682.671a.676.676 0 0 1-.681-.67l-.001-3.159H1.001a.676.676 0 0 1-.682-.67c0-.371.305-.672.682-.672h11.413V9.626L.909 9.627a.676.676 0 0 1-.682-.671c0-.37.306-.671.682-.671l11.505-.001V3.289c0-.37.306-.67.682-.67"/>\n                </svg>',
  insert_layout:
    '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 256 256">\n                    <title>Insert Layout</title>\n                    <path fill="currentColor" d="M216 42H40a14 14 0 0 0-14 14v144a14 14 0 0 0 14 14h176a14 14 0 0 0 14-14V56a14 14 0 0 0-14-14M40 54h176a2 2 0 0 1 2 2v42H38V56a2 2 0 0 1 2-2m-2 146v-90h60v92H40a2 2 0 0 1-2-2m178 2H110v-92h108v90a2 2 0 0 1-2 2"/>\n                </svg>',
  heading:
    '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24">\n                <title>Heading</title>\n                <path fill="currentColor" d="M17 11V4h2v17h-2v-8H7v8H5V4h2v7z"/>\n            </svg>',
  hyperlink:
    '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24">\n                <title>Hyperlink</title>\n                <path fill="currentColor" d="M14.78 3.653a3.936 3.936 0 1 1 5.567 5.567l-3.627 3.627a3.936 3.936 0 0 1-5.88-.353a.75.75 0 0 0-1.18.928a5.436 5.436 0 0 0 8.12.486l3.628-3.628a5.436 5.436 0 1 0-7.688-7.688l-3 3a.75.75 0 0 0 1.06 1.061z"/>\n                <path fill="currentColor" d="M7.28 11.153a3.936 3.936 0 0 1 5.88.353a.75.75 0 0 0 1.18-.928a5.436 5.436 0 0 0-8.12-.486L2.592 13.72a5.436 5.436 0 1 0 7.688 7.688l3-3a.75.75 0 1 0-1.06-1.06l-3 3a3.936 3.936 0 0 1-5.567-5.568z"/>\n            </svg>',
  image:
    '<svg \n            xmlns="http://www.w3.org/2000/svg" \n            width="18" \n            height="18" \n            viewBox="0 0 16 16">\n            <title>Insert Image</title>\n            <path fill="currentColor" d="M6 5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m9-4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm-3.448 6.134l-3.76 2.769a.5.5 0 0 1-.436.077l-.087-.034l-1.713-.87L1 11.8V14h14V9.751zM15 2H1v8.635l4.28-2.558a.5.5 0 0 1 .389-.054l.094.037l1.684.855l3.813-2.807a.5.5 0 0 1 .52-.045l.079.05L15 8.495z"/>\n        </svg>',
};
class g {
  constructor(t) {
    (this.htmlString = t),
      (this.doc = new DOMParser().parseFromString(t, 'text/html'));
  }
  parse() {
    const t = this.doc.body.children;
    let e = [];
    return (
      Array.from(t).forEach((t, n) => {
        const i = this.parseElement(t);
        console.log(t, 'element parse', n, i), e.push(i);
      }),
      console.log(e, 'element--jsondata'),
      e
    );
  }
  parseElement(t) {
    const e = t.getAttribute('data-id') || '',
      n = t.className || 'paragraph-block',
      i = t.style.textAlign || 'left';
    let o = null,
      s = null;
    'UL' === t.tagName
      ? (o = 'ul')
      : 'OL' === t.tagName &&
        ((o = 'ol'), (s = parseInt(t.getAttribute('start') || '1', 10)));
    let l = [];
    return (
      o ? this.parseListItems(t, l) : this.parseParagraphText(t, l),
      Object.assign(
        Object.assign(
          Object.assign(
            { dataId: e, class: n, alignment: i, pieces: l },
            o ? { listType: o } : {}
          ),
          null !== s ? { listStart: s } : {}
        ),
        {}
      )
    );
  }
  parseListItems(t, n) {
    t.querySelectorAll('li').forEach(t => {
      const i = this.extractTextAttributes(t);
      i && n.push(new e(i.text, i.attributes));
    });
  }
  parseParagraphText(t, n) {
    const i = t.querySelectorAll('span'),
      o = new Map();
    i.forEach(t => {
      const e = this.extractTextAttributes(t);
      if (
        (console.log(
          e,
          'piece parseParagraphText span',
          t.textContent,
          t.style.color
        ),
        e)
      ) {
        const t = o.get(e.text);
        t
          ? ((t.attributes.bold = t.attributes.bold || e.attributes.bold),
            (t.attributes.italic = t.attributes.italic || e.attributes.italic),
            (t.attributes.underline =
              t.attributes.underline || e.attributes.underline),
            (t.attributes.fontFamily =
              e.attributes.fontFamily || t.attributes.fontFamily),
            (t.attributes.fontSize =
              e.attributes.fontSize || t.attributes.fontSize),
            (t.attributes.fontColor =
              e.attributes.fontColor || t.attributes.fontColor),
            (t.attributes.bgColor =
              e.attributes.bgColor || t.attributes.bgColor))
          : o.set(e.text, Object.assign({}, e));
      }
    }),
      o.forEach(t => {
        n.push(new e(t.text, t.attributes));
      }),
      console.log(n, 'pieces--parseParagraphText (merged)');
  }
  extractTextAttributes(t) {
    var e;
    const n = t.textContent || '';
    return n
      ? (console.log('extractTextAttributes node', t, t.style.color),
        {
          text: n,
          attributes: {
            bold: null !== t.querySelector('b, strong'),
            italic: null !== t.querySelector('i, em'),
            underline: null !== t.querySelector('u'),
            undo: !1,
            redo: !1,
            fontFamily: t.style.fontFamily || 'Arial',
            fontSize: t.style.fontSize || '12px',
            hyperlink:
              !!t.querySelector('a') &&
              (null === (e = t.querySelector('a')) || void 0 === e
                ? void 0
                : e.getAttribute('href')),
            fontColor: t.style.color,
            bgColor: t.style.backgroundColor,
          },
        })
      : null;
  }
  rgbToHex(t, e = !1) {
    const n = t.match(/\d+/g);
    if (!n || n.length < 3) return null;
    const i = n
      .map(t => {
        const e = parseInt(t);
        return e < 0 || e > 255 ? '00' : e.toString(16).padStart(2, '0');
      })
      .join('');
    return e || '000000' !== i ? `#${i}` : null;
  }
}
class p {
  constructor(t, e) {
    (this.editor = t),
      (this.document = e),
      (this.isImageHighlighted = !1),
      (this.highLightedImageDataId = ''),
      (this.currentCursorLocation = 0),
      (this.isCrossIconVisible = !1);
  }
  setEditorView(t) {
    this.editorView = t;
  }
  insertImage() {
    const t = document.createElement('input');
    (t.type = 'file'),
      (t.accept = 'image/*'),
      t.click(),
      (t.onchange = () => {
        const e = t.files ? t.files[0] : null;
        if (e) {
          const t = new FileReader();
          (t.onload = t => {
            var e;
            const n =
              null === (e = t.target) || void 0 === e ? void 0 : e.result;
            this.insertImageAtCursor(n);
          }),
            t.readAsDataURL(e);
        }
      });
  }
  insertImageAtCursor(t) {
    const [e, n] = s(this.editorView);
    console.log(e, n, 'vicky insertImage', t),
      n > e && this.document.deleteRange(e, n, this.document.selectedBlockId),
      this.insertImageAtPosition(t, e, this.document.selectedBlockId);
  }
  setCursorPostion(t, e) {
    const n = document.querySelector(`[data-id="${e}"]`);
    n.focus(),
      setTimeout(() => {
        const e = document.createRange(),
          i = window.getSelection();
        if (n.firstChild) e.setStart(n.firstChild, t);
        else {
          const t = document.createTextNode('');
          n.appendChild(t), e.setStart(t, 0);
        }
        e.collapse(!0),
          null == i || i.removeAllRanges(),
          null == i || i.addRange(e);
      }, 0);
  }
  insertImageAtPosition(t, n, i) {
    console.log(t, n, i, 'vicky insertImageAtPosition', this.document.blocks);
    const o = `data-id-${Date.now()}-${1e3 * Math.random()}`,
      s = `data-id-${Date.now()}-${1e3 * Math.random()}`,
      l = `data-id-${Date.now()}-${1e3 * Math.random()}`,
      a = {
        dataId: o,
        class: r.PARAGRAPH_BLOCK_CLASS,
        pieces: [new e(' ')],
        type: 'image',
        image: t,
      },
      d = {
        dataId: s,
        class: r.PARAGRAPH_BLOCK_CLASS,
        pieces: [new e(' ')],
        type: 'text',
      };
    let c = this.document.selectedBlockId;
    const h = this.document.blocks.findIndex(
      t => t.dataId === this.document.selectedBlockId
    );
    let u = [];
    const { remainingText: g, piece: p } = (function (t, e) {
      const n = window.getSelection();
      if (!n || 0 === n.rangeCount) return { remainingText: '', piece: null };
      const i = n.getRangeAt(0).startContainer;
      let o = '';
      const s = e.blocks.filter(e => {
          if (e.dataId === t) return e;
        }),
        l = document.querySelector(`[data-id="${t}"]`),
        a = e.getCursorOffsetInParent(`[data-id="${t}"]`);
      console.log(a, 'textPosition:vicky');
      let r = [],
        d = 0;
      if (
        (s[0].pieces.forEach((t, e) => {
          (o += t.text),
            (null == a ? void 0 : a.innerText) === t.text &&
              ((d = e), r.push(t));
        }),
        s[0].pieces.length > 1 &&
          s[0].pieces.forEach((t, e) => {
            d < e && r.push(t);
          }),
        !l)
      )
        return (
          console.error(`Element with data-id "${t}" not found.`),
          { remainingText: '', piece: null }
        );
      if (!l.contains(i))
        return (
          console.error(
            `Cursor is not inside the element with data-id "${t}".`
          ),
          { remainingText: '', piece: null }
        );
      const c = o,
        h = null == a ? void 0 : a.offset,
        u = c.slice(h),
        g = c.slice(0, h);
      return (l.textContent = g), { remainingText: u, piece: r };
    })(c || '', this.document);
    console.log(c || '', this.document, 'extractTextFromDataId-vicky', g, p);
    const m = ' ' + g;
    let f = this.document.blocks;
    if (m.length > 0) {
      const t = g.split(' ');
      let n = [];
      '' !== t[0] || void 0 !== t[1]
        ? 1 === p.length
          ? (n = [new e(m, p[0].attributes)])
          : (n.push(new e(' ' + t[0] + ' ', p[0].attributes)),
            p.length >= 2 &&
              p.forEach((t, e) => {
                0 !== e && n.push(t);
              }))
        : (n = [new e(' ')]),
        console.log(
          this.document.selectedBlockId,
          'uniqueId3 extractTextFromDataId-vicky',
          l
        ),
        (f = (function (t, e, n) {
          const i = t.findIndex(t => t.dataId === e);
          return -1 === i
            ? (console.error(`Block with dataId "${e}" not found.`), t)
            : [...t.slice(0, i + 1), n, ...t.slice(i + 1)];
        })(this.document.blocks, this.document.selectedBlockId || '', {
          dataId: l,
          class: r.PARAGRAPH_BLOCK_CLASS,
          pieces: n,
          type: 'text',
        }));
    }
    (this.document.blocks = f),
      this.document.deleteRange(
        this.currentCursorLocation,
        this.currentCursorLocation + g.length,
        this.document.selectedBlockId,
        this.document.currentOffset
      ),
      this.document.blocks.length > h + 1
        ? this.document.blocks.forEach((t, e) => {
            u.push(t),
              e === h
                ? u.push(a)
                : c === this.document.selectedBlockId && (c = t.dataId);
          })
        : ((u = [...this.document.blocks, a, d]), (c = d.dataId)),
      (this.document.blocks = u),
      this.editorView.render(),
      (this.document.selectedBlockId = c);
    const b = document.querySelector(`[data-id="${c}"]`);
    b.focus(),
      setTimeout(() => {
        const t = document.createRange(),
          e = window.getSelection();
        if (b.firstChild) t.setStart(b.firstChild, 1);
        else {
          const e = document.createTextNode('');
          b.appendChild(e), t.setStart(e, 0);
        }
        t.collapse(!0),
          null == e || e.removeAllRanges(),
          null == e || e.addRange(t);
      }, 0);
  }
  createImageFragment(t, e) {
    const n = document.createDocumentFragment(),
      i = document.createElement('img');
    (i.src = t),
      (i.style.maxWidth = '30%'),
      i.setAttribute('contenteditable', 'false'),
      n.appendChild(i);
    const o = document.createElement('span');
    return (
      o.setAttribute('contenteditable', 'false'),
      o.appendChild(n),
      i.addEventListener('click', () => this.addStyleToImage(e)),
      o
    );
  }
  addStyleToImage(t) {
    if (!this.isCrossIconVisible) {
      const e = document.querySelector(`[data-id="${t}"]`),
        n = null == e ? void 0 : e.querySelector('span');
      n && (n.style.position = 'relative');
      const i = null == e ? void 0 : e.querySelector('img');
      i && (i.style.border = '2px solid blue');
      const o = document.createElement('div');
      (o.className = r.IMAGE_CROSS_CLASS),
        (o.innerHTML = 'x'),
        Object.assign(o.style, {
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
        }),
        o.addEventListener(
          'mouseover',
          () => (o.style.border = '3px solid black')
        ),
        o.addEventListener(
          'mouseout',
          () => (o.style.border = '3px solid blue')
        ),
        o.addEventListener('click', t => {
          t.stopPropagation(), this.deleteImage();
        }),
        null == n || n.appendChild(o),
        (this.isImageHighlighted = !0),
        (this.highLightedImageDataId = t),
        (this.isCrossIconVisible = !0);
    }
  }
  clearImageStyling() {
    const t = document.querySelector(
      `[data-id="${this.highLightedImageDataId}"]`
    );
    if (t) {
      const e = t.querySelector('span');
      null == e || e.removeAttribute('style');
      const n = null == e ? void 0 : e.querySelector('img');
      n && n.removeAttribute('style');
      const i = null == e ? void 0 : e.querySelector(`.${r.IMAGE_CROSS_CLASS}`);
      null == i || i.remove(), (this.highLightedImageDataId = '');
    }
    this.isCrossIconVisible = !1;
  }
  deleteImage() {
    (this.document.blocks = this.document.blocks.filter(
      t => t.dataId !== this.highLightedImageDataId
    )),
      (this.highLightedImageDataId = ''),
      (this.isImageHighlighted = !1),
      this.clearImageStyling(),
      this.document.emit('documentChanged', this);
  }
}
class m {
  constructor(t, e) {
    (this.snapshotUndoStack = []),
      (this.snapshotRedoStack = []),
      (this.maxSnapshots = 5e3),
      (this.document = t),
      (this.editorView = e);
  }
  createSnapshot() {
    const [t, e] = s(this.editorView);
    return {
      blocks: JSON.parse(JSON.stringify(this.document.blocks)),
      dataIds: [...this.document.dataIds],
      selectedBlockId: this.document.selectedBlockId,
      currentOffset: this.document.currentOffset,
      selection: this.getCurrentSelection(),
      cursorPosition: t,
    };
  }
  getCurrentSelection() {
    const t = i(this.document.editorView.container);
    return t ? { start: t.start, end: t.end } : { start: 0, end: 0 };
  }
  saveUndoSnapshot() {
    const t = this.createSnapshot();
    this.snapshotUndoStack.push(t),
      this.snapshotUndoStack.length > this.maxSnapshots &&
        this.snapshotUndoStack.shift(),
      (this.snapshotRedoStack = []);
  }
  restoreSnapshot(t) {
    (this.document.blocks = t.blocks),
      (this.document.dataIds = t.dataIds),
      (this.document._selectedBlockId = t.selectedBlockId),
      (this.document.currentOffset = t.currentOffset);
    for (let t of this.document.blocks)
      t.pieces &&
        Array.isArray(t.pieces) &&
        (t.pieces = t.pieces.map(t => new e(t.text, t.attributes)));
    this.document.emit('documentChanged', this.document),
      this.document.setCursorPosition(t.cursorPosition || 0);
  }
  undo() {
    if (
      (console.log('   ', this.snapshotUndoStack),
      console.log('uuuno', this.snapshotRedoStack),
      0 === this.snapshotUndoStack.length)
    )
      return;
    const t = this.createSnapshot();
    this.snapshotRedoStack.push(t),
      this.snapshotRedoStack.length > this.maxSnapshots &&
        this.snapshotRedoStack.shift();
    const e = this.snapshotUndoStack.pop();
    e && this.restoreSnapshot(e);
  }
  redo() {
    if (0 === this.snapshotRedoStack.length) return;
    const t = this.createSnapshot();
    this.snapshotUndoStack.push(t),
      this.snapshotUndoStack.length > this.maxSnapshots &&
        this.snapshotUndoStack.shift();
    const e = this.snapshotRedoStack.pop();
    e && this.restoreSnapshot(e);
  }
}
class f {
  constructor(t, i) {
    var o, s, h, f, b, y, I, k, C;
    (this.savedSelection = null), (this.debounceTimer = null);
    const { mainEditorId: v, toolbarId: E } = (function (t, e) {
      const n = r.EDITOR_ID,
        i = r.TOOLBAR_ID,
        o = ['Arial', 'Times New Roman', 'Courier New', 'Verdana'],
        s = ['12px', '14px', '16px', '18px', '20px'],
        l = document.getElementById(t);
      if (!l) throw new Error(r.EDITOR_ELEMENT_NT_FOUND);
      const a = document.createElement('div');
      (a.className = r.TOOLBAR_CLASSNAME),
        (a.id = i),
        l.appendChild(a),
        (null == e ? void 0 : e.showToolbar) || (a.style.display = 'none');
      const d = document.createElement('div');
      (d.id = n),
        (d.className = r.EDITOR_CLASSNAME),
        (d.contentEditable = 'true'),
        l.appendChild(d);
      const c = {
          bold: '<strong>B</strong>',
          italic: '<em>I</em>',
          underline: '<u>U</u>',
          hyperlink: '&#128279;',
          alignLeft: '&#8676;',
          alignCenter: '&#8596;',
          alignRight: '&#8677;',
          unorderedList: '&#8226;',
          orderedList: '1.',
          fontFamily: 'fontFamily',
          fontSize: 'fontSize',
          fontColor: 'A',
          subscript: 'X<sub>2</sub>',
          superscript: 'X<sup>2</sup>',
          justify: '&#8644;',
          insert_table: '&#8866;',
          insert_layout: '&#10064;',
          heading: 'H',
          image: '&#128247;',
          colors: '&#127912;',
        },
        h = [
          { feature: 'alignLeft', id: 'alignLeft', icon: u.left_align },
          { feature: 'alignCenter', id: 'alignCenter', icon: u.center_align },
          { feature: 'alignRight', id: 'alignRight', icon: u.right_align },
          {
            feature: 'unorderedList',
            id: 'unorderedList',
            icon: u.bullet_list,
          },
          { feature: 'orderedList', id: 'orderedList', icon: u.numbered_list },
          { feature: 'hyperlink', id: 'hyperlink', icon: u.hyperlink },
        ],
        g = (t, e) => {
          const n = document.createElement('select');
          return (
            (n.dataset.action = t),
            (n.id = t),
            e.forEach(t => {
              const e = document.createElement('option');
              (e.value = t), (e.textContent = t), n.appendChild(e);
            }),
            n
          );
        };
      e.features.forEach(t => {
        if ('fontFamily' === t) {
          const t = g(r.FONT_FAMILY_SELECT_ID, o);
          a.appendChild(t);
        } else if ('fontSize' === t) {
          const t = g(r.FONT_SIZE_SELECT_ID, s);
          a.appendChild(t);
        } else if ('fontColor' === t) {
          if (document.getElementById(r.FONT_COLOR_WRAPPER_ID)) return;
          const t = document.createElement('span');
          (t.id = r.FONT_COLOR_WRAPPER_ID),
            (t.style.display = 'inline-block'),
            (t.style.marginRight = '8px');
          const e = document.createElement('button');
          (e.id = r.FONT_COLOR_ID),
            (e.type = 'button'),
            (e.textContent = 'A'),
            t.appendChild(e);
          const n = document.createElement('span');
          (n.id = r.FONT_COLOR_PICKER_WRAPPER_ID), (n.style.display = 'hidden');
          const i = document.createElement('input');
          (i.type = 'color'),
            (i.id = r.FONT_COLOR_PICKER_ID),
            i.setAttribute('data-action', 'fontColor'),
            (i.style.display = 'none'),
            n.appendChild(i);
          const o = document.createElement('button');
          (o.id = r.FONT_COLOR_RESET_ID),
            (o.type = 'button'),
            (o.textContent = '⟳'),
            (o.style.margin = '-10px'),
            (o.style.display = 'none'),
            (o.style.fontSize = 'x-small'),
            n.appendChild(o),
            t.appendChild(n),
            a.appendChild(t);
        } else if ('bgColor' === t) {
          if (document.getElementById(r.BG_COLOR_WRAPPER_ID)) return;
          const t = document.createElement('span');
          (t.id = r.BG_COLOR_WRAPPER_ID),
            (t.style.display = 'inline-block'),
            (t.style.marginRight = '8px');
          const e = document.createElement('button');
          (e.id = r.BG_COLOR_ID),
            (e.type = 'button'),
            (e.textContent = 'B'),
            t.appendChild(e);
          const n = document.createElement('div');
          (n.id = r.BG_COLOR_PICKER_WRAPPER_ID),
            (n.style.display = 'block'),
            (n.style.margin = '0');
          const i = document.createElement('input');
          i.setAttribute('data-action', 'bgColor'),
            (i.value = '#ffffff'),
            (i.type = 'color'),
            (i.id = r.BG_COLOR_PICKER_ID),
            (i.style.display = 'none'),
            n.appendChild(i);
          const o = document.createElement('button');
          (o.id = r.BG_COLOR_RESET_ID),
            (o.type = 'button'),
            (o.textContent = '⟳'),
            (o.style.margin = '-10px'),
            (o.style.display = 'none'),
            (o.style.fontSize = 'x-small'),
            n.appendChild(o),
            t.appendChild(n),
            a.appendChild(t);
        } else if ('getHtmlContent' === t) {
          const t = document.createElement('button');
          (t.id = r.GET_HTML_BUTTON_ID),
            (t.type = 'button'),
            (t.textContent = 'Get HTML'),
            (t.style.padding = '8px 12px'),
            (t.style.marginRight = '8px'),
            (t.style.border = '1px solid #ccc'),
            (t.style.borderRadius = '4px'),
            (t.style.cursor = 'pointer'),
            (t.style.background = '#f4f4f4'),
            a.appendChild(t);
        } else if ('loadHtmlContent' === t) {
          const t = document.createElement('button');
          (t.id = r.LOAD_HTML_BUTTON_ID),
            (t.type = 'button'),
            (t.textContent = 'Load HTML'),
            (t.style.padding = '8px 12px'),
            (t.style.marginRight = '8px'),
            (t.style.border = '1px solid #ccc'),
            (t.style.borderRadius = '4px'),
            (t.style.cursor = 'pointer'),
            (t.style.background = '#f4f4f4'),
            a.appendChild(t);
        } else if (h.map(t => t.feature).includes(t)) {
          const e = h.find(e => e.feature === t),
            n = document.createElement('button');
          (n.id = t),
            (n.dataset.action = t),
            (n.innerHTML = (null == e ? void 0 : e.icon) || ''),
            a.appendChild(n);
        } else {
          const e = document.createElement('button');
          (e.dataset.action = t),
            (e.innerHTML = c[t] || t),
            (e.id = t),
            (e.title = t
              .split('_')
              .map(t => t.charAt(0).toUpperCase() + t.slice(1))
              .join(' ')),
            a.appendChild(e);
        }
      });
      const p = document.createElement('div');
      (p.id = r.HYPERLINK_CONTAINER_ID), (p.style.display = 'none');
      const m = document.createElement('input');
      (m.type = 'text'),
        (m.id = r.HYPERLINK_INPUT_ID),
        (m.placeholder = r.HYPERLINK_PLACEHOLDER);
      const f = document.createElement('button');
      (f.id = r.HYPERLINK_APPLY_BTN_ID), (f.textContent = 'Link');
      const b = document.createElement('button');
      (b.id = r.HYPERLINK_CANCEL_BTN_ID),
        (b.textContent = 'Unlink'),
        p.appendChild(m),
        p.appendChild(f),
        p.appendChild(b),
        a.appendChild(p);
      const y = document.createElement('div');
      (y.id = r.VIEW_HYPERLINK_CONTAINER_ID), (y.style.display = 'none');
      const I = document.createElement('span');
      (I.id = r.VIEW_HYPERLINK_LABEL_ID), (I.innerHTML = 'Visit URL : ');
      const k = document.createElement('a');
      return (
        (k.id = r.VIEW_HYPERLINK_ANCHOR_ID),
        (k.href = ''),
        (k.target = '_blank'),
        y.appendChild(I),
        y.appendChild(k),
        a.appendChild(y),
        { mainEditorId: n, toolbarId: i }
      );
    })(t, i);
    if (
      ((this.editorContainer = document.getElementById(v) || null),
      (this.toolbarContainer = document.getElementById(E) || null),
      !this.editorContainer || !this.toolbarContainer)
    )
      throw new Error('Editor element not found or incorrect element type.');
    (this.document = new n()),
      (this.editorView = new l(this.editorContainer, this.document)),
      (this.toolbarView = new a(this.toolbarContainer)),
      (this.hyperlinkHandler = new d(
        this.editorContainer,
        this.editorView,
        this.document
      )),
      (this.imageHandler = new p(this.editorContainer, this.document)),
      (this.undoRedoManager = new m(this.document, this.editorView)),
      this.editorView.setImageHandler(this.imageHandler),
      this.imageHandler.setEditorView(this.editorView),
      this.document.setEditorView(this.editorView),
      this.document.setUndoRedoManager(this.undoRedoManager),
      this.hyperlinkHandler.setUndoRedoManager(this.undoRedoManager),
      (this.currentAttributes = {
        bold: !1,
        italic: !1,
        underline: !1,
        undo: !1,
        redo: !1,
        hyperlink: !1,
      }),
      (this.manualOverride = !1),
      (this.lastPiece = null),
      this.toolbarView.on('toolbarAction', (t, e = []) =>
        this.handleToolbarAction(t, e)
      ),
      this.document.on('documentChanged', () => this.editorView.render()),
      this.editorContainer.addEventListener('keydown', t => {
        this.syncCurrentAttributesWithCursor(), this.handleKeydown(t);
      }),
      this.editorContainer.addEventListener('keyup', () =>
        this.syncCurrentAttributesWithCursor()
      ),
      this.editorContainer.addEventListener('blur', () => {
        this.hyperlinkHandler.hideHyperlinkViewButton();
      }),
      document.addEventListener('mouseup', () => {
        this.syncCurrentAttributesWithCursor();
        const t = this.document.getAllSelectedDataIds();
        console.log(t, 'dataId lntgerr');
      }),
      null === (o = document.getElementById('fontColor')) ||
        void 0 === o ||
        o.addEventListener('click', t => {
          const e = document.getElementById('fontColorPicker');
          e.style.display = 'inline';
          const n = document.getElementById('colorWrapper'),
            i = t.target.getBoundingClientRect(),
            o = i.left + window.scrollX,
            s = i.bottom + window.scrollY,
            l = document.getElementById('colorResetFont');
          (l.style.display = 'inline-block'),
            l.addEventListener('click', () => {
              (e.value = '#000000'), (l.style.display = 'none');
            }),
            (n.style.position = 'absolute'),
            (n.style.left = o - 2 + 'px'),
            (n.style.top = s - 15 + 'px'),
            (n.style.display = 'block'),
            e.click(),
            e &&
              e.addEventListener('input', t => {
                const e = t.target.value,
                  [n, i] = this.getSelectionRange();
                this.document.dataIds.length > 1
                  ? this.document.blocks.forEach(t => {
                      if (this.document.dataIds.includes(t.dataId)) {
                        this.document.selectedBlockId = t.dataId;
                        let i = 0;
                        t.pieces.forEach(t => {
                          i += t.text.length;
                        });
                        let o = n - i;
                        this.document.applyFontColor(o, i, e);
                      }
                    })
                  : (this.debounceTimer && clearTimeout(this.debounceTimer),
                    (this.debounceTimer = setTimeout(() => {
                      this.document.applyFontColor(n, i, e);
                    }, 300)));
              });
        }),
      document.addEventListener('click', t => {
        var e;
        const n = t.target;
        (null === (e = this.editorContainer) || void 0 === e
          ? void 0
          : e.contains(n)) ||
          n.closest('.hyperlink-popup') ||
          this.hyperlinkHandler.hideHyperlinkViewButton();
      }),
      null === (s = document.getElementById('bgColor')) ||
        void 0 === s ||
        s.addEventListener('click', t => {
          const e = document.getElementById('bgColorPicker');
          e.style.display = 'inline';
          const n = document.getElementById('colorBgWrapper'),
            i = t.target.getBoundingClientRect(),
            o = i.left + window.scrollX,
            s = i.bottom + window.scrollY,
            l = document.getElementById('colorResetBG');
          (l.style.display = 'inline-block'),
            l.addEventListener('click', () => {
              (e.value = '#ffffff'),
                (l.style.display = 'none'),
                console.log(s, 'resetb');
            }),
            (n.style.position = 'absolute'),
            (n.style.left = o - 2 + 'px'),
            (n.style.top = s - 15 + 'px'),
            (n.style.display = 'block'),
            e.click(),
            e &&
              e.addEventListener('input', t => {
                const e = t.target.value,
                  [n, i] = this.getSelectionRange();
                this.document.dataIds.length > 1
                  ? this.document.blocks.forEach(t => {
                      if (this.document.dataIds.includes(t.dataId)) {
                        this.document.selectedBlockId = t.dataId;
                        let i = 0;
                        t.pieces.forEach(t => {
                          i += t.text.length;
                        });
                        let o = n - i;
                        this.document.applyBgColor(o, i, e);
                      }
                    })
                  : (this.debounceTimer && clearTimeout(this.debounceTimer),
                    (this.debounceTimer = setTimeout(() => {
                      this.document.applyBgColor(n, i, e);
                    }, 300)));
              });
        }),
      null === (h = document.getElementById('getHtmlButton')) ||
        void 0 === h ||
        h.addEventListener('click', t => {
          const e = this.document.getHtmlContent();
          console.log('Editor HTML Content:', e),
            (this.htmlToJsonParser = new g(e));
          const n = this.htmlToJsonParser.parse();
          console.log('htmltoJson', JSON.stringify(n, null, 2), n);
        }),
      null === (f = document.getElementById('loadHtmlButton')) ||
        void 0 === f ||
        f.addEventListener('click', t => {
          this.undoRedoManager.saveUndoSnapshot();
          const e = r.TEST_HTML_CODE;
          (this.htmlToJsonParser = new g(e)),
            console.log(this.htmlToJsonParser, 'this.htmlToJsonParser');
          const n = this.htmlToJsonParser.parse();
          (this.document.blocks = n),
            (this.document.dataIds[0] = n[0].dataId),
            (this.document.selectedBlockId = 'data-id-1734604240404'),
            this.document.emit('documentChanged', this);
          const [i, o] = this.getSelectionRange();
          this.document.blocks.forEach(t => {
            if (this.document.dataIds.includes(t.dataId)) {
              this.document.selectedBlockId = t.dataId;
              let e = 0;
              t.pieces.forEach(t => {
                e += t.text.length;
              });
              let n = i - e;
              this.document.setFontSize(n, e, t.fontSize);
            }
          }),
            console.log(
              'blocks',
              this.document.blocks,
              this.document.dataIds,
              this.document.currentOffset
            ),
            console.log('htmltoJson', JSON.stringify(n, null, 2), n);
        }),
      null === (b = document.getElementById('fontFamily')) ||
        void 0 === b ||
        b.addEventListener('change', t => {
          this.undoRedoManager.saveUndoSnapshot();
          const e = t.target.value,
            [n, i] = this.getSelectionRange();
          this.document.dataIds.length > 1
            ? this.document.blocks.forEach(t => {
                if (this.document.dataIds.includes(t.dataId)) {
                  this.document.selectedBlockId = t.dataId;
                  let i = 0;
                  t.pieces.forEach(t => {
                    i += t.text.length;
                  });
                  let o = n - i;
                  this.document.setFontFamily(o, i, e);
                }
              })
            : this.document.setFontFamily(n, i, e);
        }),
      null === (y = document.getElementById('fontSize')) ||
        void 0 === y ||
        y.addEventListener('change', t => {
          this.undoRedoManager.saveUndoSnapshot();
          const e = t.target.value,
            [n, i] = this.getSelectionRange();
          this.document.dataIds.length > 1
            ? this.document.blocks.forEach(t => {
                if (this.document.dataIds.includes(t.dataId)) {
                  this.document.selectedBlockId = t.dataId;
                  let i = 0;
                  t.pieces.forEach(t => {
                    i += t.text.length;
                  });
                  let o = n - i;
                  this.document.setFontSize(o, i, e);
                }
              })
            : this.document.setFontSize(n, i, e);
        }),
      null === (I = document.getElementById('alignLeft')) ||
        void 0 === I ||
        I.addEventListener('click', () => {
          console.log('alignment alignLeft', this.document.dataIds),
            this.document.dataIds.forEach(t =>
              this.document.setAlignment('left', t)
            );
        }),
      null === (k = document.getElementById('alignCenter')) ||
        void 0 === k ||
        k.addEventListener('click', () => {
          console.log('alignment alignCenter', this.document.dataIds),
            this.document.dataIds.forEach(t =>
              this.document.setAlignment('center', t)
            );
        }),
      null === (C = document.getElementById('alignRight')) ||
        void 0 === C ||
        C.addEventListener('click', () => {
          console.log('alignment alignRight', this.document.dataIds),
            this.document.dataIds.forEach(t =>
              this.document.setAlignment('right', t)
            );
        }),
      this.editorContainer.addEventListener('keydown', t => {
        if ((t.ctrlKey || t.metaKey) && !t.altKey) {
          const e = t.key.toLowerCase();
          if (['b', 'i', 'u', 'h'].includes(e)) {
            t.preventDefault();
            let n = 'b';
            switch (e) {
              case 'b':
                n = 'bold';
                break;
              case 'i':
                n = 'italic';
                break;
              case 'u':
                n = 'underline';
                break;
              case 'h':
                n = 'hyperlink';
            }
            this.handleToolbarAction(n);
          }
          if (
            ('z' === e
              ? (t.preventDefault(), this.undoRedoManager.undo())
              : 'y' === e && (t.preventDefault(), this.undoRedoManager.redo()),
            'a' === e)
          ) {
            const t = this.document.handleCtrlASelection();
            (this.document.selectAll = !0),
              console.log('Selected text is inside element with data-id:', t);
          }
          'l' === t.key
            ? (t.preventDefault(),
              this.document.setAlignment('left', this.document.selectedBlockId))
            : 'e' === t.key
              ? (t.preventDefault(),
                this.document.setAlignment(
                  'center',
                  this.document.selectedBlockId
                ))
              : 'r' === t.key &&
                (t.preventDefault(),
                this.document.setAlignment(
                  'right',
                  this.document.selectedBlockId
                ));
        }
      }),
      document.addEventListener(
        'selectionchange',
        this.handleSelectionChange.bind(this)
      ),
      this.document.emit('documentChanged', this.document),
      this.editorContainer.addEventListener('paste', t => {
        var n, i;
        this.undoRedoManager.saveUndoSnapshot(), t.preventDefault();
        const o =
            null === (n = t.clipboardData) || void 0 === n
              ? void 0
              : n.getData('text/html'),
          [s, l] = this.getSelectionRange();
        l > s && this.document.deleteRange(s, l);
        let a = [];
        if (o) a = c(o);
        else {
          const n =
            (null === (i = t.clipboardData) || void 0 === i
              ? void 0
              : i.getData('text/plain')) || '';
          a = [new e(n, Object.assign({}, this.currentAttributes))];
        }
        let r = s;
        for (const t of a)
          this.document.insertAt(
            t.text,
            Object.assign({}, t.attributes),
            r,
            this.document.selectedBlockId
          ),
            (r += t.text.length);
        this.setCursorPosition(r);
      }),
      this.editorContainer.addEventListener('dragover', t => {
        t.preventDefault();
      }),
      this.editorContainer.addEventListener('drop', t => {
        var n, i;
        t.preventDefault();
        const o =
            null === (n = t.dataTransfer) || void 0 === n
              ? void 0
              : n.getData('text/html'),
          [s, l] = this.getSelectionRange();
        l > s && this.document.deleteRange(s, l);
        let a = [];
        if (o) a = c(o);
        else {
          const n =
            (null === (i = t.dataTransfer) || void 0 === i
              ? void 0
              : i.getData('text/plain')) || '';
          a = [new e(n, Object.assign({}, this.currentAttributes))];
        }
        let r = s;
        for (const t of a)
          this.document.insertAt(
            t.text,
            Object.assign({}, t.attributes),
            r,
            this.document.selectedBlockId
          ),
            (r += t.text.length);
        this.setCursorPosition(r);
      });
  }
  getSelectionRange() {
    const t = i(this.editorView.container);
    return t ? [t.start, t.end] : [0, 0];
  }
  applyFontColor(t) {
    const e = window.getSelection();
    if (!e || 0 === e.rangeCount) return;
    e.getRangeAt(0).toString();
  }
  handleToolbarAction(t, e = []) {
    const [n, i] = this.getSelectionRange();
    switch (t) {
      case 'orderedList':
        this.document.dataIds.forEach(t => {
          this.document.toggleOrderedList(t);
        }),
          this.document.updateOrderedListNumbers();
        break;
      case 'unorderedList':
        this.document.dataIds.forEach(t => {
          this.document.toggleUnorderedList(t);
        });
        break;
      case 'image':
        this.imageHandler.insertImage();
        break;
      default:
        if (n < i)
          switch ((this.undoRedoManager.saveUndoSnapshot(), t)) {
            case 'bold':
              this.document.dataIds.length > 1
                ? this.document.blocks.forEach(t => {
                    if (this.document.dataIds.includes(t.dataId)) {
                      this.document.selectedBlockId = t.dataId;
                      let e = 0;
                      t.pieces.forEach(t => {
                        e += t.text.length;
                      });
                      let i = n - e;
                      this.document.toggleBoldRange(i, e);
                    }
                  })
                : this.document.toggleBoldRange(n, i);
              break;
            case 'italic':
              this.document.dataIds.length > 1
                ? this.document.blocks.forEach(t => {
                    if (this.document.dataIds.includes(t.dataId)) {
                      this.document.selectedBlockId = t.dataId;
                      let e = 0;
                      t.pieces.forEach(t => {
                        e += t.text.length;
                      });
                      let i = n - e;
                      this.document.toggleItalicRange(i, e);
                    }
                  })
                : this.document.toggleItalicRange(n, i);
              break;
            case 'underline':
              this.document.dataIds.length > 1
                ? this.document.blocks.forEach(t => {
                    if (this.document.dataIds.includes(t.dataId)) {
                      this.document.selectedBlockId = t.dataId;
                      let e = 0;
                      t.pieces.forEach(t => {
                        e += t.text.length;
                      });
                      let i = n - e;
                      this.document.toggleUnderlineRange(i, e);
                    }
                  })
                : this.document.toggleUnderlineRange(n, i);
              break;
            case 'hyperlink':
              this.hyperlinkHandler.hanldeHyperlinkClick(
                n,
                i,
                this.document.currentOffset,
                this.document.selectedBlockId,
                this.document.blocks
              );
          }
        else
          (this.currentAttributes[t] = !this.currentAttributes[t]),
            (this.manualOverride = !0);
    }
    this.toolbarView.updateActiveStates(this.currentAttributes);
  }
  handleSelectionChange() {
    var t, e;
    const n = window.getSelection();
    if (
      !n ||
      0 === n.rangeCount ||
      !(null === (t = this.editorContainer) || void 0 === t
        ? void 0
        : t.contains(n.anchorNode))
    )
      return void this.hyperlinkHandler.hideHyperlinkViewButton();
    const [i] = this.getSelectionRange();
    if (
      ((this.imageHandler.currentCursorLocation = i),
      n.isCollapsed
        ? (this.document.dataIds = [])
        : this.document.getAllSelectedDataIds(),
      !n || 0 === n.rangeCount)
    )
      return;
    n && !0 === n.isCollapsed && (this.document.dataIds = []);
    const o = n.getRangeAt(0),
      s =
        (null === (e = o.startContainer.parentElement) || void 0 === e
          ? void 0
          : e.closest('[data-id]')) || o.startContainer;
    s instanceof HTMLElement &&
      (this.document.selectedBlockId =
        s.getAttribute('data-id') ||
        (o.startContainer instanceof HTMLElement
          ? o.startContainer.getAttribute('data-id')
          : null)),
      this.syncCurrentAttributesWithCursor();
  }
  handleKeydown(t) {
    const [n, i] = this.getSelectionRange();
    this.imageHandler.currentCursorLocation = n;
    let o = i;
    if ('Enter' === t.key) {
      t.preventDefault();
      const i = `data-id-${Date.now()}`,
        s = this.document.blocks.findIndex(
          t => t.dataId === this.document.selectedBlockId
        ),
        l = this.document.blocks[s];
      if (l && 'image' === l.type)
        this.document.blocks.splice(s + 1, 0, {
          dataId: i,
          class: 'paragraph-block',
          pieces: [new e(' ')],
          type: 'text',
        }),
          this.document.emit('documentChanged', this),
          console.log('image - vicky', i),
          this.imageHandler.setCursorPostion(1, i);
      else if (
        !l ||
        ('ol' !== l.listType && 'ul' !== l.listType && 'li' !== l.listType)
      )
        if (null !== this.getCurrentCursorBlock()) {
          const { remainingText: t, piece: s } = this.extractTextFromDataId(
              this.getCurrentCursorBlock().toString()
            ),
            l = ' ' + t;
          let a = this.document.blocks;
          if (l.length > 0) {
            const r = t.split(' ');
            let d = [];
            '' !== r[0] || void 0 !== r[1]
              ? 1 === s.length
                ? (d = [new e(l, s[0].attributes)])
                : (d.push(new e(' ' + r[0] + ' ', s[0].attributes)),
                  s.length >= 2 &&
                    s.forEach((t, e) => {
                      0 !== e && d.push(t);
                    }))
              : (d = [new e(' ')]),
              (a = this.addBlockAfter(
                this.document.blocks,
                this.getCurrentCursorBlock().toString(),
                { dataId: i, class: 'paragraph-block', pieces: d, type: 'text' }
              )),
              (o = n + l.length - 1);
          } else
            a = this.addBlockAfter(
              this.document.blocks,
              this.getCurrentCursorBlock().toString(),
              {
                dataId: i,
                class: 'paragraph-block',
                pieces: [new e(' ')],
                type: 'text',
              }
            );
          this.document.blocks = a;
        } else
          this.document.blocks.push({
            dataId: i,
            class: 'paragraph-block',
            pieces: [new e(' ')],
            type: 'text',
          });
      else {
        let t = {
            dataId: i,
            class: 'paragraph-block',
            pieces: [new e(' ')],
            type: 'text',
          },
          n = '';
        if (
          ('ol' === l.listType
            ? ((t.listType = 'li'),
              (t.listStart = l.listStart + 1),
              (t.parentId = l.dataId),
              (n = l.dataId))
            : 'li' === l.listType
              ? ((t.listType = 'li'),
                (t.listStart = l.listStart + 1),
                (t.parentId = l.parentId),
                (n = l.parentId))
              : 'ul' === l.listType &&
                ((t.listType = 'ul'), (t.parentId = l.parentId || l.dataId)),
          this.document.blocks.splice(s + 1, 0, t),
          'ol' === l.listType || 'li' === l.listType)
        )
          for (let t = s + 2; t < this.document.blocks.length; t++) {
            const e = this.document.blocks[t];
            if ('li' !== e.listType || e.parentId !== n) break;
            e.listStart += 1;
          }
      }
      this.syncCurrentAttributesWithCursor(),
        this.editorView.render(),
        this.setCursorPosition(o + 1, i),
        o > n &&
          this.document.deleteRange(
            n,
            o,
            this.document.selectedBlockId,
            this.document.currentOffset
          );
    } else if ('Backspace' === t.key) {
      if ((t.preventDefault(), this.imageHandler.isImageHighlighted)) {
        const t = this.document.blocks.findIndex(
          t => t.dataId === this.imageHandler.highLightedImageDataId
        );
        return (
          this.imageHandler.deleteImage(),
          void this.imageHandler.setCursorPostion(
            1,
            this.document.blocks[t - 1].dataId
          )
        );
      }
      const e = window.getSelection();
      if (
        (console.log(e, 'selection lntgerr'),
        this.document.dataIds.length >= 1 &&
          this.document.selectAll &&
          (this.document.deleteBlocks(), this.setCursorPosition(n + 1)),
        n === i && n > 0)
      ) {
        this.document.deleteRange(
          n - 1,
          n,
          this.document.selectedBlockId,
          this.document.currentOffset
        ),
          this.setCursorPosition(n - 1);
        const t = this.document.blocks.findIndex(
          t => t.dataId === this.document.selectedBlockId
        );
        console.log(t, 'index lntgerr');
        if (
          null ===
          document.querySelector(`[data-id="${this.document.selectedBlockId}"]`)
        ) {
          let t = 0;
          console.log(t, ' listStart lntgerr');
          const e = this.document.blocks.map(
            (e, n) => (
              (void 0 === (null == e ? void 0 : e.listType) &&
                null === (null == e ? void 0 : e.listType)) ||
                ('ol' === (null == e ? void 0 : e.listType)
                  ? ((t = 1), (e.listStart = 1))
                  : 'li' === (null == e ? void 0 : e.listType) &&
                    ((t += 1), (e.listStart = t))),
              e
            )
          );
          console.log(e, 'blocks lntgerr'),
            this.document.emit('documentChanged', this);
        }
      } else
        i > n &&
          (this.document.deleteRange(
            n,
            i,
            this.document.selectedBlockId,
            this.document.currentOffset
          ),
          this.setCursorPosition(n + 1));
    } else
      1 !== t.key.length || t.ctrlKey || t.metaKey || t.altKey
        ? 'Delete' === t.key &&
          (t.preventDefault(),
          n === i
            ? (this.document.deleteRange(
                n,
                n + 1,
                this.document.selectedBlockId
              ),
              this.setCursorPosition(n))
            : i > n &&
              (this.document.deleteRange(n, i, this.document.selectedBlockId),
              this.setCursorPosition(n)))
        : (t.preventDefault(),
          i > n &&
            this.document.deleteRange(
              n,
              i,
              this.document.selectedBlockId,
              this.document.currentOffset
            ),
          console.log(
            'insertat',
            t.key,
            this.currentAttributes,
            n,
            this.document.selectedBlockId,
            this.document.currentOffset,
            '',
            '',
            !t.isTrusted || !1
          ),
          this.document.insertAt(
            t.key,
            this.currentAttributes,
            n,
            this.document.selectedBlockId,
            this.document.currentOffset,
            '',
            '',
            !t.isTrusted || !1
          ),
          this.setCursorPosition(n + 1));
    this.hyperlinkHandler.hideHyperlinkViewButton();
  }
  extractTextFromDataId(t) {
    const e = window.getSelection();
    if ((console.log('selection::', e), !e || 0 === e.rangeCount))
      return { remainingText: '', piece: null };
    const n = e.getRangeAt(0).startContainer;
    let i = '';
    console.log(0, 'count lntgerr');
    const o = this.document.blocks.filter(e => {
        if (e.dataId === t) return e;
      }),
      s = document.querySelector(`[data-id="${t}"]`),
      l = this.document.getCursorOffsetInParent(`[data-id="${t}"]`);
    let a = [],
      r = 0;
    if (
      (o[0].pieces.forEach((t, e) => {
        (i += t.text),
          (null == l ? void 0 : l.innerText) === t.text && ((r = e), a.push(t));
      }),
      o[0].pieces.length > 1 &&
        o[0].pieces.forEach((t, e) => {
          r < e && a.push(t);
        }),
      !s)
    )
      return (
        console.error(`Element with data-id "${t}" not found.`),
        { remainingText: '', piece: null }
      );
    if (!s.contains(n))
      return (
        console.error(`Cursor is not inside the element with data-id "${t}".`),
        { remainingText: '', piece: null }
      );
    const d = i,
      c = null == l ? void 0 : l.offset,
      h = d.slice(c),
      u = d.slice(0, c);
    return (s.textContent = u), { remainingText: h, piece: a };
  }
  getCurrentCursorBlock() {
    const t = window.getSelection();
    if (!t || 0 === t.rangeCount) return null;
    const e = t.getRangeAt(0).startContainer,
      n = e.nodeType === Node.TEXT_NODE ? e.parentElement : e,
      i = null == n ? void 0 : n.closest('[data-id]');
    return (null == i ? void 0 : i.getAttribute('data-id')) || null;
  }
  addBlockAfter(t, e, n) {
    const i = t.findIndex(t => t.dataId === e);
    if (-1 === i)
      return console.error(`Block with dataId "${e}" not found.`), t;
    return [...t.slice(0, i + 1), n, ...t.slice(i + 1)];
  }
  syncCurrentAttributesWithCursor() {
    var t;
    const [e, n] = this.getSelectionRange();
    console.log('log1', { start: e, end: n });
    const i = this.document.blocks.findIndex(
      t => t.dataId === this.document.selectedBlockId
    );
    if (
      ('image' ===
      (null === (t = this.document.blocks[i]) || void 0 === t ? void 0 : t.type)
        ? this.imageHandler.addStyleToImage(this.document.selectedBlockId || '')
        : this.imageHandler.isImageHighlighted &&
          this.imageHandler.clearImageStyling(),
      e === n)
    ) {
      const t = this.document.findPieceAtOffset(
        e,
        this.document.selectedBlockId
      );
      if (t) {
        t !== this.lastPiece &&
          ((this.manualOverride = !1), (this.lastPiece = t)),
          this.manualOverride ||
            ((this.currentAttributes = {
              bold: t.attributes.bold,
              italic: t.attributes.italic,
              underline: t.attributes.underline,
              hyperlink: t.attributes.hyperlink || !1,
              fontFamily: t.attributes.fontFamily,
              fontSize: t.attributes.fontSize,
              fontColor: t.attributes.fontColor,
              bgColor: t.attributes.bgColor,
            }),
            this.toolbarView.updateActiveStates(this.currentAttributes));
        const e = null == t ? void 0 : t.attributes.hyperlink;
        e && 'string' == typeof e
          ? this.hyperlinkHandler.showHyperlinkViewButton(e)
          : this.hyperlinkHandler.hideHyperlinkViewButton();
      } else
        this.hyperlinkHandler.hideHyperlinkViewButton(),
          this.manualOverride ||
            ((this.currentAttributes = {
              bold: !1,
              italic: !1,
              underline: !1,
              hyperlink: !1,
            }),
            this.toolbarView.updateActiveStates(this.currentAttributes)),
          (this.lastPiece = null);
    } else this.hyperlinkHandler.hideHyperlinkViewButton();
  }
  setCursorPosition(t, e = '') {
    if ('' === e) this.editorView.container.focus();
    else {
      document.querySelector('[data-id="' + e + '"]').focus();
    }
    const n = window.getSelection();
    if (!n) return;
    const i = document.createRange();
    let o = 0;
    const s = [this.editorView.container];
    let l;
    for (; (l = s.pop()); )
      if (3 === l.nodeType) {
        const e = l,
          n = o + e.length;
        if (t >= o && t <= n) {
          i.setStart(e, t - o), i.collapse(!0);
          break;
        }
        o = n;
      } else if ('BR' === l.tagName) {
        if (t === o) {
          i.setStartBefore(l), i.collapse(!0);
          break;
        }
        o++;
      } else {
        const t = l;
        let e = t.childNodes.length;
        for (; e--; ) s.push(t.childNodes[e]);
      }
    n.removeAllRanges(), n.addRange(i);
  }
}
(window.TextIgniter = f), (exports.TextIgniter = f);

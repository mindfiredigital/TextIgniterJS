var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../core/dist/index.js
var require_dist = __commonJS({
  "../core/dist/index.js"(exports, module) {
    "use strict";
    !(function(t, e) {
      "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).TextIgniter = {});
    })(exports, function(t) {
      "use strict";
      class e {
        constructor() {
          this.events = {};
        }
        on(t2, e2) {
          this.events[t2] || (this.events[t2] = []), this.events[t2].push(e2);
        }
        emit(t2, e2) {
          this.events[t2] && this.events[t2].forEach((t3) => t3(e2));
        }
      }
      class n {
        constructor(t2, e2 = {}) {
          this.text = t2;
          const n2 = document.getElementById("fontFamily"), i2 = document.getElementById("fontSize");
          let o2 = "Arial", s2 = "16px", l2 = document.getElementById("fontColorPicker"), r2 = document.getElementById("bgColorPicker");
          n2 && (o2 = n2.value), i2 && (s2 = i2.value);
          const a2 = e2.fontColor || (l2 ? l2.value : "#000000"), d2 = e2.bgColor || (r2 ? r2.value : "#ffffff");
          this.attributes = { bold: e2.bold || false, italic: e2.italic || false, underline: e2.underline || false, strikethrough: e2.strikethrough || false, undo: e2.undo || false, redo: e2.redo || false, fontFamily: e2.fontFamily || o2, fontSize: e2.fontSize || s2, hyperlink: e2.hyperlink || false, fontColor: a2, bgColor: d2 };
        }
        isBold() {
          return this.attributes.bold;
        }
        setBold(t2) {
          this.attributes.bold = t2;
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
        setItalic(t2) {
          this.attributes.italic = t2;
        }
        isUnderline() {
          return this.attributes.underline;
        }
        setUnderline(t2) {
          this.attributes.underline = t2;
        }
        isStrikethrough() {
          return this.attributes.strikethrough || false;
        }
        setStrikethrough(t2) {
          this.attributes.strikethrough = t2;
        }
        setUndo(t2) {
          this.attributes.undo = t2;
        }
        setRedo(t2) {
          this.attributes.redo = t2;
        }
        clone() {
          return new n(this.text, Object.assign({}, this.attributes));
        }
        hasSameAttributes(t2) {
          return this.attributes.bold === t2.attributes.bold && this.attributes.italic === t2.attributes.italic && this.attributes.underline === t2.attributes.underline && (this.attributes.strikethrough || false) === (t2.attributes.strikethrough || false) && this.attributes.undo === t2.attributes.undo && this.attributes.redo === t2.attributes.redo && this.attributes.fontFamily === t2.attributes.fontFamily && this.attributes.fontSize === t2.attributes.fontSize && this.attributes.italic === t2.attributes.italic && this.attributes.underline === t2.attributes.underline && this.attributes.hyperlink === t2.attributes.hyperlink && this.attributes.fontColor === t2.attributes.fontColor && this.attributes.bgColor === t2.attributes.bgColor;
        }
        getHyperlink() {
          return this.attributes.hyperlink || false;
        }
        setHyperlink(t2) {
          this.attributes.hyperlink = t2;
        }
      }
      class i extends e {
        get selectedBlockId() {
          return this._selectedBlockId;
        }
        set selectedBlockId(t2) {
          if (this._selectedBlockId !== t2) {
            this._selectedBlockId = t2;
            const e2 = this.getCursorOffset(document.querySelector('[id="editor"]')), n2 = this.getCursorOffset(document.querySelector('[data-id="' + t2 + '"]'));
            this.currentOffset = e2 - n2;
          }
        }
        constructor() {
          super(), this.dataIds = [], this.selectAll = false, this._selectedBlockId = null, this.pieces = [new n("")], this.blocks = [{ type: "text", dataId: "data-id-1734604240404", class: "paragraph-block", alignment: "left", pieces: [new n("\u200B")] }], this.selectedBlockId = "data-id-1734604240404", this.currentOffset = 0;
        }
        setEditorView(t2) {
          this.editorView = t2;
        }
        getPlainText() {
          return this.pieces.map((t2) => t2.text).join("");
        }
        setUndoRedoManager(t2) {
          this.undoRedoManager = t2;
        }
        insertAt(t2, e2, i2, o2 = "", s2 = 0, l2 = "", r2 = "", a2 = false) {
          a2 || "batch" === r2 || this.undoRedoManager.saveUndoSnapshot(), console.log("inserted,", { start: i2, text: t2 }), console.log("inserted,", this.blocks);
          let d2 = 0, c2 = [], h2 = false, u2 = 0;
          "" !== o2 && null !== o2 && (u2 = this.blocks.findIndex((t3) => t3.dataId === o2), d2 = this.currentOffset);
          for (let o3 of this.blocks[u2].pieces) {
            const s3 = d2 + o3.text.length;
            if (!h2 && i2 <= s3) {
              const s4 = i2 - d2;
              s4 > 0 && c2.push(new n(o3.text.slice(0, s4), Object.assign({}, o3.attributes))), c2.push(new n(t2, { bold: e2.bold || false, italic: e2.italic || false, underline: e2.underline || false, strikethrough: e2.strikethrough || false, hyperlink: e2.hyperlink || false })), s4 < o3.text.length && c2.push(new n(o3.text.slice(s4), Object.assign({}, o3.attributes))), h2 = true;
            } else c2.push(o3.clone());
            d2 = s3;
          }
          if (!h2) {
            const i3 = c2[c2.length - 1];
            i3 && i3.hasSameAttributes(new n("", { bold: e2.bold || false, italic: e2.italic || false, underline: e2.underline || false, strikethrough: e2.strikethrough || false, hyperlink: e2.hyperlink || false })) ? i3.text += t2 : c2.push(new n(t2, { bold: e2.bold || false, italic: e2.italic || false, underline: e2.underline || false, strikethrough: e2.strikethrough || false, hyperlink: e2.hyperlink || false }));
          }
          let p2 = this.mergePieces(c2);
          this.blocks[u2].pieces = p2, console.log({ position: i2 }), this.emit("documentChanged", this);
        }
        deleteRange(t2, e2, i2 = "", o2 = 0, s2 = false) {
          if (console.log("deleted2,", { start: t2, end: e2 }), t2 === e2) return;
          let l2 = [], r2 = 0, a2 = 0, d2 = false;
          if ("" !== i2 && null !== i2) {
            if (a2 = this.blocks.findIndex((t3) => t3.dataId === i2), -1 === a2) return;
            r2 = o2;
          }
          let c2 = -1;
          if (s2 && t2 === r2 && a2 > 0 && e2 === t2 && (c2 = a2 - 1 >= 0 && "image" === this.blocks[a2 - 1].type ? a2 - 2 : a2 - 1, c2 >= 0 && this.blocks[c2])) for (let t3 of this.blocks[c2].pieces) l2.push(t3.clone()), d2 = true;
          for (let i3 of this.blocks[a2].pieces) {
            const o3 = r2 + i3.text.length, s3 = r2;
            if (o3 <= t2 || s3 >= e2) l2.push(i3.clone());
            else {
              const r3 = i3.text;
              if (t2 > s3) {
                const e3 = r3.slice(0, t2 - s3);
                e3.length > 0 && l2.push(new n(e3, Object.assign({}, i3.attributes)));
              }
              if (e2 < o3) {
                const t3 = r3.slice(e2 - s3);
                t3.length > 0 && l2.push(new n(t3, Object.assign({}, i3.attributes)));
              }
            }
            r2 = o3;
          }
          let h2 = this.mergePieces(l2), u2 = false;
          d2 && c2 >= 0 ? (!this.blocks[a2] || "ol" !== this.blocks[a2].listType && "li" !== this.blocks[a2].listType || (u2 = true), this.blocks[c2].pieces = h2, this.blocks.splice(a2, 1)) : 0 === h2.length ? this.blocks.length > 1 ? (!this.blocks[a2] || "ol" !== this.blocks[a2].listType && "li" !== this.blocks[a2].listType || (u2 = true), this.blocks.splice(a2, 1)) : (h2 = [new n(" ")], this.blocks[a2].pieces = h2) : this.blocks[a2].pieces = h2, u2 && this.updateOrderedListNumbers(), this.emit("documentChanged", this);
        }
        deleteBlocks() {
          const t2 = this.blocks.some((t3) => this.dataIds.includes(t3.dataId) && ("ol" === t3.listType || "li" === t3.listType));
          this.blocks = this.blocks.filter((t3) => {
            if (!this.dataIds.includes(t3.dataId)) return t3;
          }), this.dataIds = [], this.selectAll = false, 0 === this.blocks.length && this.blocks.push({ dataId: `data-id-${Date.now()}`, class: "paragraph-block", type: "text", pieces: [new n("\u200B")] }), t2 && this.updateOrderedListNumbers(), this.emit("documentChanged", this);
        }
        getSelectedTextDataId() {
          const t2 = window.getSelection();
          if (!t2 || 0 === t2.rangeCount) return null;
          const e2 = t2.getRangeAt(0).startContainer, n2 = (e2.nodeType === Node.TEXT_NODE ? e2.parentElement : e2).closest("[data-id]");
          return (null == n2 ? void 0 : n2.getAttribute("data-id")) || null;
        }
        getAllSelectedDataIds() {
          var t2;
          const e2 = window.getSelection();
          if (!e2 || 0 === e2.rangeCount) return [];
          const n2 = e2.getRangeAt(0), i2 = [], o2 = document.createNodeIterator(n2.commonAncestorContainer, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
          let s2;
          for (; s2 = o2.nextNode(); ) if (n2.intersectsNode(s2)) {
            const e3 = s2.nodeType === Node.TEXT_NODE ? s2.parentElement : s2, n3 = null === (t2 = null == e3 ? void 0 : e3.closest("[data-id]")) || void 0 === t2 ? void 0 : t2.getAttribute("data-id");
            n3 && !i2.includes(n3) && i2.push(n3);
          }
          return this.removeExclusiveEndBlock(n2, i2), this.dataIds = i2, console.log("selected id 3", this.dataIds, i2), i2;
        }
        handleCtrlASelection() {
          const t2 = [], e2 = document.getElementById("editor");
          if (e2) {
            e2.querySelectorAll("[data-id]").forEach((e3) => {
              const n2 = e3.getAttribute("data-id");
              n2 && !t2.includes(n2) && t2.push(n2);
            });
          }
          return this.dataIds = t2, console.log("selected id 2", this.dataIds, t2), t2;
        }
        getSelectedDataIds() {
          const t2 = window.getSelection();
          if (!t2 || 0 === t2.rangeCount) return [];
          const e2 = t2.getRangeAt(0), n2 = [], i2 = e2.startContainer, o2 = e2.endContainer, s2 = this.getDataIdFromNode(i2), l2 = this.getDataIdFromNode(o2);
          return s2 && !n2.includes(s2) && n2.push(s2), l2 && !n2.includes(l2) && n2.push(l2), this.removeExclusiveEndBlock(e2, n2), this.dataIds = n2, console.log("selected id 1", this.dataIds, n2), n2;
        }
        getDataIdFromNode(t2) {
          var e2;
          const n2 = t2.nodeType === Node.TEXT_NODE ? t2.parentElement : t2;
          return (null === (e2 = null == n2 ? void 0 : n2.closest("[data-id]")) || void 0 === e2 ? void 0 : e2.getAttribute("data-id")) || null;
        }
        getCursorOffset(t2) {
          const e2 = window.getSelection();
          if (!e2 || 0 === e2.rangeCount) return -1;
          const n2 = e2.getRangeAt(0);
          let i2 = 0;
          const o2 = (t3) => {
            if (t3 === n2.startContainer) return i2 += n2.startOffset, true;
            t3.nodeType === Node.TEXT_NODE && (i2 += (t3.textContent || "").length);
            for (const e3 of Array.from(t3.childNodes)) if (o2(e3)) return true;
            return false;
          };
          return o2(t2), i2;
        }
        formatAttribute(t2, e2, i2, o2) {
          console.log("formatAttribute", t2, e2, i2, o2);
          let s2 = [], l2 = 0, r2 = -1;
          if ("" !== this.selectedBlockId && null !== this.selectedBlockId) {
            if (r2 = this.blocks.findIndex((t3) => t3.dataId === this.selectedBlockId), -1 === r2) return;
            l2 = this.currentOffset;
          }
          for (let a3 of this.blocks[r2].pieces) {
            const r3 = l2 + a3.text.length;
            if (r3 <= t2 || l2 >= e2) s2.push(a3.clone());
            else {
              const r4 = l2, d2 = a3.text, c2 = Math.max(t2 - r4, 0), h2 = Math.min(e2 - r4, d2.length);
              c2 > 0 && s2.push(new n(d2.slice(0, c2), Object.assign({}, a3.attributes)));
              const u2 = new n(d2.slice(c2, h2), Object.assign({}, a3.attributes));
              ("bold" !== i2 && "italic" !== i2 && "underline" !== i2 && "strikethrough" !== i2 && "undo" !== i2 && "redo" !== i2 && "hyperlink" !== i2 || "boolean" != typeof o2) && ("fontFamily" !== i2 && "fontSize" !== i2 && "hyperlink" !== i2 && "fontColor" !== i2 && "bgColor" !== i2 || "string" != typeof o2) || (u2.attributes[i2] = o2), s2.push(u2), h2 < d2.length && s2.push(new n(d2.slice(h2), Object.assign({}, a3.attributes)));
            }
            l2 = r3;
          }
          const a2 = this.mergePieces(s2);
          this.blocks[r2].pieces = a2, this.emit("documentChanged", this);
        }
        toggleOrderedList(t2, e2 = "") {
          const n2 = this.blocks.findIndex((e3) => e3.dataId === t2);
          if (-1 === n2) return;
          const i2 = this.blocks[n2];
          "ol" === i2.listType || "li" === i2.listType ? (i2.listType = null, i2.listStart = void 0, i2.parentId = void 0) : (i2.listType = "ol", i2.listStart = 1, i2.parentId = i2.dataId), this.updateOrderedListNumbers(), this.emit("documentChanged", this);
        }
        toggleOrderedListForMultipleBlocks(t2) {
          if (0 === t2.length) return;
          const e2 = t2.sort((t3, e3) => this.blocks.findIndex((e4) => e4.dataId === t3) - this.blocks.findIndex((t4) => t4.dataId === e3));
          if (e2.every((t3) => {
            const e3 = this.blocks.find((e4) => e4.dataId === t3);
            return e3 && ("ol" === e3.listType || "li" === e3.listType);
          })) e2.forEach((t3) => {
            const e3 = this.blocks.find((e4) => e4.dataId === t3);
            e3 && (e3.listType = null, e3.listStart = void 0, e3.parentId = void 0);
          });
          else {
            const t3 = e2[0];
            e2.forEach((e3, n2) => {
              const i2 = this.blocks.find((t4) => t4.dataId === e3);
              i2 && (0 === n2 ? (i2.listType = "ol", i2.listStart = 1, i2.parentId = t3) : (i2.listType = "li", i2.listStart = n2 + 1, i2.parentId = t3));
            });
          }
          this.updateOrderedListNumbers(), this.emit("documentChanged", this);
        }
        toggleUnorderedList(t2) {
          const e2 = this.blocks.findIndex((e3) => e3.dataId === t2);
          if (-1 === e2) return;
          const n2 = this.blocks[e2];
          n2.listType = "ul" === n2.listType ? null : "ul", this.emit("documentChanged", this);
        }
        updateOrderedListNumbers() {
          let t2 = 1, e2 = null;
          for (let n2 = 0; n2 < this.blocks.length; n2++) {
            const i2 = this.blocks[n2];
            if ("ol" === i2.listType || "li" === i2.listType) {
              ("ol" === i2.listType || i2.parentId !== e2) && (t2 = 1, e2 = "ol" === i2.listType ? i2.dataId : i2.parentId), i2.listStart = t2, t2++;
            } else t2 = 1, e2 = null;
          }
          this.emit("documentChanged", this);
        }
        undo() {
          console.log("undo"), this.undoRedoManager.undo();
        }
        redo() {
          this.undoRedoManager.redo(), console.log("redo");
        }
        setCursorPosition(t2, e2 = "") {
          var n2;
          if ("" !== e2) {
            const t3 = document.querySelector(`[data-id="${e2}"]`);
            if (!t3) return void console.warn(`Element with data-id="${e2}" not found.`);
            setTimeout(() => t3.focus(), 0);
          } else this.editorView.container.focus();
          const i2 = window.getSelection();
          if (!i2) return;
          const o2 = document.createRange();
          let s2 = 0;
          const l2 = [this.editorView.container];
          let r2;
          const a2 = (null === (n2 = this.editorView.container.textContent) || void 0 === n2 ? void 0 : n2.length) || 0;
          if (!(t2 < 0 || t2 > a2)) {
            for (; r2 = l2.pop(); ) if (3 === r2.nodeType) {
              const e3 = r2, n3 = s2 + e3.length;
              if (t2 >= s2 && t2 <= n3) {
                o2.setStart(e3, Math.min(t2 - s2, e3.length)), o2.collapse(true);
                break;
              }
              s2 = n3;
            } else if ("BR" === r2.tagName) {
              if (t2 === s2) {
                o2.setStartBefore(r2), o2.collapse(true);
                break;
              }
              s2++;
            } else {
              const t3 = r2;
              let e3 = t3.childNodes.length;
              for (; e3--; ) l2.push(t3.childNodes[e3]);
            }
            i2.removeAllRanges(), i2.addRange(o2);
          }
        }
        toggleBoldRange(t2, e2, n2 = "") {
          const i2 = this.isRangeEntirelyAttribute(t2, e2, "bold");
          this.formatAttribute(t2, e2, "bold", !i2);
        }
        toggleItalicRange(t2, e2, n2 = "") {
          const i2 = this.isRangeEntirelyAttribute(t2, e2, "italic");
          this.formatAttribute(t2, e2, "italic", !i2);
        }
        toggleUnderlineRange(t2, e2, n2 = "") {
          const i2 = this.isRangeEntirelyAttribute(t2, e2, "underline");
          this.formatAttribute(t2, e2, "underline", !i2);
        }
        toggleStrikethroughRange(t2, e2, n2 = "") {
          const i2 = this.isRangeEntirelyAttribute(t2, e2, "strikethrough");
          this.formatAttribute(t2, e2, "strikethrough", !i2);
        }
        toggleUndoRange(t2, e2, n2 = "") {
          const i2 = this.isRangeEntirelyAttribute(t2, e2, "undo");
          this.formatAttribute(t2, e2, "undo", !i2);
        }
        toggleRedoRange(t2, e2) {
          const n2 = this.isRangeEntirelyAttribute(t2, e2, "redo");
          this.formatAttribute(t2, e2, "redo", !n2);
        }
        applyFontColor(t2, e2, n2, i2 = "") {
          t2 < e2 && (this.formatAttribute(t2, e2, "fontColor", n2), console.log("applyFontColor-color", n2, t2, e2));
        }
        applyBgColor(t2, e2, n2, i2 = "") {
          t2 < e2 && this.formatAttribute(t2, e2, "bgColor", n2);
        }
        isRangeEntirelyAttribute(t2, e2, n2) {
          let i2 = this.currentOffset, o2 = true;
          if ("" !== this.selectedBlockId && null !== this.selectedBlockId) {
            const s2 = this.blocks.findIndex((t3) => t3.dataId === this.selectedBlockId);
            if (-1 === s2) return false;
            for (let l2 of this.blocks[s2].pieces) {
              const s3 = i2 + l2.text.length;
              if (s3 > t2 && i2 < e2 && !l2.attributes[n2]) {
                o2 = false;
                break;
              }
              i2 = s3;
            }
          }
          return o2;
        }
        mergePieces(t2) {
          let e2 = [];
          for (let n2 of t2) {
            const t3 = e2[e2.length - 1];
            t3 && t3.hasSameAttributes(n2) ? t3.text += n2.text : e2.push(n2);
          }
          return e2;
        }
        findPieceAtOffset(t2, e2 = "") {
          let n2 = 0;
          if ("" !== e2 && null !== e2) for (let i2 of this.blocks) {
            const o2 = i2.pieces.reduce((t3, e3) => t3 + e3.text.length, 0);
            if (i2.dataId == e2) {
              let e3 = null;
              for (let o3 of i2.pieces) {
                const i3 = n2, s2 = i3 + o3.text.length;
                if (t2 >= i3 && t2 < s2) return t2 === i3 && e3 ? e3 : o3;
                e3 = o3, n2 = s2;
              }
            } else n2 += o2;
          }
          return null;
        }
        setFontFamily(t2, e2, n2) {
          this.formatAttribute(t2, e2, "fontFamily", n2);
        }
        setFontSize(t2, e2, n2) {
          this.formatAttribute(t2, e2, "fontSize", n2);
        }
        setAlignment(t2, e2) {
          const n2 = this.blocks.find((t3) => t3.dataId === e2);
          n2 && (n2.alignment = t2, this.emit("documentChanged", this));
        }
        getHtmlContent(t2 = false) {
          const e2 = document.getElementById("editor");
          if (!e2) return void console.error("Editor container not found.");
          const n2 = e2.innerHTML;
          return t2 && navigator.clipboard.writeText(n2).then(() => {
            console.log("HTML copied to clipboard!");
          }).catch((t3) => console.error("Failed to copy HTML:", t3)), n2;
        }
        getCursorOffsetInParent(t2) {
          var e2;
          console.log("textPosition -1:vicky", t2);
          const n2 = document.querySelector(t2);
          if (!n2) return null;
          const i2 = window.getSelection();
          if (!i2 || 0 === i2.rangeCount) return null;
          const o2 = i2.getRangeAt(0);
          if (!n2.contains(o2.startContainer)) return null;
          let s2 = 0, l2 = null;
          const r2 = document.createTreeWalker(n2, NodeFilter.SHOW_TEXT, null);
          let a2 = null;
          for (; r2.nextNode(); ) {
            const t3 = r2.currentNode;
            if (console.log(t3, "textPosition - currentNode: vicky"), t3 === o2.startContainer) {
              s2 += o2.startOffset, l2 = t3, a2 = t3.parentElement;
              break;
            }
            s2 += (null === (e2 = t3.textContent) || void 0 === e2 ? void 0 : e2.length) || 0;
          }
          return console.log({ offset: s2, childNode: l2, innerHTML: a2.innerHTML, innerText: a2.innerText }, "textPosition - return values: vicky"), { offset: s2, childNode: l2, innerHTML: a2.innerHTML, innerText: a2.innerText };
        }
        removeExclusiveEndBlock(t2, e2) {
          if (e2.length <= 1) return;
          const n2 = t2.endContainer, i2 = t2.endOffset;
          let o2 = false;
          if ((n2.nodeType === Node.TEXT_NODE || n2.nodeType === Node.ELEMENT_NODE) && (o2 = 0 === i2), !o2) return;
          const s2 = this.getDataIdFromNode(n2);
          if (!s2) return;
          if (s2 !== this.getDataIdFromNode(t2.startContainer) && e2.includes(s2)) {
            const t3 = e2.lastIndexOf(s2);
            t3 > -1 && e2.splice(t3, 1);
          }
        }
      }
      function o(t2) {
        const e2 = window.getSelection();
        if (!e2 || 0 === e2.rangeCount) return null;
        const n2 = e2.getRangeAt(0), i2 = n2.cloneRange();
        i2.selectNodeContents(t2), i2.setEnd(n2.startContainer, n2.startOffset);
        const o2 = i2.toString().length;
        i2.setEnd(n2.endContainer, n2.endOffset);
        return { start: o2, end: i2.toString().length };
      }
      function s(t2, e2) {
        if (!e2) return;
        let n2 = 0;
        const i2 = document.createRange();
        i2.setStart(t2, 0), i2.collapse(true);
        const o2 = [t2];
        let s2, l2 = false, r2 = false;
        for (; !r2 && (s2 = o2.pop()); ) if (3 === s2.nodeType) {
          const t3 = s2, o3 = n2 + t3.length;
          !l2 && e2.start >= n2 && e2.start <= o3 && (i2.setStart(t3, e2.start - n2), l2 = true), l2 && e2.end >= n2 && e2.end <= o3 && (i2.setEnd(t3, e2.end - n2), r2 = true), n2 = o3;
        } else if ("BR" === s2.tagName) l2 || e2.start !== n2 || (i2.setStartBefore(s2), l2 = true), l2 && e2.end === n2 && (i2.setEndBefore(s2), r2 = true), n2++;
        else {
          const t3 = s2;
          let e3 = t3.childNodes.length;
          for (; e3--; ) o2.push(t3.childNodes[e3]);
        }
        const a2 = window.getSelection();
        a2 && (a2.removeAllRanges(), a2.addRange(i2));
      }
      function l(t2) {
        const e2 = o(t2.container);
        return e2 ? [e2.start, e2.end] : [0, 0];
      }
      const r = /((https?:\/\/|www\.)[\w\-._~:\/?#[\]@!$&'()*+,;=%]+|\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[\w\-._~:\/?#[\]@!$&'()*+,;=%]*)?)/g;
      function a(t2, e2) {
        return e2 > 0 && "@" === t2[e2 - 1];
      }
      function d(t2) {
        if (!t2) return t2;
        let e2 = t2.trim();
        const n2 = e2.match(/^https?:\/\/[\w.-]+(?::\d+)?\/(https?:\/\/.*)$/);
        return n2 && (e2 = n2[1]), /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(e2) ? e2 : e2.startsWith("//") ? "https:" + e2 : "https://" + e2;
      }
      class c {
        constructor(t2, e2) {
          this.container = t2, this.document = e2;
        }
        setImageHandler(t2) {
          this.imageHandler = t2;
        }
        render() {
          const t2 = o(this.container);
          this.container.innerHTML = "", this.document.blocks.forEach((t3) => {
            var e2;
            if ("" !== t3.dataId) {
              let n2;
              if ("image" === t3.type) {
                if (n2 = document.createElement("div"), n2.setAttribute("data-id", t3.dataId), n2.setAttribute("class", t3.class), n2.setAttribute("type", t3.type), n2.style.textAlign = t3.alignment || "left", t3.image) if (this.imageHandler && "function" == typeof this.imageHandler.createImageFragment) n2.appendChild(this.imageHandler.createImageFragment(t3.image, t3.dataId));
                else {
                  const e3 = document.createElement("img");
                  e3.src = t3.image, n2.appendChild(e3);
                }
              } else if ("ol" === t3.listType || "li" === t3.listType ? (n2 = document.createElement("ol"), n2.setAttribute("start", (null === (e2 = null == t3 ? void 0 : t3.listStart) || void 0 === e2 ? void 0 : e2.toString()) || "1")) : n2 = "ul" === t3.listType ? document.createElement("ul") : document.createElement("div"), n2.setAttribute("data-id", t3.dataId), n2.setAttribute("class", t3.class), n2.setAttribute("type", t3.type), n2.style.textAlign = t3.alignment || "left", Array.isArray(t3.pieces)) if ("ol" === t3.listType || "ul" === t3.listType || "li" === t3.listType) {
                const e3 = document.createElement("li");
                t3.pieces.forEach((t4) => {
                  e3.appendChild(this.renderPiece(t4));
                }), n2.appendChild(e3);
              } else t3.pieces.forEach((t4) => {
                n2.appendChild(this.renderPiece(t4));
              });
              this.container.appendChild(n2);
            }
          }), s(this.container, t2);
        }
        renderPiece(t2) {
          const e2 = t2.text.split("\n");
          return this.wrapAttributes(e2, t2.attributes);
        }
        wrapAttributes(t2, e2) {
          const n2 = document.createDocumentFragment();
          return t2.forEach((i2, o2) => {
            let s2 = document.createTextNode(i2);
            if (e2.strikethrough) {
              const t3 = document.createElement("s");
              t3.appendChild(s2), s2 = t3;
            }
            if (e2.underline) {
              const t3 = document.createElement("u");
              t3.appendChild(s2), s2 = t3;
            }
            if (e2.italic) {
              const t3 = document.createElement("em");
              t3.appendChild(s2), s2 = t3;
            }
            if (e2.bold) {
              const t3 = document.createElement("strong");
              t3.appendChild(s2), s2 = t3;
            }
            const l2 = document.getElementById("fontFamily"), r2 = document.getElementById("fontSize");
            let a2 = "Arial", c2 = "16px";
            l2 && (a2 = l2.value), r2 && (c2 = r2.value);
            const h2 = document.createElement("span");
            if (h2.style.fontFamily = e2.fontFamily || a2, h2.style.fontSize = e2.fontSize || c2, e2.fontColor && "string" == typeof e2.fontColor && (h2.style.color = e2.fontColor), e2.bgColor && "string" == typeof e2.bgColor && (h2.style.backgroundColor = e2.bgColor), e2.hyperlink && "string" == typeof e2.hyperlink) {
              const t3 = document.createElement("a");
              t3.href = d(e2.hyperlink), t3.appendChild(s2), s2 = t3;
            }
            h2.appendChild(s2), s2 = h2, n2.appendChild(s2), o2 < t2.length - 1 && n2.appendChild(document.createElement("br"));
          }), n2;
        }
      }
      class h extends e {
        constructor(t2) {
          super(), this.container = t2, this.setupButtons();
        }
        setupButtons() {
          this.container.querySelectorAll("button").forEach((t2) => {
            t2.addEventListener("mousedown", (t3) => {
              t3.preventDefault();
            });
          }), this.container.addEventListener("click", (t2) => {
            const e2 = t2.target.closest("button");
            if (e2) {
              const t3 = e2.getAttribute("data-action");
              t3 && this.emit("toolbarAction", t3);
            }
          });
        }
        updateActiveStates(t2) {
          if (this.container.querySelectorAll("button").forEach((e2) => {
            const n2 = e2.getAttribute("data-action");
            let i2 = false;
            "bold" === n2 && t2.bold && (i2 = true), "italic" === n2 && t2.italic && (i2 = true), "underline" === n2 && t2.underline && (i2 = true), "strikethrough" === n2 && t2.strikethrough && (i2 = true), "hyperlink" === n2 && t2.hyperlink && (i2 = true), "undo" === n2 && t2.undo && (i2 = true), "redo" === n2 && t2.redo && (i2 = true), e2.classList.toggle("active", i2);
          }), this.container.querySelectorAll("select").forEach((e2) => {
            const n2 = e2.getAttribute("data-action");
            "fontFamily" === n2 && t2.fontFamily && (e2.value = t2.fontFamily), "fontSize" === n2 && t2.fontSize && (e2.value = t2.fontSize);
          }), t2.fontColor) {
            const e2 = document.getElementById("fontColorPicker");
            e2 && (e2.value = t2.fontColor, e2.dispatchEvent(new Event("input", { bubbles: true })));
          }
          if (t2.bgColor) {
            const e2 = document.getElementById("bgColorPicker");
            e2 && (e2.value = t2.bgColor, e2.dispatchEvent(new Event("input", { bubbles: true })));
          }
        }
      }
      const u = { TOOLBAR_CLASSNAME: "toolbar", TOOLBAR_ID: "toolbar", EDITOR_CLASSNAME: "editor", EDITOR_ID: "editor", EDITOR_ELEMENT_NT_FOUND: "Editor element not found or incorrect element type.", FONT_FAMILY_SELECT_ID: "fontFamily", FONT_SIZE_SELECT_ID: "fontSize", FONT_COLOR_WRAPPER_ID: "fontColorWrapper", FONT_COLOR_ID: "fontColor", FONT_COLOR_PICKER_WRAPPER_ID: "colorWrapper", FONT_COLOR_PICKER_ID: "fontColorPicker", FONT_COLOR_RESET_ID: "colorResetFont", BG_COLOR_WRAPPER_ID: "bgColorWrapper", BG_COLOR_ID: "bgColor", BG_COLOR_PICKER_WRAPPER_ID: "colorBgWrapper", BG_COLOR_RESET_ID: "colorResetBG", BG_COLOR_PICKER_ID: "bgColorPicker", GET_HTML_BUTTON_ID: "getHtmlButton", LOAD_HTML_BUTTON_ID: "loadHtmlButton", HYPERLINK_CONTAINER_ID: "hyperlink-container", HYPERLINK_INPUT_ID: "hyperlink-input", HYPERLINK_PLACEHOLDER: "Enter a URL...", HYPERLINK_APPLY_BTN_ID: "apply-hyperlink", HYPERLINK_CANCEL_BTN_ID: "cancel-hyperlink", VIEW_HYPERLINK_CONTAINER_ID: "hyperlink-container-view", VIEW_HYPERLINK_LABEL_ID: "hyperlink-view-span", VIEW_HYPERLINK_ANCHOR_ID: "hyperlink-view-link", TEMPORARY_SELECTION_HIGHLIGHT_CLASS: "temporary-selection-highlight", PARAGRAPH_BLOCK_CLASS: "paragraph-block", IMAGE_CROSS_CLASS: "image-cross", TEST_HTML_CODE: '<div data-id="data-id-1734604240404" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> ajsh diujaksdajsh diujaksdajsh </span></span></span></div><div data-id="data-id-1739430551701" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> diujaksdasd </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(163, 67, 67);"><strong>98hasiudasdh 98</strong></span></span></span></div><div data-id="data-id-1739430553412" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong> </strong></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">This is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"><em>t</em></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"> this is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"><em>test work</em></span></span></span></div><div data-id="data-id-1739430554776" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">This is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><em>test work.</em></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> this is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong>test work</strong></span></span></span></div><div data-id="data-id-1739430558023" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong><em> uj09asujdi</em></strong></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank"><strong><em>odiodiooias </em></strong></a></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank"><strong>diodiodio</strong></a></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank">oias</a></span></span></span></div><div data-id="data-id-1739430556280" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> da90 uasd y98asiodoiasda90 uasd y9</span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">8asiodoiasda90 uasd y98asioda</span></span></span></div><div data-id="data-id-1739430559464" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> sdjasdjasdja9sudoija9sudoija9sudoija90sdoa90sdoa90sdo</span></span></span></div>', POPUP_TOOLBAR_CLASSNAME: "popup-toolbar", POPUP_TOOLBAR_ID: "popup-toolbar", TOAST_ID: "ti-toast", TOAST_SHOW_CLASS: "ti-toast--show", TOAST_DEFAULT_MESSAGE: "HTML copied to clipboard", TOAST_DEFAULT_DURATION_MS: 2e3 };
      class p {
        constructor(t2, e2, n2) {
          this.savedSelection = null, this.clickOutsideHandler = null, this.editorContainer = t2, this.editorView = e2, this.document = n2;
        }
        setUndoRedoManager(t2) {
          this.undoRedoManager = t2;
        }
        hanldeHyperlinkClick(t2, e2, n2, i2, o2) {
          const s2 = this.getCommonHyperlinkInRange(t2, e2, n2, i2, o2);
          this.showHyperlinkInput(s2);
        }
        getCommonHyperlinkInRange(t2, e2, n2, i2, o2) {
          let s2 = n2, l2 = 0;
          i2 && (l2 = o2.findIndex((t3) => t3.dataId === i2));
          const r2 = o2[l2].pieces;
          let a2 = null;
          for (let n3 of r2) {
            const i3 = s2 + n3.text.length;
            if (i3 > t2 && s2 < e2) {
              const t3 = n3.attributes.hyperlink || null;
              if (null === a2) a2 = t3;
              else if (a2 !== t3) return null;
            }
            s2 = i3;
          }
          return a2;
        }
        showHyperlinkInput(t2) {
          var e2, n2, i2;
          const s2 = document.getElementById(u.HYPERLINK_CONTAINER_ID), l2 = document.getElementById(u.HYPERLINK_INPUT_ID), r2 = document.getElementById(u.HYPERLINK_APPLY_BTN_ID), a2 = document.getElementById(u.HYPERLINK_CANCEL_BTN_ID);
          if (s2 && l2 && r2 && a2) {
            s2.style.display = "block";
            const c2 = window.getSelection();
            if (c2 && c2.rangeCount > 0) {
              const t3 = c2.getRangeAt(0);
              let o2 = null;
              if (t3 && "function" == typeof t3.getBoundingClientRect) o2 = t3.getBoundingClientRect();
              else if (t3 && "function" == typeof t3.getClientRects) {
                const n3 = null === (e2 = t3.getClientRects) || void 0 === e2 ? void 0 : e2.call(t3);
                o2 = n3 && n3.length ? n3[0] : null;
              }
              (!o2 || Number.isNaN(o2.top) && Number.isNaN(o2.left)) && (o2 = this.editorView.container.getBoundingClientRect());
              const l3 = (null === window || void 0 === window ? void 0 : window.scrollY) || 0, r3 = (null === window || void 0 === window ? void 0 : window.scrollX) || 0;
              s2.style.top = `${(null !== (n2 = o2.bottom) && void 0 !== n2 ? n2 : o2.top) + l3 + 5}px`, s2.style.left = `${(null !== (i2 = o2.left) && void 0 !== i2 ? i2 : 0) + r3}px`;
            }
            l2.value = t2 || "", this.savedSelection = o(this.editorView.container), this.highlightSelection(), l2.focus(), r2.onclick = null, a2.onclick = null;
            const h2 = this.document.dataIds, u2 = () => {
              const t3 = d(l2.value.trim());
              t3 && this.applyHyperlink(t3, h2), s2.style.display = "none";
            };
            r2.onclick = u2, l2.onkeydown = (t3) => {
              "Enter" === t3.key && (t3.preventDefault(), u2());
            }, a2.onclick = () => {
              this.removeHyperlink(h2), s2.style.display = "none";
            };
          }
        }
        highlightSelection() {
          this.removeHighlightSelection();
          const t2 = window.getSelection();
          if (t2 && t2.rangeCount > 0) {
            const e2 = t2.getRangeAt(0), n2 = document.createElement("span");
            n2.className = u.TEMPORARY_SELECTION_HIGHLIGHT_CLASS, n2.appendChild(e2.extractContents()), e2.insertNode(n2), t2.removeAllRanges();
            const i2 = document.createRange();
            i2.selectNodeContents(n2), t2.addRange(i2);
          }
        }
        removeHighlightSelection() {
          var t2;
          const e2 = null === (t2 = this.editorContainer) || void 0 === t2 ? void 0 : t2.querySelectorAll(`span.${u.TEMPORARY_SELECTION_HIGHLIGHT_CLASS}`);
          null == e2 || e2.forEach((t3) => {
            const e3 = t3.parentNode;
            if (e3) {
              for (; t3.firstChild; ) e3.insertBefore(t3.firstChild, t3);
              e3.removeChild(t3);
            }
          });
        }
        applyHyperlink(t2, e2) {
          this.undoRedoManager.saveUndoSnapshot(), this.removeHighlightSelection(), s(this.editorView.container, this.savedSelection);
          const [n2, i2] = l(this.editorView);
          if (n2 < i2) {
            const o2 = d(t2);
            e2.length > 1 ? this.document.blocks.forEach((t3) => {
              if (e2.includes(t3.dataId)) {
                this.document.selectedBlockId = t3.dataId;
                let e3 = 0;
                t3.pieces.forEach((t4) => {
                  e3 += t4.text.length;
                });
                let i3 = n2 - e3;
                this.document.formatAttribute(i3, e3, "hyperlink", o2);
              }
            }) : this.document.formatAttribute(n2, i2, "hyperlink", o2), this.editorView.render();
            const s2 = window.getSelection();
            s2 && s2.removeAllRanges(), this.editorView.container.focus();
          }
          this.savedSelection = null;
        }
        removeHyperlink(t2) {
          this.undoRedoManager.saveUndoSnapshot(), this.removeHighlightSelection(), s(this.editorView.container, this.savedSelection);
          const [e2, n2] = l(this.editorView);
          e2 < n2 && (t2.length > 1 ? this.document.blocks.forEach((n3) => {
            if (t2.includes(n3.dataId)) {
              this.document.selectedBlockId = n3.dataId;
              let t3 = 0;
              n3.pieces.forEach((e3) => {
                t3 += e3.text.length;
              });
              let i2 = e2 - t3;
              this.document.formatAttribute(i2, t3, "hyperlink", false);
            }
          }) : this.document.formatAttribute(e2, n2, "hyperlink", false), this.editorView.render(), s(this.editorView.container, this.savedSelection), this.editorView.container.focus()), this.savedSelection = null;
        }
        addClickOutsideListener(t2) {
          this.removeClickOutsideListener(), this.clickOutsideHandler = (e2) => {
            t2 && !t2.contains(e2.target) && this.hideHyperlinkViewButton();
          }, setTimeout(() => {
            document.addEventListener("click", this.clickOutsideHandler);
          }, 100);
        }
        removeClickOutsideListener() {
          this.clickOutsideHandler && (document.removeEventListener("click", this.clickOutsideHandler), this.clickOutsideHandler = null);
        }
        showHyperlinkViewButton(t2) {
          var e2, n2, i2;
          const o2 = document.getElementById(u.VIEW_HYPERLINK_CONTAINER_ID), s2 = document.getElementById(u.VIEW_HYPERLINK_ANCHOR_ID);
          if (o2 && s2) {
            o2.style.display = "block";
            const l2 = window.getSelection();
            if (l2 && l2.rangeCount > 0) {
              const t3 = l2.getRangeAt(0);
              let s3 = null;
              if (t3 && "function" == typeof t3.getBoundingClientRect) s3 = t3.getBoundingClientRect();
              else if (t3 && "function" == typeof t3.getClientRects) {
                const n3 = null === (e2 = t3.getClientRects) || void 0 === e2 ? void 0 : e2.call(t3);
                s3 = n3 && n3.length ? n3[0] : null;
              }
              s3 || (s3 = this.editorView.container.getBoundingClientRect());
              const r2 = (null === window || void 0 === window ? void 0 : window.scrollY) || 0, a2 = (null === window || void 0 === window ? void 0 : window.scrollX) || 0;
              s3 && (o2.style.top = `${(null !== (n2 = s3.bottom) && void 0 !== n2 ? n2 : s3.top) + r2 + 5}px`, o2.style.left = `${(null !== (i2 = s3.left) && void 0 !== i2 ? i2 : 0) + a2}px`);
            }
            t2 && (s2.innerText = t2, s2.href = d(t2));
          }
          this.addClickOutsideListener(o2);
        }
        hideHyperlinkViewButton() {
          const t2 = document.getElementById(u.VIEW_HYPERLINK_CONTAINER_ID);
          t2 && (t2.style.display = "none"), this.removeClickOutsideListener();
        }
      }
      function g(t2) {
        return m(new DOMParser().parseFromString(t2, "text/html").body, { bold: false, italic: false, underline: false, hyperlink: false });
      }
      function m(t2, e2) {
        let i2 = Object.assign({}, e2);
        const o2 = [];
        if (t2 instanceof HTMLElement) {
          if ("A" === t2.tagName) {
            const e3 = t2.getAttribute("href");
            e3 && (i2.hyperlink = e3);
          }
          "STRONG" !== t2.tagName && "B" !== t2.tagName || (i2.bold = true), "EM" !== t2.tagName && "I" !== t2.tagName || (i2.italic = true), "U" === t2.tagName && (i2.underline = true), t2.childNodes.forEach((t3) => {
            o2.push(...m(t3, i2));
          });
        } else if (t2 instanceof Text) {
          const e3 = t2.nodeValue || "";
          "" !== e3.trim() && o2.push(new n(e3, Object.assign({}, i2)));
        }
        return o2;
      }
      const f = { bold: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">\n                <title>Bold</title>\n                <path d="M17.061 11.22A4.46 4.46 0 0 0 18 8.5C18 6.019 15.981 4 13.5 4H6v15h8c2.481 0 4.5-2.019 4.5-4.5a4.48 4.48 0 0 0-1.439-3.28zM13.5 7c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5H9V7h4.5zm.5 9H9v-3h5c.827 0 1.5.673 1.5 1.5S14.827 16 14 16z"></path>\n            </svg>', italic: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">\n                <title>Italic</title>\n                <path d="M19 7V4H9v3h2.868L9.012 17H5v3h10v-3h-2.868l2.856-10z"></path>\n            </svg>', underline: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" height="18" \n                    viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">\n                    <title>Underline</title>\n                    <path d="M5 18h14v2H5zM6 4v6c0 3.309 2.691 6 6 6s6-2.691 6-6V4h-2v6c0 2.206-1.794 4-4 4s-4-1.794-4-4V4H6z"></path>\n                </svg>', strikethrough: '<svg \n        xmlns="http://www.w3.org/2000/svg" \n        width="18" \n        height="18" \n        viewBox="0 0 24 24" \n        style="fill: rgba(0, 0, 0, 1);">\n        <title>Strikethrough</title>\n        <path d="M5 12.5h14v-1H5v1zm7-7c-2.21 0-4 1.79-4 4h2a2 2 0 1 1 4 0c0 1.1-.9 2-2 2h-1v2h1a4 4 0 0 0 0-8zm0 14c2.21 0 4-1.79 4-4h-2a2 2 0 1 1-4 0c0-1.1.9-2 2-2h1v-2h-1a4 4 0 0 0 0 8z"/>\n    </svg>', subscript: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                    width="18" height="18" \n                    viewBox="0 0 24 24">\n                    <title>Subscript</title>\n                    <path fill="currentColor" d="M19 20v-3h3v-1h-3v-1h4v3h-3v1h3v1zM5.875 18l4.625-7.275L6.2 4h2.65l3.1 5h.1l3.075-5H17.8l-4.325 6.725L18.125 18H15.45l-3.4-5.425h-.1L8.55 18z"/>\n                </svg>', superscript: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Superscript</title>\n                    <path fill="currentColor" d="M19 9V6h3V5h-3V4h4v3h-3v1h3v1zM5.875 20l4.625-7.275L6.2 6h2.65l3.1 5h.1l3.075-5H17.8l-4.325 6.725L18.125 20H15.45l-3.4-5.425h-.1L8.55 20z"/>\n                </svg>', left_align: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Left Align</title>\n                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M4.5 12h8m-8 6.25h15m-15-12.5h15"/>\n                </svg>', center_align: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Center Align</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M6 18h12"/>\n                </svg>', right_align: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Right Align</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M19.5 12h-8m8-6.25h-15m15 12.5h-15"/></svg>', justify: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 20 20">\n                <title>Justify</title><path fill="currentColor" d="M2 4.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.25m0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.25m.75 4.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5z"/>\n            </svg>', bullet_list: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 16 16">\n                    <title>Bullet List</title><path fill="currentColor" d="M2 4.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2M2 9a1 1 0 1 0 0-2a1 1 0 0 0 0 2m1 3.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M5.5 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM5 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 8m.5 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/></svg>', numbered_list: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 512 512">\n                    <title>Numbererd List</title>\n                    <path fill="currentColor" d="M184 80h288v32H184zm0 160h288v32H184zm0 160h288v32H184zm-64-240V40H56v32h32v88zM56 262.111V312h80v-32H91.777L136 257.889V192H56v32h48v14.111zM56 440v32h80V344H56v32h48v16H80v32h24v16z"/>\n                </svg>', insert_table: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 20 20">\n                    <title>Insert Table</title>\n                    <path fill="currentColor" d="M1.364 5.138v12.02h17.272V5.138zM.909 1.5h18.182c.502 0 .909.4.909.895v15.21a.9.9 0 0 1-.91.895H.91c-.503 0-.91-.4-.91-.895V2.395C0 1.9.407 1.5.91 1.5m5.227 1.759c0-.37.306-.671.682-.671s.682.3.682.671v13.899c0 .37-.305.67-.682.67a.676.676 0 0 1-.682-.67zm6.96-.64c.377 0 .682.3.682.67v4.995h4.91c.377 0 .683.301.683.672c0 .37-.306.671-.682.671l-4.911-.001v3.062h5.002c.377 0 .682.3.682.671c0 .37-.305.671-.682.671h-5.002v3.158a.676.676 0 0 1-.682.671a.676.676 0 0 1-.681-.67l-.001-3.159H1.001a.676.676 0 0 1-.682-.67c0-.371.305-.672.682-.672h11.413V9.626L.909 9.627a.676.676 0 0 1-.682-.671c0-.37.306-.671.682-.671l11.505-.001V3.289c0-.37.306-.67.682-.67"/>\n                </svg>', insert_layout: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 256 256">\n                    <title>Insert Layout</title>\n                    <path fill="currentColor" d="M216 42H40a14 14 0 0 0-14 14v144a14 14 0 0 0 14 14h176a14 14 0 0 0 14-14V56a14 14 0 0 0-14-14M40 54h176a2 2 0 0 1 2 2v42H38V56a2 2 0 0 1 2-2m-2 146v-90h60v92H40a2 2 0 0 1-2-2m178 2H110v-92h108v90a2 2 0 0 1-2 2"/>\n                </svg>', heading: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24">\n                <title>Heading</title>\n                <path fill="currentColor" d="M17 11V4h2v17h-2v-8H7v8H5V4h2v7z"/>\n            </svg>', hyperlink: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24">\n                <title>Hyperlink</title>\n                <path fill="currentColor" d="M14.78 3.653a3.936 3.936 0 1 1 5.567 5.567l-3.627 3.627a3.936 3.936 0 0 1-5.88-.353a.75.75 0 0 0-1.18.928a5.436 5.436 0 0 0 8.12.486l3.628-3.628a5.436 5.436 0 1 0-7.688-7.688l-3 3a.75.75 0 0 0 1.06 1.061z"/>\n                <path fill="currentColor" d="M7.28 11.153a3.936 3.936 0 0 1 5.88.353a.75.75 0 0 0 1.18-.928a5.436 5.436 0 0 0-8.12-.486L2.592 13.72a5.436 5.436 0 1 0 7.688 7.688l3-3a.75.75 0 1 0-1.06-1.06l-3 3a3.936 3.936 0 0 1-5.567-5.568z"/>\n            </svg>', image: '<svg \n            xmlns="http://www.w3.org/2000/svg" \n            width="18" \n            height="18" \n            viewBox="0 0 16 16">\n            <title>Insert Image</title>\n            <path fill="currentColor" d="M6 5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m9-4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm-3.448 6.134l-3.76 2.769a.5.5 0 0 1-.436.077l-.087-.034l-1.713-.87L1 11.8V14h14V9.751zM15 2H1v8.635l4.28-2.558a.5.5 0 0 1 .389-.054l.094.037l1.684.855l3.813-2.807a.5.5 0 0 1 .52-.045l.079.05L15 8.495z"/>\n        </svg>' }, b = { dropdowns: ["fontFamily", "fontSize"], colors: ["fontColor", "bgColor"], formatting: ["bold", "italic", "underline", "strikethrough"], alignment: ["alignLeft", "alignCenter", "alignRight"], lists: ["unorderedList", "orderedList"], media: ["hyperlink", "image"], utility: ["getHtmlContent", "loadHtmlContent"] };
      function y() {
        const t2 = document.createElement("div");
        return t2.className = "toolbar-separator", t2;
      }
      function k(t2, e2) {
        const n2 = u.EDITOR_ID, i2 = u.TOOLBAR_ID, o2 = u.POPUP_TOOLBAR_ID, s2 = ["Arial", "Times New Roman", "Courier New", "Verdana"], l2 = ["12px", "14px", "16px", "18px", "20px"], r2 = document.getElementById(t2);
        if (!r2) throw new Error(u.EDITOR_ELEMENT_NT_FOUND);
        r2.classList.add("editor-container");
        const a2 = document.createElement("div");
        a2.className = u.TOOLBAR_CLASSNAME, a2.id = i2, r2.appendChild(a2), (null == e2 ? void 0 : e2.showToolbar) || (a2.style.display = "none");
        const d2 = document.createElement("div");
        d2.id = n2, d2.className = u.EDITOR_CLASSNAME, d2.contentEditable = "true", r2.appendChild(d2);
        const c2 = { bold: "<strong>B</strong>", italic: "<em>I</em>", underline: "<u>U</u>", hyperlink: "&#128279;", alignLeft: "&#8676;", alignCenter: "&#8596;", alignRight: "&#8677;", unorderedList: "&#8226;", orderedList: "1.", fontFamily: "fontFamily", fontSize: "fontSize", fontColor: "A", subscript: "X<sub>2</sub>", superscript: "X<sup>2</sup>", justify: "&#8644;", insert_table: "&#8866;", insert_layout: "&#10064;", heading: "H", image: "&#128247;", colors: "&#127912;" }, h2 = { bold: "Bold (Ctrl+B)", italic: "Italic (Ctrl+I)", underline: "Underline (Ctrl+U)", strikethrough: "Strikethrough", hyperlink: "Insert Link (Ctrl+H)", alignLeft: "Align Left (Ctrl+L)", alignCenter: "Align Center (Ctrl+E)", alignRight: "Align Right (Ctrl+R)", unorderedList: "Bullet List", orderedList: "Numbered List", fontColor: "Text Color", bgColor: "Highlight Color", image: "Insert Image", getHtmlContent: "Get HTML", loadHtmlContent: "Load HTML" }, p2 = [{ feature: "alignLeft", id: "alignLeft", icon: f.left_align }, { feature: "alignCenter", id: "alignCenter", icon: f.center_align }, { feature: "alignRight", id: "alignRight", icon: f.right_align }, { feature: "unorderedList", id: "unorderedList", icon: f.bullet_list }, { feature: "orderedList", id: "orderedList", icon: f.numbered_list }, { feature: "hyperlink", id: "hyperlink", icon: f.hyperlink }, { feature: "strikethrough", id: "strikethrough", icon: f.strikethrough }], g2 = (t3, e3) => {
          const n3 = document.createElement("select");
          return n3.dataset.action = t3, n3.id = t3, e3.forEach((t4) => {
            const e4 = document.createElement("option");
            e4.value = t4, e4.textContent = t4, n3.appendChild(e4);
          }), n3;
        }, m2 = document.createElement("div");
        m2.id = o2, m2.className = u.POPUP_TOOLBAR_CLASSNAME, m2.style.display = "none", r2.appendChild(m2), e2.popupFeatures && e2.popupFeatures.forEach((t3, e3) => {
          e3 > 0 && "hyperlink" === t3 && m2.appendChild(y());
          const n3 = p2.find((e4) => e4.feature === t3) || { icon: c2[t3] || t3 }, i3 = document.createElement("button");
          i3.dataset.action = t3, i3.innerHTML = n3.icon, i3.dataset.tooltip = h2[t3] || t3.split("_").map((t4) => t4.charAt(0).toUpperCase() + t4.slice(1)).join(" "), m2.appendChild(i3);
        });
        let k2 = null;
        e2.features.forEach((t3, e3) => {
          const n3 = (function(t4) {
            for (const [e4, n4] of Object.entries(b)) if (n4.includes(t4)) return e4;
            return null;
          })(t3);
          if (e3 > 0 && n3 && k2 && n3 !== k2 && a2.appendChild(y()), k2 = n3, "fontFamily" === t3) {
            const t4 = g2(u.FONT_FAMILY_SELECT_ID, s2);
            a2.appendChild(t4);
          } else if ("fontSize" === t3) {
            const t4 = g2(u.FONT_SIZE_SELECT_ID, l2);
            a2.appendChild(t4);
          } else if ("fontColor" === t3) {
            if (document.getElementById(u.FONT_COLOR_WRAPPER_ID)) return;
            const t4 = document.createElement("span");
            t4.id = u.FONT_COLOR_WRAPPER_ID, t4.style.display = "inline-flex", t4.style.alignItems = "center", t4.style.position = "relative", t4.style.gap = "4px";
            const e4 = document.createElement("button");
            e4.id = u.FONT_COLOR_ID, e4.type = "button", e4.dataset.tooltip = h2.fontColor, e4.innerHTML = '<span style="font-weight: bold; font-size: 14px; position: relative; display: inline-block; padding: 2px 4px;">A<span style="position: absolute; bottom: 0; left: 2px; right: 2px; height: 3px; background-color: #000000; border-radius: 1px;" id="fontColorIndicator"></span></span>', t4.appendChild(e4);
            const n4 = document.createElement("div");
            n4.id = u.FONT_COLOR_PICKER_WRAPPER_ID, n4.style.display = "none", n4.style.position = "absolute", n4.style.top = "100%", n4.style.left = "0", n4.style.marginTop = "4px", n4.style.zIndex = "1000", n4.style.backgroundColor = "#ffffff", n4.style.border = "1px solid #d1d1d1", n4.style.borderRadius = "4px", n4.style.padding = "8px", n4.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)", n4.style.width = "135px";
            const i3 = document.createElement("input");
            i3.type = "color", i3.id = u.FONT_COLOR_PICKER_ID, i3.setAttribute("data-action", "fontColor"), i3.style.width = "100%", i3.style.height = "32px", i3.style.border = "1px solid #d1d1d1", i3.style.borderRadius = "4px", i3.style.cursor = "pointer", i3.style.marginBottom = "8px", i3.value = "#000000", n4.appendChild(i3);
            const o3 = document.createElement("button");
            o3.id = u.FONT_COLOR_RESET_ID, o3.type = "button", o3.textContent = "Reset", o3.style.display = "block", o3.style.width = "100%", o3.style.padding = "6px 12px", o3.style.fontSize = "12px", o3.style.border = "1px solid #000000", o3.style.borderRadius = "4px", o3.style.backgroundColor = "#f8f8f8", o3.style.cursor = "pointer", o3.style.transition = "background-color 0.2s", o3.onmouseenter = () => o3.style.backgroundColor = "#e8e8e8", o3.onmouseleave = () => o3.style.backgroundColor = "#f8f8f8", n4.appendChild(o3), t4.appendChild(n4), a2.appendChild(t4);
          } else if ("bgColor" === t3) {
            if (document.getElementById(u.BG_COLOR_WRAPPER_ID)) return;
            const t4 = document.createElement("span");
            t4.id = u.BG_COLOR_WRAPPER_ID, t4.style.display = "inline-flex", t4.style.alignItems = "center", t4.style.position = "relative", t4.style.gap = "4px";
            const e4 = document.createElement("button");
            e4.id = u.BG_COLOR_ID, e4.type = "button", e4.dataset.tooltip = h2.bgColor, e4.innerHTML = '<span style="font-weight: bold; font-size: 14px; position: relative; display: inline-block; padding: 2px 4px;">B<span style="position: absolute; bottom: 0; left: 2px; right: 2px; height: 3px; background-color: #ffffff;" id="bgColorIndicator"></span></span>', t4.appendChild(e4);
            const n4 = document.createElement("div");
            n4.id = u.BG_COLOR_PICKER_WRAPPER_ID, n4.style.display = "none", n4.style.position = "absolute", n4.style.top = "100%", n4.style.left = "0", n4.style.marginTop = "4px", n4.style.zIndex = "1000", n4.style.backgroundColor = "#ffffff", n4.style.border = "1px solid #000000", n4.style.borderRadius = "4px", n4.style.padding = "8px", n4.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)", n4.style.width = "135px";
            const i3 = document.createElement("input");
            i3.setAttribute("data-action", "bgColor"), i3.type = "color", i3.id = u.BG_COLOR_PICKER_ID, i3.style.width = "100%", i3.style.height = "32px", i3.style.border = "1px solid #000000ff", i3.style.borderRadius = "4px", i3.style.cursor = "pointer", i3.style.marginBottom = "8px", i3.value = "#ffffff", n4.appendChild(i3);
            const o3 = document.createElement("button");
            o3.id = u.BG_COLOR_RESET_ID, o3.type = "button", o3.textContent = "Reset", o3.style.display = "block", o3.style.width = "100%", o3.style.padding = "6px 12px", o3.style.fontSize = "12px", o3.style.border = "1px solid #d1d1d1", o3.style.borderRadius = "4px", o3.style.backgroundColor = "#f8f8f8", o3.style.cursor = "pointer", o3.style.transition = "background-color 0.2s", o3.onmouseenter = () => o3.style.backgroundColor = "#e8e8e8", o3.onmouseleave = () => o3.style.backgroundColor = "#f8f8f8", n4.appendChild(o3), t4.appendChild(n4), a2.appendChild(t4);
          } else if ("getHtmlContent" === t3) {
            const t4 = document.createElement("button");
            t4.id = u.GET_HTML_BUTTON_ID, t4.type = "button", t4.textContent = "Get HTML", t4.dataset.tooltip = h2.getHtmlContent, a2.appendChild(t4);
          } else if ("loadHtmlContent" === t3) {
            const t4 = document.createElement("button");
            t4.id = u.LOAD_HTML_BUTTON_ID, t4.type = "button", t4.textContent = "Load HTML", t4.dataset.tooltip = h2.loadHtmlContent, a2.appendChild(t4);
          } else if (p2.map((t4) => t4.feature).includes(t3)) {
            const e4 = p2.find((e5) => e5.feature === t3), n4 = document.createElement("button");
            n4.id = t3, n4.dataset.action = t3, n4.innerHTML = (null == e4 ? void 0 : e4.icon) || "", n4.dataset.tooltip = h2[t3] || t3, a2.appendChild(n4);
          } else {
            const e4 = document.createElement("button");
            e4.dataset.action = t3, e4.innerHTML = c2[t3] || t3, e4.id = t3, e4.dataset.tooltip = h2[t3] || t3.split("_").map((t4) => t4.charAt(0).toUpperCase() + t4.slice(1)).join(" "), a2.appendChild(e4);
          }
        });
        const I2 = document.createElement("div");
        I2.id = u.HYPERLINK_CONTAINER_ID, I2.style.display = "none";
        const C2 = document.createElement("input");
        C2.type = "text", C2.id = u.HYPERLINK_INPUT_ID, C2.placeholder = u.HYPERLINK_PLACEHOLDER;
        const v2 = document.createElement("button");
        v2.id = u.HYPERLINK_APPLY_BTN_ID, v2.textContent = "Link";
        const E2 = document.createElement("button");
        E2.id = u.HYPERLINK_CANCEL_BTN_ID, E2.textContent = "Unlink", I2.appendChild(C2), I2.appendChild(v2), I2.appendChild(E2), a2.appendChild(I2);
        const w2 = document.createElement("div");
        w2.id = u.VIEW_HYPERLINK_CONTAINER_ID, w2.style.display = "none";
        const x2 = document.createElement("span");
        x2.id = u.VIEW_HYPERLINK_LABEL_ID, x2.innerHTML = "Visit URL : ";
        const A = document.createElement("a");
        return A.id = u.VIEW_HYPERLINK_ANCHOR_ID, A.href = "", A.target = "_blank", w2.appendChild(x2), w2.appendChild(A), a2.appendChild(w2), { mainEditorId: n2, toolbarId: i2, popupToolbarId: o2 };
      }
      class I {
        constructor(t2) {
          this.htmlString = t2, this.doc = new DOMParser().parseFromString(t2, "text/html");
        }
        parse() {
          const t2 = this.doc.body.children;
          let e2 = [];
          return Array.from(t2).forEach((t3, n2) => {
            const i2 = this.parseElement(t3);
            console.log(t3, "element parse", n2, i2), e2.push(i2);
          }), console.log(e2, "element--jsondata"), e2;
        }
        parseElement(t2) {
          const e2 = t2.getAttribute("data-id") || "", n2 = t2.className || "paragraph-block", i2 = t2.style.textAlign || "left";
          let o2 = null, s2 = null;
          "UL" === t2.tagName ? o2 = "ul" : "OL" === t2.tagName && (o2 = "ol", s2 = parseInt(t2.getAttribute("start") || "1", 10));
          let l2 = [];
          return o2 ? this.parseListItems(t2, l2) : this.parseParagraphText(t2, l2), Object.assign(Object.assign(Object.assign({ dataId: e2, class: n2, alignment: i2, pieces: l2 }, o2 ? { listType: o2 } : {}), null !== s2 ? { listStart: s2 } : {}), {});
        }
        parseListItems(t2, e2) {
          t2.querySelectorAll("li").forEach((t3) => {
            const i2 = this.extractTextAttributes(t3);
            i2 && e2.push(new n(i2.text, i2.attributes));
          });
        }
        parseParagraphText(t2, e2) {
          const i2 = t2.querySelectorAll("span"), o2 = /* @__PURE__ */ new Map();
          i2.forEach((t3) => {
            const e3 = this.extractTextAttributes(t3);
            if (console.log(e3, "piece parseParagraphText span", t3.textContent, t3.style.color), e3) {
              const t4 = o2.get(e3.text);
              t4 ? (t4.attributes.bold = t4.attributes.bold || e3.attributes.bold, t4.attributes.italic = t4.attributes.italic || e3.attributes.italic, t4.attributes.underline = t4.attributes.underline || e3.attributes.underline, t4.attributes.fontFamily = e3.attributes.fontFamily || t4.attributes.fontFamily, t4.attributes.fontSize = e3.attributes.fontSize || t4.attributes.fontSize, t4.attributes.fontColor = e3.attributes.fontColor || t4.attributes.fontColor, t4.attributes.bgColor = e3.attributes.bgColor || t4.attributes.bgColor) : o2.set(e3.text, Object.assign({}, e3));
            }
          }), o2.forEach((t3) => {
            e2.push(new n(t3.text, t3.attributes));
          }), console.log(e2, "pieces--parseParagraphText (merged)");
        }
        extractTextAttributes(t2) {
          var e2;
          const n2 = t2.textContent || "";
          return n2 ? (console.log("extractTextAttributes node", t2, t2.style.color), { text: n2, attributes: { bold: null !== t2.querySelector("b, strong"), italic: null !== t2.querySelector("i, em"), underline: null !== t2.querySelector("u"), undo: false, redo: false, fontFamily: t2.style.fontFamily || "Arial", fontSize: t2.style.fontSize || "12px", hyperlink: !!t2.querySelector("a") && (null === (e2 = t2.querySelector("a")) || void 0 === e2 ? void 0 : e2.getAttribute("href")), fontColor: t2.style.color, bgColor: t2.style.backgroundColor } }) : null;
        }
        rgbToHex(t2, e2 = false) {
          const n2 = t2.match(/\d+/g);
          if (!n2 || n2.length < 3) return null;
          const i2 = n2.map((t3) => {
            const e3 = parseInt(t3);
            return e3 < 0 || e3 > 255 ? "00" : e3.toString(16).padStart(2, "0");
          }).join("");
          return e2 || "000000" !== i2 ? `#${i2}` : null;
        }
      }
      class C {
        constructor(t2, e2) {
          this.editor = t2, this.document = e2, this.isImageHighlighted = false, this.highLightedImageDataId = "", this.currentCursorLocation = 0, this.isCrossIconVisible = false;
        }
        setEditorView(t2) {
          this.editorView = t2;
        }
        insertImage() {
          const t2 = document.createElement("input");
          t2.type = "file", t2.accept = "image/*", t2.click(), t2.onchange = () => {
            const e2 = t2.files ? t2.files[0] : null;
            if (e2) {
              const t3 = new FileReader();
              t3.onload = (t4) => {
                var e3;
                const n2 = null === (e3 = t4.target) || void 0 === e3 ? void 0 : e3.result;
                this.insertImageAtCursor(n2);
              }, t3.readAsDataURL(e2);
            }
          };
        }
        insertImageAtCursor(t2) {
          if (!t2) return;
          const [e2, n2] = l(this.editorView);
          n2 > e2 && this.document.deleteRange(e2, n2, this.document.selectedBlockId), this.insertImageAtPosition(t2, e2, this.document.selectedBlockId);
        }
        setCursorPostion(t2, e2) {
          if ("number" != typeof t2 || !e2) return;
          const n2 = document.querySelector(`[data-id="${e2}"]`);
          n2 && ("function" == typeof n2.focus && n2.focus(), setTimeout(() => {
            const e3 = document.createRange(), i2 = window.getSelection();
            if (n2.firstChild) e3.setStart(n2.firstChild, t2);
            else {
              const t3 = document.createTextNode("");
              n2.appendChild(t3), e3.setStart(t3, 0);
            }
            e3.collapse(true), null == i2 || i2.removeAllRanges(), null == i2 || i2.addRange(e3);
          }, 0));
        }
        insertImageAtPosition(t2, e2, i2) {
          if (!t2 || "number" != typeof e2 || !this.editorView) return;
          console.log(t2, e2, i2, "vicky insertImageAtPosition", this.document.blocks);
          const o2 = `data-id-${Date.now()}-${1e3 * Math.random()}`, s2 = `data-id-${Date.now()}-${1e3 * Math.random()}`, l2 = `data-id-${Date.now()}-${1e3 * Math.random()}`, r2 = { dataId: o2, class: u.PARAGRAPH_BLOCK_CLASS, pieces: [new n(" ")], type: "image", image: t2 }, a2 = { dataId: s2, class: u.PARAGRAPH_BLOCK_CLASS, pieces: [new n(" ")], type: "text" };
          let d2 = this.document.selectedBlockId;
          const c2 = this.document.blocks.findIndex((t3) => t3.dataId === this.document.selectedBlockId);
          let h2 = [];
          const { remainingText: p2, piece: g2 } = (function(t3, e3) {
            const n2 = window.getSelection();
            if (!n2 || 0 === n2.rangeCount) return { remainingText: "", piece: null };
            const i3 = n2.getRangeAt(0).startContainer;
            let o3 = "";
            const s3 = e3.blocks.filter((e4) => {
              if (e4.dataId === t3) return e4;
            });
            if (!s3[0] || !s3[0].pieces) return { remainingText: "", piece: null };
            const l3 = document.querySelector(`[data-id="${t3}"]`), r3 = e3.getCursorOffsetInParent(`[data-id="${t3}"]`);
            let a3 = [], d3 = 0;
            if (s3[0].pieces.forEach((t4, e4) => {
              o3 += t4.text, (null == r3 ? void 0 : r3.innerText) === t4.text && (d3 = e4, a3.push(t4));
            }), s3[0].pieces.length > 1 && s3[0].pieces.forEach((t4, e4) => {
              d3 < e4 && a3.push(t4);
            }), !l3) return console.error(`Element with data-id "${t3}" not found.`), { remainingText: "", piece: null };
            if (!l3.contains(i3)) return console.error(`Cursor is not inside the element with data-id "${t3}".`), { remainingText: "", piece: null };
            const c3 = o3, h3 = null == r3 ? void 0 : r3.offset, u2 = c3.slice(h3), p3 = c3.slice(0, h3);
            return l3.textContent = p3, { remainingText: u2, piece: a3 };
          })(d2 || "", this.document);
          console.log(d2 || "", this.document, "extractTextFromDataId-vicky", p2, g2);
          const m2 = " " + p2;
          let f2 = this.document.blocks;
          if (m2.length > 0) {
            const t3 = p2.split(" ");
            let e3 = [];
            "" !== t3[0] || void 0 !== t3[1] ? 1 === g2.length ? e3 = [new n(m2, g2[0].attributes)] : (e3.push(new n(" " + t3[0] + " ", g2[0].attributes)), g2.length >= 2 && g2.forEach((t4, n2) => {
              0 !== n2 && e3.push(t4);
            })) : e3 = [new n(" ")], console.log(this.document.selectedBlockId, "uniqueId3 extractTextFromDataId-vicky", l2), f2 = (function(t4, e4, n2) {
              const i3 = t4.findIndex((t5) => t5.dataId === e4);
              return -1 === i3 ? (console.error(`Block with dataId "${e4}" not found.`), t4) : [...t4.slice(0, i3 + 1), n2, ...t4.slice(i3 + 1)];
            })(this.document.blocks, this.document.selectedBlockId || "", { dataId: l2, class: u.PARAGRAPH_BLOCK_CLASS, pieces: e3, type: "text" });
          }
          this.document.blocks = f2, this.document.deleteRange(this.currentCursorLocation, this.currentCursorLocation + p2.length, this.document.selectedBlockId, this.document.currentOffset), this.document.blocks.length > c2 + 1 ? this.document.blocks.forEach((t3, e3) => {
            h2.push(t3), e3 === c2 ? h2.push(r2) : d2 === this.document.selectedBlockId && (d2 = t3.dataId);
          }) : (h2 = [...this.document.blocks, r2, a2], d2 = a2.dataId), this.document.blocks = h2, this.editorView.render(), this.document.selectedBlockId = d2;
          const b2 = document.querySelector(`[data-id="${d2}"]`);
          b2.focus(), setTimeout(() => {
            const t3 = document.createRange(), e3 = window.getSelection();
            if (b2.firstChild) t3.setStart(b2.firstChild, 1);
            else {
              const e4 = document.createTextNode("");
              b2.appendChild(e4), t3.setStart(e4, 0);
            }
            t3.collapse(true), null == e3 || e3.removeAllRanges(), null == e3 || e3.addRange(t3);
          }, 0);
        }
        createImageFragment(t2, e2) {
          if (!t2 || !e2) return document.createDocumentFragment();
          const n2 = document.createDocumentFragment(), i2 = document.createElement("img");
          i2.src = t2, i2.style.maxWidth = "30%", i2.setAttribute("contenteditable", "false"), n2.appendChild(i2);
          const o2 = document.createElement("span");
          return o2.setAttribute("contenteditable", "false"), o2.appendChild(n2), i2.addEventListener("click", () => this.addStyleToImage(e2)), o2;
        }
        addStyleToImage(t2) {
          if (t2 && !this.isCrossIconVisible) {
            const e2 = document.querySelector(`[data-id="${t2}"]`), n2 = null == e2 ? void 0 : e2.querySelector("span");
            n2 && (n2.style.position = "relative");
            const i2 = null == e2 ? void 0 : e2.querySelector("img");
            i2 && (i2.style.border = "2px solid blue");
            const o2 = document.createElement("div");
            o2.className = u.IMAGE_CROSS_CLASS, o2.innerHTML = "x", Object.assign(o2.style, { position: "absolute", top: "0", left: "50%", transform: "translate(-50%, 0)", background: "#fff", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "3px solid blue", zIndex: "999" }), o2.addEventListener("mouseover", () => o2.style.border = "3px solid black"), o2.addEventListener("mouseout", () => o2.style.border = "3px solid blue"), o2.addEventListener("click", (t3) => {
              t3.stopPropagation(), this.deleteImage();
            }), null == n2 || n2.appendChild(o2), this.isImageHighlighted = true, this.highLightedImageDataId = t2, this.isCrossIconVisible = true;
          }
        }
        clearImageStyling() {
          if (!this.highLightedImageDataId) return;
          const t2 = document.querySelector(`[data-id="${this.highLightedImageDataId}"]`);
          if (t2) {
            const e2 = t2.querySelector("span");
            null == e2 || e2.removeAttribute("style");
            const n2 = null == e2 ? void 0 : e2.querySelector("img");
            n2 && n2.removeAttribute("style");
            const i2 = null == e2 ? void 0 : e2.querySelector(`.${u.IMAGE_CROSS_CLASS}`);
            null == i2 || i2.remove(), this.highLightedImageDataId = "";
          }
          this.isCrossIconVisible = false;
        }
        deleteImage() {
          this.highLightedImageDataId && (this.document.blocks = this.document.blocks.filter((t2) => t2.dataId !== this.highLightedImageDataId), this.highLightedImageDataId = "", this.isImageHighlighted = false, this.clearImageStyling(), this.document.emit("documentChanged", this));
        }
      }
      class v {
        constructor(t2, e2) {
          this.snapshotUndoStack = [], this.snapshotRedoStack = [], this.maxSnapshots = 5e3, this.document = t2, this.editorView = e2;
        }
        createSnapshot() {
          const [t2, e2] = l(this.editorView);
          return { blocks: JSON.parse(JSON.stringify(this.document.blocks)), dataIds: [...this.document.dataIds], selectedBlockId: this.document.selectedBlockId, currentOffset: this.document.currentOffset, selection: this.getCurrentSelection(), cursorPosition: t2 };
        }
        getCurrentSelection() {
          const t2 = o(this.document.editorView.container);
          return t2 ? { start: t2.start, end: t2.end } : { start: 0, end: 0 };
        }
        saveUndoSnapshot() {
          const t2 = this.createSnapshot();
          console.log("Saving snapshot:", t2.cursorPosition, "Stack length:", this.snapshotUndoStack.length), this.snapshotUndoStack.push(t2), this.snapshotUndoStack.length > this.maxSnapshots && this.snapshotUndoStack.shift(), this.snapshotRedoStack = [];
        }
        restoreSnapshot(t2) {
          this.document.blocks = t2.blocks, this.document.dataIds = t2.dataIds, this.document._selectedBlockId = t2.selectedBlockId, this.document.currentOffset = t2.currentOffset;
          for (let t3 of this.document.blocks) t3.pieces && Array.isArray(t3.pieces) && (t3.pieces = t3.pieces.map((t4) => new n(t4.text, t4.attributes)));
          this.document.emit("documentChanged", this.document), setTimeout(() => {
            this.document.setCursorPosition(t2.cursorPosition || 0);
          }, 0);
        }
        undo() {
          if (console.log("UNDO - Undo stack length:", this.snapshotUndoStack.length), console.log("UNDO - Redo stack length:", this.snapshotRedoStack.length), 0 === this.snapshotUndoStack.length) return;
          const t2 = this.createSnapshot();
          this.snapshotRedoStack.push(t2), this.snapshotRedoStack.length > this.maxSnapshots && this.snapshotRedoStack.shift();
          const e2 = this.snapshotUndoStack.pop();
          e2 && (console.log("UNDO - Restoring cursor position:", e2.cursorPosition), this.restoreSnapshot(e2));
        }
        redo() {
          if (0 === this.snapshotRedoStack.length) return;
          const t2 = this.createSnapshot();
          this.snapshotUndoStack.push(t2), this.snapshotUndoStack.length > this.maxSnapshots && this.snapshotUndoStack.shift();
          const e2 = this.snapshotRedoStack.pop();
          e2 && this.restoreSnapshot(e2);
        }
      }
      class E extends e {
        constructor(t2) {
          super(), this.container = t2, this.setupButtons();
        }
        setupButtons() {
          this.container.addEventListener("mousedown", (t2) => {
            t2.preventDefault();
          }), this.container.addEventListener("click", (t2) => {
            const e2 = t2.target.closest("button");
            if (e2) {
              const t3 = e2.getAttribute("data-action");
              t3 && this.emit("popupAction", t3);
            }
          });
        }
        show(t2) {
          const e2 = t2.getRangeAt(0).getBoundingClientRect();
          if (0 === e2.width && 0 === e2.height) return void this.hide();
          this.container.style.display = "flex";
          const n2 = this.container.offsetWidth, i2 = this.container.offsetHeight;
          let o2 = e2.top + window.scrollY - i2 - 8, s2 = e2.left + window.scrollX + e2.width / 2 - n2 / 2;
          o2 < window.scrollY && (o2 = e2.bottom + window.scrollY + 8), s2 < 0 && (s2 = 5), this.container.style.top = `${o2}px`, this.container.style.left = `${s2}px`;
        }
        hide() {
          this.container.style.display = "none";
        }
        updateActiveStates(t2) {
          this.container.querySelectorAll("button").forEach((e2) => {
            const n2 = e2.getAttribute("data-action");
            let i2 = false;
            "bold" === n2 && t2.bold && (i2 = true), "italic" === n2 && t2.italic && (i2 = true), "underline" === n2 && t2.underline && (i2 = true), "strikethrough" === n2 && t2.strikethrough && (i2 = true), "hyperlink" === n2 && t2.hyperlink && (i2 = true), e2.classList.toggle("active", i2);
          });
        }
      }
      class w {
        constructor() {
          this.linkElement = null, this.createPopup();
        }
        setCallbacks(t2, e2) {
          this.onOpenClick = t2, this.onUnlinkClick = e2;
        }
        createPopup() {
          this.popup = document.createElement("div"), this.popup.className = "link-popup", this.popup.style.cssText = "\n      position: absolute;\n      background: #000;\n      border-radius: 4px;\n      padding: 2px;\n      box-shadow: 0 1px 4px rgba(0,0,0,0.5);\n      z-index: 1000;\n      display: none;\n    ";
          const t2 = this.createButton("Open", "\u{1F517}"), e2 = this.createButton("Unlink", "\u2715");
          t2.addEventListener("click", () => this.handleOpenClick()), e2.addEventListener("click", () => this.handleUnlinkClick()), this.popup.appendChild(t2), this.popup.appendChild(e2), document.body.appendChild(this.popup);
        }
        createButton(t2, e2) {
          const n2 = document.createElement("button");
          return n2.innerHTML = `${e2}`, n2.title = t2, n2.style.cssText = "\n      background: transparent;\n      color: white;\n      border: none;\n      padding: 4px;\n      margin: 0 1px;\n      border-radius: 2px;\n      cursor: pointer;\n      font-size: 16px;\n      transition: background 0.1s;\n      width: 24px;\n      height: 24px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    ", n2.addEventListener("mouseenter", () => {
            n2.style.background = "#333";
          }), n2.addEventListener("mouseleave", () => {
            n2.style.background = "transparent";
          }), n2;
        }
        handleOpenClick() {
          this.linkElement && this.onOpenClick && this.onOpenClick(this.linkElement.href);
        }
        handleUnlinkClick() {
          this.onUnlinkClick && this.linkElement && this.onUnlinkClick(this.linkElement);
        }
        show(t2, e2, n2) {
          this.linkElement = t2;
          const i2 = t2.getBoundingClientRect();
          this.popup.style.left = `${i2.left + window.scrollX}px`, this.popup.style.top = `${i2.bottom + window.scrollY + 5}px`, this.popup.style.display = "flex", this.popup.style.opacity = "0", this.popup.style.transform = "translateY(-2px)", requestAnimationFrame(() => {
            this.popup.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out", this.popup.style.opacity = "1", this.popup.style.transform = "translateY(0)";
          });
        }
        hide() {
          "none" !== this.popup.style.display && (this.popup.style.transition = "opacity 0.1s ease-in-out, transform 0.1s ease-in-out", this.popup.style.opacity = "0", this.popup.style.transform = "translateY(-2px)", setTimeout(() => {
            this.popup.style.display = "none", this.popup.style.transition = "";
          }, 100));
        }
        isPopup(t2) {
          return this.popup.contains(t2);
        }
        isVisible() {
          return "none" !== this.popup.style.display;
        }
      }
      class x extends e {
        constructor(t2, e2) {
          var o2, s2, l2, d2, m2, f2, b2, y2, x2, A, S, T, R;
          super(), this.savedSelection = null, this.debounceTimer = null;
          const { mainEditorId: L, toolbarId: _, popupToolbarId: O } = k(t2, e2);
          this.editorContainer = document.getElementById(L) || null, this.toolbarContainer = document.getElementById(_) || null;
          const B = document.getElementById(O) || null;
          if (!this.editorContainer || !this.toolbarContainer || !B) throw new Error("Editor element not found or incorrect element type.");
          this.document = new i(), this.editorView = new c(this.editorContainer, this.document), this.toolbarView = new h(this.toolbarContainer), this.popupToolbarView = new E(B), this.linkPopupView = new w(), this.hyperlinkHandler = new p(this.editorContainer, this.editorView, this.document), this.imageHandler = new C(this.editorContainer, this.document), this.undoRedoManager = new v(this.document, this.editorView), this.editorView.setImageHandler(this.imageHandler), this.imageHandler.setEditorView(this.editorView), this.document.setEditorView(this.editorView), this.document.setUndoRedoManager(this.undoRedoManager), this.hyperlinkHandler.setUndoRedoManager(this.undoRedoManager), this.linkPopupView.setCallbacks((t3) => this.openLink(t3), (t3) => this.unlinkText(t3)), this.currentAttributes = { bold: false, italic: false, underline: false, strikethrough: false, undo: false, redo: false, hyperlink: false }, this.manualOverride = false, this.lastPiece = null, this.toolbarView.on("toolbarAction", (t3, e3 = []) => this.handleToolbarAction(t3, e3)), this.popupToolbarView.on("popupAction", (t3) => this.handleToolbarAction(t3)), this.document.on("documentChanged", () => this.editorView.render()), this.document.on("documentChanged", () => {
            var t3;
            const e3 = this.document.getHtmlContent();
            this.emit("contentChange", { html: e3, text: (null === (t3 = this.editorContainer) || void 0 === t3 ? void 0 : t3.textContent) || "" });
          }), this.editorContainer.addEventListener("keydown", (t3) => {
            this.syncCurrentAttributesWithCursor(), this.handleKeydown(t3);
          }), this.editorContainer.addEventListener("keyup", () => this.syncCurrentAttributesWithCursor()), this.editorContainer.addEventListener("blur", () => {
            this.hyperlinkHandler.hideHyperlinkViewButton();
          }), document.addEventListener("mouseup", () => {
            this.syncCurrentAttributesWithCursor();
            const t3 = this.document.getAllSelectedDataIds();
            console.log(t3, "dataId lntgerr");
          }), document.addEventListener("selectionchange", () => {
            const t3 = window.getSelection();
            t3 && !t3.isCollapsed || (this.document.dataIds = [], this.document.selectAll = false);
          }), null === (o2 = document.getElementById("fontColor")) || void 0 === o2 || o2.addEventListener("click", (t3) => {
            t3.stopPropagation();
            const e3 = document.getElementById("colorWrapper"), n2 = document.getElementById("fontColorPicker");
            if (!e3 || !n2) return;
            const i2 = "block" === e3.style.display;
            e3.style.display = i2 ? "none" : "block";
          }), null === (s2 = document.getElementById("fontColorPicker")) || void 0 === s2 || s2.addEventListener("input", (t3) => {
            const e3 = t3.target.value, [n2, i2] = this.getSelectionRange(), o3 = document.getElementById("fontColorIndicator");
            o3 && (o3.style.backgroundColor = e3), this.document.dataIds.length > 1 ? this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let i3 = 0;
                t4.pieces.forEach((t5) => {
                  i3 += t5.text.length;
                });
                let o4 = n2 - i3;
                this.document.applyFontColor(o4, i3, e3);
              }
            }) : (this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = setTimeout(() => {
              this.document.applyFontColor(n2, i2, e3);
            }, 300));
          }), null === (l2 = document.getElementById("colorResetFont")) || void 0 === l2 || l2.addEventListener("click", () => {
            const t3 = document.getElementById("fontColorPicker"), e3 = document.getElementById("fontColorIndicator");
            t3 && (t3.value = "#000000", e3 && (e3.style.backgroundColor = "#000000"), t3.dispatchEvent(new Event("input")));
          }), document.addEventListener("click", (t3) => {
            var e3;
            const n2 = t3.target, i2 = document.getElementById("colorWrapper"), o3 = document.getElementById("colorBgWrapper"), s3 = document.getElementById("fontColor"), l3 = document.getElementById("bgColor");
            !i2 || n2.closest("#colorWrapper") || n2 === s3 || (null == s3 ? void 0 : s3.contains(n2)) || (i2.style.display = "none"), !o3 || n2.closest("#colorBgWrapper") || n2 === l3 || (null == l3 ? void 0 : l3.contains(n2)) || (o3.style.display = "none"), (null === (e3 = this.editorContainer) || void 0 === e3 ? void 0 : e3.contains(n2)) || n2.closest(".hyperlink-popup") || this.hyperlinkHandler.hideHyperlinkViewButton();
          }), null === (d2 = document.getElementById("bgColor")) || void 0 === d2 || d2.addEventListener("click", (t3) => {
            t3.stopPropagation();
            const e3 = document.getElementById("colorBgWrapper"), n2 = document.getElementById("bgColorPicker");
            if (!e3 || !n2) return;
            const i2 = "block" === e3.style.display;
            e3.style.display = i2 ? "none" : "block";
          }), null === (m2 = document.getElementById("bgColorPicker")) || void 0 === m2 || m2.addEventListener("input", (t3) => {
            const e3 = t3.target.value, [n2, i2] = this.getSelectionRange(), o3 = document.getElementById("bgColorIndicator");
            o3 && (o3.style.backgroundColor = e3), this.document.dataIds.length > 1 ? this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let i3 = 0;
                t4.pieces.forEach((t5) => {
                  i3 += t5.text.length;
                });
                let o4 = n2 - i3;
                this.document.applyBgColor(o4, i3, e3);
              }
            }) : (this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = setTimeout(() => {
              this.document.applyBgColor(n2, i2, e3);
            }, 300));
          }), null === (f2 = document.getElementById("colorResetBG")) || void 0 === f2 || f2.addEventListener("click", () => {
            const t3 = document.getElementById("bgColorPicker"), e3 = document.getElementById("bgColorIndicator");
            t3 && (t3.value = "#ffffff", e3 && (e3.style.backgroundColor = "#ffffff"), t3.dispatchEvent(new Event("input")));
          }), null === (b2 = document.getElementById("getHtmlButton")) || void 0 === b2 || b2.addEventListener("click", (t3) => {
            const e3 = this.document.getHtmlContent(true);
            console.log("Editor HTML Content:", e3), this.htmlToJsonParser = new I(e3);
            const n2 = this.htmlToJsonParser.parse();
            console.log("htmltoJson", JSON.stringify(n2, null, 2), n2), this.showAcknowledgement("HTML copied to clipboard", 2e3);
          }), null === (y2 = document.getElementById("loadHtmlButton")) || void 0 === y2 || y2.addEventListener("click", (t3) => {
            this.undoRedoManager.saveUndoSnapshot();
            const e3 = u.TEST_HTML_CODE;
            this.htmlToJsonParser = new I(e3), console.log(this.htmlToJsonParser, "this.htmlToJsonParser");
            const n2 = this.htmlToJsonParser.parse();
            this.document.blocks = n2, this.document.dataIds[0] = n2[0].dataId, this.document.selectedBlockId = "data-id-1734604240404", this.document.emit("documentChanged", this);
            const [i2] = this.getSelectionRange();
            this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let e4 = 0;
                t4.pieces.forEach((t5) => {
                  e4 += t5.text.length;
                });
                let n3 = i2 - e4;
                this.document.setFontSize(n3, e4, t4.fontSize);
              }
            }), console.log("blocks", this.document.blocks, this.document.dataIds, this.document.currentOffset), console.log("htmltoJson", JSON.stringify(n2, null, 2), n2);
          }), null === (x2 = document.getElementById("fontFamily")) || void 0 === x2 || x2.addEventListener("change", (t3) => {
            this.undoRedoManager.saveUndoSnapshot();
            const e3 = t3.target.value, [n2, i2] = this.getSelectionRange();
            this.document.dataIds.length > 1 ? this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let i3 = 0;
                t4.pieces.forEach((t5) => {
                  i3 += t5.text.length;
                });
                let o3 = n2 - i3;
                this.document.setFontFamily(o3, i3, e3);
              }
            }) : this.document.setFontFamily(n2, i2, e3);
          }), null === (A = document.getElementById("fontSize")) || void 0 === A || A.addEventListener("change", (t3) => {
            this.undoRedoManager.saveUndoSnapshot();
            const e3 = t3.target.value, [n2, i2] = this.getSelectionRange();
            this.document.dataIds.length > 1 ? this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let i3 = 0;
                t4.pieces.forEach((t5) => {
                  i3 += t5.text.length;
                });
                let o3 = n2 - i3;
                this.document.setFontSize(o3, i3, e3);
              }
            }) : this.document.setFontSize(n2, i2, e3);
          }), null === (S = document.getElementById("alignLeft")) || void 0 === S || S.addEventListener("click", () => {
            console.log("alignment alignLeft", this.document.dataIds), this.document.dataIds.forEach((t3) => this.document.setAlignment("left", t3));
          }), null === (T = document.getElementById("alignCenter")) || void 0 === T || T.addEventListener("click", () => {
            console.log("alignment alignCenter", this.document.dataIds), this.document.dataIds.forEach((t3) => this.document.setAlignment("center", t3));
          }), null === (R = document.getElementById("alignRight")) || void 0 === R || R.addEventListener("click", () => {
            console.log("alignment alignRight", this.document.dataIds), this.document.dataIds.forEach((t3) => this.document.setAlignment("right", t3));
          }), this.editorContainer.addEventListener("keydown", (t3) => {
            if ((t3.ctrlKey || t3.metaKey) && !t3.altKey) {
              const e3 = t3.key.toLowerCase();
              if (["b", "i", "u", "h"].includes(e3)) {
                t3.preventDefault();
                let n2 = "b";
                switch (e3) {
                  case "b":
                    n2 = "bold";
                    break;
                  case "i":
                    n2 = "italic";
                    break;
                  case "u":
                    n2 = "underline";
                    break;
                  case "h":
                    n2 = "hyperlink";
                }
                this.handleToolbarAction(n2);
              }
              if ("z" === e3 ? (t3.preventDefault(), this.undoRedoManager.undo()) : "y" === e3 && (t3.preventDefault(), this.undoRedoManager.redo()), "a" === e3) {
                const t4 = this.document.handleCtrlASelection();
                this.document.selectAll = true, console.log("Selected text is inside element with data-id:", t4);
              }
              "l" === t3.key ? (t3.preventDefault(), this.document.setAlignment("left", this.document.selectedBlockId)) : "e" === t3.key ? (t3.preventDefault(), this.document.setAlignment("center", this.document.selectedBlockId)) : "r" === t3.key && (t3.preventDefault(), this.document.setAlignment("right", this.document.selectedBlockId));
            }
          }), document.addEventListener("selectionchange", this.handleSelectionChange.bind(this)), this.editorContainer.addEventListener("click", (t3) => {
            const e3 = t3.target;
            if ("A" === e3.tagName || e3.closest("a")) {
              t3.preventDefault(), t3.stopPropagation();
              const n2 = "A" === e3.tagName ? e3 : e3.closest("a");
              this.showLinkPopup(n2, t3.clientX, t3.clientY);
            } else this.hideLinkPopup();
          }), document.addEventListener("click", (t3) => {
            this.linkPopupView.isPopup(t3.target) || this.hideLinkPopup();
          }), this.document.emit("documentChanged", this.document), this.editorContainer.addEventListener("paste", (t3) => {
            var e3, i2;
            this.undoRedoManager.saveUndoSnapshot(), t3.preventDefault();
            const o3 = null === (e3 = t3.clipboardData) || void 0 === e3 ? void 0 : e3.getData("text/html"), [s3, l3] = this.getSelectionRange();
            l3 > s3 && this.document.deleteRange(s3, l3, this.document.selectedBlockId, this.document.currentOffset);
            let d3 = [];
            if (o3) d3 = g(o3);
            else {
              const e4 = (function(t4) {
                const e5 = [];
                let n2, i3 = 0;
                for (; null !== (n2 = r.exec(t4)); ) {
                  const o4 = n2.index;
                  let s4 = n2[0], l4 = "";
                  const r2 = s4.match(/[.,!?;:)\]\}"']+$/);
                  if (r2 && (l4 = r2[0], s4 = s4.slice(0, -l4.length)), a(t4, o4)) continue;
                  o4 > i3 && e5.push({ text: t4.substring(i3, o4), isUrl: false });
                  let d4 = s4;
                  d4.startsWith("http") || (d4 = "https://" + d4), e5.push({ text: s4, isUrl: true, url: d4 }), l4 && e5.push({ text: l4, isUrl: false }), i3 = o4 + n2[0].length;
                }
                return i3 < t4.length && e5.push({ text: t4.substring(i3), isUrl: false }), e5;
              })((null === (i2 = t3.clipboardData) || void 0 === i2 ? void 0 : i2.getData("text/plain")) || "");
              d3 = e4.map((t4) => t4.isUrl && t4.url ? new n(t4.text, Object.assign(Object.assign({}, this.currentAttributes), { hyperlink: t4.url })) : new n(t4.text, Object.assign({}, this.currentAttributes)));
            }
            let c2 = s3;
            for (const t4 of d3) this.document.insertAt(t4.text, Object.assign({}, t4.attributes), c2, this.document.selectedBlockId, 0, "", "batch"), c2 += t4.text.length;
            this.setCursorPosition(c2);
          }), this.editorContainer.addEventListener("dragover", (t3) => {
            t3.preventDefault();
          }), this.editorContainer.addEventListener("drop", (t3) => {
            var e3, i2;
            t3.preventDefault(), this.undoRedoManager.saveUndoSnapshot();
            const o3 = null === (e3 = t3.dataTransfer) || void 0 === e3 ? void 0 : e3.getData("text/html"), [s3, l3] = this.getSelectionRange();
            l3 > s3 && this.document.deleteRange(s3, l3, this.document.selectedBlockId, this.document.currentOffset);
            let r2 = [];
            if (o3) r2 = g(o3);
            else {
              const e4 = (null === (i2 = t3.dataTransfer) || void 0 === i2 ? void 0 : i2.getData("text/plain")) || "";
              r2 = [new n(e4, Object.assign({}, this.currentAttributes))];
            }
            let a2 = s3;
            for (const t4 of r2) this.document.insertAt(t4.text, Object.assign({}, t4.attributes), a2, this.document.selectedBlockId, 0, "", "batch"), a2 += t4.text.length;
            this.setCursorPosition(a2);
          });
        }
        getSelectionRange() {
          const t2 = o(this.editorView.container);
          return t2 ? [t2.start, t2.end] : [0, 0];
        }
        applyFontColor(t2) {
          const e2 = window.getSelection();
          if (!e2 || 0 === e2.rangeCount) return;
          e2.getRangeAt(0).toString();
        }
        handleToolbarAction(t2, e2 = []) {
          const [n2, i2] = this.getSelectionRange();
          switch (t2) {
            case "orderedList":
              if (this.document.dataIds.length > 1) this.document.toggleOrderedListForMultipleBlocks(this.document.dataIds);
              else {
                const t3 = this.document.selectedBlockId || this.document.dataIds[0];
                this.document.toggleOrderedList(t3);
              }
              this.document.updateOrderedListNumbers();
              break;
            case "unorderedList":
              this.document.dataIds.forEach((t3) => {
                this.document.toggleUnorderedList(t3);
              });
              break;
            case "image":
              this.imageHandler.insertImage();
              break;
            default:
              if (n2 < i2) switch (this.undoRedoManager.saveUndoSnapshot(), t2) {
                case "bold":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e3 = 0;
                      t3.pieces.forEach((t4) => {
                        e3 += t4.text.length;
                      });
                      let i3 = n2 - e3;
                      this.document.toggleBoldRange(i3, e3);
                    }
                  }) : this.document.toggleBoldRange(n2, i2);
                  break;
                case "italic":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e3 = 0;
                      t3.pieces.forEach((t4) => {
                        e3 += t4.text.length;
                      });
                      let i3 = n2 - e3;
                      this.document.toggleItalicRange(i3, e3);
                    }
                  }) : this.document.toggleItalicRange(n2, i2);
                  break;
                case "underline":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e3 = 0;
                      t3.pieces.forEach((t4) => {
                        e3 += t4.text.length;
                      });
                      let i3 = n2 - e3;
                      this.document.toggleUnderlineRange(i3, e3);
                    }
                  }) : this.document.toggleUnderlineRange(n2, i2);
                  break;
                case "strikethrough":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e3 = 0;
                      t3.pieces.forEach((t4) => {
                        e3 += t4.text.length;
                      });
                      let i3 = n2 - e3;
                      this.document.toggleStrikethroughRange(i3, e3);
                    }
                  }) : this.document.toggleStrikethroughRange(n2, i2);
                  break;
                case "hyperlink":
                  this.hyperlinkHandler.hanldeHyperlinkClick(n2, i2, this.document.currentOffset, this.document.selectedBlockId, this.document.blocks);
              }
              else this.currentAttributes[t2] = !this.currentAttributes[t2], this.manualOverride = true;
          }
          this.toolbarView.updateActiveStates(this.currentAttributes);
        }
        handleSelectionChange() {
          var t2, e2;
          const n2 = window.getSelection();
          if (!n2 || 0 === n2.rangeCount || !(null === (t2 = this.editorContainer) || void 0 === t2 ? void 0 : t2.contains(n2.anchorNode))) return this.hyperlinkHandler.hideHyperlinkViewButton(), void this.popupToolbarView.hide();
          const [i2] = this.getSelectionRange();
          if (this.imageHandler.currentCursorLocation = i2, n2.isCollapsed ? (this.document.dataIds = [], this.document.selectAll = false, this.popupToolbarView.hide()) : (this.document.getAllSelectedDataIds(), this.document.dataIds.length === this.document.blocks.length && this.document.blocks.length > 0 && (this.document.selectAll = true), this.popupToolbarView.show(n2)), !n2 || 0 === n2.rangeCount) return;
          n2 && true === n2.isCollapsed && (this.document.dataIds = [], this.document.selectAll = false);
          const o2 = n2.getRangeAt(0), s2 = (null === (e2 = o2.startContainer.parentElement) || void 0 === e2 ? void 0 : e2.closest("[data-id]")) || o2.startContainer;
          s2 instanceof HTMLElement && (this.document.selectedBlockId = s2.getAttribute("data-id") || (o2.startContainer instanceof HTMLElement ? o2.startContainer.getAttribute("data-id") : null)), this.syncCurrentAttributesWithCursor();
        }
        handleKeydown(t2) {
          var e2, i2;
          const [o2, s2] = this.getSelectionRange();
          if (this.imageHandler.currentCursorLocation = o2, "Enter" === t2.key) {
            t2.preventDefault(), this.undoRedoManager.saveUndoSnapshot();
            const i3 = `data-id-${Date.now()}`, l2 = this.document.blocks.findIndex((t3) => t3.dataId === this.document.selectedBlockId), r2 = this.document.blocks[l2], a2 = (null === (e2 = null == r2 ? void 0 : r2.pieces) || void 0 === e2 ? void 0 : e2.length) > 0 ? r2.pieces[r2.pieces.length - 1] : null, d2 = a2 ? Object.assign({}, a2.attributes) : { fontFamily: "Arial", fontSize: "16px", fontColor: "#000000", bgColor: "#ffffff", bold: false, italic: false, underline: false, strikethrough: false };
            if (r2 && "image" === r2.type) this.document.blocks.splice(l2 + 1, 0, { dataId: i3, class: "paragraph-block", pieces: [new n("\u200B", d2)], type: "text" }), this.document.emit("documentChanged", this), this.imageHandler.setCursorPostion(1, i3);
            else if (!r2 || "ol" !== r2.listType && "ul" !== r2.listType && "li" !== r2.listType) {
              const t3 = this.getCurrentCursorBlock(), e3 = null == t3 ? void 0 : t3.toString();
              if (e3 && r2 && "text" === r2.type) {
                const t4 = o2 - this.document.currentOffset, s3 = [], l3 = [];
                let a3 = 0;
                for (const e4 of r2.pieces) {
                  const i4 = a3 + e4.text.length;
                  if (i4 <= t4) s3.push(e4.clone());
                  else if (a3 >= t4) l3.push(e4.clone());
                  else {
                    const i5 = t4 - a3, o3 = e4.text.slice(0, i5), r3 = e4.text.slice(i5);
                    o3 && s3.push(new n(o3, Object.assign({}, e4.attributes))), r3 && l3.push(new n(r3, Object.assign({}, e4.attributes)));
                  }
                  a3 = i4;
                }
                r2.pieces = s3.length > 0 ? s3 : [new n("\u200B", d2)];
                const c2 = l3.length > 0 ? l3 : [new n("\u200B", d2)], h2 = this.addBlockAfter(this.document.blocks, e3, { dataId: i3, class: "paragraph-block", pieces: c2, type: "text" });
                this.document.blocks = h2;
              } else this.document.blocks.push({ dataId: i3, class: "paragraph-block", pieces: [new n("\u200B", d2)], type: "text" });
            } else {
              let t3 = { dataId: i3, class: "paragraph-block", pieces: [new n("\u200B", d2)], type: "text" }, e3 = "";
              if ("ol" === r2.listType ? (t3.listType = "li", t3.listStart = r2.listStart + 1, t3.parentId = r2.dataId, e3 = r2.dataId) : "li" === r2.listType ? (t3.listType = "li", t3.listStart = r2.listStart + 1, t3.parentId = r2.parentId, e3 = r2.parentId) : "ul" === r2.listType && (t3.listType = "ul", t3.parentId = r2.parentId || r2.dataId), this.document.blocks.splice(l2 + 1, 0, t3), "ol" === r2.listType || "li" === r2.listType) for (let t4 = l2 + 2; t4 < this.document.blocks.length; t4++) {
                const n2 = this.document.blocks[t4];
                if ("li" !== n2.listType || n2.parentId !== e3) break;
                n2.listStart += 1;
              }
            }
            this.syncCurrentAttributesWithCursor(), this.editorView.render(), this.setCursorPosition(s2 + 1, i3);
          } else if ("Backspace" === t2.key) {
            if (t2.preventDefault(), this.imageHandler.isImageHighlighted) {
              const t3 = this.document.blocks.findIndex((t4) => t4.dataId === this.imageHandler.highLightedImageDataId);
              return this.imageHandler.deleteImage(), void this.imageHandler.setCursorPostion(1, this.document.blocks[t3 - 1].dataId);
            }
            const e3 = window.getSelection();
            console.log(e3, "selection lntgerr");
            if ((this.document.selectAll || this.document.dataIds.length === this.document.blocks.length && this.document.dataIds.length > 0 || this.document.dataIds.length > 1) && !(null === (i2 = window.getSelection()) || void 0 === i2 ? void 0 : i2.isCollapsed)) {
              this.undoRedoManager.saveUndoSnapshot();
              const t3 = this.document.dataIds[0], e4 = this.document.blocks.findIndex((e5) => e5.dataId === t3);
              this.document.deleteBlocks();
              let i3 = null, o3 = 0;
              if (0 === this.document.blocks.length) {
                const t4 = `data-id-${Date.now()}`;
                this.document.blocks.push({ dataId: t4, class: "paragraph-block", pieces: [new n(" ")], type: "text" }), i3 = t4, o3 = 0, this.editorView.render();
              } else if (e4 < this.document.blocks.length) i3 = this.document.blocks[e4].dataId, o3 = 0;
              else {
                const t4 = this.document.blocks[this.document.blocks.length - 1];
                i3 = t4.dataId, o3 = t4.pieces.reduce((t5, e5) => t5 + e5.text.length, 0);
              }
              return void this.setCursorPosition(o3, i3);
            }
            if (s2 > o2) {
              this.undoRedoManager.saveUndoSnapshot();
              const t3 = Math.min(this.document.currentOffset, o2);
              this.document.deleteRange(o2, s2, this.document.selectedBlockId, t3, true), this.setCursorPosition(o2 - 1);
              const e4 = this.document.blocks.findIndex((t4) => t4.dataId === this.document.selectedBlockId);
              console.log(e4, "index lntgerr");
              if (null === document.querySelector(`[data-id="${this.document.selectedBlockId}"]`)) {
                let t4 = 0;
                console.log(t4, " listStart lntgerr");
                const e5 = this.document.blocks.map((e6, n2) => (void 0 === (null == e6 ? void 0 : e6.listType) && null === (null == e6 ? void 0 : e6.listType) || ("ol" === (null == e6 ? void 0 : e6.listType) ? (t4 = 1, e6.listStart = 1) : "li" === (null == e6 ? void 0 : e6.listType) && (t4 += 1, e6.listStart = t4)), e6));
                console.log(e5, "blocks lntgerr"), this.document.emit("documentChanged", this);
              }
            } else o2 === s2 && o2 > 0 && (this.document.deleteRange(o2 - 1, o2, this.document.selectedBlockId, this.document.currentOffset, true), this.setCursorPosition(o2 - 1));
          } else if (1 !== t2.key.length || t2.ctrlKey || t2.metaKey || t2.altKey) {
            if ("Delete" === t2.key) {
              if (t2.preventDefault(), o2 === s2) {
                if (this.undoRedoManager.saveUndoSnapshot(), s2 > o2) {
                  const t4 = Math.min(this.document.currentOffset, o2);
                  this.document.deleteRange(o2, s2, this.document.selectedBlockId, t4), this.setCursorPosition(o2);
                } else if (s2 > o2) return this.undoRedoManager.saveUndoSnapshot(), void this.document.deleteRange(o2, s2, this.document.selectedBlockId);
                const t3 = this.document.blocks.findIndex((t4) => t4.dataId === this.document.selectedBlockId);
                if (-1 === t3) return;
                const e3 = this.document.blocks[t3].pieces.reduce((t4, e4) => t4 + e4.text.length, 0);
                o2 - this.document.currentOffset < e3 ? (this.document.deleteRange(o2, o2 + 1, this.document.selectedBlockId, this.document.currentOffset, false), this.setCursorPosition(o2)) : s2 > o2 && (this.undoRedoManager.saveUndoSnapshot(), this.document.deleteRange(o2, s2, this.document.selectedBlockId), this.setCursorPosition(o2));
              }
              this.hyperlinkHandler.hideHyperlinkViewButton();
            }
          } else t2.preventDefault(), s2 > o2 && (this.undoRedoManager.saveUndoSnapshot(), this.document.deleteRange(o2, s2, this.document.selectedBlockId, this.document.currentOffset, false)), console.log("insertat", t2.key, this.currentAttributes, o2, this.document.selectedBlockId, this.document.currentOffset, "", "", !t2.isTrusted || false), this.document.insertAt(t2.key, this.currentAttributes, o2, this.document.selectedBlockId, this.document.currentOffset, "", "", !t2.isTrusted || false), this.setCursorPosition(o2 + 1);
        }
        extractTextFromDataId(t2) {
          const e2 = window.getSelection();
          if (console.log("selection::", e2), !e2 || 0 === e2.rangeCount) return { remainingText: "", piece: null };
          const n2 = e2.getRangeAt(0).startContainer;
          let i2 = "";
          console.log(0, "count lntgerr");
          const o2 = this.document.blocks.filter((e3) => {
            if (e3.dataId === t2) return e3;
          }), s2 = document.querySelector(`[data-id="${t2}"]`), l2 = this.document.getCursorOffsetInParent(`[data-id="${t2}"]`);
          let r2 = [], a2 = 0;
          if (o2[0].pieces.forEach((t3, e3) => {
            i2 += t3.text, (null == l2 ? void 0 : l2.innerText) === t3.text && (a2 = e3, r2.push(t3));
          }), o2[0].pieces.length > 1 && o2[0].pieces.forEach((t3, e3) => {
            a2 < e3 && r2.push(t3);
          }), !s2) return console.error(`Element with data-id "${t2}" not found.`), { remainingText: "", piece: null };
          if (!s2.contains(n2)) return console.error(`Cursor is not inside the element with data-id "${t2}".`), { remainingText: "", piece: null };
          const d2 = i2, c2 = null == l2 ? void 0 : l2.offset, h2 = d2.slice(c2), u2 = d2.slice(0, c2);
          return s2.textContent = u2, { remainingText: h2, piece: r2 };
        }
        getCurrentCursorBlock() {
          const t2 = window.getSelection();
          if (!t2 || 0 === t2.rangeCount) return null;
          const e2 = t2.getRangeAt(0).startContainer, n2 = e2.nodeType === Node.TEXT_NODE ? e2.parentElement : e2;
          let i2 = null;
          return n2 && n2 instanceof Element && (i2 = n2.closest("[data-id]")), (null == i2 ? void 0 : i2.getAttribute("data-id")) || null;
        }
        addBlockAfter(t2, e2, n2) {
          const i2 = t2.findIndex((t3) => t3.dataId === e2);
          if (-1 === i2) return console.error(`Block with dataId "${e2}" not found.`), t2;
          return [...t2.slice(0, i2 + 1), n2, ...t2.slice(i2 + 1)];
        }
        syncCurrentAttributesWithCursor() {
          var t2;
          const [e2, n2] = this.getSelectionRange();
          console.log("log1", { start: e2, end: n2 });
          const i2 = this.document.blocks.findIndex((t3) => t3.dataId === this.document.selectedBlockId);
          if ("image" === (null === (t2 = this.document.blocks[i2]) || void 0 === t2 ? void 0 : t2.type) ? this.imageHandler.addStyleToImage(this.document.selectedBlockId || "") : this.imageHandler.isImageHighlighted && this.imageHandler.clearImageStyling(), e2 === n2) {
            const t3 = this.document.findPieceAtOffset(e2, this.document.selectedBlockId);
            t3 ? (t3 !== this.lastPiece && (this.manualOverride = false, this.lastPiece = t3), this.manualOverride || (this.currentAttributes = { bold: t3.attributes.bold, italic: t3.attributes.italic, underline: t3.attributes.underline, strikethrough: t3.attributes.strikethrough || false, hyperlink: t3.attributes.hyperlink || false, fontFamily: t3.attributes.fontFamily, fontSize: t3.attributes.fontSize, fontColor: t3.attributes.fontColor, bgColor: t3.attributes.bgColor }, this.toolbarView.updateActiveStates(this.currentAttributes), this.popupToolbarView.updateActiveStates(this.currentAttributes)), this.hyperlinkHandler.hideHyperlinkViewButton()) : (this.hyperlinkHandler.hideHyperlinkViewButton(), this.manualOverride || (this.currentAttributes = { bold: false, italic: false, underline: false, strikethrough: false, hyperlink: false }, this.toolbarView.updateActiveStates(this.currentAttributes), this.popupToolbarView.updateActiveStates(this.currentAttributes)), this.lastPiece = null);
          } else {
            this.hyperlinkHandler.hideHyperlinkViewButton();
            const t3 = this.document.isRangeEntirelyAttribute(e2, n2, "bold"), i3 = this.document.isRangeEntirelyAttribute(e2, n2, "italic"), o2 = this.document.isRangeEntirelyAttribute(e2, n2, "underline"), s2 = this.document.isRangeEntirelyAttribute(e2, n2, "strikethrough");
            this.currentAttributes = { bold: t3, italic: i3, underline: o2, strikethrough: s2, hyperlink: false }, this.toolbarView.updateActiveStates(this.currentAttributes), this.popupToolbarView.updateActiveStates(this.currentAttributes);
          }
        }
        setCursorPosition(t2, e2 = "") {
          if ("" === e2) this.editorView.container.focus();
          else {
            const t3 = document.querySelector('[data-id="' + e2 + '"]');
            t3 && t3.focus();
          }
          const n2 = window.getSelection();
          if (!n2) return;
          const i2 = document.createRange();
          let o2 = 0;
          const s2 = [this.editorView.container];
          let l2;
          for (; l2 = s2.pop(); ) if (3 === l2.nodeType) {
            const e3 = l2, n3 = o2 + e3.length;
            if (t2 >= o2 && t2 <= n3) {
              i2.setStart(e3, t2 - o2), i2.collapse(true);
              break;
            }
            o2 = n3;
          } else if ("BR" === l2.tagName) {
            if (t2 === o2) {
              i2.setStartBefore(l2), i2.collapse(true);
              break;
            }
            o2++;
          } else {
            const t3 = l2;
            let e3 = t3.childNodes.length;
            for (; e3--; ) s2.push(t3.childNodes[e3]);
          }
          n2.removeAllRanges(), n2.addRange(i2);
        }
        showAcknowledgement(t2, e2 = 2e3) {
          const n2 = document.getElementById(u.TOAST_ID);
          n2 && n2.remove();
          const i2 = document.createElement("div");
          i2.id = u.TOAST_ID, i2.className = "ti-toast", i2.textContent = t2 || u.TOAST_DEFAULT_MESSAGE, document.body.appendChild(i2), i2.offsetHeight, i2.classList.add(u.TOAST_SHOW_CLASS), setTimeout(() => {
            i2.classList.remove(u.TOAST_SHOW_CLASS), setTimeout(() => i2.remove(), 200);
          }, e2 || u.TOAST_DEFAULT_DURATION_MS);
        }
        showLinkPopup(t2, e2, n2) {
          this.linkPopupView.show(t2, e2, n2);
        }
        hideLinkPopup() {
          this.linkPopupView.hide();
        }
        openLink(t2) {
          window.open(t2, "_blank"), this.hideLinkPopup();
        }
        unlinkText(t2) {
          this.undoRedoManager.saveUndoSnapshot();
          const e2 = t2.textContent || "", n2 = (this.editorView.container.textContent || "").indexOf(e2);
          -1 !== n2 && (this.document.formatAttribute(n2, n2 + e2.length, "hyperlink", false), this.editorView.render()), this.hideLinkPopup();
        }
        onContentChange(t2) {
          this.on("contentChange", t2);
        }
        getContent() {
          return this.document.getHtmlContent() || "";
        }
        getTextContent() {
          var t2;
          return (null === (t2 = this.editorContainer) || void 0 === t2 ? void 0 : t2.textContent) || "";
        }
      }
      window.TextIgniter = x, t.TextIgniter = x;
    });
  }
});

// src/component/TextIgniterComponent.ts
var import_textigniter = __toESM(require_dist(), 1);

// #style-inject:#style-inject
function styleInject(css, { insertAt } = {}) {
  if (!css || typeof document === "undefined") return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// ../core/dist/styles/text-igniter.css
styleInject(`.editor-container {
  border: none;
  padding: 0;
  border-radius: 12px;
}
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 12px;
  margin-bottom: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.toolbar-separator {
  width: 1px;
  height: 24px;
  background: #e5e7eb;
  margin: 0 8px;
}
.toolbar button {
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 32px;
  height: 32px;
}
.toolbar button:hover {
  background: #f3f4f6;
}
.toolbar button:hover#fontColor,
.toolbar button:hover#bgColor {
  background: transparent !important;
}
.toolbar button[data-tooltip]:hover#fontColor,
.toolbar button[data-tooltip]:hover#bgColor {
  background: transparent !important;
}
.toolbar button.active {
  background: #e5e7eb;
  color: #111827;
}
.toolbar button svg {
  width: 18px;
  height: 18px;
  display: block;
}
.toolbar button[data-tooltip],
.toolbar select[data-tooltip],
.popup-toolbar button[data-tooltip] {
  position: relative;
}
.toolbar button[data-tooltip]::before,
.toolbar select[data-tooltip]::before,
.popup-toolbar button[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  padding: 8px 12px;
  background: #1f2937;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.toolbar button[data-tooltip]::after,
.toolbar select[data-tooltip]::after,
.popup-toolbar button[data-tooltip]::after {
  content: "";
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  border: 5px solid transparent;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.toolbar button[data-tooltip]:hover::before,
.toolbar button[data-tooltip]:hover::after,
.toolbar select[data-tooltip]:hover::before,
.toolbar select[data-tooltip]:hover::after,
.popup-toolbar button[data-tooltip]:hover::before,
.popup-toolbar button[data-tooltip]:hover::after {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
#fontFamily,
#fontSize {
  padding: 6px 12px;
  padding-right: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  transition: all 0.15s ease;
  appearance: none;
  -webkit-appearance: none;
}
#fontFamily:hover,
#fontSize:hover {
  border-color: #d1d5db;
  background-color: #f9fafb;
}
#fontFamily:focus,
#fontSize:focus {
  outline: none;
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.15);
}
#fontFamily {
  min-width: 130px;
}
#fontSize {
  min-width: 75px;
}
#editor {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px 24px;
  min-height: 200px;
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  background: #fff;
  margin-top: 12px;
  font-size: 15px;
  line-height: 1.6;
  color: #1f2937;
}
#editor:focus {
  border-color: #d1d5db;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
}
.paragraph-block {
  padding: 2px 0;
  margin: 0;
}
#fontColor,
#bgColor {
  font-size: 15px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}
#fontColor::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  border-radius: 2px;
}
#bgColor::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  border-radius: 2px;
}
#fontColorPicker,
#bgColorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  height: 20px;
  width: 20px;
  cursor: pointer;
  border-radius: 4px;
}
#fontColorWrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}
#hyperlink-container,
#hyperlink-container-view {
  position: absolute;
  display: none;
  z-index: 1000;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
}
#hyperlink-input {
  width: 220px;
  margin-right: 8px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.15s ease;
}
#hyperlink-input:focus {
  outline: none;
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.15);
}
#apply-hyperlink,
#cancel-hyperlink {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
}
#apply-hyperlink {
  background: #1f2937;
  color: white;
}
#apply-hyperlink:hover {
  background: #000000;
}
#cancel-hyperlink {
  background: #f3f4f6;
  color: #000000;
}
#cancel-hyperlink:hover {
  background: #e5e7eb;
}
.temporary-selection-highlight {
  background-color: rgba(59, 130, 246, 0.3);
}
.popup-toolbar {
  position: absolute;
  z-index: 1001;
  background: #fff;
  border-radius: 10px;
  padding: 6px 8px;
  display: none;
  align-items: center;
  gap: 2px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}
.popup-toolbar button {
  background: transparent;
  border: none;
  color: #000000;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.popup-toolbar button:hover {
  background: #f3f4f6;
}
.popup-toolbar button.active {
  background: #e5e7eb;
}
.popup-toolbar button svg {
  width: 16px;
  height: 16px;
  display: block;
}
.popup-toolbar .toolbar-separator {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
}
.ti-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  background: #1f2937;
  color: #fff;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  z-index: 2000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
.ti-toast.ti-toast--show {
  opacity: 1;
}
.text-igniter a {
  color: #2563eb;
  text-decoration: underline;
  text-decoration-color: rgba(37, 99, 235, 0.3);
  text-underline-offset: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.text-igniter a:hover {
  color: #1d4ed8;
  text-decoration-color: rgba(37, 99, 235, 0.6);
}
.text-igniter a:visited {
  color: #7c3aed;
}
.link-popup {
  position: absolute;
  background: #1f2937;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: none;
  animation: fadeIn 0.15s ease;
  flex-direction: row;
  gap: 2px;
}
.link-popup button {
  background: transparent;
  color: white;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s ease;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.link-popup button:hover {
  background: rgba(255, 255, 255, 0.1);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
#editor img {
  max-width: 100%;
  border-radius: 8px;
  margin: 8px 0;
}
#editor .image-float-right {
  float: right;
  margin: 0 0 12px 16px;
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
#editor .image-float-left {
  float: left;
  margin: 0 16px 12px 0;
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
`);

// src/component/TextIgniterComponent.ts
var TextIgniterComponent = class extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
    this.config = {};
    this.template = `<div id="editor-container"></div>`;
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
  }
  static get observedAttributes() {
    return ["config"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "config" && newValue !== oldValue) {
      try {
        console.log(newValue);
        const parsedConfig = JSON.parse(newValue);
        this.config = parsedConfig;
        this.initializeEditor();
      } catch (e) {
        console.error("Failed to parse config: ", e);
      }
    }
  }
  connectedCallback() {
    if (this.initialized) {
      return;
    }
    this.initializeEditor();
  }
  initializeEditor() {
    var _a;
    if (this.initialized) {
      return;
    }
    const editorContainer = (_a = this.querySelector("#editor-container")) == null ? void 0 : _a.id;
    if (!editorContainer) {
      console.error("Editor element not found inside the DOM.");
      return;
    }
    try {
      this.initialized = true;
      this.textIgniter = new import_textigniter.TextIgniter(
        editorContainer,
        this.config
      );
      this.textIgniter.onContentChange((data) => {
        const event = new CustomEvent("content-change", {
          detail: data,
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(event);
      });
    } catch (error) {
      console.error("Failed to initialize TextIgniter:", error);
      this.initialized = false;
    }
  }
};
if (!customElements.get("text-igniter")) {
  customElements.define("text-igniter", TextIgniterComponent);
}
export {
  TextIgniterComponent
};
//# sourceMappingURL=index.js.map
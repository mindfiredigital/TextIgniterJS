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
          const n2 = document.getElementById("fontFamily"), s2 = document.getElementById("fontSize");
          let o2 = "Arial", i2 = "16px", l2 = document.getElementById("fontColorPicker"), a2 = document.getElementById("bgColorPicker");
          n2 && (o2 = n2.value), s2 && (i2 = s2.value);
          const r2 = e2.fontColor || (l2 ? l2.value : "#000000"), d2 = e2.bgColor || (a2 ? a2.value : "#ffffff");
          this.attributes = { bold: e2.bold || false, italic: e2.italic || false, underline: e2.underline || false, strikethrough: e2.strikethrough || false, subscript: e2.subscript || false, superscript: e2.superscript || false, undo: e2.undo || false, redo: e2.redo || false, fontFamily: e2.fontFamily || o2, fontSize: e2.fontSize || i2, hyperlink: e2.hyperlink || false, fontColor: r2, bgColor: d2 };
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
          return this.attributes.bold === t2.attributes.bold && this.attributes.italic === t2.attributes.italic && this.attributes.underline === t2.attributes.underline && (this.attributes.strikethrough || false) === (t2.attributes.strikethrough || false) && (this.attributes.subscript || false) === (t2.attributes.subscript || false) && (this.attributes.superscript || false) === (t2.attributes.superscript || false) && this.attributes.undo === t2.attributes.undo && this.attributes.redo === t2.attributes.redo && this.attributes.fontFamily === t2.attributes.fontFamily && this.attributes.fontSize === t2.attributes.fontSize && this.attributes.italic === t2.attributes.italic && this.attributes.underline === t2.attributes.underline && this.attributes.hyperlink === t2.attributes.hyperlink && this.attributes.fontColor === t2.attributes.fontColor && this.attributes.bgColor === t2.attributes.bgColor;
        }
        getHyperlink() {
          return this.attributes.hyperlink || false;
        }
        setHyperlink(t2) {
          this.attributes.hyperlink = t2;
        }
      }
      class s extends e {
        get selectedBlockId() {
          return this._selectedBlockId;
        }
        set selectedBlockId(t2) {
          if (this._selectedBlockId !== t2) {
            this._selectedBlockId = t2;
            const e2 = document.querySelector('[id="editor"]'), n2 = document.querySelector('[data-id="' + t2 + '"]');
            if (e2 && n2) {
              const t3 = this.getCursorOffset(e2), s2 = this.getCursorOffset(n2);
              this.currentOffset = t3 - s2;
            } else this.currentOffset = 0;
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
        insertAt(t2, e2, s2, o2 = "", i2 = 0, l2 = "", a2 = "", r2 = false) {
          r2 || "batch" === a2 || this.undoRedoManager.saveUndoSnapshot(), console.log("inserted,", { start: s2, text: t2 }), console.log("inserted,", this.blocks);
          let d2 = 0, c2 = [], h2 = false, u2 = 0;
          if ("" === o2 || null === o2) return;
          if (u2 = this.blocks.findIndex((t3) => t3.dataId === o2), -1 === u2 || !this.blocks[u2].pieces) return;
          d2 = this.currentOffset;
          for (let o3 of this.blocks[u2].pieces) {
            const i3 = d2 + o3.text.length;
            if (!h2 && s2 <= i3) {
              const i4 = s2 - d2;
              i4 > 0 && c2.push(new n(o3.text.slice(0, i4), Object.assign({}, o3.attributes))), c2.push(new n(t2, { bold: e2.bold || false, italic: e2.italic || false, underline: e2.underline || false, strikethrough: e2.strikethrough || false, hyperlink: e2.hyperlink || false })), i4 < o3.text.length && c2.push(new n(o3.text.slice(i4), Object.assign({}, o3.attributes))), h2 = true;
            } else c2.push(o3.clone());
            d2 = i3;
          }
          if (!h2) {
            const s3 = c2[c2.length - 1];
            s3 && s3.hasSameAttributes(new n("", { bold: e2.bold || false, italic: e2.italic || false, underline: e2.underline || false, strikethrough: e2.strikethrough || false, hyperlink: e2.hyperlink || false })) ? s3.text += t2 : c2.push(new n(t2, { bold: e2.bold || false, italic: e2.italic || false, underline: e2.underline || false, strikethrough: e2.strikethrough || false, hyperlink: e2.hyperlink || false }));
          }
          let p2 = this.mergePieces(c2);
          this.blocks[u2].pieces = p2, console.log({ position: s2 }), this.emit("documentChanged", this);
        }
        deleteRange(t2, e2, s2 = "", o2 = 0, i2 = false) {
          if (console.log("deleted2,", { start: t2, end: e2 }), t2 === e2) return;
          let l2 = [], a2 = 0, r2 = 0, d2 = false;
          if ("" === s2 || null === s2) return;
          if (r2 = this.blocks.findIndex((t3) => t3.dataId === s2), -1 === r2 || !this.blocks[r2].pieces) return;
          a2 = o2;
          let c2 = -1;
          if (i2 && t2 === a2 && r2 > 0 && e2 === t2 && (c2 = r2 - 1 >= 0 && "image" === this.blocks[r2 - 1].type ? r2 - 2 : r2 - 1, c2 >= 0 && this.blocks[c2])) for (let t3 of this.blocks[c2].pieces) l2.push(t3.clone()), d2 = true;
          for (let s3 of this.blocks[r2].pieces) {
            const o3 = a2 + s3.text.length, i3 = a2;
            if (o3 <= t2 || i3 >= e2) l2.push(s3.clone());
            else {
              const a3 = s3.text;
              if (t2 > i3) {
                const e3 = a3.slice(0, t2 - i3);
                e3.length > 0 && l2.push(new n(e3, Object.assign({}, s3.attributes)));
              }
              if (e2 < o3) {
                const t3 = a3.slice(e2 - i3);
                t3.length > 0 && l2.push(new n(t3, Object.assign({}, s3.attributes)));
              }
            }
            a2 = o3;
          }
          let h2 = this.mergePieces(l2), u2 = false;
          d2 && c2 >= 0 ? (!this.blocks[r2] || "ol" !== this.blocks[r2].listType && "li" !== this.blocks[r2].listType || (u2 = true), this.blocks[c2].pieces = h2, this.blocks.splice(r2, 1)) : 0 === h2.length ? this.blocks.length > 1 ? (!this.blocks[r2] || "ol" !== this.blocks[r2].listType && "li" !== this.blocks[r2].listType || (u2 = true), this.blocks.splice(r2, 1)) : (h2 = [new n(" ")], this.blocks[r2].pieces = h2) : this.blocks[r2].pieces = h2, u2 && this.updateOrderedListNumbers(), this.emit("documentChanged", this);
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
          const n2 = e2.getRangeAt(0), s2 = [], o2 = document.createNodeIterator(n2.commonAncestorContainer, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
          let i2;
          for (; i2 = o2.nextNode(); ) if (n2.intersectsNode(i2)) {
            const e3 = i2.nodeType === Node.TEXT_NODE ? i2.parentElement : i2, n3 = null === (t2 = null == e3 ? void 0 : e3.closest("[data-id]")) || void 0 === t2 ? void 0 : t2.getAttribute("data-id");
            n3 && !s2.includes(n3) && s2.push(n3);
          }
          return this.removeExclusiveEndBlock(n2, s2), this.dataIds = s2, console.log("selected id 3", this.dataIds, s2), s2;
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
          const e2 = t2.getRangeAt(0), n2 = [], s2 = e2.startContainer, o2 = e2.endContainer, i2 = this.getDataIdFromNode(s2), l2 = this.getDataIdFromNode(o2);
          return i2 && !n2.includes(i2) && n2.push(i2), l2 && !n2.includes(l2) && n2.push(l2), this.removeExclusiveEndBlock(e2, n2), this.dataIds = n2, console.log("selected id 1", this.dataIds, n2), n2;
        }
        getDataIdFromNode(t2) {
          var e2;
          const n2 = t2.nodeType === Node.TEXT_NODE ? t2.parentElement : t2;
          return (null === (e2 = null == n2 ? void 0 : n2.closest("[data-id]")) || void 0 === e2 ? void 0 : e2.getAttribute("data-id")) || null;
        }
        getCursorOffset(t2) {
          const e2 = window.getSelection();
          if (!e2 || 0 === e2.rangeCount || !t2) return -1;
          const n2 = e2.getRangeAt(0);
          let s2 = 0;
          const o2 = (t3) => {
            if (t3 === n2.startContainer) return s2 += n2.startOffset, true;
            t3.nodeType === Node.TEXT_NODE && (s2 += (t3.textContent || "").length);
            for (const e3 of Array.from(t3.childNodes)) if (o2(e3)) return true;
            return false;
          };
          return o2(t2), s2;
        }
        formatAttribute(t2, e2, s2, o2) {
          console.log("formatAttribute", t2, e2, s2, o2);
          let i2 = [], l2 = 0, a2 = -1;
          if ("" === this.selectedBlockId || null === this.selectedBlockId) return;
          if (a2 = this.blocks.findIndex((t3) => t3.dataId === this.selectedBlockId), -1 === a2 || !this.blocks[a2].pieces) return;
          l2 = this.currentOffset;
          for (let r3 of this.blocks[a2].pieces) {
            const a3 = l2 + r3.text.length;
            if (a3 <= t2 || l2 >= e2) i2.push(r3.clone());
            else {
              const a4 = l2, d2 = r3.text, c2 = Math.max(t2 - a4, 0), h2 = Math.min(e2 - a4, d2.length);
              c2 > 0 && i2.push(new n(d2.slice(0, c2), Object.assign({}, r3.attributes)));
              const u2 = new n(d2.slice(c2, h2), Object.assign({}, r3.attributes));
              ("bold" !== s2 && "italic" !== s2 && "underline" !== s2 && "strikethrough" !== s2 && "subscript" !== s2 && "superscript" != s2 && "undo" !== s2 && "redo" !== s2 && "hyperlink" !== s2 || "boolean" != typeof o2) && ("fontFamily" !== s2 && "fontSize" !== s2 && "hyperlink" !== s2 && "fontColor" !== s2 && "bgColor" !== s2 || "string" != typeof o2) || (u2.attributes[s2] = o2), i2.push(u2), h2 < d2.length && i2.push(new n(d2.slice(h2), Object.assign({}, r3.attributes)));
            }
            l2 = a3;
          }
          const r2 = this.mergePieces(i2);
          this.blocks[a2].pieces = r2, this.emit("documentChanged", this);
        }
        toggleOrderedList(t2, e2 = "") {
          const n2 = this.blocks.findIndex((e3) => e3.dataId === t2);
          if (-1 === n2) return;
          const s2 = this.blocks[n2];
          "ol" === s2.listType || "li" === s2.listType ? (s2.listType = null, s2.listStart = void 0, s2.parentId = void 0) : (s2.listType = "ol", s2.listStart = 1, s2.parentId = s2.dataId), this.updateOrderedListNumbers(), this.emit("documentChanged", this);
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
              const s2 = this.blocks.find((t4) => t4.dataId === e3);
              s2 && (0 === n2 ? (s2.listType = "ol", s2.listStart = 1, s2.parentId = t3) : (s2.listType = "li", s2.listStart = n2 + 1, s2.parentId = t3));
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
            const s2 = this.blocks[n2];
            if ("ol" === s2.listType || "li" === s2.listType) {
              ("ol" === s2.listType || s2.parentId !== e2) && (t2 = 1, e2 = "ol" === s2.listType ? s2.dataId : s2.parentId), s2.listStart = t2, t2++;
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
          const s2 = window.getSelection();
          if (!s2) return;
          const o2 = document.createRange();
          let i2 = 0;
          const l2 = [this.editorView.container];
          let a2;
          const r2 = (null === (n2 = this.editorView.container.textContent) || void 0 === n2 ? void 0 : n2.length) || 0;
          if (!(t2 < 0 || t2 > r2)) {
            for (; a2 = l2.pop(); ) if (3 === a2.nodeType) {
              const e3 = a2, n3 = i2 + e3.length;
              if (t2 >= i2 && t2 <= n3) {
                o2.setStart(e3, Math.min(t2 - i2, e3.length)), o2.collapse(true);
                break;
              }
              i2 = n3;
            } else if ("BR" === a2.tagName) {
              if (t2 === i2) {
                o2.setStartBefore(a2), o2.collapse(true);
                break;
              }
              i2++;
            } else {
              const t3 = a2;
              let e3 = t3.childNodes.length;
              for (; e3--; ) l2.push(t3.childNodes[e3]);
            }
            s2.removeAllRanges(), s2.addRange(o2);
          }
        }
        toggleBoldRange(t2, e2, n2 = "") {
          const s2 = this.isRangeEntirelyAttribute(t2, e2, "bold");
          this.formatAttribute(t2, e2, "bold", !s2);
        }
        toggleItalicRange(t2, e2, n2 = "") {
          const s2 = this.isRangeEntirelyAttribute(t2, e2, "italic");
          this.formatAttribute(t2, e2, "italic", !s2);
        }
        toggleUnderlineRange(t2, e2, n2 = "") {
          const s2 = this.isRangeEntirelyAttribute(t2, e2, "underline");
          this.formatAttribute(t2, e2, "underline", !s2);
        }
        toggleStrikethroughRange(t2, e2, n2 = "") {
          const s2 = this.isRangeEntirelyAttribute(t2, e2, "strikethrough");
          this.formatAttribute(t2, e2, "strikethrough", !s2);
        }
        toggleSubscriptRange(t2, e2, n2 = "") {
          const s2 = this.isRangeEntirelyAttribute(t2, e2, "subscript");
          s2 || this.formatAttribute(t2, e2, "superscript", false), this.formatAttribute(t2, e2, "subscript", !s2);
        }
        toggleSuperscriptRange(t2, e2, n2 = "") {
          const s2 = this.isRangeEntirelyAttribute(t2, e2, "superscript");
          s2 || this.formatAttribute(t2, e2, "subscript", false), this.formatAttribute(t2, e2, "superscript", !s2);
        }
        toggleUndoRange(t2, e2, n2 = "") {
          const s2 = this.isRangeEntirelyAttribute(t2, e2, "undo");
          this.formatAttribute(t2, e2, "undo", !s2);
        }
        toggleRedoRange(t2, e2) {
          const n2 = this.isRangeEntirelyAttribute(t2, e2, "redo");
          this.formatAttribute(t2, e2, "redo", !n2);
        }
        applyFontColor(t2, e2, n2, s2 = "") {
          t2 < e2 && (this.formatAttribute(t2, e2, "fontColor", n2), console.log("applyFontColor-color", n2, t2, e2));
        }
        applyBgColor(t2, e2, n2, s2 = "") {
          t2 < e2 && this.formatAttribute(t2, e2, "bgColor", n2);
        }
        isRangeEntirelyAttribute(t2, e2, n2) {
          let s2 = this.currentOffset, o2 = true;
          if ("" !== this.selectedBlockId && null !== this.selectedBlockId) {
            const i2 = this.blocks.findIndex((t3) => t3.dataId === this.selectedBlockId);
            if (-1 === i2 || !this.blocks[i2].pieces) return false;
            for (let l2 of this.blocks[i2].pieces) {
              const i3 = s2 + l2.text.length;
              if (i3 > t2 && s2 < e2 && !l2.attributes[n2]) {
                o2 = false;
                break;
              }
              s2 = i3;
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
          if ("" !== e2 && null !== e2) for (let s2 of this.blocks) {
            if ("table" === s2.type || "layout" === s2.type || !s2.pieces) continue;
            const o2 = s2.pieces.reduce((t3, e3) => t3 + e3.text.length, 0);
            if (s2.dataId == e2) {
              let e3 = null;
              for (let o3 of s2.pieces) {
                const s3 = n2, i2 = s3 + o3.text.length;
                if (t2 >= s3 && t2 < i2) return t2 === s3 && e3 ? e3 : o3;
                e3 = o3, n2 = i2;
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
          const s2 = window.getSelection();
          if (!s2 || 0 === s2.rangeCount) return null;
          const o2 = s2.getRangeAt(0);
          if (!n2.contains(o2.startContainer)) return null;
          let i2 = 0, l2 = null;
          const a2 = document.createTreeWalker(n2, NodeFilter.SHOW_TEXT, null);
          let r2 = null;
          for (; a2.nextNode(); ) {
            const t3 = a2.currentNode;
            if (console.log(t3, "textPosition - currentNode: vicky"), t3 === o2.startContainer) {
              i2 += o2.startOffset, l2 = t3, r2 = t3.parentElement;
              break;
            }
            i2 += (null === (e2 = t3.textContent) || void 0 === e2 ? void 0 : e2.length) || 0;
          }
          return console.log({ offset: i2, childNode: l2, innerHTML: r2.innerHTML, innerText: r2.innerText }, "textPosition - return values: vicky"), { offset: i2, childNode: l2, innerHTML: r2.innerHTML, innerText: r2.innerText };
        }
        removeExclusiveEndBlock(t2, e2) {
          if (e2.length <= 1) return;
          const n2 = t2.endContainer, s2 = t2.endOffset;
          let o2 = false;
          if ((n2.nodeType === Node.TEXT_NODE || n2.nodeType === Node.ELEMENT_NODE) && (o2 = 0 === s2), !o2) return;
          const i2 = this.getDataIdFromNode(n2);
          if (!i2) return;
          if (i2 !== this.getDataIdFromNode(t2.startContainer) && e2.includes(i2)) {
            const t3 = e2.lastIndexOf(i2);
            t3 > -1 && e2.splice(t3, 1);
          }
        }
      }
      function o(t2) {
        const e2 = window.getSelection();
        if (!e2 || 0 === e2.rangeCount) return null;
        const n2 = e2.getRangeAt(0), s2 = n2.cloneRange();
        s2.selectNodeContents(t2), s2.setEnd(n2.startContainer, n2.startOffset);
        const o2 = s2.toString().length;
        s2.setEnd(n2.endContainer, n2.endOffset);
        return { start: o2, end: s2.toString().length };
      }
      function i(t2, e2) {
        if (!e2) return;
        let n2 = 0;
        const s2 = document.createRange();
        s2.setStart(t2, 0), s2.collapse(true);
        const o2 = [t2];
        let i2, l2 = false, a2 = false;
        for (; !a2 && (i2 = o2.pop()); ) if (3 === i2.nodeType) {
          const t3 = i2, o3 = n2 + t3.length;
          !l2 && e2.start >= n2 && e2.start <= o3 && (s2.setStart(t3, e2.start - n2), l2 = true), l2 && e2.end >= n2 && e2.end <= o3 && (s2.setEnd(t3, e2.end - n2), a2 = true), n2 = o3;
        } else if ("BR" === i2.tagName) l2 || e2.start !== n2 || (s2.setStartBefore(i2), l2 = true), l2 && e2.end === n2 && (s2.setEndBefore(i2), a2 = true), n2++;
        else {
          const t3 = i2;
          let e3 = t3.childNodes.length;
          for (; e3--; ) o2.push(t3.childNodes[e3]);
        }
        const r2 = window.getSelection();
        r2 && (r2.removeAllRanges(), r2.addRange(s2));
      }
      function l(t2) {
        const e2 = o(t2.container);
        return e2 ? [e2.start, e2.end] : [0, 0];
      }
      const a = /((https?:\/\/|www\.)[\w\-._~:\/?#[\]@!$&'()*+,;=%]+|\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[\w\-._~:\/?#[\]@!$&'()*+,;=%]*)?)/g;
      function r(t2, e2) {
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
              if ("table" === t3.type || "layout" === t3.type || "math" === t3.type) return void (t3.element && this.container.appendChild(t3.element));
              if ("image" === t3.type) {
                if (n2 = document.createElement("div"), n2.setAttribute("data-id", t3.dataId), n2.setAttribute("class", t3.class), n2.setAttribute("type", t3.type), n2.style.textAlign = t3.alignment || "left", t3.image) if (this.imageHandler && "function" == typeof this.imageHandler.createImageFragment) n2.appendChild(this.imageHandler.createImageFragment(t3.image, t3.dataId));
                else {
                  const e3 = document.createElement("img");
                  e3.src = t3.image, n2.appendChild(e3);
                }
              } else if ("code" === t3.type) {
                n2 = document.createElement("div"), n2.setAttribute("data-id", t3.dataId), n2.setAttribute("class", "code_block_wrapper"), n2.setAttribute("type", "code"), n2.setAttribute("data-language", t3.language || "text"), n2.addEventListener("mousedown", (t4) => {
                  t4.preventDefault();
                });
                const e3 = document.createElement("div");
                e3.className = "code_block_header";
                const s2 = document.createElement("span");
                s2.className = "code_block_language", s2.innerText = t3.language || "text";
                const o2 = document.createElement("span");
                o2.className = "code_block_hint", o2.innerText = "double-click to edit";
                const i2 = document.createElement("button");
                i2.className = "code_block_cancel", i2.innerHTML = "&times;", i2.title = "Remove block", i2.addEventListener("mousedown", (t4) => {
                  t4.stopPropagation();
                }), i2.onclick = (e4) => {
                  e4.stopPropagation(), e4.preventDefault(), n2.remove();
                  const s3 = this.document.blocks.findIndex((e5) => e5.dataId === t3.dataId);
                  -1 !== s3 && (this.document.blocks.splice(s3, 1), this.document.selectedBlockId === t3.dataId && (this.document.selectedBlockId = null), this.document.emit("documentChanged", this.document));
                }, e3.appendChild(s2), e3.appendChild(o2), e3.appendChild(i2);
                const l2 = document.createElement("pre");
                l2.className = "code_block_content";
                const a2 = document.createElement("code");
                a2.textContent = t3.code || "", l2.appendChild(a2), n2.appendChild(e3), n2.appendChild(l2);
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
          }), i(this.container, t2);
        }
        renderPiece(t2) {
          const e2 = t2.text.split("\n");
          return this.wrapAttributes(e2, t2.attributes);
        }
        wrapAttributes(t2, e2) {
          const n2 = document.createDocumentFragment();
          return t2.forEach((s2, o2) => {
            let i2 = document.createTextNode(s2);
            if (e2.strikethrough) {
              const t3 = document.createElement("s");
              t3.appendChild(i2), i2 = t3;
            }
            if (e2.underline) {
              const t3 = document.createElement("u");
              t3.appendChild(i2), i2 = t3;
            }
            if (e2.italic) {
              const t3 = document.createElement("em");
              t3.appendChild(i2), i2 = t3;
            }
            if (e2.bold) {
              const t3 = document.createElement("strong");
              t3.appendChild(i2), i2 = t3;
            }
            if (e2.subscript) {
              const t3 = document.createElement("sub");
              t3.appendChild(i2), i2 = t3;
            }
            if (e2.superscript) {
              const t3 = document.createElement("sup");
              t3.appendChild(i2), i2 = t3;
            }
            const l2 = document.getElementById("fontFamily"), a2 = document.getElementById("fontSize");
            let r2 = "Arial", c2 = "16px";
            l2 && (r2 = l2.value), a2 && (c2 = a2.value);
            const h2 = document.createElement("span");
            if (h2.style.fontFamily = e2.fontFamily || r2, h2.style.fontSize = e2.fontSize || c2, e2.fontColor && "string" == typeof e2.fontColor && (h2.style.color = e2.fontColor), e2.bgColor && "string" == typeof e2.bgColor && (h2.style.backgroundColor = e2.bgColor), e2.hyperlink && "string" == typeof e2.hyperlink) {
              const t3 = document.createElement("a");
              t3.href = d(e2.hyperlink), t3.appendChild(i2), i2 = t3;
            }
            h2.appendChild(i2), i2 = h2, n2.appendChild(i2), o2 < t2.length - 1 && n2.appendChild(document.createElement("br"));
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
            let s2 = false;
            "bold" === n2 && t2.bold && (s2 = true), "italic" === n2 && t2.italic && (s2 = true), "underline" === n2 && t2.underline && (s2 = true), "strikethrough" === n2 && t2.strikethrough && (s2 = true), "hyperlink" === n2 && t2.hyperlink && (s2 = true), "undo" === n2 && t2.undo && (s2 = true), "redo" === n2 && t2.redo && (s2 = true), e2.classList.toggle("active", s2);
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
      const u = { TOOLBAR_CLASSNAME: "toolbar", TOOLBAR_ID: "toolbar", EDITOR_CLASSNAME: "editor", EDITOR_ID: "editor", EDITOR_ELEMENT_NT_FOUND: "Editor element not found or incorrect element type.", FONT_FAMILY_SELECT_ID: "fontFamily", FONT_SIZE_SELECT_ID: "fontSize", FONT_COLOR_WRAPPER_ID: "fontColorWrapper", FONT_COLOR_ID: "fontColor", FONT_COLOR_PICKER_WRAPPER_ID: "colorWrapper", FONT_COLOR_PICKER_ID: "fontColorPicker", FONT_COLOR_RESET_ID: "colorResetFont", BG_COLOR_WRAPPER_ID: "bgColorWrapper", BG_COLOR_ID: "bgColor", BG_COLOR_PICKER_WRAPPER_ID: "colorBgWrapper", BG_COLOR_RESET_ID: "colorResetBG", BG_COLOR_PICKER_ID: "bgColorPicker", GET_HTML_BUTTON_ID: "getHtmlButton", LOAD_HTML_BUTTON_ID: "loadHtmlButton", HYPERLINK_CONTAINER_ID: "hyperlink-container", HYPERLINK_INPUT_ID: "hyperlink-input", HYPERLINK_PLACEHOLDER: "Enter a URL...", HYPERLINK_APPLY_BTN_ID: "apply-hyperlink", HYPERLINK_CANCEL_BTN_ID: "cancel-hyperlink", VIEW_HYPERLINK_CONTAINER_ID: "hyperlink-container-view", VIEW_HYPERLINK_LABEL_ID: "hyperlink-view-span", VIEW_HYPERLINK_ANCHOR_ID: "hyperlink-view-link", TEMPORARY_SELECTION_HIGHLIGHT_CLASS: "temporary-selection-highlight", PARAGRAPH_BLOCK_CLASS: "paragraph-block", IMAGE_CROSS_CLASS: "image-cross", TEST_HTML_CODE: '<div data-id="data-id-1734604240404" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> ajsh diujaksdajsh diujaksdajsh </span></span></span></div><div data-id="data-id-1739430551701" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> diujaksdasd </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(163, 67, 67);"><strong>98hasiudasdh 98</strong></span></span></span></div><div data-id="data-id-1739430553412" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong> </strong></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">This is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"><em>t</em></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"> this is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(85, 153, 170);"><span style="color: rgb(0, 0, 0);"><em>test work</em></span></span></span></div><div data-id="data-id-1739430554776" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">This is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><em>test work.</em></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> this is a </span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong>test work</strong></span></span></span></div><div data-id="data-id-1739430558023" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><strong><em> uj09asujdi</em></strong></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank"><strong><em>odiodiooias </em></strong></a></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank"><strong>diodiodio</strong></a></span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"><a href="a;lsjd 98aiosd" target="_blank">oias</a></span></span></span></div><div data-id="data-id-1739430556280" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> da90 uasd y98asiodoiasda90 uasd y9</span></span></span><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);">8asiodoiasda90 uasd y98asioda</span></span></span></div><div data-id="data-id-1739430559464" class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-family: Arial; font-size: 12px;"><span style="background-color: rgb(247, 247, 247);"><span style="color: rgb(0, 0, 0);"> sdjasdjasdja9sudoija9sudoija9sudoija90sdoa90sdoa90sdo</span></span></span></div>', TEST_BLOG_POST_HTML_CODE: '<div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 20px;"><strong>Blog Post Title</strong></span></div><div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 14px;">Start writing your post here...</span></div>', TEST_NEWSLATER_HTML_CODE: '<div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 18px;"><strong>Weekly Newsletter</strong></span></div><div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 14px;">Hello subscribers,</span></div>', TEST_RESUME_HTML_CODE: '<div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 20px;"><strong>John Doe</strong></span></div><div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 14px;"><strong>Experience</strong></span></div><div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 14px;">&bull; Role 1</span></div>', TEST_EMAIL_HTML_CODE: '<div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 14px;"><strong>Subject: Important Update</strong></span></div><div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 14px;">Hi Team,</span></div>', TEST_MEETING_HTML_CODE: '<div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 18px;"><strong>Meeting Minutes</strong></span></div><div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 14px;"><strong>Attendees:</strong> </span></div><div class="paragraph-block" type="undefined" style="text-align: left;"><span style="font-size: 14px;"><strong>Action Items:</strong></span></div>', POPUP_TOOLBAR_CLASSNAME: "popup-toolbar", POPUP_TOOLBAR_ID: "popup-toolbar", TOAST_ID: "ti-toast", TOAST_SHOW_CLASS: "ti-toast--show", TOAST_DEFAULT_MESSAGE: "HTML copied to clipboard", TOAST_DEFAULT_DURATION_MS: 2e3 };
      class p {
        constructor(t2, e2, n2) {
          this.savedSelection = null, this.clickOutsideHandler = null, this.editorContainer = t2, this.editorView = e2, this.document = n2;
        }
        setUndoRedoManager(t2) {
          this.undoRedoManager = t2;
        }
        hanldeHyperlinkClick(t2, e2, n2, s2, o2) {
          const i2 = this.getCommonHyperlinkInRange(t2, e2, n2, s2, o2);
          this.showHyperlinkInput(i2);
        }
        getCommonHyperlinkInRange(t2, e2, n2, s2, o2) {
          let i2 = n2, l2 = 0;
          s2 && (l2 = o2.findIndex((t3) => t3.dataId === s2));
          const a2 = o2[l2].pieces;
          let r2 = null;
          for (let n3 of a2) {
            const s3 = i2 + n3.text.length;
            if (s3 > t2 && i2 < e2) {
              const t3 = n3.attributes.hyperlink || null;
              if (null === r2) r2 = t3;
              else if (r2 !== t3) return null;
            }
            i2 = s3;
          }
          return r2;
        }
        showHyperlinkInput(t2) {
          var e2, n2, s2;
          const i2 = document.getElementById(u.HYPERLINK_CONTAINER_ID), l2 = document.getElementById(u.HYPERLINK_INPUT_ID), a2 = document.getElementById(u.HYPERLINK_APPLY_BTN_ID), r2 = document.getElementById(u.HYPERLINK_CANCEL_BTN_ID);
          if (i2 && l2 && a2 && r2) {
            i2.style.display = "block";
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
              const l3 = (null === window || void 0 === window ? void 0 : window.scrollY) || 0, a3 = (null === window || void 0 === window ? void 0 : window.scrollX) || 0;
              i2.style.top = `${(null !== (n2 = o2.bottom) && void 0 !== n2 ? n2 : o2.top) + l3 + 5}px`, i2.style.left = `${(null !== (s2 = o2.left) && void 0 !== s2 ? s2 : 0) + a3}px`;
            }
            l2.value = t2 || "", this.savedSelection = o(this.editorView.container), this.highlightSelection(), l2.focus(), a2.onclick = null, r2.onclick = null;
            const h2 = this.document.dataIds, u2 = () => {
              const t3 = d(l2.value.trim());
              t3 && this.applyHyperlink(t3, h2), i2.style.display = "none";
            };
            a2.onclick = u2, l2.onkeydown = (t3) => {
              "Enter" === t3.key && (t3.preventDefault(), u2());
            }, r2.onclick = () => {
              this.removeHyperlink(h2), i2.style.display = "none";
            };
          }
        }
        highlightSelection() {
          this.removeHighlightSelection();
          const t2 = window.getSelection();
          if (t2 && t2.rangeCount > 0) {
            const e2 = t2.getRangeAt(0), n2 = document.createElement("span");
            n2.className = u.TEMPORARY_SELECTION_HIGHLIGHT_CLASS, n2.appendChild(e2.extractContents()), e2.insertNode(n2), t2.removeAllRanges();
            const s2 = document.createRange();
            s2.selectNodeContents(n2), t2.addRange(s2);
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
          this.undoRedoManager.saveUndoSnapshot(), this.removeHighlightSelection(), i(this.editorView.container, this.savedSelection);
          const [n2, s2] = l(this.editorView);
          if (n2 < s2) {
            const o2 = d(t2);
            e2.length > 1 ? this.document.blocks.forEach((t3) => {
              if (e2.includes(t3.dataId)) {
                this.document.selectedBlockId = t3.dataId;
                let e3 = 0;
                t3.pieces.forEach((t4) => {
                  e3 += t4.text.length;
                });
                let s3 = n2 - e3;
                this.document.formatAttribute(s3, e3, "hyperlink", o2);
              }
            }) : this.document.formatAttribute(n2, s2, "hyperlink", o2), this.editorView.render();
            const i2 = window.getSelection();
            i2 && i2.removeAllRanges(), this.editorView.container.focus();
          }
          this.savedSelection = null;
        }
        removeHyperlink(t2) {
          this.undoRedoManager.saveUndoSnapshot(), this.removeHighlightSelection(), i(this.editorView.container, this.savedSelection);
          const [e2, n2] = l(this.editorView);
          e2 < n2 && (t2.length > 1 ? this.document.blocks.forEach((n3) => {
            if (t2.includes(n3.dataId)) {
              this.document.selectedBlockId = n3.dataId;
              let t3 = 0;
              n3.pieces.forEach((e3) => {
                t3 += e3.text.length;
              });
              let s2 = e2 - t3;
              this.document.formatAttribute(s2, t3, "hyperlink", false);
            }
          }) : this.document.formatAttribute(e2, n2, "hyperlink", false), this.editorView.render(), i(this.editorView.container, this.savedSelection), this.editorView.container.focus()), this.savedSelection = null;
        }
        addClickOutsideListener(t2) {
          this.removeClickOutsideListener(), this.clickOutsideHandler = (e2) => {
            t2 && !t2.contains(e2.target) && this.hideHyperlinkViewButton();
          }, setTimeout(() => {
            "undefined" != typeof document && document.addEventListener("click", this.clickOutsideHandler);
          }, 100);
        }
        removeClickOutsideListener() {
          this.clickOutsideHandler && (document.removeEventListener("click", this.clickOutsideHandler), this.clickOutsideHandler = null);
        }
        showHyperlinkViewButton(t2) {
          var e2, n2, s2;
          const o2 = document.getElementById(u.VIEW_HYPERLINK_CONTAINER_ID), i2 = document.getElementById(u.VIEW_HYPERLINK_ANCHOR_ID);
          if (o2 && i2) {
            o2.style.display = "block";
            const l2 = window.getSelection();
            if (l2 && l2.rangeCount > 0) {
              const t3 = l2.getRangeAt(0);
              let i3 = null;
              if (t3 && "function" == typeof t3.getBoundingClientRect) i3 = t3.getBoundingClientRect();
              else if (t3 && "function" == typeof t3.getClientRects) {
                const n3 = null === (e2 = t3.getClientRects) || void 0 === e2 ? void 0 : e2.call(t3);
                i3 = n3 && n3.length ? n3[0] : null;
              }
              i3 || (i3 = this.editorView.container.getBoundingClientRect());
              const a2 = (null === window || void 0 === window ? void 0 : window.scrollY) || 0, r2 = (null === window || void 0 === window ? void 0 : window.scrollX) || 0;
              i3 && (o2.style.top = `${(null !== (n2 = i3.bottom) && void 0 !== n2 ? n2 : i3.top) + a2 + 5}px`, o2.style.left = `${(null !== (s2 = i3.left) && void 0 !== s2 ? s2 : 0) + r2}px`);
            }
            t2 && (i2.innerText = t2, i2.href = d(t2));
          }
          this.addClickOutsideListener(o2);
        }
        hideHyperlinkViewButton() {
          const t2 = document.getElementById(u.VIEW_HYPERLINK_CONTAINER_ID);
          t2 && (t2.style.display = "none"), this.removeClickOutsideListener();
        }
      }
      function m(t2) {
        return g(new DOMParser().parseFromString(t2, "text/html").body, { bold: false, italic: false, underline: false, hyperlink: false });
      }
      function g(t2, e2) {
        let s2 = Object.assign({}, e2);
        const o2 = [];
        if (t2 instanceof HTMLElement) {
          if ("A" === t2.tagName) {
            const e3 = t2.getAttribute("href");
            e3 && (s2.hyperlink = e3);
          }
          "STRONG" !== t2.tagName && "B" !== t2.tagName || (s2.bold = true), "EM" !== t2.tagName && "I" !== t2.tagName || (s2.italic = true), "U" === t2.tagName && (s2.underline = true), t2.childNodes.forEach((t3) => {
            o2.push(...g(t3, s2));
          });
        } else if (t2 instanceof Text) {
          const e3 = t2.nodeValue || "";
          "" !== e3.trim() && o2.push(new n(e3, Object.assign({}, s2)));
        }
        return o2;
      }
      const f = { bold: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">\n                <title>Bold</title>\n                <path d="M17.061 11.22A4.46 4.46 0 0 0 18 8.5C18 6.019 15.981 4 13.5 4H6v15h8c2.481 0 4.5-2.019 4.5-4.5a4.48 4.48 0 0 0-1.439-3.28zM13.5 7c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5H9V7h4.5zm.5 9H9v-3h5c.827 0 1.5.673 1.5 1.5S14.827 16 14 16z"></path>\n            </svg>', italic: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">\n                <title>Italic</title>\n                <path d="M19 7V4H9v3h2.868L9.012 17H5v3h10v-3h-2.868l2.856-10z"></path>\n            </svg>', underline: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" height="18" \n                    viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;">\n                    <title>Underline</title>\n                    <path d="M5 18h14v2H5zM6 4v6c0 3.309 2.691 6 6 6s6-2.691 6-6V4h-2v6c0 2.206-1.794 4-4 4s-4-1.794-4-4V4H6z"></path>\n                </svg>', strikethrough: '<svg \n        xmlns="http://www.w3.org/2000/svg" \n        width="18" \n        height="18" \n        viewBox="0 0 24 24" \n        style="fill: rgba(0, 0, 0, 1);">\n        <title>Strikethrough</title>\n        <path d="M5 12.5h14v-1H5v1zm7-7c-2.21 0-4 1.79-4 4h2a2 2 0 1 1 4 0c0 1.1-.9 2-2 2h-1v2h1a4 4 0 0 0 0-8zm0 14c2.21 0 4-1.79 4-4h-2a2 2 0 1 1-4 0c0-1.1.9-2 2-2h1v-2h-1a4 4 0 0 0 0 8z"/>\n    </svg>', subscript: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="200" \n                height="200" \n                viewBox="0 0 1025 1024">\n                <path fill="currentColor" d="M992.31 896h-160v64h160q13 0 22.5 9.5t9.5 22.5t-9.5 22.5t-22.5 9.5h-192q-12 0-20.5-7.5t-10.5-18.5V858q2-11 10.5-18.5t20.5-7.5h160v-64h-160q-13 0-22.5-9.5t-9.5-22.5t9.5-22.5t22.5-9.5h192q12 0 20.5 7.5t10.5 18.5v140q-2 11-10.5 18.5t-20.5 7.5zm-369.5-145.5q-16.5 16.5-39.5 16.5t-40-16l-223-278l-224 278q-16 16-39.5 16t-40-16.5T.31 711t17-40l231-287l-231-288q-17-16-17-39.5t16.5-40t40-16.5t39.5 17l224 277l223-277q17-17 40-17t39.5 16.5t16.5 40t-16 39.5l-231 288l231 287q16 17 16 40t-16.5 39.5z"/>\n            </svg>', superscript: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="200" \n                    height="200" \n                    viewBox="0 0 1024 1023">\n                    <path fill="currentColor" d="M992 192H832v64h160q13 0 22.5 9.5t9.5 22.5t-9.5 22.5T992 320H800q-12 0-20.5-7.5T769 294V154q2-11 10.5-18.5T800 128h160V64H800q-13 0-22.5-9.5T768 32t9.5-22.5T800 0h192q12 0 20.5 7.5T1023 26v140q-2 11-10.5 18.5T992 192zm-369.5 814.5Q606 1023 583 1023t-40-17L320 729L96 1006q-16 17-39.5 17t-40-16.5t-16.5-40T17 927l231-288L17 352Q0 335 0 312t16.5-39.5t40-16.5T96 272l224 278l223-278q17-16 40-16t39.5 16.5T639 312t-16 40L392 639l231 288q16 16 16 39.5t-16.5 40z"/>\n                </svg>', left_align: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Left Align</title>\n                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M4.5 12h8m-8 6.25h15m-15-12.5h15"/>\n                </svg>', center_align: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Center Align</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M6 18h12"/>\n                </svg>', right_align: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24">\n                    <title>Right Align</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M19.5 12h-8m8-6.25h-15m15 12.5h-15"/></svg>', justify: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 20 20">\n                <title>Justify</title><path fill="currentColor" d="M2 4.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.25m0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.25m.75 4.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5z"/>\n            </svg>', bullet_list: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 16 16">\n                    <title>Bullet List</title><path fill="currentColor" d="M2 4.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2M2 9a1 1 0 1 0 0-2a1 1 0 0 0 0 2m1 3.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M5.5 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zM5 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 8m.5 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/></svg>', numbered_list: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 512 512">\n                    <title>Numbererd List</title>\n                    <path fill="currentColor" d="M184 80h288v32H184zm0 160h288v32H184zm0 160h288v32H184zm-64-240V40H56v32h32v88zM56 262.111V312h80v-32H91.777L136 257.889V192H56v32h48v14.111zM56 440v32h80V344H56v32h48v16H80v32h24v16z"/>\n                </svg>', insert_table: '<svg\n                    xmlns="http://www.w3.org/2000/svg"\n                    width="92"\n                    height="92"\n                    viewBox="0 0 24 24"\n                    fill="none"\n                    stroke="#000000"\n                    stroke-width="1"\n                    stroke-linecap="round"\n                    stroke-linejoin="round"\n                    >\n                    <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" />\n                    <path d="M9 3l-6 6" />\n                    <path d="M14 3l-7 7" />\n                    <path d="M19 3l-7 7" />\n                    <path d="M21 6l-4 4" />\n                    <path d="M3 10h18" />\n                    <path d="M10 10v11" />\n                </svg>', insert_layout: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 256 256">\n                    <title>Insert Layout</title>\n                    <path fill="currentColor" d="M216 42H40a14 14 0 0 0-14 14v144a14 14 0 0 0 14 14h176a14 14 0 0 0 14-14V56a14 14 0 0 0-14-14M40 54h176a2 2 0 0 1 2 2v42H38V56a2 2 0 0 1 2-2m-2 146v-90h60v92H40a2 2 0 0 1-2-2m178 2H110v-92h108v90a2 2 0 0 1-2 2"/>\n                </svg>', heading: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24">\n                <title>Heading</title>\n                <path fill="currentColor" d="M17 11V4h2v17h-2v-8H7v8H5V4h2v7z"/>\n            </svg>', hyperlink: '<svg \n                xmlns="http://www.w3.org/2000/svg" \n                width="18" \n                height="18" \n                viewBox="0 0 24 24">\n                <title>Hyperlink</title>\n                <path fill="currentColor" d="M14.78 3.653a3.936 3.936 0 1 1 5.567 5.567l-3.627 3.627a3.936 3.936 0 0 1-5.88-.353a.75.75 0 0 0-1.18.928a5.436 5.436 0 0 0 8.12.486l3.628-3.628a5.436 5.436 0 1 0-7.688-7.688l-3 3a.75.75 0 0 0 1.06 1.061z"/>\n                <path fill="currentColor" d="M7.28 11.153a3.936 3.936 0 0 1 5.88.353a.75.75 0 0 0 1.18-.928a5.436 5.436 0 0 0-8.12-.486L2.592 13.72a5.436 5.436 0 1 0 7.688 7.688l3-3a.75.75 0 1 0-1.06-1.06l-3 3a3.936 3.936 0 0 1-5.567-5.568z"/>\n            </svg>', image: '<svg \n            xmlns="http://www.w3.org/2000/svg" \n            width="18" \n            height="18" \n            viewBox="0 0 16 16">\n            <title>Insert Image</title>\n            <path fill="currentColor" d="M6 5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m9-4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm-3.448 6.134l-3.76 2.769a.5.5 0 0 1-.436.077l-.087-.034l-1.713-.87L1 11.8V14h14V9.751zM15 2H1v8.635l4.28-2.558a.5.5 0 0 1 .389-.054l.094.037l1.684.855l3.813-2.807a.5.5 0 0 1 .52-.045l.079.05L15 8.495z"/>\n        </svg>', stop_microphone: ' \n        <svg \n            xmlns="http://www.w3.org/2000/svg" \n            viewBox="0 0 640 640">\n            <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->\n            <path d="M39 39.1C48.4 29.7 63.6 29.7 72.9 39.1L223.9 190.1L223.9 159.9C223.9 106.9 266.9 63.9 319.9 63.9C370.2 63.9 411.5 102.6 415.6 151.9L360 152C346.7 152 336 162.7 336 176C336 189.3 346.7 200 360 200L416 200L416 248L360 248C346.7 248 336 258.7 336 272C336 285.3 346.7 296 360 296L415.7 296C413.8 318.9 403.9 339.4 388.8 355L422.7 388.9C448.2 362.9 464 327.3 464 288L464 248C464 234.7 474.7 224 488 224C501.3 224 512 234.7 512 248L512 288C512 340.6 490.9 388.2 456.7 422.8L601 567.1C610.4 576.5 610.4 591.7 601 601C591.6 610.3 576.4 610.4 567.1 601L39 73.1C29.7 63.7 29.7 48.5 39 39.1zM329.8 431.7L371.2 473.1C362.4 475.5 353.3 477.4 343.9 478.5L343.9 528L391.9 528C405.2 528 415.9 538.7 415.9 552C415.9 565.3 405.2 576 391.9 576L247.9 576C234.6 576 223.9 565.3 223.9 552C223.9 538.7 234.6 528 247.9 528L295.9 528L295.9 478.5C201.3 466.7 128 385.9 128 288L128 248C128 242.9 129.6 238.1 132.4 234.2L176 277.8L176 288C176 367.5 240.5 432 320 432C323.3 432 326.6 431.9 329.8 431.7z"/>\n        </svg>\n  ', start_microphone: '\n        <svg \n            xmlns="http://www.w3.org/2000/svg" \n            viewBox="0 0 640 640">\n            <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->\n            <path d="M224 160C224 107 267 64 320 64C370.3 64 411.6 102.7 415.7 152L360 152C346.7 152 336 162.7 336 176C336 189.3 346.7 200 360 200L416 200L416 248L360 248C346.7 248 336 258.7 336 272C336 285.3 346.7 296 360 296L415.7 296C411.6 345.3 370.4 384 320 384C267 384 224 341 224 288L224 160zM152 224C165.3 224 176 234.7 176 248L176 288C176 367.5 240.5 432 320 432C399.5 432 464 367.5 464 288L464 248C464 234.7 474.7 224 488 224C501.3 224 512 234.7 512 248L512 288C512 385.9 438.7 466.7 344 478.5L344 528L392 528C405.3 528 416 538.7 416 552C416 565.3 405.3 576 392 576L248 576C234.7 576 224 565.3 224 552C224 538.7 234.7 528 248 528L296 528L296 478.5C201.3 466.7 128 385.9 128 288L128 248C128 234.7 138.7 224 152 224z"/>\n        </svg>\n  ', close_icon: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24" \n                    fill="none" \n                    stroke="currentColor" \n                    stroke-width="2" \n                    stroke-linecap="round" \n                    stroke-linejoin="round">\n                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>\n                </svg>', emoji: '<svg xmlns="http://www.w3.org/2000/svg" \n                    width="18" \n                    height="18" \n                    viewBox="0 0 24 24" \n                    fill="none" \n                    stroke="currentColor" \n                    stroke-width="2" \n                    stroke-linecap="round" stroke-linejoin="round">\n                    <title>Emoji</title>\n                    <circle cx="12" cy="12" r="10"></circle>\n                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>\n                    <line x1="9" y1="9" x2="9.01" y2="9"></line>\n                    <line x1="15" y1="9" x2="15.01" y2="9"></line>\n                </svg>', insert_math: '<svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="200" height="200" \n                    viewBox="0 0 24 24">\n                    <path fill="currentColor" d="M18 6H8.83l6 6l-6 6H18v2H6v-2l6-6l-6-6V4h12v2Z"/>\n                </svg>', textToSppech: '\n                <svg \n                    xmlns="http://www.w3.org/2000/svg" \n                    width="24px" \n                    height="24px" \n                    viewBox="0 0 24 24">\n                    <defs>\n                        <style>.cls-1{fill:#000;}.cls-2{fill:#000;}</style>\n                    </defs>\n                    <title>Icon_24px_TexttoSpeech_Color</title>\n                    <g data-name="Product Icons">\n                        <rect \n                            class="cls-1" \n                            x="2.01" \n                            y="6.99" \n                            width="6.64" \n                            height="1.67"\n                        />\n                        <polygon \n                            class="cls-1" \n                            points="11.17 15.32 2 15.32 2 16.99 2 16.99 11.17 16.99 11.17 15.32"\n                        />\n                        <polygon \n                            class="cls-1" \n                            points="4.51 11.16 2 11.16 2 12.82 6.18 12.82 12 12.82 10.33 11.16 4.51 11.16"\n                        />\n                        <path \n                            class="cls-2" \n                            d="M12,9.07a.42.42,0,0,1,.42-.36.41.41,0,0,1,.41.36v9.18a2.09,2.09,0,0,0,2.61,2A2.16,2.16,0,0,0,17,18.14V5.75a.4.4,0,0,1,.19-.4.41.41,0,0,1,.45,0,.4.4,0,0,1,.19.4v9.16a2.07,2.07,0,0,0,.81,1.64,2,2,0,0,0,1.8.37A2.16,2.16,0,0,0,22,14.8V12H20.33v2.92a.4.4,0,0,1-.19.4.41.41,0,0,1-.45,0,.4.4,0,0,1-.19-.4V5.75a2.09,2.09,0,0,0-2.61-2,2.16,2.16,0,0,0-1.56,2.13V18.25a.4.4,0,0,1-.19.4.41.41,0,0,1-.45,0,.4.4,0,0,1-.19-.4V9.08a2.07,2.07,0,0,0-4.11-.36,2.4,2.4,0,0,0-.05.46v2L12,12.82V9.07Z"\n                        />\n                    </g>\n                </svg>\n  ', speaker_on: '\n                    <svg \n                        xmlns="http://www.w3.org/2000/svg" \n                        viewBox="0 0 640 640">\n                        <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->\n                        <path d="M112 416L160 416L294.1 535.2C300.5 540.9 308.7 544 317.2 544C336.4 544 352 528.4 352 509.2L352 130.8C352 111.6 336.4 96 317.2 96C308.7 96 300.5 99.1 294.1 104.8L160 224L112 224C85.5 224 64 245.5 64 272L64 368C64 394.5 85.5 416 112 416zM505.1 171C494.8 162.6 479.7 164.2 471.3 174.5C462.9 184.8 464.5 199.9 474.8 208.3C507.3 234.7 528 274.9 528 320C528 365.1 507.3 405.3 474.8 431.8C464.5 440.2 463 455.3 471.3 465.6C479.6 475.9 494.8 477.4 505.1 469.1C548.3 433.9 576 380.2 576 320.1C576 260 548.3 206.3 505.1 171.1zM444.6 245.5C434.3 237.1 419.2 238.7 410.8 249C402.4 259.3 404 274.4 414.3 282.8C425.1 291.6 432 305 432 320C432 335 425.1 348.4 414.3 357.3C404 365.7 402.5 380.8 410.8 391.1C419.1 401.4 434.3 402.9 444.6 394.6C466.1 376.9 480 350.1 480 320C480 289.9 466.1 263.1 444.5 245.5z"/>\n                    </svg>\n  ', speaker_off: '\n                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416zM399 239C389.6 248.4 389.6 263.6 399 272.9L446 319.9L399 366.9C389.6 376.3 389.6 391.5 399 400.8C408.4 410.1 423.6 410.2 432.9 400.8L479.9 353.8L526.9 400.8C536.3 410.2 551.5 410.2 560.8 400.8C570.1 391.4 570.2 376.2 560.8 366.9L513.8 319.9L560.8 272.9C570.2 263.5 570.2 248.3 560.8 239C551.4 229.7 536.2 229.6 526.9 239L479.9 286L432.9 239C423.5 229.6 408.3 229.6 399 239z"/></svg>\n  ' }, b = { dropdowns: ["fontFamily", "fontSize"], colors: ["fontColor", "bgColor"], formatting: ["bold", "italic", "underline", "strikethrough"], alignment: ["alignLeft", "alignCenter", "alignRight"], lists: ["unorderedList", "orderedList"], media: ["hyperlink", "image", "emoji", "insert_math"], utility: ["getHtmlContent", "loadHtmlContent"] };
      function y() {
        const t2 = document.createElement("div");
        return t2.className = "toolbar-separator", t2;
      }
      function C(t2, e2) {
        const n2 = u.EDITOR_ID, s2 = u.TOOLBAR_ID, o2 = u.POPUP_TOOLBAR_ID, i2 = ["Arial", "Times New Roman", "Courier New", "Verdana"], l2 = ["12px", "14px", "16px", "18px", "20px"], a2 = document.getElementById(t2);
        if (!a2) throw new Error(u.EDITOR_ELEMENT_NT_FOUND);
        a2.classList.add("editor-container");
        const r2 = document.createElement("div");
        r2.className = u.TOOLBAR_CLASSNAME, r2.id = s2, a2.appendChild(r2), (null == e2 ? void 0 : e2.showToolbar) || (r2.style.display = "none");
        const d2 = document.createElement("div");
        d2.id = n2, d2.className = u.EDITOR_CLASSNAME, d2.contentEditable = "true", d2.spellcheck = true, d2.lang = "en", a2.appendChild(d2);
        const c2 = { bold: "<strong>B</strong>", italic: "<em>I</em>", underline: "<u>U</u>", hyperlink: "&#128279;", alignLeft: "&#8676;", alignCenter: "&#8596;", alignRight: "&#8677;", unorderedList: "&#8226;", orderedList: "1.", fontFamily: "fontFamily", fontSize: "fontSize", fontColor: "A", subscript: "X<sub>2</sub>", superscript: "X<sup>2</sup>", justify: "&#8644;", insert_table: "&#8866;", insert_layout: "&#10064;", insert_math: "\u03A3", heading: "H", image: "&#128247;", colors: "&#127912;" }, h2 = { bold: "Bold (Ctrl+B)", italic: "Italic (Ctrl+I)", underline: "Underline (Ctrl+U)", strikethrough: "Strikethrough", hyperlink: "Insert Link (Ctrl+H)", alignLeft: "Align Left (Ctrl+L)", alignCenter: "Align Center (Ctrl+E)", alignRight: "Align Right (Ctrl+R)", unorderedList: "Bullet List", orderedList: "Numbered List", fontColor: "Text Color", bgColor: "Highlight Color", image: "Insert Image", emoji: "Emoji", getHtmlContent: "Get HTML", loadHtmlContent: "Load HTML", insert_table: "Insert table", insert_math: "Insert Equation", textToSpeech: "Text To Sppech" }, p2 = [{ feature: "alignLeft", id: "alignLeft", icon: f.left_align }, { feature: "alignCenter", id: "alignCenter", icon: f.center_align }, { feature: "alignRight", id: "alignRight", icon: f.right_align }, { feature: "unorderedList", id: "unorderedList", icon: f.bullet_list }, { feature: "orderedList", id: "orderedList", icon: f.numbered_list }, { feature: "hyperlink", id: "hyperlink", icon: f.hyperlink }, { feature: "emoji", id: "emoji", icon: f.emoji }, { feature: "strikethrough", id: "strikethrough", icon: f.strikethrough }, { feature: "insert_table", id: "insert_table", icon: f.insert_table }, { feature: "insert_math", id: "insert_math", icon: f.insert_math }, { feature: "subscript", id: "subscript", icon: f.subscript }, { feature: "superscript", id: "superscript", icon: f.superscript }, { feature: "textToSpeech", id: "textToSpeech", icon: f.speaker_on }], m2 = (t3, e3) => {
          const n3 = document.createElement("select");
          return n3.dataset.action = t3, n3.id = t3, e3.forEach((t4) => {
            const e4 = document.createElement("option");
            e4.value = t4, e4.textContent = t4, n3.appendChild(e4);
          }), n3;
        }, g2 = document.createElement("div");
        g2.id = o2, g2.className = u.POPUP_TOOLBAR_CLASSNAME, g2.style.display = "none", a2.appendChild(g2), e2.popupFeatures && e2.popupFeatures.forEach((t3, e3) => {
          e3 > 0 && "hyperlink" === t3 && g2.appendChild(y());
          const n3 = p2.find((e4) => e4.feature === t3) || { icon: c2[t3] || t3 }, s3 = document.createElement("button");
          s3.dataset.action = t3, s3.innerHTML = n3.icon, s3.dataset.tooltip = h2[t3] || t3.split("_").map((t4) => t4.charAt(0).toUpperCase() + t4.slice(1)).join(" "), g2.appendChild(s3);
        });
        let C2 = null;
        e2.features.forEach((t3, n3) => {
          const s3 = (function(t4) {
            for (const [e3, n4] of Object.entries(b)) if (n4.includes(t4)) return e3;
            return null;
          })(t3);
          if (n3 > 0 && s3 && C2 && s3 !== C2 && r2.appendChild(y()), C2 = s3, "fontFamily" === t3) {
            const t4 = m2(u.FONT_FAMILY_SELECT_ID, i2);
            r2.appendChild(t4);
          } else if ("fontSize" === t3) {
            const t4 = m2(u.FONT_SIZE_SELECT_ID, l2);
            r2.appendChild(t4);
          } else if ("fontColor" === t3) {
            if (document.getElementById(u.FONT_COLOR_WRAPPER_ID)) return;
            const t4 = document.createElement("span");
            t4.id = u.FONT_COLOR_WRAPPER_ID, t4.style.display = "inline-flex", t4.style.alignItems = "center", t4.style.position = "relative", t4.style.gap = "4px";
            const e3 = document.createElement("button");
            e3.id = u.FONT_COLOR_ID, e3.type = "button", e3.dataset.tooltip = h2.fontColor, e3.innerHTML = '<span style="font-weight: bold; font-size: 14px; position: relative; display: inline-block; padding: 2px 4px;">A<span style="position: absolute; bottom: 0; left: 2px; right: 2px; height: 3px; background-color: #000000; border-radius: 1px;" id="fontColorIndicator"></span></span>', t4.appendChild(e3);
            const n4 = document.createElement("div");
            n4.id = u.FONT_COLOR_PICKER_WRAPPER_ID, n4.style.display = "none", n4.style.position = "absolute", n4.style.top = "100%", n4.style.left = "0", n4.style.marginTop = "4px", n4.style.zIndex = "1000", n4.style.backgroundColor = "#ffffff", n4.style.border = "1px solid #d1d1d1", n4.style.borderRadius = "4px", n4.style.padding = "8px", n4.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)", n4.style.width = "135px";
            const s4 = document.createElement("input");
            s4.type = "color", s4.id = u.FONT_COLOR_PICKER_ID, s4.setAttribute("data-action", "fontColor"), s4.style.width = "100%", s4.style.height = "32px", s4.style.border = "1px solid #d1d1d1", s4.style.borderRadius = "4px", s4.style.cursor = "pointer", s4.style.marginBottom = "8px", s4.value = "#000000", n4.appendChild(s4);
            const o3 = document.createElement("button");
            o3.id = u.FONT_COLOR_RESET_ID, o3.type = "button", o3.textContent = "Reset", o3.style.display = "block", o3.style.width = "100%", o3.style.padding = "6px 12px", o3.style.fontSize = "12px", o3.style.border = "1px solid #000000", o3.style.borderRadius = "4px", o3.style.backgroundColor = "#f8f8f8", o3.style.cursor = "pointer", o3.style.transition = "background-color 0.2s", o3.onmouseenter = () => o3.style.backgroundColor = "#e8e8e8", o3.onmouseleave = () => o3.style.backgroundColor = "#f8f8f8", n4.appendChild(o3), t4.appendChild(n4), r2.appendChild(t4);
          } else if ("bgColor" === t3) {
            if (document.getElementById(u.BG_COLOR_WRAPPER_ID)) return;
            const t4 = document.createElement("span");
            t4.id = u.BG_COLOR_WRAPPER_ID, t4.style.display = "inline-flex", t4.style.alignItems = "center", t4.style.position = "relative", t4.style.gap = "4px";
            const e3 = document.createElement("button");
            e3.id = u.BG_COLOR_ID, e3.type = "button", e3.dataset.tooltip = h2.bgColor, e3.innerHTML = '<span style="font-weight: bold; font-size: 14px; position: relative; display: inline-block; padding: 2px 4px;">B<span style="position: absolute; bottom: 0; left: 2px; right: 2px; height: 3px; background-color: #ffffff;" id="bgColorIndicator"></span></span>', t4.appendChild(e3);
            const n4 = document.createElement("div");
            n4.id = u.BG_COLOR_PICKER_WRAPPER_ID, n4.style.display = "none", n4.style.position = "absolute", n4.style.top = "100%", n4.style.left = "0", n4.style.marginTop = "4px", n4.style.zIndex = "1000", n4.style.backgroundColor = "#ffffff", n4.style.border = "1px solid #000000", n4.style.borderRadius = "4px", n4.style.padding = "8px", n4.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)", n4.style.width = "135px";
            const s4 = document.createElement("input");
            s4.setAttribute("data-action", "bgColor"), s4.type = "color", s4.id = u.BG_COLOR_PICKER_ID, s4.style.width = "100%", s4.style.height = "32px", s4.style.border = "1px solid #000000ff", s4.style.borderRadius = "4px", s4.style.cursor = "pointer", s4.style.marginBottom = "8px", s4.value = "#ffffff", n4.appendChild(s4);
            const o3 = document.createElement("button");
            o3.id = u.BG_COLOR_RESET_ID, o3.type = "button", o3.textContent = "Reset", o3.style.display = "block", o3.style.width = "100%", o3.style.padding = "6px 12px", o3.style.fontSize = "12px", o3.style.border = "1px solid #d1d1d1", o3.style.borderRadius = "4px", o3.style.backgroundColor = "#f8f8f8", o3.style.cursor = "pointer", o3.style.transition = "background-color 0.2s", o3.onmouseenter = () => o3.style.backgroundColor = "#e8e8e8", o3.onmouseleave = () => o3.style.backgroundColor = "#f8f8f8", n4.appendChild(o3), t4.appendChild(n4), r2.appendChild(t4);
          } else if ("getHtmlContent" === t3) {
            const t4 = document.createElement("button");
            t4.id = u.GET_HTML_BUTTON_ID, t4.type = "button", t4.textContent = "Get HTML", t4.dataset.tooltip = h2.getHtmlContent, r2.appendChild(t4);
          } else if ("loadHtmlContent" === t3) {
            const t4 = document.createElement("select");
            t4.id = u.LOAD_HTML_BUTTON_ID, t4.dataset.action = "loadHtmlContent", t4.dataset.tooltip = h2.loadHtmlContent, t4.style.cursor = "pointer", t4.style.padding = "4px 8px", t4.style.border = "1px solid #ccc", t4.style.borderRadius = "4px", t4.style.backgroundColor = "#f9f9f9", t4.style.fontSize = "13px", t4.style.outline = "none", t4.style.color = "#333", t4.style.height = "28px", t4.addEventListener("mouseenter", () => {
              t4.style.backgroundColor = "#eaeaea";
            }), t4.addEventListener("mouseleave", () => {
              t4.style.backgroundColor = "#f9f9f9";
            });
            const n4 = document.createElement("option");
            n4.value = "", n4.textContent = "Templates...", n4.disabled = true, n4.selected = true, t4.appendChild(n4);
            [...[{ name: "Default Test", html: u.TEST_HTML_CODE }, { name: "Blog Post", html: u.TEST_BLOG_POST_HTML_CODE }, { name: "Newsletter", html: u.TEST_NEWSLATER_HTML_CODE }, { name: "Resume", html: u.TEST_RESUME_HTML_CODE }, { name: "Email", html: u.TEST_EMAIL_HTML_CODE }, { name: "Meeting Notes", html: u.TEST_MEETING_HTML_CODE }], ...e2.templates || []].forEach((e3, n5) => {
              const s4 = document.createElement("option");
              s4.value = n5.toString(), s4.dataset.html = e3.html, s4.textContent = e3.name, t4.appendChild(s4);
            }), r2.appendChild(t4);
          } else if (p2.map((t4) => t4.feature).includes(t3)) {
            const e3 = p2.find((e4) => e4.feature === t3), n4 = document.createElement("button");
            n4.id = t3, n4.dataset.action = t3, n4.innerHTML = (null == e3 ? void 0 : e3.icon) || "", n4.dataset.tooltip = h2[t3] || t3, r2.appendChild(n4);
          } else {
            const e3 = document.createElement("button");
            e3.dataset.action = t3, e3.innerHTML = c2[t3] || t3, e3.id = t3, e3.dataset.tooltip = h2[t3] || t3.split("_").map((t4) => t4.charAt(0).toUpperCase() + t4.slice(1)).join(" "), r2.appendChild(e3);
          }
        });
        const k2 = document.createElement("div");
        k2.id = u.HYPERLINK_CONTAINER_ID, k2.style.display = "none";
        const v2 = document.createElement("input");
        v2.type = "text", v2.id = u.HYPERLINK_INPUT_ID, v2.placeholder = u.HYPERLINK_PLACEHOLDER;
        const I2 = document.createElement("button");
        I2.id = u.HYPERLINK_APPLY_BTN_ID, I2.textContent = "Link";
        const x2 = document.createElement("button");
        x2.id = u.HYPERLINK_CANCEL_BTN_ID, x2.textContent = "Unlink", k2.appendChild(v2), k2.appendChild(I2), k2.appendChild(x2), r2.appendChild(k2);
        const E2 = document.createElement("div");
        E2.id = u.VIEW_HYPERLINK_CONTAINER_ID, E2.style.display = "none";
        const w2 = document.createElement("span");
        w2.id = u.VIEW_HYPERLINK_LABEL_ID, w2.innerHTML = "Visit URL : ";
        const _2 = document.createElement("a");
        return _2.id = u.VIEW_HYPERLINK_ANCHOR_ID, _2.href = "", _2.target = "_blank", E2.appendChild(w2), E2.appendChild(_2), r2.appendChild(E2), { mainEditorId: n2, toolbarId: s2, popupToolbarId: o2 };
      }
      class k {
        constructor(t2) {
          this.htmlString = t2, this.doc = new DOMParser().parseFromString(t2, "text/html");
        }
        parse() {
          const t2 = this.doc.body.children;
          let e2 = [];
          return Array.from(t2).forEach((t3, n2) => {
            const s2 = this.parseElement(t3);
            console.log(t3, "element parse", n2, s2), e2.push(s2);
          }), console.log(e2, "element--jsondata"), e2;
        }
        parseElement(t2) {
          const e2 = t2.getAttribute("data-id") || `data-id-${Date.now()}-${Math.floor(1e3 * Math.random())}`, n2 = t2.className || "paragraph-block", s2 = t2.style.textAlign || "left";
          let o2 = null, i2 = null;
          "UL" === t2.tagName ? o2 = "ul" : "OL" === t2.tagName && (o2 = "ol", i2 = parseInt(t2.getAttribute("start") || "1", 10));
          let l2 = [];
          return o2 ? this.parseListItems(t2, l2) : this.parseParagraphText(t2, l2), Object.assign(Object.assign(Object.assign({ dataId: e2, class: n2, alignment: s2, pieces: l2 }, o2 ? { listType: o2 } : {}), null !== i2 ? { listStart: i2 } : {}), {});
        }
        parseListItems(t2, e2) {
          t2.querySelectorAll("li").forEach((t3) => {
            const s2 = this.extractTextAttributes(t3);
            s2 && e2.push(new n(s2.text, s2.attributes));
          });
        }
        parseParagraphText(t2, e2) {
          const s2 = t2.querySelectorAll("span"), o2 = /* @__PURE__ */ new Map();
          s2.forEach((t3) => {
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
          const s2 = n2.map((t3) => {
            const e3 = parseInt(t3);
            return e3 < 0 || e3 > 255 ? "00" : e3.toString(16).padStart(2, "0");
          }).join("");
          return e2 || "000000" !== s2 ? `#${s2}` : null;
        }
      }
      class v {
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
            const e3 = document.createRange(), s2 = window.getSelection();
            if (n2.firstChild) e3.setStart(n2.firstChild, t2);
            else {
              const t3 = document.createTextNode("");
              n2.appendChild(t3), e3.setStart(t3, 0);
            }
            e3.collapse(true), null == s2 || s2.removeAllRanges(), null == s2 || s2.addRange(e3);
          }, 0));
        }
        insertImageAtPosition(t2, e2, s2) {
          if (!t2 || "number" != typeof e2 || !this.editorView) return;
          console.log(t2, e2, s2, "vicky insertImageAtPosition", this.document.blocks);
          const o2 = `data-id-${Date.now()}-${1e3 * Math.random()}`, i2 = `data-id-${Date.now()}-${1e3 * Math.random()}`, l2 = `data-id-${Date.now()}-${1e3 * Math.random()}`, a2 = { dataId: o2, class: u.PARAGRAPH_BLOCK_CLASS, pieces: [new n(" ")], type: "image", image: t2 }, r2 = { dataId: i2, class: u.PARAGRAPH_BLOCK_CLASS, pieces: [new n(" ")], type: "text" };
          let d2 = this.document.selectedBlockId;
          const c2 = this.document.blocks.findIndex((t3) => t3.dataId === this.document.selectedBlockId);
          let h2 = [];
          const { remainingText: p2, piece: m2 } = (function(t3, e3) {
            const n2 = window.getSelection();
            if (!n2 || 0 === n2.rangeCount) return { remainingText: "", piece: null };
            const s3 = n2.getRangeAt(0).startContainer;
            let o3 = "";
            const i3 = e3.blocks.filter((e4) => {
              if (e4.dataId === t3) return e4;
            });
            if (!i3[0] || !i3[0].pieces) return { remainingText: "", piece: null };
            const l3 = document.querySelector(`[data-id="${t3}"]`), a3 = e3.getCursorOffsetInParent(`[data-id="${t3}"]`);
            let r3 = [], d3 = 0;
            if (i3[0].pieces.forEach((t4, e4) => {
              o3 += t4.text, (null == a3 ? void 0 : a3.innerText) === t4.text && (d3 = e4, r3.push(t4));
            }), i3[0].pieces.length > 1 && i3[0].pieces.forEach((t4, e4) => {
              d3 < e4 && r3.push(t4);
            }), !l3) return console.error(`Element with data-id "${t3}" not found.`), { remainingText: "", piece: null };
            if (!l3.contains(s3)) return console.error(`Cursor is not inside the element with data-id "${t3}".`), { remainingText: "", piece: null };
            const c3 = o3, h3 = null == a3 ? void 0 : a3.offset, u2 = c3.slice(h3), p3 = c3.slice(0, h3);
            return l3.textContent = p3, { remainingText: u2, piece: r3 };
          })(d2 || "", this.document);
          console.log(d2 || "", this.document, "extractTextFromDataId-vicky", p2, m2);
          const g2 = " " + p2;
          let f2 = this.document.blocks;
          if (g2.length > 0) {
            const t3 = p2.split(" ");
            let e3 = [];
            "" !== t3[0] || void 0 !== t3[1] ? 1 === m2.length ? e3 = [new n(g2, m2[0].attributes)] : (e3.push(new n(" " + t3[0] + " ", m2[0].attributes)), m2.length >= 2 && m2.forEach((t4, n2) => {
              0 !== n2 && e3.push(t4);
            })) : e3 = [new n(" ")], console.log(this.document.selectedBlockId, "uniqueId3 extractTextFromDataId-vicky", l2), f2 = (function(t4, e4, n2) {
              const s3 = t4.findIndex((t5) => t5.dataId === e4);
              return -1 === s3 ? (console.error(`Block with dataId "${e4}" not found.`), t4) : [...t4.slice(0, s3 + 1), n2, ...t4.slice(s3 + 1)];
            })(this.document.blocks, this.document.selectedBlockId || "", { dataId: l2, class: u.PARAGRAPH_BLOCK_CLASS, pieces: e3, type: "text" });
          }
          this.document.blocks = f2, this.document.deleteRange(this.currentCursorLocation, this.currentCursorLocation + p2.length, this.document.selectedBlockId, this.document.currentOffset), this.document.blocks.length > c2 + 1 ? this.document.blocks.forEach((t3, e3) => {
            h2.push(t3), e3 === c2 ? h2.push(a2) : d2 === this.document.selectedBlockId && (d2 = t3.dataId);
          }) : (h2 = [...this.document.blocks, a2, r2], d2 = r2.dataId), this.document.blocks = h2, this.editorView.render(), this.document.selectedBlockId = d2;
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
          const n2 = document.createDocumentFragment(), s2 = document.createElement("img");
          s2.src = t2, s2.style.maxWidth = "30%", s2.setAttribute("contenteditable", "false"), n2.appendChild(s2);
          const o2 = document.createElement("span");
          return o2.setAttribute("contenteditable", "false"), o2.appendChild(n2), s2.addEventListener("click", () => this.addStyleToImage(e2)), o2;
        }
        addStyleToImage(t2) {
          if (t2 && !this.isCrossIconVisible) {
            const e2 = document.querySelector(`[data-id="${t2}"]`), n2 = null == e2 ? void 0 : e2.querySelector("span");
            n2 && (n2.style.position = "relative");
            const s2 = null == e2 ? void 0 : e2.querySelector("img");
            s2 && (s2.style.border = "2px solid blue");
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
            const s2 = null == e2 ? void 0 : e2.querySelector(`.${u.IMAGE_CROSS_CLASS}`);
            null == s2 || s2.remove(), this.highLightedImageDataId = "";
          }
          this.isCrossIconVisible = false;
        }
        deleteImage() {
          this.highLightedImageDataId && (this.document.blocks = this.document.blocks.filter((t2) => t2.dataId !== this.highLightedImageDataId), this.highLightedImageDataId = "", this.isImageHighlighted = false, this.clearImageStyling(), this.document.emit("documentChanged", this));
        }
      }
      class I {
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
      class x extends e {
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
          const n2 = this.container.offsetWidth, s2 = this.container.offsetHeight;
          let o2 = e2.top + window.scrollY - s2 - 8, i2 = e2.left + window.scrollX + e2.width / 2 - n2 / 2;
          o2 < window.scrollY && (o2 = e2.bottom + window.scrollY + 8), i2 < 0 && (i2 = 5), this.container.style.top = `${o2}px`, this.container.style.left = `${i2}px`;
        }
        hide() {
          this.container.style.display = "none";
        }
        updateActiveStates(t2) {
          this.container.querySelectorAll("button").forEach((e2) => {
            const n2 = e2.getAttribute("data-action");
            let s2 = false;
            "bold" === n2 && t2.bold && (s2 = true), "italic" === n2 && t2.italic && (s2 = true), "underline" === n2 && t2.underline && (s2 = true), "strikethrough" === n2 && t2.strikethrough && (s2 = true), "hyperlink" === n2 && t2.hyperlink && (s2 = true), e2.classList.toggle("active", s2);
          });
        }
      }
      class E {
        constructor() {
          this.linkElement = null, this.createPopup();
        }
        setCallbacks(t2, e2) {
          this.onOpenClick = t2, this.onUnlinkClick = e2;
        }
        createPopup() {
          this.popup = document.createElement("div"), this.popup.className = "link-popup", this.popup.style.cssText = "\n      position: absolute;\n      background: #000;\n      border-radius: 4px;\n      padding: 2px;\n      box-shadow: 0 1px 4px rgba(0,0,0,0.5);\n      z-index: 1000;\n    ", this.popup.style.display = "none";
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
          const s2 = t2.getBoundingClientRect();
          this.popup.style.left = `${s2.left + window.scrollX}px`, this.popup.style.top = `${s2.bottom + window.scrollY + 5}px`, this.popup.style.display = "flex", this.popup.style.opacity = "0", this.popup.style.transform = "translateY(-2px)", requestAnimationFrame(() => {
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
      class w {
        constructor(t2, e2, n2, s2) {
          this.isRecording = false, this.silenceTimer = null, this.document = t2, this.editorView = e2, this.onStateChange = n2, this.insertText = s2;
          const o2 = window.SpeechRecognition || window.webkitSpeechRecognition;
          o2 ? (this.recognition = new o2(), this.recognition.continuous = true, this.recognition.interimResults = false, this.recognition.onresult = (t3) => {
            const e3 = t3.results[t3.results.length - 1];
            if (e3.isFinal) {
              const t4 = e3[0].transcript + " ";
              this.insertText(t4);
            }
          }, this.recognition.onerror = (t3) => {
            console.error("Speech recognition error:", t3.error), "no-speech" !== t3.error && this.stopRecording();
          }, this.recognition.onend = () => {
            this.stopRecording();
          }) : console.warn("Speech Recognition API not supported in this browser.");
        }
        toggleRecording() {
          this.isRecording ? this.stopRecording() : this.startRecording();
        }
        startRecording() {
          if (this.recognition) try {
            this.recognition.start(), this.isRecording = true, this.onStateChange(true);
          } catch (t2) {
            console.error("Failed to start speech recognition:", t2);
          }
        }
        stopRecording() {
          if (this.recognition && this.isRecording) {
            try {
              this.recognition.stop();
            } catch (t2) {
              console.warn("Some problem occur during the stop recording  . . . ", t2);
            }
            this.isRecording = false, this.onStateChange(false), this.silenceTimer && (clearTimeout(this.silenceTimer), this.silenceTimer = null);
          }
        }
      }
      class _ {
        constructor(t2, e2) {
          this.modal = null, this.activeTable = null, this.editor = t2, this.document = e2, this.setupClickOutsideListener();
        }
        openTableModal() {
          this.modal && (this.modal.remove(), this.modal = null);
          const t2 = document.createElement("div");
          t2.className = "table_modal", t2.id = "table_modal";
          const e2 = document.createElement("div");
          e2.className = "main_modal", e2.setAttribute("role", "dialog"), e2.setAttribute("aria-modal", "true"), e2.setAttribute("aria-label", "Insert Table");
          const n2 = document.createElement("div");
          n2.className = "main_modal_header";
          const s2 = document.createElement("h3");
          s2.className = "main_modal_title", s2.textContent = "Insert Table";
          const o2 = document.createElement("button");
          o2.className = "main_modal_close", o2.setAttribute("aria-label", "Close"), o2.innerHTML = f.close_icon, o2.onclick = () => this.closeModal(), n2.appendChild(s2), n2.appendChild(o2);
          const i2 = document.createElement("div");
          i2.className = "main_modal_body";
          const l2 = document.createElement("div");
          l2.className = "main_modal_inputs";
          const a2 = document.createElement("div");
          a2.className = "all_input";
          const r2 = document.createElement("label");
          r2.textContent = "Rows", r2.className = "input_label", r2.setAttribute("for", "modal_input_row");
          const d2 = document.createElement("input");
          d2.type = "number", d2.id = "modal_input_row", d2.className = "modal_inputs", d2.placeholder = "Enter the row number 1 to 20", d2.min = "1", d2.max = "20", d2.value = "3", a2.appendChild(r2), a2.appendChild(d2);
          const c2 = document.createElement("div");
          c2.className = "all_input";
          const h2 = document.createElement("label");
          h2.textContent = "Columns", h2.className = "input_label", h2.setAttribute("for", "modal_input_col");
          const u2 = document.createElement("input");
          u2.type = "number", u2.id = "modal_input_col", u2.className = "modal_inputs", u2.placeholder = "Enter the coloumn number 1 to 20", u2.min = "1", u2.max = "20", u2.value = "3", c2.appendChild(h2), c2.appendChild(u2), l2.appendChild(a2), l2.appendChild(c2);
          const p2 = document.createElement("div");
          p2.className = "main_modal_footer";
          const m2 = document.createElement("button");
          m2.className = "modal_close_button modal_close_button_secondary", m2.textContent = "Cancel", m2.type = "button", m2.onclick = () => this.closeModal();
          const g2 = document.createElement("button");
          g2.className = "modal_close_button modal_close_button_primary", g2.textContent = "Insert Table", g2.type = "button", g2.onclick = () => {
            const t3 = Math.max(1, Math.min(20, parseInt(d2.value) || 3)), e3 = Math.max(1, Math.min(20, parseInt(u2.value) || 3));
            this.insertTable(t3, e3), this.closeModal();
          }, p2.appendChild(m2), p2.appendChild(g2), i2.appendChild(l2), e2.appendChild(n2), e2.appendChild(i2), e2.appendChild(p2), t2.appendChild(e2), t2.addEventListener("click", (e3) => {
            e3.target === t2 && this.closeModal();
          }), document.body.appendChild(t2), this.modal = t2, requestAnimationFrame(() => {
            t2.classList.add("table_modal_visible");
          });
        }
        closeModal() {
          this.modal && (this.modal.classList.remove("table_modal_visible"), setTimeout(() => {
            var t2;
            null === (t2 = this.modal) || void 0 === t2 || t2.remove(), this.modal = null;
          }, 200));
        }
        insertTable(t2, e2) {
          const s2 = `data-id-${Date.now()}`, o2 = `data-id-${Date.now() + 1}`, i2 = document.createElement("div");
          i2.className = "table_wrapper", i2.setAttribute("data-type", "tbl"), i2.setAttribute("data-id", s2), i2.setAttribute("contenteditable", "false");
          const l2 = document.createElement("div");
          l2.className = "table_controls";
          const a2 = document.createElement("button");
          a2.className = "table_delete_button", a2.innerHTML = f.close_icon, a2.onclick = () => {
            const t3 = this.document.blocks.findIndex((t4) => t4.dataId === s2);
            -1 !== t3 && (this.document.blocks.splice(t3, 1), this.document.selectedBlockId === s2 && (this.document.selectedBlockId = null), this.document.emit("documentChanged", this.document));
          }, l2.appendChild(a2), i2.appendChild(l2);
          const r2 = document.createElement("table");
          r2.className = "tbl";
          const d2 = document.createElement("thead"), c2 = document.createElement("tr");
          for (let t3 = 0; t3 < e2; t3++) {
            const e3 = document.createElement("th");
            e3.className = "tblCell tbl_header_cell", e3.contentEditable = "true", e3.setAttribute("data-placeholder", `Header ${t3 + 1}`), this.setupCellEvents(e3), c2.appendChild(e3);
          }
          d2.appendChild(c2), r2.appendChild(d2);
          const h2 = document.createElement("tbody");
          for (let n2 = 0; n2 < t2; n2++) {
            const t3 = document.createElement("tr");
            for (let n3 = 0; n3 < e2; n3++) {
              const e3 = document.createElement("td");
              e3.className = "tblCell", e3.contentEditable = "true", e3.setAttribute("data-placeholder", ""), this.setupCellEvents(e3), t3.appendChild(e3);
            }
            h2.appendChild(t3);
          }
          r2.appendChild(h2), i2.appendChild(r2);
          let u2 = this.document.blocks.length;
          if (this.document.selectedBlockId) {
            const t3 = this.document.blocks.findIndex((t4) => t4.dataId === this.document.selectedBlockId);
            -1 !== t3 && (u2 = t3 + 1);
          }
          const p2 = { dataId: s2, type: "table", element: i2 }, m2 = { dataId: o2, type: "text", class: "paragraph-block", pieces: [new n("\u200B", { bold: false, italic: false, underline: false, strikethrough: false, hyperlink: false })] };
          this.document.blocks.splice(u2, 0, p2, m2), this.document.selectedBlockId = s2, this.document.currentOffset = 0, this.document.emit("documentChanged", this.document), setTimeout(() => {
            const t3 = i2.querySelector(".tblCell");
            t3 && (t3.focus(), this.setActiveTable(i2.querySelector("table")));
          }, 0);
        }
        setupCellEvents(t2) {
          t2.addEventListener("focus", () => {
            const e2 = t2.closest("table");
            e2 && this.setActiveTable(e2), t2.classList.add("tblCell_focused");
          }), t2.addEventListener("blur", () => {
            t2.classList.remove("tblCell_focused");
          }), t2.addEventListener("keydown", (e2) => {
            var n2;
            const s2 = e2;
            if ("Tab" === s2.key) {
              s2.preventDefault(), s2.stopPropagation();
              const e3 = Array.from((null === (n2 = t2.closest("table")) || void 0 === n2 ? void 0 : n2.querySelectorAll(".tblCell")) || []), o2 = e3.indexOf(t2);
              if (s2.shiftKey) o2 > 0 && (e3[o2 - 1].focus(), this.selectAllInCell(e3[o2 - 1]));
              else if (o2 < e3.length - 1) e3[o2 + 1].focus(), this.selectAllInCell(e3[o2 + 1]);
              else {
                const e4 = t2.closest(".table_wrapper"), n3 = null == e4 ? void 0 : e4.nextElementSibling;
                n3 && (n3.focus(), this.clearTableActive());
              }
            }
            "Enter" !== s2.key || s2.shiftKey || s2.stopPropagation(), "Backspace" !== s2.key && "Delete" !== s2.key || s2.stopPropagation(), 1 !== s2.key.length || s2.ctrlKey || s2.metaKey || s2.altKey || s2.stopPropagation();
          });
        }
        selectAllInCell(t2) {
          const e2 = window.getSelection();
          if (!e2) return;
          const n2 = document.createRange();
          n2.selectNodeContents(t2), e2.removeAllRanges(), e2.addRange(n2);
        }
        setActiveTable(t2) {
          document.querySelectorAll(".tbl_active").forEach((e2) => {
            e2 !== t2 && e2.classList.remove("tbl_active");
          }), t2.classList.add("tbl_active"), this.activeTable = t2;
        }
        clearTableActive() {
          this.activeTable && (this.activeTable.classList.remove("tbl_active"), this.activeTable = null);
        }
        setupClickOutsideListener() {
          document.addEventListener("click", (t2) => {
            const e2 = t2.target, n2 = null !== e2.closest(".table_wrapper"), s2 = null !== e2.closest("#table_modal");
            n2 || s2 || this.clearTableActive();
          }, true), document.addEventListener("focusin", (t2) => {
            t2.target.closest(".table_wrapper") || this.clearTableActive();
          }, true);
        }
      }
      const T = [{ label: "Smileys & People", items: [{ char: "\u{1F600}", name: "grinning face", shortcode: ":grinning:" }, { char: "\u{1F603}", name: "big eyes smile", shortcode: ":smiley:" }, { char: "\u{1F604}", name: "smiling eyes grin", shortcode: ":smile:" }, { char: "\u{1F601}", name: "beaming grin", shortcode: ":grin:" }, { char: "\u{1F606}", name: "squinting laugh", shortcode: ":laughing:" }, { char: "\u{1F605}", name: "sweat smile", shortcode: ":sweat_smile:" }, { char: "\u{1F923}", name: "rolling floor laughing", shortcode: ":rofl:" }, { char: "\u{1F602}", name: "tears of joy", shortcode: ":joy:" }, { char: "\u{1F642}", name: "slightly smiling", shortcode: ":slightly_smiling_face:" }, { char: "\u{1F60A}", name: "smiling eyes blush", shortcode: ":blush:" }] }], L = "recent_emojies";
      class A {
        constructor() {
          this.isOpen = false, this.popup = this.buildPopup(), this.gridArea = this.popup.querySelector(".emoji_grid"), this.searchInput = this.popup.querySelector(".emoji_serch"), document.body.appendChild(this.popup), document.addEventListener("mousedown", (t2) => {
            if (this.isOpen && !this.popup.contains(t2.target)) {
              t2.target.closest('[data-action="emoji"]') || this.close();
            }
          });
        }
        onSelect(t2) {
          this.onSelectCallback = t2;
        }
        open(t2) {
          const e2 = t2.getBoundingClientRect();
          let n2 = e2.left + window.scrollX;
          n2 + 320 > window.innerWidth - 8 && (n2 = window.innerWidth - 320 - 8);
          const s2 = e2.bottom + window.scrollY + 4;
          this.popup.style.left = `${n2}px`, this.popup.style.top = `${s2}px`, this.popup.style.display = "flex", this.isOpen = true, this.searchInput.value = "", this.renderGrid("");
        }
        close() {
          this.popup.style.display = "none", this.isOpen = false;
        }
        getIsOpen() {
          return this.isOpen;
        }
        buildPopup() {
          const t2 = document.createElement("div");
          t2.style.cssText = "\n      position: absolute;\n      display: none;\n      flex-direction: column;\n      width: 320px;\n      max-height: 380px;\n      background: #ffffff;\n      border: 1px solid #dddddd;\n      border-radius: 10px;\n      box-shadow: 0 6px 24px rgba(0,0,0,0.14);\n      z-index: 9999;\n      overflow: hidden;\n      font-family: system-ui, -apple-system, sans-serif;\n    ";
          const e2 = document.createElement("div");
          e2.style.cssText = "\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      padding: 10px 12px;\n      border-bottom: 1px solid #f0f0f0;\n      background: #fafafa;\n    ";
          const n2 = document.createElement("input");
          n2.type = "text", n2.placeholder = "\u{1F50D} Search emojis or :shortcode:", n2.className = "emoji_serch", n2.style.cssText = "\n      flex: 1;\n      padding: 6px 10px;\n      border: 1px solid #ccc;\n      border-radius: 6px;\n      font-size: 13px;\n      outline: none;\n      background: #fff;\n    ", n2.addEventListener("input", () => this.renderGrid(n2.value.trim())), e2.appendChild(n2);
          const s2 = document.createElement("div");
          return s2.className = "emoji_grid", s2.style.cssText = "\n      flex: 1;\n      overflow-y: auto;\n      padding: 10px 12px 12px;\n    ", t2.appendChild(e2), t2.appendChild(s2), t2;
        }
        getRecentEmojis() {
          try {
            const t2 = localStorage.getItem(L);
            return t2 ? JSON.parse(t2) : [];
          } catch (t2) {
            return [];
          }
        }
        saveRecentEmoji(t2) {
          const e2 = this.getRecentEmojis().filter((e3) => e3.char !== t2.char);
          e2.unshift(t2), e2.length > 24 && (e2.length = 24);
          try {
            localStorage.setItem(L, JSON.stringify(e2));
          } catch (t3) {
            console.error("Problem occur in saving emojies", t3);
          }
        }
        resolveChar(t2) {
          return t2.char;
        }
        renderGrid(t2) {
          this.gridArea.innerHTML = "";
          const e2 = t2.toLowerCase().replace(/^:/, "").replace(/:$/, ""), n2 = (t3, e3) => {
            if (!e3.length) return;
            const n3 = document.createElement("div");
            n3.style.marginBottom = "12px";
            const s2 = document.createElement("div");
            s2.textContent = t3, s2.style.cssText = "\n        font-size: 11px;\n        font-weight: 600;\n        text-transform: uppercase;\n        letter-spacing: 0.5px;\n        color: #999;\n        margin-bottom: 6px;\n      ", n3.appendChild(s2);
            const o2 = document.createElement("div");
            o2.style.cssText = "\n        display: grid;\n        grid-template-columns: repeat(8, 1fr);\n        gap: 2px;\n      ", e3.forEach((t4) => {
              const e4 = this.resolveChar(t4), n4 = document.createElement("button");
              n4.textContent = e4, n4.title = `${t4.name}  ${t4.shortcode}`, n4.style.cssText = "\n          font-size: 20px;\n          background: transparent;\n          border: none;\n          cursor: pointer;\n          border-radius: 5px;\n          padding: 4px;\n          line-height: 1.2;\n          transition: background 0.1s;\n          aspect-ratio: 1;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        ", n4.addEventListener("mouseenter", () => n4.style.background = "#f0f0f0"), n4.addEventListener("mouseleave", () => n4.style.background = "transparent"), n4.addEventListener("mousedown", (n5) => {
                var s3;
                n5.preventDefault(), this.saveRecentEmoji(t4), null === (s3 = this.onSelectCallback) || void 0 === s3 || s3.call(this, e4);
              }), o2.appendChild(n4);
            }), n3.appendChild(o2), this.gridArea.appendChild(n3);
          };
          if (e2) {
            const t3 = [];
            T.forEach((n3) => {
              n3.items.forEach((n4) => {
                (n4.name.includes(e2) || n4.shortcode.includes(e2)) && t3.push(n4);
              });
            }), n2(`Results for "${e2}"`, t3);
          } else {
            const t3 = this.getRecentEmojis();
            n2("Recently Used", t3), T.forEach((t4) => n2(t4.label, t4.items));
          }
          if (!this.gridArea.querySelector("button")) {
            const t3 = document.createElement("div");
            t3.textContent = "No emojis found", t3.style.cssText = "text-align: center; color: #aaa; padding: 24px 0; font-size: 13px;", this.gridArea.appendChild(t3);
          }
        }
      }
      class S {
        constructor() {
          this.currentLanguage = "", this.onSaveCallback = null, this.onCloseCallback = null, this.container = document.createElement("div"), this.container.className = "code_editor_modal", this.container.style.display = "none";
          const t2 = document.createElement("div");
          t2.className = "code_editor_modal_content";
          const e2 = document.createElement("div");
          e2.className = "code_editor_modal_header";
          const n2 = document.createElement("span");
          n2.className = "code_editor_modal_title";
          const s2 = document.createElement("div");
          s2.className = "code_editor_modal_actions", this.copyBtn = document.createElement("button"), this.copyBtn.className = "copy_editor_btn", this.copyBtn.innerText = "Copy", this.copyBtn.onclick = () => this.handleCopy(), this.saveBtn = document.createElement("button"), this.saveBtn.className = "copy_editor_btn copy_editor_btn--primary", this.saveBtn.innerText = "Save", this.saveBtn.onclick = () => this.handleSave(), this.cancelBtn = document.createElement("button"), this.cancelBtn.className = "copy_editor_btn copy_editor_btn--cancel", this.cancelBtn.innerText = "Cancel", this.cancelBtn.onclick = () => this.handleClose(), s2.appendChild(this.copyBtn), s2.appendChild(this.saveBtn), s2.appendChild(this.cancelBtn), e2.appendChild(n2), e2.appendChild(s2);
          const o2 = document.createElement("div");
          o2.className = "editor_moal_wrapper", this.lineNumbers = document.createElement("div"), this.lineNumbers.className = "editor_moal_line_number", this.pre = document.createElement("pre"), this.pre.className = "editor_modal_pre_block", this.pre.setAttribute("aria-hidden", "true"), this.codeHighlight = document.createElement("code"), this.codeHighlight.className = "modal_editor_highlight", this.pre.appendChild(this.codeHighlight), this.textArea = document.createElement("textarea"), this.textArea.className = "modal_editor_text_area", this.textArea.spellcheck = false, o2.appendChild(this.lineNumbers), o2.appendChild(this.pre), o2.appendChild(this.textArea), t2.appendChild(e2), t2.appendChild(o2), this.container.appendChild(t2), document.body.appendChild(this.container), this.attachEventListeners();
        }
        attachEventListeners() {
          this.textArea.addEventListener("input", () => {
            this.syncHighlight();
          }), this.textArea.addEventListener("scroll", () => {
            this.pre.scrollTop = this.textArea.scrollTop, this.pre.scrollLeft = this.textArea.scrollLeft, this.lineNumbers.scrollTop = this.textArea.scrollTop;
          }), this.textArea.addEventListener("keydown", (t2) => {
            if ("Tab" === t2.key) {
              t2.preventDefault();
              const e2 = this.textArea.selectionStart, n2 = this.textArea.selectionEnd;
              this.textArea.value = this.textArea.value.substring(0, e2) + "  " + this.textArea.value.substring(n2), this.textArea.selectionStart = this.textArea.selectionEnd = e2 + 2, this.syncHighlight();
            }
          }), this.container.addEventListener("click", (t2) => {
            t2.target === this.container && this.handleClose();
          });
        }
        syncHighlight() {
          const t2 = this.textArea.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          this.codeHighlight.innerHTML = t2 + "\n";
        }
        handleCopy() {
          navigator.clipboard.writeText(this.textArea.value).then(() => {
            const t2 = this.copyBtn.innerText;
            this.copyBtn.innerText = "Copied!", setTimeout(() => this.copyBtn.innerText = t2, 2e3);
          });
        }
        handleSave() {
          this.onSaveCallback && this.onSaveCallback(this.textArea.value), this.close();
        }
        handleClose() {
          this.onCloseCallback && this.onCloseCallback(), this.close();
        }
        open(t2, e2, n2, s2) {
          this.currentLanguage = e2, this.onSaveCallback = n2, this.onCloseCallback = s2;
          this.container.querySelector(".code_editor_modal_title").innerText = e2 || "text", this.textArea.value = t2, this.syncHighlight(), this.container.style.display = "flex", setTimeout(() => this.textArea.focus(), 50);
        }
        close() {
          this.container.style.display = "none", this.textArea.value = "", this.currentLanguage = "";
        }
      }
      class R {
        constructor(t2, e2) {
          this.modal = null, this.activeLayout = null, this.editor = t2, this.document = e2, this.setupClickOutsideListener();
        }
        openLayoutModal() {
          this.modal && (this.modal.remove(), this.modal = null);
          const t2 = document.createElement("div");
          t2.className = "table_modal", t2.id = "layout_modal";
          const e2 = document.createElement("div");
          e2.className = "main_modal layout_main_modal", e2.setAttribute("role", "dialog"), e2.setAttribute("aria-modal", "true"), e2.setAttribute("aria-label", "Insert Layout");
          const n2 = document.createElement("div");
          n2.className = "main_modal_header";
          const s2 = document.createElement("h3");
          s2.className = "main_modal_title", s2.textContent = "Insert Layout";
          const o2 = document.createElement("button");
          o2.className = "main_modal_close", o2.setAttribute("aria-label", "Close"), o2.innerHTML = f.close_icon, o2.onclick = () => this.closeModal(), n2.appendChild(s2), n2.appendChild(o2);
          const i2 = document.createElement("div");
          i2.className = "main_modal_body";
          const l2 = document.createElement("label");
          l2.textContent = "Preset Splits", l2.className = "input_label", l2.style.display = "block", l2.style.marginBottom = "8px";
          const a2 = document.createElement("div");
          a2.style.display = "flex", a2.style.flexWrap = "wrap", a2.style.gap = "8px", a2.style.marginBottom = "16px";
          [{ label: "Single", cols: 1, widths: [100] }, { label: "50 - 50", cols: 2, widths: [50, 50] }, { label: "60 - 40", cols: 2, widths: [60, 40] }, { label: "40 - 60", cols: 2, widths: [40, 60] }, { label: "33 - 33 - 33", cols: 3, widths: [33.33, 33.33, 33.33] }, { label: "25 - 50 - 25", cols: 3, widths: [25, 50, 25] }].forEach((t3) => {
            const e3 = document.createElement("button");
            e3.className = "modal_close_button modal_close_button_secondary", e3.style.padding = "4px 8px", e3.style.fontSize = "12px", e3.textContent = t3.label, e3.onclick = () => {
              this.insertLayout(t3.cols, t3.widths), this.closeModal();
            }, a2.appendChild(e3);
          });
          const r2 = document.createElement("label");
          r2.textContent = "Or Custom Splits (comma separated %)", r2.className = "input_label", r2.style.display = "block", r2.style.marginBottom = "8px";
          const d2 = document.createElement("input");
          d2.type = "text", d2.className = "modal_inputs", d2.placeholder = "e.g. 20, 60, 20", d2.style.width = "100%", i2.appendChild(l2), i2.appendChild(a2), i2.appendChild(r2), i2.appendChild(d2);
          const c2 = document.createElement("div");
          c2.className = "main_modal_footer";
          const h2 = document.createElement("button");
          h2.className = "modal_close_button modal_close_button_secondary", h2.textContent = "Cancel", h2.type = "button", h2.onclick = () => this.closeModal();
          const u2 = document.createElement("button");
          u2.className = "modal_close_button modal_close_button_primary", u2.textContent = "Insert Custom", u2.type = "button", u2.onclick = () => {
            const t3 = d2.value.trim();
            if (t3) {
              const e3 = t3.split(",").map((t4) => parseFloat(t4.trim())).filter((t4) => !isNaN(t4));
              if (e3.length > 0) {
                const t4 = e3.reduce((t5, e4) => t5 + e4, 0), n3 = e3.map((e4) => e4 / t4 * 100);
                this.insertLayout(n3.length, n3);
              } else this.insertLayout(2, [50, 50]);
            } else this.insertLayout(2, [50, 50]);
            this.closeModal();
          }, c2.appendChild(h2), c2.appendChild(u2), e2.appendChild(n2), e2.appendChild(i2), e2.appendChild(c2), t2.appendChild(e2), t2.addEventListener("click", (e3) => {
            e3.target === t2 && this.closeModal();
          }), document.body.appendChild(t2), this.modal = t2, requestAnimationFrame(() => {
            t2.classList.add("table_modal_visible");
          });
        }
        closeModal() {
          this.modal && (this.modal.classList.remove("table_modal_visible"), setTimeout(() => {
            var t2;
            null === (t2 = this.modal) || void 0 === t2 || t2.remove(), this.modal = null;
          }, 200));
        }
        insertLayout(t2, e2) {
          const s2 = `data-id-${Date.now()}`, o2 = `data-id-${Date.now() + 1}`, i2 = document.createElement("div");
          i2.className = "layout_wrapper", i2.setAttribute("data-type", "layout"), i2.setAttribute("data-id", s2), i2.setAttribute("contenteditable", "false");
          const l2 = document.createElement("div");
          l2.className = "table_controls";
          const a2 = document.createElement("button");
          a2.className = "table_delete_button", a2.innerHTML = f.close_icon, a2.onclick = () => {
            const t3 = this.document.blocks.findIndex((t4) => t4.dataId === s2);
            -1 !== t3 && (this.document.blocks.splice(t3, 1), this.document.selectedBlockId === s2 && (this.document.selectedBlockId = null), this.document.emit("documentChanged", this.document));
          }, l2.appendChild(a2), i2.appendChild(l2);
          const r2 = document.createElement("div");
          r2.className = "layout_container", r2.style.display = "flex", r2.style.width = "100%", r2.style.gap = "10px";
          for (let n2 = 0; n2 < t2; n2++) {
            const s3 = document.createElement("div");
            s3.className = "layout_column tblCell", s3.style.flex = `0 0 calc(${e2[n2]}% - ${10 * (t2 - 1) / t2}px)`, s3.style.border = "1px dashed #ccc", s3.style.padding = "10px", s3.style.minHeight = "40px", s3.style.boxSizing = "border-box", s3.contentEditable = "true", s3.setAttribute("data-placeholder", `Column ${n2 + 1}`), this.setupCellEvents(s3), r2.appendChild(s3);
          }
          i2.appendChild(r2);
          let d2 = this.document.blocks.length;
          if (this.document.selectedBlockId) {
            const t3 = this.document.blocks.findIndex((t4) => t4.dataId === this.document.selectedBlockId);
            -1 !== t3 && (d2 = t3 + 1);
          }
          const c2 = { dataId: s2, type: "layout", element: i2 }, h2 = { dataId: o2, type: "text", class: "paragraph-block", pieces: [new n("\u200B", { bold: false, italic: false, underline: false, strikethrough: false, hyperlink: false })] };
          this.document.blocks.splice(d2, 0, c2, h2), this.document.selectedBlockId = s2, this.document.currentOffset = 0, this.document.emit("documentChanged", this.document), setTimeout(() => {
            const t3 = i2.querySelector(".layout_column");
            t3 && (t3.focus(), this.setActiveLayout(i2.querySelector(".layout_container")));
          }, 0);
        }
        setupCellEvents(t2) {
          t2.addEventListener("focus", () => {
            const e2 = t2.closest(".layout_container");
            e2 && this.setActiveLayout(e2), t2.classList.add("tblCell_focused");
          }), t2.addEventListener("blur", () => {
            t2.classList.remove("tblCell_focused");
          }), t2.addEventListener("keydown", (e2) => {
            var n2;
            const s2 = e2;
            if ("Tab" === s2.key) {
              s2.preventDefault(), s2.stopPropagation();
              const e3 = Array.from((null === (n2 = t2.closest(".layout_container")) || void 0 === n2 ? void 0 : n2.querySelectorAll(".layout_column")) || []), o2 = e3.indexOf(t2);
              if (s2.shiftKey) o2 > 0 && (e3[o2 - 1].focus(), this.selectAllInCell(e3[o2 - 1]));
              else if (o2 < e3.length - 1) e3[o2 + 1].focus(), this.selectAllInCell(e3[o2 + 1]);
              else {
                const e4 = t2.closest(".layout_wrapper"), n3 = null == e4 ? void 0 : e4.nextElementSibling;
                n3 && (n3.focus(), this.clearLayoutActive());
              }
            }
            "Enter" !== s2.key || s2.shiftKey || s2.stopPropagation(), "Backspace" !== s2.key && "Delete" !== s2.key || s2.stopPropagation(), 1 !== s2.key.length || s2.ctrlKey || s2.metaKey || s2.altKey || s2.stopPropagation();
          });
        }
        selectAllInCell(t2) {
          const e2 = window.getSelection();
          if (!e2) return;
          const n2 = document.createRange();
          n2.selectNodeContents(t2), e2.removeAllRanges(), e2.addRange(n2);
        }
        setActiveLayout(t2) {
          document.querySelectorAll(".layout_active").forEach((e2) => {
            e2 !== t2 && e2.classList.remove("layout_active");
          }), t2.classList.add("layout_active"), this.activeLayout = t2;
        }
        clearLayoutActive() {
          this.activeLayout && (this.activeLayout.classList.remove("layout_active"), this.activeLayout = null);
        }
        setupClickOutsideListener() {
          document.addEventListener("click", (t2) => {
            const e2 = t2.target, n2 = null !== e2.closest(".layout_wrapper"), s2 = null !== e2.closest("#layout_modal");
            n2 || s2 || this.clearLayoutActive();
          }, true), document.addEventListener("focusin", (t2) => {
            t2.target.closest(".layout_wrapper") || this.clearLayoutActive();
          }, true);
        }
      }
      class B {
        constructor(t2, e2) {
          this.modal = null, this.isKatexLoaded = false, this.editingBlockId = null, this.editor = t2, this.document = e2, this.loadKatex();
        }
        loadKatex() {
          if ("undefined" != typeof katex) return void (this.isKatexLoaded = true);
          if (document.getElementById("katex-js")) return;
          const t2 = document.createElement("link");
          t2.rel = "stylesheet", t2.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css", document.head.appendChild(t2);
          const e2 = document.createElement("script");
          e2.id = "katex-js", e2.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js", e2.onload = () => {
            this.isKatexLoaded = true;
          }, document.head.appendChild(e2);
        }
        openMathModal(t2 = "", e2 = null) {
          if (!this.isKatexLoaded) return void alert("Math rendering engine is still loading. Please try again in a moment.");
          this.editingBlockId = e2, this.modal && (this.modal.remove(), this.modal = null);
          const n2 = document.createElement("div");
          n2.className = "table_modal", n2.id = "math_modal";
          const s2 = document.createElement("div");
          s2.className = "main_modal", s2.setAttribute("role", "dialog"), s2.setAttribute("aria-modal", "true"), s2.setAttribute("aria-label", "Insert Equation"), s2.style.width = "400px", s2.style.height = "390px", s2.style.maxHeight = "90vh", s2.style.position = "fixed", s2.style.top = "90px", s2.style.right = "-90px", s2.style.margin = "0";
          const o2 = document.createElement("div");
          o2.className = "main_modal_header";
          const i2 = document.createElement("h3");
          i2.className = "main_modal_title", i2.textContent = this.editingBlockId ? "Edit Equation" : "Insert Equation";
          const l2 = document.createElement("button");
          l2.className = "main_modal_close", l2.setAttribute("aria-label", "Close"), l2.innerHTML = f.close_icon, l2.onclick = () => this.closeModal(), o2.appendChild(i2), o2.appendChild(l2);
          const a2 = document.createElement("div");
          a2.className = "main_modal_body";
          const r2 = document.createElement("label");
          r2.textContent = "LaTeX Input:", r2.className = "input_label", r2.style.display = "block", r2.style.marginBottom = "8px";
          const d2 = document.createElement("textarea");
          d2.className = "modal_inputs", d2.style.width = "100%", d2.style.height = "80px", d2.style.resize = "vertical", d2.placeholder = "e.g. c = \\pm\\sqrt{a^2 + b^2}", d2.value = t2;
          const c2 = document.createElement("label");
          c2.textContent = "Preview:", c2.className = "input_label", c2.style.display = "block", c2.style.marginTop = "16px", c2.style.marginBottom = "8px";
          const h2 = document.createElement("div");
          h2.style.padding = "10px", h2.style.border = "1px solid #ccc", h2.style.borderRadius = "4px", h2.style.minHeight = "50px", h2.style.display = "flex", h2.style.alignItems = "center", h2.style.justifyContent = "center", h2.style.overflowX = "auto";
          const u2 = () => {
            try {
              katex.render(d2.value || "Preview", h2, { throwOnError: false });
            } catch (t3) {
              console.error("error", t3), h2.textContent = "Invalid LaTeX";
            }
          };
          d2.addEventListener("input", u2), a2.appendChild(r2), a2.appendChild(d2), a2.appendChild(c2), a2.appendChild(h2);
          const p2 = document.createElement("div");
          p2.className = "main_modal_footer";
          const m2 = document.createElement("button");
          m2.className = "modal_close_button modal_close_button_secondary", m2.textContent = "Cancel", m2.type = "button", m2.onclick = () => this.closeModal();
          const g2 = document.createElement("button");
          g2.className = "modal_close_button modal_close_button_primary", g2.textContent = "Apply Equation", g2.type = "button", g2.onclick = () => {
            d2.value.trim() && this.insertEquation(d2.value.trim()), this.closeModal();
          }, p2.appendChild(m2), p2.appendChild(g2), s2.appendChild(o2), s2.appendChild(a2), s2.appendChild(p2), n2.appendChild(s2), n2.addEventListener("click", (t3) => {
            t3.target === n2 && this.closeModal();
          }), document.body.appendChild(n2), this.modal = n2, requestAnimationFrame(() => {
            n2.classList.add("table_modal_visible"), d2.focus(), u2();
          });
        }
        closeModal() {
          this.modal && (this.modal.classList.remove("table_modal_visible"), setTimeout(() => {
            var t2;
            null === (t2 = this.modal) || void 0 === t2 || t2.remove(), this.modal = null, this.editingBlockId = null;
          }, 200));
        }
        insertEquation(t2) {
          const e2 = katex.renderToString(t2, { output: "mathml" });
          if (this.editingBlockId) {
            const n2 = this.document.blocks.find((t3) => t3.dataId === this.editingBlockId);
            if (n2 && n2.element) {
              const s3 = n2.element.querySelector(".math_node");
              s3 && (s3.innerHTML = e2, s3.dataset.latex = t2);
            }
            return void this.document.emit("documentChanged", this.document);
          }
          const s2 = `data-id-${Date.now()}`, o2 = document.createElement("div");
          o2.setAttribute("data-id", s2), o2.setAttribute("contenteditable", "false"), o2.style.display = "inline-flex", o2.style.alignItems = "center", o2.style.gap = "6px", o2.style.margin = "4px", o2.style.cursor = "pointer", o2.style.position = "relative";
          const i2 = document.createElement("button");
          i2.className = "table_delete_button", i2.innerHTML = f.close_icon, i2.style.cursor = "pointer", i2.style.opacity = "0", i2.style.transition = "opacity 0.2s", o2.onmouseenter = () => {
            i2.style.opacity = "1";
          }, o2.onmouseleave = () => {
            i2.style.opacity = "0";
          }, i2.onclick = (t3) => {
            t3.stopPropagation();
            const e3 = this.document.blocks.findIndex((t4) => t4.dataId === s2);
            -1 !== e3 && (this.document.blocks.splice(e3, 1), this.document.selectedBlockId === s2 && (this.document.selectedBlockId = null), this.document.emit("documentChanged", this.document));
          };
          const l2 = document.createElement("span");
          l2.className = "math_node", l2.dataset.latex = t2, l2.innerHTML = e2, o2.onclick = (e3) => {
            e3.stopPropagation(), this.openMathModal(t2, s2);
          }, o2.appendChild(l2), o2.appendChild(i2);
          let a2 = this.document.blocks.length;
          if (this.document.selectedBlockId) {
            const t3 = this.document.blocks.findIndex((t4) => t4.dataId === this.document.selectedBlockId);
            -1 !== t3 && (a2 = t3 + 1);
          }
          const r2 = { dataId: s2, type: "math", element: o2 }, d2 = { dataId: `data-id-${Date.now() + 1}`, type: "text", class: "paragraph-block", pieces: [new n("\u200B", { bold: false, italic: false, underline: false, strikethrough: false, hyperlink: false })] };
          this.document.blocks.splice(a2, 0, r2, d2), this.document.selectedBlockId = d2.dataId, this.document.currentOffset = 0, this.document.emit("documentChanged", this.document);
        }
      }
      class O {
        constructor(t2) {
          this.isSpeaking = false, this.synth = window.speechSynthesis, this.onStateChange = t2;
        }
        getHindiVoice() {
          return this.synth.getVoices().find((t2) => "Google \u0939\u093F\u0928\u094D\u0926\u0940" === t2.name || "hi-IN" === t2.lang) || null;
        }
        speak(t2) {
          if (!t2 || "" === t2.trim()) return;
          this.synth.speaking && this.synth.cancel();
          const e2 = new SpeechSynthesisUtterance(t2), n2 = this.getHindiVoice();
          n2 && (e2.voice = n2, e2.lang = "hi-IN"), e2.onstart = () => {
            this.isSpeaking = true, this.onStateChange(true);
          }, e2.onend = () => {
            this.isSpeaking = false, this.onStateChange(false);
          }, e2.onerror = () => {
            this.isSpeaking = false, this.onStateChange(false);
          }, this.synth.speak(e2);
        }
        stop() {
          this.synth.speaking && (this.synth.cancel(), this.isSpeaking = false, this.onStateChange(false));
        }
        toggle(t2) {
          this.isSpeaking ? this.stop() : this.speak(t2);
        }
      }
      class N extends e {
        constructor(t2, e2) {
          var o2, i2, l2, d2, g2, b2, y2, T2, L2, N2, H, M, P;
          super(), this.savedSelection = null, this.debounceTimer = null;
          const { mainEditorId: D, toolbarId: z, popupToolbarId: V } = C(t2, e2);
          this.editorContainer = document.getElementById(D) || null, this.toolbarContainer = document.getElementById(z) || null;
          const F = document.getElementById(V) || null;
          if (!this.editorContainer || !this.toolbarContainer || !F) throw new Error("Editor element not found or incorrect element type.");
          this.document = new s(), this.editorView = new c(this.editorContainer, this.document), this.toolbarView = new h(this.toolbarContainer), this.popupToolbarView = new x(F), this.linkPopupView = new E(), this.hyperlinkHandler = new p(this.editorContainer, this.editorView, this.document), this.imageHandler = new v(this.editorContainer, this.document), this.undoRedoManager = new I(this.document, this.editorView), this.editorView.setImageHandler(this.imageHandler), this.imageHandler.setEditorView(this.editorView), this.document.setEditorView(this.editorView), this.document.setUndoRedoManager(this.undoRedoManager), this.hyperlinkHandler.setUndoRedoManager(this.undoRedoManager), this.linkPopupView.setCallbacks((t3) => this.openLink(t3), (t3) => this.unlinkText(t3)), this.insertTableHandler = new _(this.editorView.container, this.document), this.insertLayoutHandler = new R(this.editorView.container, this.document), this.insertMathHandler = new B(this.editorView.container, this.document), this.textToSpeechHandler = new O((t3) => {
            const e3 = document.getElementById("textToSpeech");
            e3 && (e3.innerHTML = t3 ? f.speaker_off : f.speaker_on, e3.dataset.tooltip = t3 ? "stop Reading" : "start Reading");
          }), this.speechToTextHandler = new w(this.document, this.editorView, (t3) => {
            const e3 = document.getElementById("speechToText");
            e3 && (e3.innerHTML = t3 ? f.stop_microphone : f.start_microphone, e3.dataset.tooltip = t3 ? "stop" : "start");
          }, (t3) => {
            const [e3, n2] = this.getSelectionRange();
            n2 > e3 && this.document.deleteRange(e3, n2, this.document.selectedBlockId, this.document.currentOffset);
            let s2 = e3;
            this.document.insertAt(t3, Object.assign({}, this.currentAttributes), s2, this.document.selectedBlockId, 0, "", "batch"), s2 += t3.length, this.setCursorPosition(s2);
          });
          const j = document.getElementById("speechToText");
          j && (j.innerHTML = "", j.insertAdjacentHTML("afterbegin", f.start_microphone), j.dataset.tooltip = "start");
          const U = document.getElementById("textToSpeech");
          U && (U.innerHTML = "", U.insertAdjacentHTML("afterbegin", f.speaker_on), U.dataset.tooltip = "start Reading"), this.emojiPickerView = new A(), this.codeEditorModal = new S(), this.emojiPickerView.onSelect((t3) => {
            var e3, n2, s2, o3;
            const i3 = null !== (n2 = null === (e3 = this.savedSelection) || void 0 === e3 ? void 0 : e3.start) && void 0 !== n2 ? n2 : 0, l3 = null !== (o3 = null === (s2 = this.savedSelection) || void 0 === s2 ? void 0 : s2.end) && void 0 !== o3 ? o3 : i3;
            l3 > i3 && this.document.deleteRange(i3, l3, this.document.selectedBlockId, this.document.currentOffset, false), this.document.insertAt(t3, Object.assign({}, this.currentAttributes), i3, this.document.selectedBlockId, 0, "", "batch");
            const a2 = i3 + t3.length;
            this.savedSelection = { start: a2, end: a2 }, this.setCursorPosition(a2);
          }), this.currentAttributes = { bold: false, italic: false, underline: false, strikethrough: false, subscript: false, superscript: false, undo: false, redo: false, hyperlink: false }, this.manualOverride = false, this.lastPiece = null, this.toolbarView.on("toolbarAction", (t3, e3 = []) => this.handleToolbarAction(t3, e3)), this.popupToolbarView.on("popupAction", (t3) => this.handleToolbarAction(t3)), this.document.on("documentChanged", () => {
            if (0 === this.document.blocks.length || 1 === this.document.blocks.length && this.document.blocks[0].pieces.every((t3) => "" === t3.text.trim() || "\u200B" === t3.text)) {
              const t3 = document.getElementById("loadHtmlButton");
              t3 && (t3.selectedIndex = 0);
            }
            this.editorView.render();
          }), this.document.on("documentChanged", () => {
            var t3;
            const e3 = this.document.getHtmlContent();
            this.emit("contentChange", { html: e3, text: (null === (t3 = this.editorContainer) || void 0 === t3 ? void 0 : t3.textContent) || "" });
          }), this.editorContainer.addEventListener("dblclick", (t3) => {
            const e3 = t3.target.closest(".code_block_wrapper");
            if (e3) {
              t3.preventDefault();
              const n2 = e3.getAttribute("data-id");
              if (!n2) return;
              const s2 = this.document.blocks.find((t4) => t4.dataId === n2);
              s2 && "code" === s2.type && this.codeEditorModal.open(s2.code || "", s2.language || "text", (t4) => {
                s2.code = t4, this.document.emit("documentChanged", this.document);
              }, () => {
                var t4;
                null === (t4 = this.editorContainer) || void 0 === t4 || t4.focus();
              });
            }
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
            const s2 = "block" === e3.style.display;
            e3.style.display = s2 ? "none" : "block";
          }), null === (i2 = document.getElementById("fontColorPicker")) || void 0 === i2 || i2.addEventListener("input", (t3) => {
            const e3 = t3.target.value, [n2, s2] = this.getSelectionRange(), o3 = document.getElementById("fontColorIndicator");
            o3 && (o3.style.backgroundColor = e3), this.document.dataIds.length > 1 ? this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let s3 = 0;
                t4.pieces.forEach((t5) => {
                  s3 += t5.text.length;
                });
                let o4 = n2 - s3;
                this.document.applyFontColor(o4, s3, e3);
              }
            }) : (this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = setTimeout(() => {
              this.document.applyFontColor(n2, s2, e3);
            }, 300));
          }), null === (l2 = document.getElementById("colorResetFont")) || void 0 === l2 || l2.addEventListener("click", () => {
            const t3 = document.getElementById("fontColorPicker"), e3 = document.getElementById("fontColorIndicator");
            t3 && (t3.value = "#000000", e3 && (e3.style.backgroundColor = "#000000"), t3.dispatchEvent(new Event("input")));
          }), document.addEventListener("click", (t3) => {
            var e3;
            const n2 = t3.target, s2 = document.getElementById("colorWrapper"), o3 = document.getElementById("colorBgWrapper"), i3 = document.getElementById("fontColor"), l3 = document.getElementById("bgColor");
            !s2 || n2.closest("#colorWrapper") || n2 === i3 || (null == i3 ? void 0 : i3.contains(n2)) || (s2.style.display = "none"), !o3 || n2.closest("#colorBgWrapper") || n2 === l3 || (null == l3 ? void 0 : l3.contains(n2)) || (o3.style.display = "none"), (null === (e3 = this.editorContainer) || void 0 === e3 ? void 0 : e3.contains(n2)) || n2.closest(".hyperlink-popup") || this.hyperlinkHandler.hideHyperlinkViewButton();
          }), null === (d2 = document.getElementById("bgColor")) || void 0 === d2 || d2.addEventListener("click", (t3) => {
            t3.stopPropagation();
            const e3 = document.getElementById("colorBgWrapper"), n2 = document.getElementById("bgColorPicker");
            if (!e3 || !n2) return;
            const s2 = "block" === e3.style.display;
            e3.style.display = s2 ? "none" : "block";
          }), null === (g2 = document.getElementById("bgColorPicker")) || void 0 === g2 || g2.addEventListener("input", (t3) => {
            const e3 = t3.target.value, [n2, s2] = this.getSelectionRange(), o3 = document.getElementById("bgColorIndicator");
            o3 && (o3.style.backgroundColor = e3), this.document.dataIds.length > 1 ? this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let s3 = 0;
                t4.pieces.forEach((t5) => {
                  s3 += t5.text.length;
                });
                let o4 = n2 - s3;
                this.document.applyBgColor(o4, s3, e3);
              }
            }) : (this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = setTimeout(() => {
              this.document.applyBgColor(n2, s2, e3);
            }, 300));
          }), null === (b2 = document.getElementById("colorResetBG")) || void 0 === b2 || b2.addEventListener("click", () => {
            const t3 = document.getElementById("bgColorPicker"), e3 = document.getElementById("bgColorIndicator");
            t3 && (t3.value = "#ffffff", e3 && (e3.style.backgroundColor = "#ffffff"), t3.dispatchEvent(new Event("input")));
          }), null === (y2 = document.getElementById("getHtmlButton")) || void 0 === y2 || y2.addEventListener("click", (t3) => {
            const e3 = this.document.getHtmlContent(true);
            console.log("Editor HTML Content:", e3), this.htmlToJsonParser = new k(e3);
            const n2 = this.htmlToJsonParser.parse();
            console.log("htmltoJson", JSON.stringify(n2, null, 2), n2), this.showAcknowledgement("HTML copied to clipboard", 2e3);
          }), null === (T2 = document.getElementById("loadHtmlButton")) || void 0 === T2 || T2.addEventListener("change", (t3) => {
            this.undoRedoManager.saveUndoSnapshot();
            const e3 = t3.target, n2 = e3.options[e3.selectedIndex].dataset.html || u.TEST_HTML_CODE;
            this.htmlToJsonParser = new k(n2), console.log(this.htmlToJsonParser, "this.htmlToJsonParser");
            const s2 = this.htmlToJsonParser.parse();
            this.document.blocks = s2, s2.length > 0 && (this.document.dataIds[0] = s2[0].dataId, this.document.selectedBlockId = s2[0].dataId), this.document.emit("documentChanged", this);
            const [o3] = this.getSelectionRange();
            this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let e4 = 0;
                t4.pieces.forEach((t5) => {
                  e4 += t5.text.length;
                });
                let n3 = o3 - e4;
                t4.fontSize && this.document.setFontSize(n3, e4, t4.fontSize);
              }
            }), console.log("blocks", this.document.blocks, this.document.dataIds, this.document.currentOffset), console.log("htmltoJson", JSON.stringify(s2, null, 2), s2);
          }), null === (L2 = document.getElementById("fontFamily")) || void 0 === L2 || L2.addEventListener("change", (t3) => {
            this.undoRedoManager.saveUndoSnapshot();
            const e3 = t3.target.value, [n2, s2] = this.getSelectionRange();
            this.document.dataIds.length > 1 ? this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let s3 = 0;
                t4.pieces.forEach((t5) => {
                  s3 += t5.text.length;
                });
                let o3 = n2 - s3;
                this.document.setFontFamily(o3, s3, e3);
              }
            }) : this.document.setFontFamily(n2, s2, e3);
          }), null === (N2 = document.getElementById("fontSize")) || void 0 === N2 || N2.addEventListener("change", (t3) => {
            this.undoRedoManager.saveUndoSnapshot();
            const e3 = t3.target.value, [n2, s2] = this.getSelectionRange();
            this.document.dataIds.length > 1 ? this.document.blocks.forEach((t4) => {
              if (this.document.dataIds.includes(t4.dataId)) {
                this.document.selectedBlockId = t4.dataId;
                let s3 = 0;
                t4.pieces.forEach((t5) => {
                  s3 += t5.text.length;
                });
                let o3 = n2 - s3;
                this.document.setFontSize(o3, s3, e3);
              }
            }) : this.document.setFontSize(n2, s2, e3);
          }), null === (H = document.getElementById("alignLeft")) || void 0 === H || H.addEventListener("click", () => {
            console.log("alignment alignLeft", this.document.dataIds), this.document.dataIds.forEach((t3) => this.document.setAlignment("left", t3));
          }), null === (M = document.getElementById("alignCenter")) || void 0 === M || M.addEventListener("click", () => {
            console.log("alignment alignCenter", this.document.dataIds), this.document.dataIds.forEach((t3) => this.document.setAlignment("center", t3));
          }), null === (P = document.getElementById("alignRight")) || void 0 === P || P.addEventListener("click", () => {
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
            var e3, s2;
            this.undoRedoManager.saveUndoSnapshot(), t3.preventDefault();
            const o3 = null === (e3 = t3.clipboardData) || void 0 === e3 ? void 0 : e3.getData("text/html"), [i3, l3] = this.getSelectionRange();
            l3 > i3 && this.document.deleteRange(i3, l3, this.document.selectedBlockId, this.document.currentOffset);
            let d3 = [];
            if (o3) d3 = m(o3);
            else {
              const e4 = (function(t4) {
                const e5 = [];
                let n2, s3 = 0;
                for (; null !== (n2 = a.exec(t4)); ) {
                  const o4 = n2.index;
                  let i4 = n2[0], l4 = "";
                  const a2 = i4.match(/[.,!?;:)\]\}"']+$/);
                  if (a2 && (l4 = a2[0], i4 = i4.slice(0, -l4.length)), r(t4, o4)) continue;
                  o4 > s3 && e5.push({ text: t4.substring(s3, o4), isUrl: false });
                  let d4 = i4;
                  d4.startsWith("http") || (d4 = "https://" + d4), e5.push({ text: i4, isUrl: true, url: d4 }), l4 && e5.push({ text: l4, isUrl: false }), s3 = o4 + n2[0].length;
                }
                return s3 < t4.length && e5.push({ text: t4.substring(s3), isUrl: false }), e5;
              })((null === (s2 = t3.clipboardData) || void 0 === s2 ? void 0 : s2.getData("text/plain")) || "");
              d3 = e4.map((t4) => t4.isUrl && t4.url ? new n(t4.text, Object.assign(Object.assign({}, this.currentAttributes), { hyperlink: t4.url })) : new n(t4.text, Object.assign({}, this.currentAttributes)));
            }
            let c2 = i3;
            for (const t4 of d3) this.document.insertAt(t4.text, Object.assign({}, t4.attributes), c2, this.document.selectedBlockId, 0, "", "batch"), c2 += t4.text.length;
            this.setCursorPosition(c2);
          }), this.editorContainer.addEventListener("dragover", (t3) => {
            t3.preventDefault();
          }), this.editorContainer.addEventListener("drop", (t3) => {
            var e3, s2;
            t3.preventDefault(), this.undoRedoManager.saveUndoSnapshot();
            const o3 = null === (e3 = t3.dataTransfer) || void 0 === e3 ? void 0 : e3.getData("text/html"), [i3, l3] = this.getSelectionRange();
            l3 > i3 && this.document.deleteRange(i3, l3, this.document.selectedBlockId, this.document.currentOffset);
            let a2 = [];
            if (o3) a2 = m(o3);
            else {
              const e4 = (null === (s2 = t3.dataTransfer) || void 0 === s2 ? void 0 : s2.getData("text/plain")) || "";
              a2 = [new n(e4, Object.assign({}, this.currentAttributes))];
            }
            let r2 = i3;
            for (const t4 of a2) this.document.insertAt(t4.text, Object.assign({}, t4.attributes), r2, this.document.selectedBlockId, 0, "", "batch"), r2 += t4.text.length;
            this.setCursorPosition(r2);
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
          const [n2, s2] = this.getSelectionRange();
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
            case "speechToText":
              this.speechToTextHandler.toggleRecording();
              break;
            case "insert_table":
              this.insertTableHandler.openTableModal();
              break;
            case "insert_layout":
              this.insertLayoutHandler.openLayoutModal();
              break;
            case "insert_math":
              this.insertMathHandler.openMathModal();
              break;
            case "emoji":
              this.savedSelection = o(this.editorView.container);
              const e3 = document.querySelector('[data-action="emoji"]');
              e3.addEventListener("mousedown", (t3) => {
                t3.preventDefault();
              }), e3 && this.emojiPickerView.open(e3);
              break;
            case "textToSpeech":
              const i2 = this.getTextForSpeech();
              if (!i2) return void console.warn("Nothing to read");
              this.textToSpeechHandler.toggle(i2);
              break;
            default:
              if (n2 < s2) switch (this.undoRedoManager.saveUndoSnapshot(), t2) {
                case "bold":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e4 = 0;
                      t3.pieces.forEach((t4) => {
                        e4 += t4.text.length;
                      });
                      let s3 = n2 - e4;
                      this.document.toggleBoldRange(s3, e4);
                    }
                  }) : this.document.toggleBoldRange(n2, s2);
                  break;
                case "italic":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e4 = 0;
                      t3.pieces.forEach((t4) => {
                        e4 += t4.text.length;
                      });
                      let s3 = n2 - e4;
                      this.document.toggleItalicRange(s3, e4);
                    }
                  }) : this.document.toggleItalicRange(n2, s2);
                  break;
                case "underline":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e4 = 0;
                      t3.pieces.forEach((t4) => {
                        e4 += t4.text.length;
                      });
                      let s3 = n2 - e4;
                      this.document.toggleUnderlineRange(s3, e4);
                    }
                  }) : this.document.toggleUnderlineRange(n2, s2);
                  break;
                case "strikethrough":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e4 = 0;
                      t3.pieces.forEach((t4) => {
                        e4 += t4.text.length;
                      });
                      let s3 = n2 - e4;
                      this.document.toggleStrikethroughRange(s3, e4);
                    }
                  }) : this.document.toggleStrikethroughRange(n2, s2);
                  break;
                case "subscript":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e4 = 0;
                      t3.pieces.forEach((t4) => {
                        e4 += t4.text.length;
                      });
                      let s3 = n2 - e4;
                      this.document.toggleSubscriptRange(s3, e4);
                    }
                  }) : this.document.toggleSubscriptRange(n2, s2);
                  break;
                case "superscript":
                  this.document.dataIds.length > 1 ? this.document.blocks.forEach((t3) => {
                    if (this.document.dataIds.includes(t3.dataId)) {
                      this.document.selectedBlockId = t3.dataId;
                      let e4 = 0;
                      t3.pieces.forEach((t4) => {
                        e4 += t4.text.length;
                      });
                      let s3 = n2 - e4;
                      this.document.toggleSuperscriptRange(s3, e4);
                    }
                  }) : this.document.toggleSuperscriptRange(n2, s2);
                  break;
                case "hyperlink":
                  this.hyperlinkHandler.hanldeHyperlinkClick(n2, s2, this.document.currentOffset, this.document.selectedBlockId, this.document.blocks);
              }
              else this.currentAttributes[t2] = !this.currentAttributes[t2], this.manualOverride = true;
          }
          this.toolbarView.updateActiveStates(this.currentAttributes);
        }
        handleSelectionChange() {
          var t2, e2, n2;
          const s2 = window.getSelection();
          if (!s2 || 0 === s2.rangeCount || !(null === (t2 = this.editorContainer) || void 0 === t2 ? void 0 : t2.contains(s2.anchorNode))) return this.hyperlinkHandler.hideHyperlinkViewButton(), void this.popupToolbarView.hide();
          const o2 = (null === (e2 = s2.anchorNode) || void 0 === e2 ? void 0 : e2.nodeType) === Node.TEXT_NODE ? s2.anchorNode.parentElement : s2.anchorNode;
          if (null == o2 ? void 0 : o2.closest(".tblCell")) return void this.popupToolbarView.hide();
          const i2 = document.getElementById("textToSpeech");
          s2 && !s2.isCollapsed && s2.toString().trim() ? null == i2 || i2.classList.remove("hidden") : null == i2 || i2.classList.add("hidden");
          const [l2] = this.getSelectionRange();
          if (this.imageHandler.currentCursorLocation = l2, s2.isCollapsed ? (this.document.dataIds = [], this.document.selectAll = false, this.popupToolbarView.hide()) : (this.document.getAllSelectedDataIds(), this.document.dataIds.length === this.document.blocks.length && this.document.blocks.length > 0 && (this.document.selectAll = true), this.popupToolbarView.show(s2)), !s2 || 0 === s2.rangeCount) return;
          s2 && true === s2.isCollapsed && (this.document.dataIds = [], this.document.selectAll = false);
          const a2 = s2.getRangeAt(0), r2 = (null === (n2 = a2.startContainer.parentElement) || void 0 === n2 ? void 0 : n2.closest("[data-id]")) || a2.startContainer;
          if (r2 instanceof HTMLElement) {
            const t3 = r2.getAttribute("data-id") || (a2.startContainer instanceof HTMLElement ? a2.startContainer.getAttribute("data-id") : null);
            if (t3) {
              const e3 = this.document.blocks.find((e4) => e4.dataId === t3);
              e3 && "table" !== e3.type && (this.document.selectedBlockId = t3);
            }
          }
          this.syncCurrentAttributesWithCursor();
        }
        handleKeydown(t2) {
          var e2, s2;
          const [o2, i2] = this.getSelectionRange();
          if (this.imageHandler.currentCursorLocation = o2, ("Enter" === t2.key || " " === t2.key) && this.document.selectedBlockId) {
            const e3 = this.document.blocks.findIndex((t3) => t3.dataId === this.document.selectedBlockId);
            if (-1 !== e3) {
              const s3 = this.document.blocks[e3];
              if ("text" === s3.type && Array.isArray(s3.pieces)) {
                const o3 = s3.pieces.map((t3) => t3.text).join("").replace(/\u200B/g, "").trim().match(/^```([a-zA-Z0-9_\-\+]*)$/);
                if (o3) {
                  t2.preventDefault(), this.undoRedoManager.saveUndoSnapshot(), s3.type = "code", s3.language = o3[1] || "text", s3.code = "", s3.pieces = [], s3.class = "code_block_wrapper";
                  const i3 = `data-id-${Date.now()}`;
                  return this.document.blocks.splice(e3 + 1, 0, { dataId: i3, class: "paragraph-block", pieces: [new n("\u200B", { fontFamily: "Arial", fontSize: "16px", fontColor: "#000000", bgColor: "#ffffff", bold: false, italic: false, underline: false, strikethrough: false })], type: "text" }), this.document.selectedBlockId = i3, this.document.emit("documentChanged", this.document), void setTimeout(() => {
                    this.setCursorPosition(this.document.currentOffset + 1, i3);
                  }, 0);
                }
              }
            }
          }
          if ("Enter" === t2.key) {
            t2.preventDefault(), this.undoRedoManager.saveUndoSnapshot();
            const s3 = `data-id-${Date.now()}`, l2 = this.document.blocks.findIndex((t3) => t3.dataId === this.document.selectedBlockId), a2 = this.document.blocks[l2], r2 = (null === (e2 = null == a2 ? void 0 : a2.pieces) || void 0 === e2 ? void 0 : e2.length) > 0 ? a2.pieces[a2.pieces.length - 1] : null, d2 = r2 ? Object.assign({}, r2.attributes) : { fontFamily: "Arial", fontSize: "16px", fontColor: "#000000", bgColor: "#ffffff", bold: false, italic: false, underline: false, strikethrough: false };
            if (a2 && "image" === a2.type) this.document.blocks.splice(l2 + 1, 0, { dataId: s3, class: "paragraph-block", pieces: [new n("\u200B", d2)], type: "text" }), this.document.emit("documentChanged", this), this.imageHandler.setCursorPostion(1, s3);
            else if (!a2 || "ol" !== a2.listType && "ul" !== a2.listType && "li" !== a2.listType) {
              const t3 = this.getCurrentCursorBlock(), e3 = null == t3 ? void 0 : t3.toString();
              if (e3 && a2 && "text" === a2.type) {
                const t4 = o2 - this.document.currentOffset, i3 = [], l3 = [];
                let r3 = 0;
                for (const e4 of a2.pieces) {
                  const s4 = r3 + e4.text.length;
                  if (s4 <= t4) i3.push(e4.clone());
                  else if (r3 >= t4) l3.push(e4.clone());
                  else {
                    const s5 = t4 - r3, o3 = e4.text.slice(0, s5), a3 = e4.text.slice(s5);
                    o3 && i3.push(new n(o3, Object.assign({}, e4.attributes))), a3 && l3.push(new n(a3, Object.assign({}, e4.attributes)));
                  }
                  r3 = s4;
                }
                a2.pieces = i3.length > 0 ? i3 : [new n("\u200B", d2)];
                const c2 = l3.length > 0 ? l3 : [new n("\u200B", d2)], h2 = this.addBlockAfter(this.document.blocks, e3, { dataId: s3, class: "paragraph-block", pieces: c2, type: "text" });
                this.document.blocks = h2;
              } else this.document.blocks.push({ dataId: s3, class: "paragraph-block", pieces: [new n("\u200B", d2)], type: "text" });
            } else {
              let t3 = [new n("\u200B", d2)];
              const e3 = o2 - this.document.currentOffset;
              if ("text" === a2.type && a2.pieces) {
                const s4 = [], o3 = [];
                let i4 = 0;
                for (const t4 of a2.pieces) {
                  const l3 = i4 + t4.text.length;
                  if (l3 <= e3) s4.push(t4.clone());
                  else if (i4 >= e3) o3.push(t4.clone());
                  else {
                    const l4 = e3 - i4, a3 = t4.text.slice(0, l4), r4 = t4.text.slice(l4);
                    a3 && s4.push(new n(a3, Object.assign({}, t4.attributes))), r4 && o3.push(new n(r4, Object.assign({}, t4.attributes)));
                  }
                  i4 = l3;
                }
                a2.pieces = s4.length > 0 ? s4 : [new n("\u200B", d2)], t3 = o3.length > 0 ? o3 : [new n("\u200B", d2)];
              }
              let i3 = { dataId: s3, class: "paragraph-block", pieces: t3, type: "text" }, r3 = "";
              if ("ol" === a2.listType ? (i3.listType = "li", i3.listStart = a2.listStart + 1, i3.parentId = a2.dataId, r3 = a2.dataId) : "li" === a2.listType ? (i3.listType = "li", i3.listStart = a2.listStart + 1, i3.parentId = a2.parentId, r3 = a2.parentId) : "ul" === a2.listType && (i3.listType = "ul", i3.parentId = a2.parentId || a2.dataId), this.document.blocks.splice(l2 + 1, 0, i3), "ol" === a2.listType || "li" === a2.listType) for (let t4 = l2 + 2; t4 < this.document.blocks.length; t4++) {
                const e4 = this.document.blocks[t4];
                if ("li" !== e4.listType || e4.parentId !== r3) break;
                e4.listStart += 1;
              }
            }
            this.syncCurrentAttributesWithCursor(), this.editorView.render(), this.setCursorPosition(i2 + 1, s3);
          } else if ("Backspace" === t2.key) {
            if (t2.preventDefault(), this.imageHandler.isImageHighlighted) {
              const t3 = this.document.blocks.findIndex((t4) => t4.dataId === this.imageHandler.highLightedImageDataId);
              return this.imageHandler.deleteImage(), void this.imageHandler.setCursorPostion(1, this.document.blocks[t3 - 1].dataId);
            }
            const e3 = window.getSelection();
            console.log(e3, "selection lntgerr");
            if ((this.document.selectAll || this.document.dataIds.length === this.document.blocks.length && this.document.dataIds.length > 0 || this.document.dataIds.length > 1) && !(null === (s2 = window.getSelection()) || void 0 === s2 ? void 0 : s2.isCollapsed)) {
              this.undoRedoManager.saveUndoSnapshot();
              const t3 = this.document.dataIds[0], e4 = this.document.blocks.findIndex((e5) => e5.dataId === t3);
              this.document.deleteBlocks();
              let s3 = null, o3 = 0;
              if (0 === this.document.blocks.length) {
                const t4 = `data-id-${Date.now()}`;
                this.document.blocks.push({ dataId: t4, class: "paragraph-block", pieces: [new n(" ")], type: "text" }), s3 = t4, o3 = 0, this.editorView.render();
              } else if (e4 < this.document.blocks.length) s3 = this.document.blocks[e4].dataId, o3 = 0;
              else {
                const t4 = this.document.blocks[this.document.blocks.length - 1];
                s3 = t4.dataId, o3 = t4.pieces.reduce((t5, e5) => t5 + e5.text.length, 0);
              }
              return void this.setCursorPosition(o3, s3);
            }
            if (i2 > o2) {
              this.undoRedoManager.saveUndoSnapshot();
              const t3 = Math.min(this.document.currentOffset, o2);
              this.document.deleteRange(o2, i2, this.document.selectedBlockId, t3, true), this.setCursorPosition(o2 - 1);
              const e4 = this.document.blocks.findIndex((t4) => t4.dataId === this.document.selectedBlockId);
              console.log(e4, "index lntgerr");
              if (null === document.querySelector(`[data-id="${this.document.selectedBlockId}"]`)) {
                let t4 = 0;
                console.log(t4, " listStart lntgerr");
                const e5 = this.document.blocks.map((e6, n2) => (void 0 === (null == e6 ? void 0 : e6.listType) && null === (null == e6 ? void 0 : e6.listType) || ("ol" === (null == e6 ? void 0 : e6.listType) ? (t4 = 1, e6.listStart = 1) : "li" === (null == e6 ? void 0 : e6.listType) && (t4 += 1, e6.listStart = t4)), e6));
                console.log(e5, "blocks lntgerr"), this.document.emit("documentChanged", this);
              }
            } else if (o2 === i2 && o2 > 0) {
              const t3 = this.editorView.container.textContent || "";
              let e4 = o2 - 1;
              if (o2 >= 2) {
                const n2 = t3.charCodeAt(o2 - 1), s3 = t3.charCodeAt(o2 - 2);
                n2 >= 56320 && n2 <= 57343 && s3 >= 55296 && s3 <= 56319 && (e4 = o2 - 2);
              }
              this.document.deleteRange(e4, o2, this.document.selectedBlockId, this.document.currentOffset, true), this.setCursorPosition(e4);
            }
          } else if (1 !== t2.key.length || t2.ctrlKey || t2.metaKey || t2.altKey) {
            if ("Delete" === t2.key) {
              if (t2.preventDefault(), o2 === i2) {
                if (this.undoRedoManager.saveUndoSnapshot(), i2 > o2) {
                  const t4 = Math.min(this.document.currentOffset, o2);
                  this.document.deleteRange(o2, i2, this.document.selectedBlockId, t4), this.setCursorPosition(o2);
                } else if (i2 > o2) return this.undoRedoManager.saveUndoSnapshot(), void this.document.deleteRange(o2, i2, this.document.selectedBlockId);
                const t3 = this.document.blocks.findIndex((t4) => t4.dataId === this.document.selectedBlockId);
                if (-1 === t3) return;
                const e3 = this.document.blocks[t3].pieces.reduce((t4, e4) => t4 + e4.text.length, 0);
                o2 - this.document.currentOffset < e3 ? (this.document.deleteRange(o2, o2 + 1, this.document.selectedBlockId, this.document.currentOffset, false), this.setCursorPosition(o2)) : i2 > o2 && (this.undoRedoManager.saveUndoSnapshot(), this.document.deleteRange(o2, i2, this.document.selectedBlockId), this.setCursorPosition(o2));
              }
              this.hyperlinkHandler.hideHyperlinkViewButton();
            }
          } else t2.preventDefault(), i2 > o2 && (this.undoRedoManager.saveUndoSnapshot(), this.document.deleteRange(o2, i2, this.document.selectedBlockId, this.document.currentOffset, false)), console.log("insertat", t2.key, this.currentAttributes, o2, this.document.selectedBlockId, this.document.currentOffset, "", "", !t2.isTrusted || false), this.document.insertAt(t2.key, this.currentAttributes, o2, this.document.selectedBlockId, this.document.currentOffset, "", "", !t2.isTrusted || false), this.setCursorPosition(o2 + 1);
        }
        extractTextFromDataId(t2) {
          const e2 = window.getSelection();
          if (console.log("selection::", e2), !e2 || 0 === e2.rangeCount) return { remainingText: "", piece: null };
          const n2 = e2.getRangeAt(0).startContainer;
          let s2 = "";
          console.log(0, "count lntgerr");
          const o2 = this.document.blocks.filter((e3) => {
            if (e3.dataId === t2) return e3;
          }), i2 = document.querySelector(`[data-id="${t2}"]`), l2 = this.document.getCursorOffsetInParent(`[data-id="${t2}"]`);
          let a2 = [], r2 = 0;
          if (o2[0].pieces.forEach((t3, e3) => {
            s2 += t3.text, (null == l2 ? void 0 : l2.innerText) === t3.text && (r2 = e3, a2.push(t3));
          }), o2[0].pieces.length > 1 && o2[0].pieces.forEach((t3, e3) => {
            r2 < e3 && a2.push(t3);
          }), !i2) return console.error(`Element with data-id "${t2}" not found.`), { remainingText: "", piece: null };
          if (!i2.contains(n2)) return console.error(`Cursor is not inside the element with data-id "${t2}".`), { remainingText: "", piece: null };
          const d2 = s2, c2 = null == l2 ? void 0 : l2.offset, h2 = d2.slice(c2), u2 = d2.slice(0, c2);
          return i2.textContent = u2, { remainingText: h2, piece: a2 };
        }
        getCurrentCursorBlock() {
          const t2 = window.getSelection();
          if (!t2 || 0 === t2.rangeCount) return null;
          const e2 = t2.getRangeAt(0).startContainer, n2 = e2.nodeType === Node.TEXT_NODE ? e2.parentElement : e2;
          let s2 = null;
          return n2 && n2 instanceof Element && (s2 = n2.closest("[data-id]")), (null == s2 ? void 0 : s2.getAttribute("data-id")) || null;
        }
        addBlockAfter(t2, e2, n2) {
          const s2 = t2.findIndex((t3) => t3.dataId === e2);
          if (-1 === s2) return console.error(`Block with dataId "${e2}" not found.`), t2;
          return [...t2.slice(0, s2 + 1), n2, ...t2.slice(s2 + 1)];
        }
        syncCurrentAttributesWithCursor() {
          var t2, e2;
          const n2 = window.getSelection();
          if (n2 && n2.rangeCount > 0) {
            const e3 = (null === (t2 = n2.anchorNode) || void 0 === t2 ? void 0 : t2.nodeType) === Node.TEXT_NODE ? n2.anchorNode.parentElement : n2.anchorNode;
            if (null == e3 ? void 0 : e3.closest(".tblCell")) return;
          }
          const [s2, o2] = this.getSelectionRange();
          console.log("log1", { start: s2, end: o2 });
          const i2 = this.document.blocks.findIndex((t3) => t3.dataId === this.document.selectedBlockId);
          if ("image" === (null === (e2 = this.document.blocks[i2]) || void 0 === e2 ? void 0 : e2.type) ? this.imageHandler.addStyleToImage(this.document.selectedBlockId || "") : this.imageHandler.isImageHighlighted && this.imageHandler.clearImageStyling(), s2 === o2) {
            const t3 = this.document.findPieceAtOffset(s2, this.document.selectedBlockId);
            t3 ? (t3 !== this.lastPiece && (this.manualOverride = false, this.lastPiece = t3), this.manualOverride || (this.currentAttributes = { bold: t3.attributes.bold, italic: t3.attributes.italic, underline: t3.attributes.underline, strikethrough: t3.attributes.strikethrough || false, subscript: t3.attributes.subscript || false, superscript: t3.attributes.superscript || false, hyperlink: t3.attributes.hyperlink || false, fontFamily: t3.attributes.fontFamily, fontSize: t3.attributes.fontSize, fontColor: t3.attributes.fontColor, bgColor: t3.attributes.bgColor }, this.toolbarView.updateActiveStates(this.currentAttributes), this.popupToolbarView.updateActiveStates(this.currentAttributes)), this.hyperlinkHandler.hideHyperlinkViewButton()) : (this.hyperlinkHandler.hideHyperlinkViewButton(), this.manualOverride || (this.currentAttributes = { bold: false, italic: false, underline: false, strikethrough: false, subscript: false, superscript: false, hyperlink: false }, this.toolbarView.updateActiveStates(this.currentAttributes), this.popupToolbarView.updateActiveStates(this.currentAttributes)), this.lastPiece = null);
          } else {
            this.hyperlinkHandler.hideHyperlinkViewButton();
            const t3 = this.document.isRangeEntirelyAttribute(s2, o2, "bold"), e3 = this.document.isRangeEntirelyAttribute(s2, o2, "italic"), n3 = this.document.isRangeEntirelyAttribute(s2, o2, "underline"), i3 = this.document.isRangeEntirelyAttribute(s2, o2, "strikethrough"), l2 = this.document.isRangeEntirelyAttribute(s2, o2, "subscript"), a2 = this.document.isRangeEntirelyAttribute(s2, o2, "superscript");
            this.currentAttributes = { bold: t3, italic: e3, underline: n3, strikethrough: i3, subscript: l2, superscript: a2, hyperlink: false }, this.toolbarView.updateActiveStates(this.currentAttributes), this.popupToolbarView.updateActiveStates(this.currentAttributes);
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
          const s2 = document.createRange();
          let o2 = 0;
          const i2 = [this.editorView.container];
          let l2;
          for (; l2 = i2.pop(); ) if (3 === l2.nodeType) {
            const e3 = l2, n3 = o2 + e3.length;
            if (t2 >= o2 && t2 <= n3) {
              s2.setStart(e3, t2 - o2), s2.collapse(true);
              break;
            }
            o2 = n3;
          } else if ("BR" === l2.tagName) {
            if (t2 === o2) {
              s2.setStartBefore(l2), s2.collapse(true);
              break;
            }
            o2++;
          } else {
            const t3 = l2;
            let e3 = t3.childNodes.length;
            for (; e3--; ) i2.push(t3.childNodes[e3]);
          }
          n2.removeAllRanges(), n2.addRange(s2);
        }
        showAcknowledgement(t2, e2 = 2e3) {
          const n2 = document.getElementById(u.TOAST_ID);
          n2 && n2.remove();
          const s2 = document.createElement("div");
          s2.id = u.TOAST_ID, s2.className = "ti-toast", s2.textContent = t2 || u.TOAST_DEFAULT_MESSAGE, document.body.appendChild(s2), s2.offsetHeight, s2.classList.add(u.TOAST_SHOW_CLASS), setTimeout(() => {
            s2.classList.remove(u.TOAST_SHOW_CLASS), setTimeout(() => s2.remove(), 200);
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
        getTextForSpeech() {
          var t2, e2;
          const n2 = window.getSelection();
          if (n2 && !n2.isCollapsed) {
            const t3 = n2.toString().trim();
            if (t3) return t3;
          }
          return (null === (e2 = null === (t2 = this.editorContainer) || void 0 === t2 ? void 0 : t2.textContent) || void 0 === e2 ? void 0 : e2.trim()) || "";
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
      window.TextIgniter = N, t.TextIgniter = N;
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
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Textigniter: () => TextigniterReact
});
module.exports = __toCommonJS(src_exports);

// src/components/TextIgniter.tsx
var import_react = __toESM(require("react"));
var TextigniterReactBase = ({
  config,
  onContentChange
}) => {
  const builderRef = (0, import_react.useRef)(null);
  const onContentChangeRef = (0, import_react.useRef)(onContentChange);
  (0, import_react.useEffect)(() => {
    onContentChangeRef.current = onContentChange;
  }, [onContentChange]);
  (0, import_react.useEffect)(() => {
    import("@mindfiredigital/textigniter-web-component").catch((error) => {
      console.error("Failed to load web component:", error);
    });
  }, []);
  (0, import_react.useEffect)(() => {
    if (builderRef.current) {
      const configString = JSON.stringify(config);
      if (builderRef.current.getAttribute("config") !== configString) {
        builderRef.current.setAttribute("config", configString);
      }
    }
  }, [config]);
  (0, import_react.useEffect)(() => {
    const element = builderRef.current;
    if (!element)
      return;
    const handleContentChange = (event) => {
      if (onContentChangeRef.current) {
        onContentChangeRef.current(event.detail);
      }
    };
    element.addEventListener("content-change", handleContentChange);
    return () => {
      element.removeEventListener("content-change", handleContentChange);
    };
  }, []);
  return import_react.default.useMemo(() => /* @__PURE__ */ import_react.default.createElement("text-igniter", { ref: builderRef }), []);
};
var TextigniterReact = import_react.default.memo(TextigniterReactBase, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Textigniter
});
//# sourceMappingURL=index.js.map
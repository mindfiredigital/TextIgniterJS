// src/components/TextIgniter.tsx
import React, { useEffect, useRef } from "react";
var TextigniterReactBase = ({
  config,
  value,
  initialValue,
  onContentChange
}) => {
  const builderRef = useRef(null);
  const onContentChangeRef = useRef(onContentChange);
  useEffect(() => {
    onContentChangeRef.current = onContentChange;
  }, [onContentChange]);
  useEffect(() => {
    import("@mindfiredigital/textigniter-web-component").catch((error) => {
      console.error("Failed to load web component:", error);
    });
  }, []);
  useEffect(() => {
    if (builderRef.current) {
      const configString = JSON.stringify(config);
      if (builderRef.current.getAttribute("config") !== configString) {
        builderRef.current.setAttribute("config", configString);
      }
    }
  }, [config]);
  useEffect(() => {
    if (builderRef.current && initialValue !== void 0) {
      if (!builderRef.current.getAttribute("value")) {
        builderRef.current.setAttribute("value", initialValue);
      }
    }
  }, []);
  useEffect(() => {
    if (builderRef.current && value !== void 0) {
      if (builderRef.current.getAttribute("value") !== value) {
        builderRef.current.setAttribute("value", value);
      }
    }
  }, [value]);
  useEffect(() => {
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
  return React.useMemo(() => /* @__PURE__ */ React.createElement("text-igniter", { ref: builderRef }), []);
};
var TextigniterReact = React.memo(TextigniterReactBase, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config) && prevProps.value === nextProps.value && prevProps.initialValue === nextProps.initialValue;
});
export {
  TextigniterReact as Textigniter
};
//# sourceMappingURL=index.mjs.map
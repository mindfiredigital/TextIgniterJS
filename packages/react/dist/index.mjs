// src/components/TextIgniter.tsx
import React, { useEffect, useRef, useState } from "react";
var TextigniterReact = ({
  config,
  onContentChange
}) => {
  const builderRef = useRef(null);
  const [processedConfig, setProcessedConfig] = useState(config);
  useEffect(() => {
    import("@mindfiredigital/textigniter-web-component").catch((error) => {
      console.error("Failed to load web component:", error);
    });
  }, []);
  useEffect(() => {
    const modifiedConfig = JSON.parse(JSON.stringify(config));
    setProcessedConfig(modifiedConfig);
  }, [config]);
  useEffect(() => {
    if (builderRef.current) {
      try {
        const configString = JSON.stringify(processedConfig);
        builderRef.current.setAttribute("config", configString);
      } catch (error) {
        console.error("Error setting config-data:", error);
      }
    }
  }, [processedConfig]);
  useEffect(() => {
    const element = builderRef.current;
    if (!element || !onContentChange)
      return;
    const handleContentChange = (event) => {
      onContentChange(event.detail);
    };
    element.addEventListener("content-change", handleContentChange);
    return () => {
      element.removeEventListener("content-change", handleContentChange);
    };
  }, [onContentChange]);
  return /* @__PURE__ */ React.createElement("text-igniter", { ref: builderRef });
};
export {
  TextigniterReact as Textigniter
};
//# sourceMappingURL=index.mjs.map
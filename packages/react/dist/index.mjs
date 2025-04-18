// src/components/TextIgniter.tsx
import React, { useEffect, useRef, useState } from "react";
var TextigniterReact = ({
  config
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
  return /* @__PURE__ */ React.createElement("text-igniter", { ref: builderRef });
};
export {
  TextigniterReact as Textigniter
};
//# sourceMappingURL=index.mjs.map
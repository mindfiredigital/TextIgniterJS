import React, { useEffect, useRef, useState } from "react";
import '../types/textigniter.d.ts';

// Updated interfaces to support new configuration
// interface DynamicComponents {
//   Basic: string[];
//   Extra: string[];
//   Custom?: Record<string, CustomComponentConfig>;
// }

// interface CustomComponentConfig {
//   component: React.ComponentType<any> | string;
//   svg?: string;
//   title?: string;
// }

// interface TextigniterReactProps {
//   config: DynamicComponents;
//   customComponents?: Record<string, CustomComponentConfig>;
// }

export const TextigniterReact: React.FC<any> = ({
  config
}) => {
  const builderRef = useRef<HTMLElement>(null);
  const [processedConfig, setProcessedConfig] = useState<any>(config);

  useEffect(() => {
    // Import web component
    import("@mindfiredigital/textigniter-web-component" as any)
      .catch(error => {
        console.error("Failed to load web component:", error);
      });
  }, []);

  useEffect(() => {
    // Create a copy of the original config
    const modifiedConfig: any = JSON.parse(JSON.stringify(config));

    // Update state and set config
    setProcessedConfig(modifiedConfig);
  }, [config]);

  // Effect to set config on web component
  useEffect(() => {
    if (builderRef.current) {
      try {
        // Convert to JSON string
        const configString = JSON.stringify(processedConfig);

        // Set config data attribute
        builderRef.current.setAttribute("config", configString);
      } catch (error) {
        console.error("Error setting config-data:", error);
      }
    }
  }, [processedConfig]);

  return <text-igniter ref={builderRef} />;
};

import React, { useEffect, useRef } from 'react';


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

interface TextigniterReactProps {
  config: any;
  value?: string;
  initialValue?: string;
  onContentChange?: (data: { html: string; text: string }) => void;
}

const TextigniterReactBase: React.FC<TextigniterReactProps> = ({
  config,
  value,
  initialValue,
  onContentChange,
}) => {
  const builderRef = useRef<HTMLElement>(null);
  const onContentChangeRef = useRef(onContentChange);

  // Keep callback ref updated without triggering re-renders
  useEffect(() => {
    onContentChangeRef.current = onContentChange;
  }, [onContentChange]);

  // Load the web component
  useEffect(() => {
    import('@mindfiredigital/textigniter-web-component' as any).catch(error => {
      console.error('Failed to load web component:', error);
    });
  }, []);

  // Sync config attribute efficiently
  useEffect(() => {
    if (builderRef.current) {
      const configString = JSON.stringify(config);
      if (builderRef.current.getAttribute('config') !== configString) {
        builderRef.current.setAttribute('config', configString);
      }
    }
  }, [config]);

  // Set initial value once on mount
  useEffect(() => {
    if (builderRef.current && initialValue !== undefined) {
      if (!builderRef.current.getAttribute('value')) {
        builderRef.current.setAttribute('value', initialValue);
      }
    }
  }, []);

  // Sync value attribute when it changes
  useEffect(() => {
    if (builderRef.current && value !== undefined) {
      if (builderRef.current.getAttribute('value') !== value) {
        builderRef.current.setAttribute('value', value);
      }
    }
  }, [value]);

  // Setup event listener once
  useEffect(() => {
    const element = builderRef.current;
    if (!element) return;

    const handleContentChange = (event: any) => {
      if (onContentChangeRef.current) {
        onContentChangeRef.current(event.detail);
      }
    };

    element.addEventListener('content-change', handleContentChange);

    return () => {
      element.removeEventListener('content-change', handleContentChange);
    };
  }, []);

  // Memoize the element to prevent React from touching its children during App re-renders
  return React.useMemo(() => <text-igniter ref={builderRef} />, []);
};

// Deep compare config and value props to ensure React re-renders appropriately
export const TextigniterReact = React.memo(TextigniterReactBase, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config) &&
    prevProps.value === nextProps.value &&
    prevProps.initialValue === nextProps.initialValue
  );
});

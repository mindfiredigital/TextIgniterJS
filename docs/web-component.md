# Web Component

TextIgniter provides a native Web Component wrapper `@mindfiredigital/textigniter-web-component` to easily build rich text editing experiences in any environment, without dependencies on specific frameworks.

## Installation

Install the package using your preferred package manager:

```bash
# npm
npm install @mindfiredigital/textigniter-web-component

# yarn
yarn add @mindfiredigital/textigniter-web-component

# pnpm
pnpm add @mindfiredigital/textigniter-web-component
```

Or via CDN:

```html
<script type="module" src="https://unpkg.com/@mindfiredigital/textigniter-web-component@latest/dist/index.js"></script>
```

## Quick Start

### Basic Setup

Import the module and use the `<text-igniter>` custom element in your HTML:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TextIgniter Web Component</title>
  </head>
  <body>
    <!-- Use the custom element -->
    <text-igniter
      id="editor-container"
      config='{
        "showToolbar": true,
        "features": [
          "bold",
          "italic",
          "underline",
          "fontFamily",
          "fontSize",
          "fontColor",
          "bgColor",
          "alignLeft",
          "alignCenter",
          "alignRight",
          "unorderedList",
          "orderedList",
          "hyperlink",
          "image",
          "getHtmlContent",
          "loadHtmlContent"
        ]
      }'
    ></text-igniter>

    <!-- Import the component bundle -->
    <script type="module" src="node_modules/@mindfiredigital/textigniter-web-component/dist/index.js"></script>
  </body>
</html>
```

### With Real-time Content Updates

Listen to the custom `content-change` event to capture changes in real-time:

```html
<text-igniter
  id="editor-container"
  config='{
    "showToolbar": true,
    "features": ["bold", "italic", "underline"]
  }'
></text-igniter>

<script type="module" src="node_modules/@mindfiredigital/textigniter-web-component/dist/index.js"></script>
<script>
  const editor = document.getElementById('editor-container');
  
  editor.addEventListener('content-change', (event) => {
    // event.detail contains both html and plain text
    console.log('HTML content:', event.detail.html);
    console.log('Plain text:', event.detail.text);
  });
</script>
```

## API Reference

### Custom Element Attributes

- **`config`** (string): JSON string containing configuration options for the editor.
- **`value`** (string): Initial HTML value to load into the editor on creation. Can also be set/updated programmatically to synchronize editor content.
- **`id`** (string): Unique identifier for the editor instance.

### Configuration Options

```typescript
interface EditorConfig {
  showToolbar?: boolean; // Show/hide toolbar (default: true)
  features?: string[];   // Array of feature names to enable
  height?: string;       // Editor height (e.g., '500px', '80vh')
  placeholder?: string;  // Placeholder text when empty
}
```

### Events

- **`content-change`**: Dispatched whenever the editor content changes.
  
  **Event Detail Structure (`event.detail`):**
  ```typescript
  interface ContentChangeDetail {
    html: string; // Formatted HTML content
    text: string; // Plain text without HTML tags
  }
  ```

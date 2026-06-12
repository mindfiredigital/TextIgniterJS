# React

TextIgniter provides a native React wrapper package `@mindfiredigital/textigniter-react` to easily integrate the editor into your React application using React components and modern hooks.

## Installation

Install the package via your preferred package manager:

```bash
# npm
npm install @mindfiredigital/textigniter-react

# yarn
yarn add @mindfiredigital/textigniter-react

# pnpm
pnpm add @mindfiredigital/textigniter-react
```

Make sure to also import the CSS style in your React root file or where you use the component:

```javascript
import '@mindfiredigital/textigniter/dist/styles/text-igniter.css';
```

## Quick Start

### Basic Usage

Simply render the `Textigniter` component and pass the configuration object:

```tsx
import { Textigniter } from '@mindfiredigital/textigniter-react';
import '@mindfiredigital/textigniter/dist/styles/text-igniter.css';

function App() {
  return (
    <Textigniter
      config={{
        showToolbar: true,
        features: [
          'bold',
          'italic',
          'underline',
          'fontFamily',
          'fontSize',
          'fontColor',
          'alignLeft',
          'alignCenter',
          'alignRight',
          'unorderedList',
          'orderedList',
          'hyperlink',
          'image',
        ],
      }}
    />
  );
}
```

### With Real-time Updates

You can listen for content updates in real-time by providing an `onContentChange` handler:

```tsx
import { useState } from 'react';
import { Textigniter } from '@mindfiredigital/textigniter-react';
import '@mindfiredigital/textigniter/dist/styles/text-igniter.css';

function App() {
  const [htmlContent, setHtmlContent] = useState('');
  const [textContent, setTextContent] = useState('');

  const handleContentChange = (data: { html: string; text: string }) => {
    setHtmlContent(data.html);
    setTextContent(data.text);
  };

  return (
    <div>
      <Textigniter
        config={{
          showToolbar: true,
          features: ['bold', 'italic', 'underline'],
        }}
        onContentChange={handleContentChange}
      />

      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>
        <h4>Live Preview:</h4>
        <pre>{htmlContent}</pre>
      </div>
    </div>
  );
}
```

## API Reference

### Component Props

The `Textigniter` component accepts the following props:

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `config` | `EditorConfig` | Yes | Configuration options for the editor. |
| `value` | `string` | No | Controlled value for parent-to-child content updates and synchronization. |
| `initialValue` | `string` | No | Uncontrolled initial content to load when the component mounts. |
| `onContentChange` | `(data: ContentChangeData) => void` | No | Callback triggered when the content changes. |

### Configuration Options (`EditorConfig`)

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showToolbar` | `boolean` | `true` | Show or hide the toolbar. |
| `features` | `string[]` | `[]` | Array of features to enable on the toolbar. |
| `popupFeatures` | `string[]` | `[]` | Array of features to show in the text selection popup bubble menu (e.g. `['bold', 'italic', 'underline', 'hyperlink']`). |
| `height` | `string` | `undefined` | Height of the editor (e.g., `'400px'`, `'50vh'`). |
| `placeholder` | `string` | `undefined` | Placeholder text when editor is empty. |

### Content Change Data (`ContentChangeData`)

```typescript
interface ContentChangeData {
  html: string; // Formatted HTML content
  text: string; // Plain text without HTML tags
}
```

### Available Features

You can specify which features to enable in the configuration:

```typescript
const features = [
  // Formatting
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',

  // Styling
  'fontFamily',
  'fontSize',
  'fontColor',
  'bgColor',

  // Alignment
  'alignLeft',
  'alignCenter',
  'alignRight',
  'justify',

  // Lists
  'unorderedList',
  'orderedList',

  // Content
  'heading',
  'hyperlink',
  'image',

  // Structure
  'insert_table',
  'insert_layout',
  'insert_math',
  'emoji',

  // Integrations & Accessibility
  'speechToText',
  'textToSpeech',

  // Actions
  'getHtmlContent',
  'loadHtmlContent',
];
```
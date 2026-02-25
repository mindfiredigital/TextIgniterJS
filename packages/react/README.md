<h1 align="center">TextIgniter React</h1><br>

<p align="center">
<a href="https://www.npmjs.com/package/@mindfiredigital/textigniter-react"><img src="https://img.shields.io/npm/v/@mindfiredigital/textigniter-react.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/textigniter-react"><img src="https://img.shields.io/npm/dm/@mindfiredigital/textigniter-react.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/textigniter-react"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License"></a>
</p>

<br>

<p align="center">A lightweight, powerful React component wrapper for TextIgniter. Build rich text editing experiences with React hooks and modern patterns.</p>

<br>

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Live Example](#-live-example)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

<br>

## ✨ Features

### Text Formatting

- **Bold** - Make text stand out
- **Italic** - Add emphasis
- **Underline** - Underline text
- **Strikethrough** - Cross out text
- **Subscript** - Lower text (H₂O)
- **Superscript** - Raise text (x²)

### Text Styling

- **Font Family** - Choose fonts
- **Font Size** - Adjust size
- **Text Color** - Change color
- **Background Color** - Highlight text

### Alignment

- **Left/Center/Right** - Align text
- **Justify** - Distribute evenly

### Lists & Structure

- **Bullet List** - Unordered lists
- **Numbered List** - Ordered lists
- **Headings** - Structure content
- **Insert Table** - Organize data
- **Insert Layout** - Create layouts

### Media & Links

- **Hyperlink** - Add links
- **Image** - Insert images

### Advanced

- **Real-time Content Events** 🆕 - Get live updates
- **Get HTML/JSON** - Export content
- **Custom Height** - Set editor height

<br>

## 📦 Installation

```bash
# npm
npm install @mindfiredigital/textigniter-react

# yarn
yarn add @mindfiredigital/textigniter-react

# pnpm
pnpm add @mindfiredigital/textigniter-react
```

<br>

## 🚀 Quick Start

### Basic Usage

```tsx
import { Textigniter } from '@mindfiredigital/textigniter-react';

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

### With Real-time Updates 🆕

```tsx
import { useState } from 'react';
import { Textigniter } from '@mindfiredigital/textigniter-react';

function App() {
  const [htmlContent, setHtmlContent] = useState('');
  const [textContent, setTextContent] = useState('');

  const handleContentChange = (data: { html: string; text: string }) => {
    console.log('Content changed:', data);
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

      {/* Real-time Preview */}
      <div
        style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}
      >
        <h3>Live Preview:</h3>
        <div>
          <strong>HTML:</strong>
          <pre>{htmlContent}</pre>
        </div>
        <div>
          <strong>Text:</strong>
          <pre>{textContent}</pre>
        </div>
        <div>
          <strong>Stats:</strong>
          <p>
            Characters: {textContent.length} | Words:{' '}
            {textContent.trim().split(/\s+/).length}
          </p>
        </div>
      </div>
    </div>
  );
}
```

<br>

## 🎯 Live Example

Want to see it in action? Check out the complete working example in the `packages/example/react` directory!

### Run the Example Locally

```bash
# Navigate to the example directory
cd packages/example/react

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open `http://localhost:5173` in your browser.

The example demonstrates:

- ✅ Basic integration
- ✅ Real-time content updates
- ✅ Character and word counting
- ✅ HTML and text preview
- ✅ All available features

**[View Example Code →](../example/react)**

<br>

## 📚 API Reference

### Component Props

```tsx
interface TextigniterProps {
  config: EditorConfig;
  onContentChange?: (data: ContentChangeData) => void;
}
```

### Configuration

```tsx
interface EditorConfig {
  showToolbar?: boolean; // Show/hide toolbar (default: true)
  features?: string[]; // Array of feature names
  height?: string; // Editor height (e.g., '500px')
  placeholder?: string; // Placeholder text
}
```

### Content Change Event

```tsx
interface ContentChangeData {
  html: string; // Formatted HTML content
  text: string; // Plain text without tags
}

const handleContentChange = (data: ContentChangeData) => {
  // Your code here
};
```

### Available Features

```typescript
const features = [
  // Text formatting
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',

  // Text styling
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
  'insertTable',
  'insertLayout',

  // Actions
  'getHtmlContent',
  'loadHtmlContent',
];
```

<br>

## 💡 Common Use Cases

### Auto-Save

```tsx
useEffect(() => {
  if (!content.html) return;

  const timer = setTimeout(() => {
    fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content: content.html }),
    });
  }, 2000);

  return () => clearTimeout(timer);
}, [content]);
```

### Character Counter

```tsx
const charCount = textContent.length;
const wordCount = textContent
  .trim()
  .split(/\s+/)
  .filter(w => w.length > 0).length;
```

### Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <Textigniter
    config={{ showToolbar: true, features: ['bold', 'italic'] }}
    onContentChange={data => setFormData({ ...formData, content: data.html })}
  />
  <button type="submit">Submit</button>
</form>
```

<br>

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute to TextIgniter React:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](../../CONTRIBUTING.md) for more details.

<br>

## 📄 License

Copyright (c) Mindfire Digital LLP. All rights reserved.

Licensed under the MIT License. See [LICENSE](../../LICENSE) file for details.

<br>

## 🔗 Links

- **NPM Package**: https://www.npmjs.com/package/@mindfiredigital/textigniter-react
- **GitHub Repository**: https://github.com/mindfiredigital/textigniterjs
- **Documentation**: https://github.com/mindfiredigital/textigniterjs/tree/main/docs
- **Issues**: https://github.com/mindfiredigital/textigniterjs/issues

### Related Packages

- **Core**: [@mindfiredigital/textigniter](https://www.npmjs.com/package/@mindfiredigital/textigniter)
- **Angular**: [@mindfiredigital/textigniter-angular](https://www.npmjs.com/package/@mindfiredigital/textigniter-angular)
- **Web Component**: [@mindfiredigital/textigniter-web-component](https://www.npmjs.com/package/@mindfiredigital/textigniter-web-component)

<br>

## 🌟 Why TextIgniter React?

- **🚀 Lightweight** - Minimal bundle size
- **💪 Powerful** - Rich feature set
- **⚛️ React Native** - Built with React best practices
- **🪝 Modern Hooks** - Uses React Hooks API
- **🔒 Type Safe** - Full TypeScript support
- **📱 Responsive** - Works on all devices
- **📚 Well Documented** - Comprehensive docs and examples
- **🆓 Open Source** - MIT licensed

<br>

---

<p align="center">
  <strong>Made with ❤️ by Mindfire Digital</strong><br>
  <a href="https://github.com/mindfiredigital">GitHub</a> •
  <a href="https://www.npmjs.com/org/mindfiredigital">NPM</a>
</p>

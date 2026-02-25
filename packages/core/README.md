<h1 align="center">TextIgniter JS</h1><br>

<p align="center">
<a href="https://www.npmjs.com/package/@mindfiredigital/textigniter"><img src="https://img.shields.io/npm/v/@mindfiredigital/textigniter.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/textigniter"><img src="https://img.shields.io/npm/dm/@mindfiredigital/textigniter.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/textigniter"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License"></a>
</p>

<br>

<p align="center">A lightweight, powerful, and intuitive rich text editor built with TypeScript. Framework-agnostic and easy to integrate into any web application.</p>

<br>

## 🎯 Live Demo

Click the button below to try TextIgniter on StackBlitz:

<a href="https://stackblitz.com/edit/stackblitz-starters-kezevu?file=index.html" target="_blank">
  <img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz">
</a>

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Events](#-events)
- [Advanced Usage](#-advanced-usage)
- [Framework Integrations](#-framework-integrations)
- [Contributing](#-contributing)
- [License](#-license)

<br>

## ✨ Features

### Text Formatting

- **Bold** - Make text stand out with bold formatting
- **Italic** - Add emphasis with italic text
- **Underline** - Underline important text
- **Strikethrough** - Cross out text
- **Subscript** - Lower text below the baseline (e.g., H₂O)
- **Superscript** - Raise text above the baseline (e.g., x²)

### Text Alignment

- **Left Align** - Align text to the left margin
- **Center Align** - Center text in the editor
- **Right Align** - Align text to the right margin
- **Justify** - Distribute text evenly across the line

### Lists & Structure

- **Bullet List** - Create unordered lists with bullets
- **Numbered List** - Create ordered lists with numbers
- **Headings** - Structure content with heading levels
- **Insert Table** - Add tables to organize data
- **Insert Layout** - Create custom layouts

### Media & Links

- **Hyperlink** - Add clickable links to web pages
- **Image** - Insert images into your document

### Advanced Features

- **Font Family** - Choose from various fonts
- **Font Size** - Adjust text size
- **Text Color** - Change text color
- **Background Color** - Highlight text with background colors
- **Undo/Redo** - Revert or reapply changes
- **Real-time Content Events** 🆕 - Get notified of content changes
- **Get HTML** - Export content as HTML
- **Get JSON** - Export content as JSON
- **Custom Height** - Set custom editor height

<br>

## 📦 Installation

Install TextIgniter using your preferred package manager:

### npm

```bash
npm install @mindfiredigital/textigniter
```

### yarn

```bash
yarn add @mindfiredigital/textigniter
```

### pnpm

```bash
pnpm add @mindfiredigital/textigniter
```

### CDN

```html
<!-- Include in your HTML -->
<script src="https://unpkg.com/@mindfiredigital/textigniter@latest/dist/index.js"></script>
<link
  rel="stylesheet"
  href="https://unpkg.com/@mindfiredigital/textigniter@latest/dist/styles/main.css"
/>
```

<br>

## 🚀 Quick Start

### Basic Setup

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TextIgniter JS</title>
    <link
      rel="stylesheet"
      href="node_modules/@mindfiredigital/textigniter/dist/styles/main.css"
    />
  </head>
  <body>
    <div id="editor"></div>

    <script src="node_modules/@mindfiredigital/textigniter/dist/index.js"></script>
    <script>
      // Initialize TextIgniter
      const config = {
        showToolbar: true,
        features: [
          'bold',
          'italic',
          'underline',
          'fontFamily',
          'fontSize',
          'fontColor',
          'bgColor',
          'alignLeft',
          'alignCenter',
          'alignRight',
          'unorderedList',
          'orderedList',
          'hyperlink',
          'image',
        ],
      };

      const editor = new TextIgniter('editor', config);
    </script>
  </body>
</html>
```

### With Real-time Content Updates 🆕

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TextIgniter JS - Real-time Updates</title>
    <link
      rel="stylesheet"
      href="node_modules/@mindfiredigital/textigniter/dist/styles/main.css"
    />
  </head>
  <body>
    <div id="editor"></div>

    <!-- Real-time Content Preview -->
    <div style="margin-top: 20px; padding: 20px; border: 1px solid #ccc;">
      <h3>Live Preview:</h3>
      <div id="html-output"></div>
      <div id="text-output"></div>
    </div>

    <script src="node_modules/@mindfiredigital/textigniter/dist/index.js"></script>
    <script>
      const config = {
        showToolbar: true,
        features: ['bold', 'italic', 'underline', 'fontColor'],
      };

      const editor = new TextIgniter('editor', config);

      // Listen to content changes
      editor.onContentChange(data => {
        console.log('Content changed:', data);
        document.getElementById('html-output').innerHTML =
          `<strong>HTML:</strong><br>${data.html}`;
        document.getElementById('text-output').innerHTML =
          `<strong>Text:</strong><br>${data.text}`;
      });
    </script>
  </body>
</html>
```

<br>

## 📚 API Reference

### Constructor

```javascript
const editor = new TextIgniter(containerId, config);
```

#### Parameters

- **containerId** (string): The ID of the DOM element where the editor will be mounted
- **config** (object): Configuration options

#### Configuration Options

```typescript
interface EditorConfig {
  showToolbar?: boolean; // Show/hide toolbar (default: true)
  features?: string[]; // Array of feature names to enable
  height?: string; // Editor height (e.g., '500px', '80vh')
  placeholder?: string; // Placeholder text
}
```

### Available Features

```javascript
const allFeatures = [
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

### Methods

#### `getContent(): string`

Get the HTML content of the editor.

```javascript
const htmlContent = editor.getContent();
console.log(htmlContent);
```

#### `getTextContent(): string`

Get the plain text content (without HTML tags).

```javascript
const textContent = editor.getTextContent();
console.log(textContent);
```

#### `onContentChange(callback): void` 🆕

Subscribe to content changes. The callback receives an object with `html` and `text` properties.

```javascript
editor.onContentChange(data => {
  console.log('HTML:', data.html);
  console.log('Text:', data.text);
});
```

<br>

## 🎪 Events

### Content Change Event 🆕

The `onContentChange` event is triggered whenever the editor content changes, providing real-time updates.

```javascript
editor.onContentChange(data => {
  // data.html - HTML content with formatting
  // data.text - Plain text content

  // Save to backend
  saveToDatabase(data.html);

  // Update character count
  updateCharCount(data.text.length);

  // Auto-save with debouncing
  debouncedSave(data);
});
```

### Event Data Structure

```typescript
interface ContentChangeData {
  html: string; // Formatted HTML content
  text: string; // Plain text without HTML tags
}
```

<br>

## 💡 Advanced Usage

### Auto-Save Functionality

```javascript
let saveTimeout;

editor.onContentChange(data => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    // Save to backend after 2 seconds of inactivity
    fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: data.html }),
    });
  }, 2000);
});
```

### Character Counter

```javascript
const counterElement = document.getElementById('char-count');

editor.onContentChange(data => {
  const charCount = data.text.length;
  const wordCount = data.text.trim().split(/\s+/).length;
  counterElement.textContent = `${charCount} characters, ${wordCount} words`;
});
```

### Content Validation

```javascript
editor.onContentChange(data => {
  const minLength = 100;
  const currentLength = data.text.length;

  if (currentLength < minLength) {
    showError(`Please write at least ${minLength} characters`);
  } else {
    clearError();
  }
});
```

### Form Integration

```javascript
const form = document.getElementById('myForm');
const hiddenInput = document.getElementById('content');

editor.onContentChange(data => {
  hiddenInput.value = data.html;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  // Content is already in hiddenInput
  const formData = new FormData(form);
  submitForm(formData);
});
```

### Multiple Editors

```javascript
// Editor 1
const editor1 = new TextIgniter('editor-1', {
  showToolbar: true,
  features: ['bold', 'italic'],
});

editor1.onContentChange(data => {
  console.log('Editor 1:', data);
});

// Editor 2
const editor2 = new TextIgniter('editor-2', {
  showToolbar: true,
  features: ['fontColor', 'bgColor'],
});

editor2.onContentChange(data => {
  console.log('Editor 2:', data);
});
```

### Custom Height

```javascript
const editor = new TextIgniter('editor', {
  showToolbar: true,
  height: '600px',
  features: ['bold', 'italic', 'underline'],
});
```

<br>

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute to TextIgniter, please follow these steps:

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

- **NPM Package**: https://www.npmjs.com/package/@mindfiredigital/textigniter
- **GitHub Repository**: https://github.com/mindfiredigital/textigniterjs
- **Documentation**: https://github.com/mindfiredigital/textigniterjs/tree/main/docs
- **Issues**: https://github.com/mindfiredigital/textigniterjs/issues
- **Discussions**: https://github.com/mindfiredigital/textigniterjs/discussions

### Related Packages

- **React**: [@mindfiredigital/textigniter-react](https://www.npmjs.com/package/@mindfiredigital/textigniter-react)
- **Angular**: [@mindfiredigital/textigniter-angular](https://www.npmjs.com/package/@mindfiredigital/textigniter-angular)
- **Web Component**: [@mindfiredigital/textigniter-web-component](https://www.npmjs.com/package/@mindfiredigital/textigniter-web-component)

<br>

## 📞 Support

Need help? Here's how to get support:

- 📖 Check the [Documentation](https://github.com/mindfiredigital/textigniterjs/tree/main/docs)
- 🐛 Report bugs via [GitHub Issues](https://github.com/mindfiredigital/textigniterjs/issues)
- 💬 Ask questions in [GitHub Discussions](https://github.com/mindfiredigital/textigniterjs/discussions)
- 📧 Contact us at [Mindfire Digital](https://github.com/mindfiredigital)

<br>

## 🎉 What's New in v1.2.0

### New Features

- ✨ **Real-time Content Events**: Added `onContentChange()` method for live content updates
- 🎯 **Better Performance**: Optimized event handling and rendering
- 📝 **Improved API**: More intuitive method names and better TypeScript support

### Bug Fixes

- 🐛 Fixed clipboard permission error on page load
- 🔧 Made clipboard copying opt-in only (activated on button click)
- 🛠️ Improved memory management and event cleanup

### Breaking Changes

None! This is a backward-compatible release.

<br>

## 🌟 Why TextIgniter?

- **🚀 Lightweight**: Minimal bundle size, maximum performance
- **💪 Powerful**: Rich set of features for all your editing needs
- **🎨 Customizable**: Easy to style and configure
- **🔧 Framework Agnostic**: Works with vanilla JS, React, Angular, and more
- **📱 Responsive**: Works seamlessly on desktop and mobile
- **♿ Accessible**: Built with accessibility in mind
- **🔒 Type Safe**: Full TypeScript support
- **📚 Well Documented**: Comprehensive docs and examples
- **🆓 Open Source**: MIT licensed, free to use

<br>

## 🎯 Use Cases

- Content Management Systems (CMS)
- Blog platforms
- Email editors
- Comment sections
- Note-taking apps
- Documentation tools
- Forum posts
- Social media posts
- Product descriptions
- Any application requiring rich text editing

<br>

## 🙏 Acknowledgments

Built with ❤️ by [Mindfire Digital](https://github.com/mindfiredigital)

Special thanks to all our [contributors](https://github.com/mindfiredigital/textigniterjs/graphs/contributors)!

<br>

---

<p align="center">
  <strong>Made with ❤️ by Mindfire Digital</strong><br>
  <a href="https://github.com/mindfiredigital">GitHub</a> •
  <a href="https://www.npmjs.com/org/mindfiredigital">NPM</a>
</p>

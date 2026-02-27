<h1 align="center">TextIgniter Web Component</h1><br>

<p align="center">
<a href="https://www.npmjs.com/package/@mindfiredigital/textigniter-web-component"><img src="https://img.shields.io/npm/v/@mindfiredigital/textigniter-web-component.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/textigniter-web-component"><img src="https://img.shields.io/npm/dm/@mindfiredigital/textigniter-web-component.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/textigniter-web-component"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License"></a>
</p>

<br>

<p align="center">A lightweight, powerful, and framework-agnostic Web Component wrapper for TextIgniter. Build rich text editing experiences with standard web technologies.</p>

<br>

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Events](#-events)
- [Advanced Usage](#-advanced-usage)
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

Install TextIgniter Web Component using your preferred package manager:

### npm

```bash
npm install @mindfiredigital/textigniter-web-component
```

### yarn

```bash
yarn add @mindfiredigital/textigniter-web-component
```

### pnpm

```bash
pnpm add @mindfiredigital/textigniter-web-component
```

### CDN

```html
<!-- Include in your HTML -->
<script
  type="module"
  src="https://unpkg.com/@mindfiredigital/textigniter-web-component@latest/dist/index.js"
></script>
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
    <title>TextIgniter Web Component</title>
  </head>
  <body>
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

    <script
      type="module"
      src="node_modules/@mindfiredigital/textigniter-web-component/dist/index.js"
    ></script>
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
    <title>TextIgniter Web Component - Real-time Updates</title>
  </head>
  <body>
    <text-igniter
      id="editor-container"
      config='{
        "showToolbar": true,
        "features": ["bold", "italic", "underline", "fontColor"]
      }'
    ></text-igniter>

    <!-- Real-time Content Preview -->
    <div style="margin-top: 20px; padding: 20px; border: 1px solid #ccc;">
      <h3>Live Preview:</h3>
      <div>
        <strong>HTML Content:</strong>
        <pre
          id="html-output"
          style="background: #f5f5f5; padding: 10px; overflow: auto;"
        ></pre>
      </div>
      <div>
        <strong>Text Content:</strong>
        <pre
          id="text-output"
          style="background: #f5f5f5; padding: 10px; overflow: auto;"
        ></pre>
      </div>
    </div>

    <script
      type="module"
      src="node_modules/@mindfiredigital/textigniter-web-component/dist/index.js"
    ></script>
    <script>
      // Listen to content-change event
      const editor = document.getElementById('editor-container');
      editor.addEventListener('content-change', event => {
        console.log('Content changed:', event.detail);
        document.getElementById('html-output').textContent = event.detail.html;
        document.getElementById('text-output').textContent = event.detail.text;
      });
    </script>
  </body>
</html>
```

<br>

## 📚 API Reference

### Custom Element

```html
<text-igniter id="editor-container" config="..."></text-igniter>
```

#### Attributes

- **id** (string): Unique identifier for the editor instance
- **config** (string): JSON string containing configuration options

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

<br>

## 🎪 Events

### Content Change Event 🆕

The `content-change` event is dispatched whenever the editor content changes, providing real-time updates.

```javascript
const editor = document.getElementById('editor');

editor.addEventListener('content-change', event => {
  // event.detail.html - HTML content with formatting
  // event.detail.text - Plain text content

  console.log('HTML:', event.detail.html);
  console.log('Text:', event.detail.text);
});
```

### Event Detail Structure

```typescript
interface ContentChangeDetail {
  html: string; // Formatted HTML content
  text: string; // Plain text without HTML tags
}
```

The event is a standard CustomEvent with:

- **bubbles**: `true` - Event bubbles up the DOM tree
- **composed**: `true` - Event crosses shadow DOM boundaries
- **detail**: Contains `html` and `text` properties

<br>

## 💡 Advanced Usage

### Auto-Save Functionality

```html
<text-igniter id="editor" config="..."></text-igniter>

<script>
  const editor = document.getElementById('editor');
  let saveTimeout;

  editor.addEventListener('content-change', event => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      // Save to backend after 2 seconds of inactivity
      fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: event.detail.html }),
      });
    }, 2000);
  });
</script>
```

### Character Counter

```html
<text-igniter id="editor" config="..."></text-igniter>
<div id="counter">0 characters, 0 words</div>

<script>
  const editor = document.getElementById('editor');
  const counter = document.getElementById('counter');

  editor.addEventListener('content-change', event => {
    const charCount = event.detail.text.length;
    const wordCount = event.detail.text.trim().split(/\s+/).length;
    counter.textContent = `${charCount} characters, ${wordCount} words`;
  });
</script>
```

### Content Validation

```html
<text-igniter id="editor" config="..."></text-igniter>
<div id="error" style="color: red;"></div>

<script>
  const editor = document.getElementById('editor');
  const errorDiv = document.getElementById('error');
  const minLength = 100;

  editor.addEventListener('content-change', event => {
    const currentLength = event.detail.text.length;

    if (currentLength < minLength) {
      errorDiv.textContent = `Please write at least ${minLength} characters (current: ${currentLength})`;
    } else {
      errorDiv.textContent = '';
    }
  });
</script>
```

### Form Integration

```html
<form id="myForm">
  <text-igniter id="editor" config="..."></text-igniter>
  <input type="hidden" id="content" name="content" />
  <button type="submit">Submit</button>
</form>

<script>
  const editor = document.getElementById('editor');
  const hiddenInput = document.getElementById('content');
  const form = document.getElementById('myForm');

  editor.addEventListener('content-change', event => {
    hiddenInput.value = event.detail.html;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log('Submitting:', formData.get('content'));
    // Submit form data
  });
</script>
```

### Multiple Editors

```html
<text-igniter
  id="editor-1"
  config='{"showToolbar": true, "features": ["bold", "italic"]}'
></text-igniter>
<text-igniter
  id="editor-2"
  config='{"showToolbar": true, "features": ["fontColor", "bgColor"]}'
></text-igniter>

<script>
  document.getElementById('editor-1').addEventListener('content-change', e => {
    console.log('Editor 1:', e.detail);
  });

  document.getElementById('editor-2').addEventListener('content-change', e => {
    console.log('Editor 2:', e.detail);
  });
</script>
```

### Custom Height

```html
<text-igniter
  id="editor"
  config='{
    "showToolbar": true,
    "height": "600px",
    "features": ["bold", "italic", "underline"]
  }'
></text-igniter>
```

<br>

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute to TextIgniter Web Component, please follow these steps:

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

- **NPM Package**: https://www.npmjs.com/package/@mindfiredigital/textigniter-web-component
- **GitHub Repository**: https://github.com/mindfiredigital/textigniterjs
- **Documentation**: https://github.com/mindfiredigital/textigniterjs/tree/main/docs
- **Issues**: https://github.com/mindfiredigital/textigniterjs/issues
- **Discussions**: https://github.com/mindfiredigital/textigniterjs/discussions

### Related Packages

- **Core**: [@mindfiredigital/textigniter](https://www.npmjs.com/package/@mindfiredigital/textigniter)
- **React**: [@mindfiredigital/textigniter-react](https://www.npmjs.com/package/@mindfiredigital/textigniter-react)
- **Angular**: [@mindfiredigital/textigniter-angular](https://www.npmjs.com/package/@mindfiredigital/textigniter-angular)

<br>

## 📞 Support

Need help? Here's how to get support:

- 📖 Check the [Documentation](https://github.com/mindfiredigital/textigniterjs/tree/main/docs)
- 🐛 Report bugs via [GitHub Issues](https://github.com/mindfiredigital/textigniterjs/issues)
- 💬 Ask questions in [GitHub Discussions](https://github.com/mindfiredigital/textigniterjs/discussions)
- 📧 Contact us at [Mindfire Digital](https://github.com/mindfiredigital)

<br>

## 🎉 What's New in v1.0.0

### New Features

- ✨ **Real-time Content Events**: Added `content-change` custom event for live content updates
- 🎯 **Better Performance**: Optimized event handling and rendering
- 🌐 **Web Standards**: Built with standard Web Components API
- 🔄 **Event Bubbling**: Events bubble and compose through shadow DOM

### Features

- 📦 **Framework Agnostic**: Works with any JavaScript framework or vanilla JS
- 🎨 **Customizable**: Easy to style and configure via attributes
- 🔧 **Standard Events**: Uses native CustomEvent API
- 📱 **Responsive**: Works seamlessly on desktop and mobile

<br>

## 🌟 Why TextIgniter Web Component?

- **🚀 Lightweight**: Minimal bundle size, maximum performance
- **💪 Powerful**: Rich set of features for all your editing needs
- **🎨 Customizable**: Easy to style and configure
- **🌐 Standard**: Built with Web Components standards
- **🔧 Framework Agnostic**: Works with any framework or vanilla JS
- **📱 Responsive**: Works seamlessly on desktop and mobile
- **♿ Accessible**: Built with accessibility in mind
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
- Any web application requiring rich text editing

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

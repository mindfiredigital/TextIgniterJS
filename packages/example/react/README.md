# TextIgniter React Example

This example demonstrates how to integrate and use the **@mindfiredigital/textigniter-react** package in a React + TypeScript + Vite application.

## 🎯 What This Example Shows

This example demonstrates:

- ✅ Basic TextIgniter React integration
- ✅ Real-time content change events with `onContentChange` callback
- ✅ HTML and plain text content preview
- ✅ Character and word counting
- ✅ TypeScript usage with the component
- ✅ All available editor features

## 📦 Installation

```bash
# Install dependencies
npm install

# or
pnpm install

# or
yarn install
```

## 🚀 Running the Example

```bash
# Start development server
npm run dev

# or
pnpm dev

# or
yarn dev
```

Then open your browser to `http://localhost:5173` (or the port shown in your terminal).

## 📝 Code Overview

### Basic Usage

The example in `src/App.tsx` shows how to use the TextIgniter component:

```tsx
import { Textigniter } from '@mindfiredigital/textigniter-react';

function App() {
  return (
    <Textigniter
      config={{
        showToolbar: true,
        features: ['bold', 'italic', 'underline', 'fontColor'],
      }}
    />
  );
}
```

### With Content Change Handler

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

      {/* Display content */}
      <div>
        <h3>HTML: {htmlContent}</h3>
        <h3>Text: {textContent}</h3>
        <p>Characters: {textContent.length}</p>
      </div>
    </div>
  );
}
```

## 🎨 Available Features

The example includes all available features:

```tsx
features: [
  // Text Formatting
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',

  // Text Styling
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

## 📚 Configuration Options

```tsx
interface EditorConfig {
  showToolbar?: boolean; // Show/hide toolbar (default: true)
  features?: string[]; // Array of feature names to enable
  height?: string; // Editor height (e.g., '500px', '80vh')
  placeholder?: string; // Placeholder text
}
```

## 🎪 onContentChange Event

The `onContentChange` callback provides real-time updates:

```tsx
interface ContentChangeData {
  html: string; // Formatted HTML content
  text: string; // Plain text without HTML tags
}

const handleContentChange = (data: ContentChangeData) => {
  console.log('HTML:', data.html);
  console.log('Text:', data.text);

  // Use the content
  // - Save to state
  // - Send to API
  // - Update character count
  // - Validate content
  // etc.
};
```

## 🛠️ Build for Production

```bash
# Build the example
npm run build

# or
pnpm build

# or
yarn build
```

The build output will be in the `dist` directory.

## 📖 Learn More

- **TextIgniter React Package**: [@mindfiredigital/textigniter-react](https://www.npmjs.com/package/@mindfiredigital/textigniter-react)
- **TextIgniter Core**: [@mindfiredigital/textigniter](https://www.npmjs.com/package/@mindfiredigital/textigniter)
- **GitHub Repository**: [TextIgniterJS](https://github.com/mindfiredigital/textigniterjs)
- **Documentation**: [Docs](https://github.com/mindfiredigital/textigniterjs/tree/main/docs)

## 🎯 Common Use Cases

### Character Counter

```tsx
const [content, setContent] = useState({ html: '', text: '' });

const charCount = content.text.length;
const wordCount = content.text
  .trim()
  .split(/\s+/)
  .filter(w => w.length > 0).length;
```

### Auto-Save

```tsx
useEffect(() => {
  if (!content.html) return;

  const timer = setTimeout(() => {
    // Save content to backend
    fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content: content.html }),
    });
  }, 2000);

  return () => clearTimeout(timer);
}, [content]);
```

### Content Validation

```tsx
const [error, setError] = useState('');

const handleContentChange = (data: { html: string; text: string }) => {
  if (data.text.length < 50) {
    setError('Content too short');
  } else if (data.text.length > 500) {
    setError('Content too long');
  } else {
    setError('');
  }
};
```

## 🔧 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@mindfiredigital/textigniter-react** - Rich text editor component

## 📄 License

MIT License - See the main repository for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/mindfiredigital">Mindfire Digital</a>
</p>

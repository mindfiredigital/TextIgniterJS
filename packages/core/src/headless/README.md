# TextIgniter Headless

A headless (framework-agnostic) text formatting engine for TextIgniter. This package provides the core business logic for text formatting without any DOM dependencies.

## Features

- ✅ **Truly Headless**: No DOM dependencies, works in any environment
- ✅ **Framework Agnostic**: Use with React, Vue, Angular, or vanilla JS
- ✅ **Same Logic as Core**: Uses identical formatting logic as the main TextIgniter editor
- ✅ **Optimized Output**: Merges adjacent pieces with identical attributes
- ✅ **Type Safe**: Full TypeScript support

## Installation

```bash
npm install textigniter-headless
```

## Usage

```typescript
import { initHeadless, toggleBold, getContentHtml } from 'textigniter-headless';

// Initialize
initHeadless('Hello World');

// Apply formatting
toggleBold(0, 5); // Bold first 5 characters

// Get HTML output
const html = getContentHtml();
// Returns: '<div data-id="..."><span><b>Hello</b> World</span></div>'
```

## API

### Core Functions

- `initHeadless(content?: string)` - Initialize the document
- `getContentHtml()` - Get HTML representation
- `updatePlainText(text: string)` - Update text content

### Formatting Functions

- `toggleBold(start, end)` - Toggle bold formatting
- `toggleItalic(start, end)` - Toggle italic formatting
- `toggleUnderline(start, end)` - Toggle underline formatting
- `toggleStrikethrough(start, end)` - Toggle strikethrough formatting
- `toggleFontColor(start, end, color)` - Set font color
- `toggleFontSize(start, end, size)` - Set font size
- `setActiveFontColor(color)` - Set active color for new text
- `setActiveFontSize(size)` - Set active size for new text

## Examples

See `examples/demo.html` for a complete working example.

## Architecture

```
src/
  ├── headless.ts          # Main API entry point
  └── models/
      ├── Piece.ts         # Piece model (text + attributes)
      └── TextDocument.ts  # Document model (blocks + pieces)
```

## Building

```bash
npm run build
```

This generates:

- `dist/headless.js` - ESM module
- `dist/headless.cjs` - CommonJS module
- `dist/headless.umd.js` - UMD bundle for browsers

## License

MIT

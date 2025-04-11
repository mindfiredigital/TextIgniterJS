# TextIgniter JS

🚀 **TextIgniter JS** is a powerful, lightweight, and customizable rich-text editor for modern web applications.

## 📌 Features

- ✅ Toolbar with essential formatting options
- ✅ Bold, Italic, Underline, Hyperlinks
- ✅ Font Family & Font Size support
- ✅ Text alignment: Left, Center, Right
- ✅ Ordered & Unordered lists
- ✅ Image embedding
- ✅ Font & Background color customization
- ✅ HTML content export

---

## 📦 Installation

### For Core Module

```sh
pnpm add @mindfiredigital/textigniter
```

### For Web Component

```sh
pnpm add @mindfiredigital/textigniter-web-component
```

---

## 🚀 Usage

### Using Core Module in JavaScript

```js
import { TextIgniter } from '@mindfiredigital/textigniter';

const editor = new TextIgniter('#editor', {
  showToolbar: true,
  features: [
    'bold',
    'italic',
    'underline',
    'hyperlink',
    'fontFamily',
    'fontSize',
    'alignLeft',
    'alignCenter',
    'alignRight',
    'unorderedList',
    'orderedList',
    'image',
    'fontColor',
    'bgColor',
    'getHtmlContent',
  ],
});
```

### Using Web Component

```html
<script type="module">
  import '@mindfiredigital/textigniter-web-component';
</script>

<text-igniter
  config='{
  "showToolbar": true,
  "features": [
    "bold",
    "italic",
    "underline",
    "hyperlink",
    "fontFamily",
    "fontSize",
    "alignLeft",
    "alignCenter",
    "alignRight",
    "unorderedList",
    "orderedList",
    "image",
    "fontColor",
    "bgColor",
    "getHtmlContent"
  ]
}'
></text-igniter>
```

---

## ⚙️ API

### TextIgniter Core Methods

| Method             | Description                                 |
| ------------------ | ------------------------------------------- |
| `getHtmlContent()` | Returns the current HTML content of editor. |
| `setContent(html)` | Sets the content of the editor.             |
| `clear()`          | Clears the editor content.                  |

---

## 📄 License

MIT License © 2025 **Mindfire Digital**

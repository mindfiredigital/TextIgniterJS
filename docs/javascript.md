# Javascript

Follow these steps to initialize and configure TextIgniter in your Javascript/Typescript project.

## Example Code
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TextIgniter JS Example</title>
    <!-- Include Stylesheet -->
    <link rel="stylesheet" href="node_modules/@mindfiredigital/textigniter/dist/styles/text-igniter.css" />
  </head>
  <body>
    <!-- Editor Container -->
    <div id="editor-container"></div>

    <button id="get-content-btn">Get Content</button>

    <!-- Include TextIgniter Script -->
    <script src="node_modules/@mindfiredigital/textigniter/dist/index.js"></script>

    <script>
      // Initialize the editor with desired features
      const config = {
        showToolbar: true,
        features: [
          'bold',
          'italic',
          'underline',
          'subscript',
          'superscript',
          'alignLeft',
          'alignCenter',
          'alignRight',
          'justify',
          'unorderedList',
          'orderedList',
          'insert_table',
          'insert_layout',
          'insert_math',
          'emoji',
          'heading',
          'hyperlink',
          'image',
        ],
      };

      const editor = new TextIgniter('editor-container', config);

      // Listen for content changes in real-time
      editor.onContentChange((data) => {
        console.log('Real-time HTML:', data.html);
        console.log('Real-time Plain Text:', data.text);
      });

      // Retrieve content on button click
      document.getElementById('get-content-btn').addEventListener('click', () => {
        const html = editor.getContent();
        const text = editor.getTextContent();
        console.log('HTML content:', html);
        console.log('Plain Text content:', text);
      });
    </script>
  </body>
</html>
```

## API Reference

### Retrieve Editor Content

Use the following methods to retrieve content from the editor instance:

```javascript
// Get formatted HTML content
const htmlContent = editor.getContent();

// Get plain text content (without HTML tags)
const textContent = editor.getTextContent();
```

### Load Initial/HTML Content

Use `loadHtmlContent(html)` to programmatically set the editor content:

```javascript
editor.loadHtmlContent('<p>Hello <strong>World</strong>!</p>');
```

### Subscribe to Content Changes

Listen to real-time changes using `onContentChange`:

```javascript
editor.onContentChange((data) => {
  console.log('HTML:', data.html);
  console.log('Text:', data.text);
});
```


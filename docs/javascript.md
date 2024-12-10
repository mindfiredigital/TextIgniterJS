# Javascript

- **Initialization**: Follow these steps to initialize and configure TextIgniterJS in your project.
Follow these steps to initialize and configure TextIgniterJS in your project.

## Example Code
```javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TextIgniterJS</title>
  </head>
  <body>
    <div id="editor"></div>

    <script src="node_modules/@mindfiredigital/textigniterjs/dist/index.js"></script>

    <script>
      // Initialize the RichTextEditor with specific features
      const config = {
        features: [
          'bold',
          'italic',
          'underline',
          'subscript',
          'superscript',
          'left_align',
          'center_align',
          'right_align',
          'justify',
          'bullet_list',
          'numbered_list',
          'insert_table',
          'insert_layout',
          'heading',
          'hyperlink',
          'image',
        ],
      };
      const editor = new TextIgniter('editor', config);

      // Example usage of getHtml and getJson methods
      function getEditorContent() {
        console.log('HTML content:', editor.getHtml());
        console.log('JSON content:', editor.getJson());
      }
      const contentButton = document.createElement('button');
      contentButton.innerText = 'Get Content';
      contentButton.onclick = getEditorContent;
      document.body.appendChild(contentButton);
    </script>
  </body>
</html>
```

## Retrieve Editor Content
### Add functionality to extract editor content using the provided methods:

```javascript
console.log('HTML content:', editor.getHtml());
console.log('JSON content:', editor.getJson());
```
### The example above demonstrates how to initialize the editor, configure it with specific features, and retrieve content in HTML and JSON formats.

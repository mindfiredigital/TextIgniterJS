import { ElementType, FC, useState } from 'react';
import { Textigniter as OriginalComponent } from '@mindfiredigital/textigniter-react';

const Textigniter = OriginalComponent as ElementType;

const App: FC = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [textContent, setTextContent] = useState('');

  const handleContentChange = (data: { html: string; text: string }) => {
    console.log('Content changed:', data);
    setHtmlContent(data.html);
    setTextContent(data.text);
  };

  return (
    <>
      {/* <h1>TextIgniter React Example</h1> */}
      <div></div>
      <Textigniter
        config={{
          showToolbar: true,
          features: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
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
            'loadHtmlContent',
            'insert_table',
            'insert_layout',
            'speechToText',
            'emoji',
            'subscript',
            'superscript',
            'insert_math',
            'textToSpeech',
          ],
        }}
        onContentChange={handleContentChange}
      />

      {/* Real-time Content Preview */}
      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          border: '1px solid #ccc',
          background: '#f9f9f9',
        }}
      >
        <h3>Real-time Content Preview:</h3>
        <div style={{ marginTop: '10px' }}>
          <strong>HTML Content:</strong>
          <pre
            style={{
              background: 'white',
              padding: '10px',
              overflow: 'auto',
              maxHeight: '200px',
            }}
          >
            {htmlContent || 'Start typing to see content...'}
          </pre>
        </div>
        <div style={{ marginTop: '10px' }}>
          <strong>Text Content:</strong>
          <pre
            style={{
              background: 'white',
              padding: '10px',
              overflow: 'auto',
              maxHeight: '100px',
            }}
          >
            {textContent || 'Start typing to see text...'}
          </pre>
        </div>
        <div style={{ marginTop: '10px' }}>
          <strong>Stats:</strong>
          <p>
            Characters: {textContent.length} | Words:{' '}
            {textContent.trim() ? textContent.trim().split(/\s+/).length : 0}
          </p>
        </div>
      </div>
    </>
  );
};

export default App;

import { ElementType, FC, useState } from 'react';
import { Textigniter as OriginalComponent } from '@mindfiredigital/textigniter-react';

const Textigniter = OriginalComponent as ElementType;

const App: FC = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [textContent, setTextContent] = useState('');
  const [editorValue, setEditorValue] = useState<string | undefined>(undefined);

  const handleContentChange = (data: { html: string; text: string }) => {
    console.log('Content changed:', data);
    setHtmlContent(data.html);
    setTextContent(data.text);
  };

  const loadTemplate1 = () => {
    setEditorValue('<div data-id="block-template-1" class="paragraph-block" type="text" style="text-align: left;"><span style="font-family: Arial; font-size: 12px; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);">Loaded <strong>Template One</strong> successfully! 🎉</span></div>');
  };

  const loadTemplate2 = () => {
    setEditorValue('<div data-id="block-template-2" class="paragraph-block" type="text" style="text-align: left;"><span style="font-family: Arial; font-size: 12px; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);">This is <em>Template Two</em> with some inline italicized styling.</span></div>');
  };

  return (
    <>
      {/* Test Interactive Controls */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={loadTemplate1}
          style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Load Template 1 (Reactive Prop)
        </button>
        <button 
          onClick={loadTemplate2}
          style={{ padding: '8px 16px', background: '#008CBA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Load Template 2 (Reactive Prop)
        </button>
        <button 
          onClick={() => setEditorValue(undefined)}
          style={{ padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Reset / Clear value prop
        </button>
      </div>

      <Textigniter
        initialValue="<div data-id='block-initial' class='paragraph-block' type='text' style='text-align: left;'><span style='font-family: Arial; font-size: 12px; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);'>Welcome to <strong>TextIgniter React</strong>! This was loaded via <code>initialValue</code> prop.</span></div>"
        value={editorValue}
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

import { FC } from 'react';
// @ts-ignore
import { Textigniter} from '@mindfiredigital/textigniter-react';

const App: FC = () => {
  return (
    <>
      <Textigniter
        config={{
          showToolbar: true,
          features: [
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
            "getHtmlContent",
            "loadHtmlContent"
          ]
        }}
      />
    </>
  );
};

export default App;

declare global {
    namespace JSX {
      interface IntrinsicElements {
        'textigniter': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement>,
          HTMLElement
        >;
      }
    }
  }
  
  export {};
declare class HtmlToJsonParser {
  private htmlString;
  private doc;
  constructor(htmlString: string);
  parse(): any[];
  private parseElement;
  private parseListItems;
  private parseParagraphText;
  private extractTextAttributes;
  private rgbToHex;
}
export default HtmlToJsonParser;
//# sourceMappingURL=HtmlToJsonParser.d.ts.map

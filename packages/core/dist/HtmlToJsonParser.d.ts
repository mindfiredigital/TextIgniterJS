declare class HtmlToJsonParser {
    private htmlString;
    private doc;
    constructor(htmlString: string);
    parse(): any[];
    private parseElement;
    private parseListItems;
    private parseParagraphText;
    private extractTextAttributes;
    rgbToHex(rgb: string, isBackground?: boolean): string | null;
}
export default HtmlToJsonParser;

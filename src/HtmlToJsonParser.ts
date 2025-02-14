import Piece from "./piece";
class HtmlToJsonParser {
    private htmlString: string;
    private doc: Document;
    constructor(htmlString: string) {
        this.htmlString = htmlString;
        this.doc = new DOMParser().parseFromString(htmlString, "text/html");
    }

    public parse(): any[] {
        const elements = this.doc.body.children;
        let jsonData: any[] = [];

        Array.from(elements).forEach((element) => {
            jsonData.push(this.parseElement(element as HTMLElement));
        });

        return jsonData;
    }

    private parseElement(element: HTMLElement): any {
        const dataId = element.getAttribute("data-id") || "";
        const className = element.className || "paragraph-block";
        const alignment = element.style.textAlign || "left";

        let listType = null;
        let listStart = null;
        let parentId = null;

        if (element.tagName === "UL") {
            listType = "ul";
        } else if (element.tagName === "OL") {
            listType = "ol";
            listStart = parseInt(element.getAttribute("start") || "1", 10);
        }

        let pieces: any[] = [];

        if (listType) {
            this.parseListItems(element, pieces);
        } else {
            this.parseParagraphText(element, pieces);
        }

        return {
            dataId,
            class: className,
            alignment,
            pieces,
            ...(listType ? { listType } : {}),  // Only spread if listType exists
            ...(listStart !== null ? { listStart } : {}),  // Only spread if listStart exists
            ...(parentId !== null ? { parentId } : {}),  // Only spread if parentId is not null
        };
    }

    private parseListItems(element: HTMLElement, pieces: any[]): void {
        const listItems = element.querySelectorAll("li");
        listItems.forEach((li) => {
            const piece = this.extractTextAttributes(li);
            
            if (piece) pieces.push(new Piece(piece.text, piece.attributes));
        });
    }

    private parseParagraphText(element: HTMLElement, pieces: any[]): void {
        const spans = element.querySelectorAll("span");
        spans.forEach((span) => {
            const piece = this.extractTextAttributes(span);
            
            if (piece) pieces.push(new Piece(piece.text, piece.attributes));
        });
    }

    private extractTextAttributes(node: any): any {
        const text = node.textContent || "";
        if (!text) return null;

        return {
            text,
            attributes: {
                bold: node.querySelector("b, strong") !== null,
                italic: node.querySelector("i, em") !== null,
                underline: node.querySelector("u") !== null,
                undo: false,
                redo: false,
                fontFamily: node.style.fontFamily || "Arial",
                fontSize: node.style.fontSize || "12px",
                hyperlink: node.querySelector("a") ? node.querySelector("a")?.getAttribute("href") : false,
                fontColor: this.rgbToHex(node.style.color, false),
                bgColor: this.rgbToHex(node.style.backgroundColor, true),
            },
        };
    }

    // private rgbToHex(rgb: string): string {
    //     const rgbArray = rgb.match(/\d+/g);
    //     if (!rgbArray) return "#000000";
    //     return `#${rgbArray.map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")}`;
    // }
    // private rgbToHex(rgb: string): string {
    //     // Extract numbers from the RGB string using a more robust regex
    //     const rgbArray = rgb.match(/\d+/g);

    //     // If no numbers are found, return a default color (e.g., black)
    //     if (!rgbArray || rgbArray.length < 3) return "#000000";

    //     // Convert each RGB component to a 2-digit hexadecimal string
    //     const hex = rgbArray
    //         .map((x) => {
    //             const value = parseInt(x);
    //             // Ensure the value is within the 0-255 range
    //             if (value < 0 || value > 255) return "00";
    //             return value.toString(16).padStart(2, "0");
    //         })
    //         .join("");

    //     return `#${hex}`;
    // }
    private rgbToHex(rgb: string, isBackground: boolean = false): string | null {
        // Extract numbers from the RGB string using regex
        const rgbArray = rgb.match(/\d+/g);

        // If no numbers are found, return null (no color)
        if (!rgbArray || rgbArray.length < 3) return null;

        // Convert each RGB component to a 2-digit hexadecimal string
        const hex = rgbArray
            .map((x) => {
                const value = parseInt(x);
                // Ensure the value is within the 0-255 range
                if (value < 0 || value > 255) return "00";
                return value.toString(16).padStart(2, "0");
            })
            .join("");

        // Avoid setting default font color as black
        if (!isBackground && hex === "000000") {
            return null; // Return null to indicate default color
        }

        return `#${hex}`;
    }

}

export default HtmlToJsonParser;
// Example Usage:
// const htmlInput = `<div data-id="data-id-1734604240404" class="paragraph-block" style="text-align: left;">
//     <span style="font-family: Arial; font-size: 12px; background-color: rgb(160, 39, 39); color: rgb(255, 255, 255);">
//         ajsh diujaksd
//     </span>
// </div>`;

// const parser = new HtmlToJsonParser(htmlInput);
// const jsonOutput = parser.parse();
// console.log(JSON.stringify(jsonOutput, null, 2));

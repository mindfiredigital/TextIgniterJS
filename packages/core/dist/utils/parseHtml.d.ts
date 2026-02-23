import Piece from '../piece';
export declare function parseHtmlToPieces(html: string): Piece[];
export declare function extractPiecesFromNode(node: Node, inheritedAttrs: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    hyperlink?: string | boolean;
}): Piece[];

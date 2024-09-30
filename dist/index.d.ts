import "./styles/text-igniter.css";
export interface EditorConfig {
    features: string[];
}
export interface NodeJson {
    type: string;
    attributes: {
        [key: string]: string;
    };
    children: (NodeJson | string)[];
}

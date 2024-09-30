interface EditorConfig {
    features: string[];
}
interface NodeJson {
    type: string;
    attributes: {
        [key: string]: string;
    };
    children: (NodeJson | string)[];
}

export type { EditorConfig, NodeJson };

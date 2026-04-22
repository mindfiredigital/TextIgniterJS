export interface EmojiItem {
  char: string;
  name: string;
  shortcode: string;
}

export interface EmojiCategory {
  label: string;
  items: EmojiItem[];
}

import { EmojiCategory } from '../types/emoji.type';

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    label: 'Smileys & People',
    items: [
      { char: '😀', name: 'grinning face', shortcode: ':grinning:' },
      { char: '😃', name: 'big eyes smile', shortcode: ':smiley:' },
      { char: '😄', name: 'smiling eyes grin', shortcode: ':smile:' },
      { char: '😁', name: 'beaming grin', shortcode: ':grin:' },
      { char: '😆', name: 'squinting laugh', shortcode: ':laughing:' },
      { char: '😅', name: 'sweat smile', shortcode: ':sweat_smile:' },
      { char: '🤣', name: 'rolling floor laughing', shortcode: ':rofl:' },
      { char: '😂', name: 'tears of joy', shortcode: ':joy:' },
      {
        char: '🙂',
        name: 'slightly smiling',
        shortcode: ':slightly_smiling_face:',
      },
      { char: '😊', name: 'smiling eyes blush', shortcode: ':blush:' },
    ],
  },
];

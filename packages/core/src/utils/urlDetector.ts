// URL regex pattern to detect various URL formats
// URL detection utility
const URL_REGEX =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;

export function detectUrlsInText(
  text: string
): Array<{ text: string; isUrl: boolean; url?: string }> {
  const segments: Array<{ text: string; isUrl: boolean; url?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = URL_REGEX.exec(text)) !== null) {
    // Add text before URL
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index),
        isUrl: false,
      });
    }

    // Add URL segment
    let url = match[0];
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    segments.push({
      text: match[0],
      isUrl: true,
      url: url,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      isUrl: false,
    });
  }

  return segments;
}

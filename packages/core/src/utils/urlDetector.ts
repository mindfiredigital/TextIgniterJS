// URL regex pattern to detect various URL formats
// URL detection utility
// Improved URL regex: matches full URLs, avoids emails, strips trailing punctuation
const URL_REGEX =
  /((https?:\/\/|www\.)[\w\-._~:/?#[\]@!$&'()*+,;=%]+|\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?)/g;

function isPartOfEmail(text: string, matchIndex: number): boolean {
  // Check if the match is immediately preceded by '@'
  return matchIndex > 0 && text[matchIndex - 1] === '@';
}

export function detectUrlsInText(
  text: string
): Array<{ text: string; isUrl: boolean; url?: string }> {
  const segments: Array<{ text: string; isUrl: boolean; url?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = URL_REGEX.exec(text)) !== null) {
    const matchIndex = match.index;
    let urlText = match[0];
    // Exclude trailing punctuation (including closing parens, brackets, quotes)
    let trailing = '';
    const trailingMatch = urlText.match(/[.,!?;:)\]\}"']+$/);
    if (trailingMatch) {
      trailing = trailingMatch[0];
      urlText = urlText.slice(0, -trailing.length);
    }
    // Skip if part of an email address
    if (isPartOfEmail(text, matchIndex)) {
      continue;
    }
    // Add text before URL
    if (matchIndex > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, matchIndex),
        isUrl: false,
      });
    }
    let url = urlText;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    segments.push({
      text: urlText,
      isUrl: true,
      url: url,
    });
    if (trailing) {
      segments.push({ text: trailing, isUrl: false });
    }
    lastIndex = matchIndex + match[0].length;
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

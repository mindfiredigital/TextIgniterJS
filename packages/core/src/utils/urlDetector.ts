// URL regex pattern to detect various URL formats
// URL detection utility
// Improved URL regex: matches full URLs, avoids emails, strips trailing punctuation
const URL_REGEX =
  /((https?:\/\/|www\.)[\w\-._~:\/?#[\]@!$&'()*+,;=%]+|\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[\w\-._~:\/?#[\]@!$&'()*+,;=%]*)?)/g;

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

// Ensure a URL has an explicit protocol so anchors are not resolved relative to the current origin
// - Leaves absolute URLs (scheme://) untouched
// - Converts protocol-relative URLs (//example.com) to https://example.com
// - Prefixes bare domains (example.com) with https://
// - Strips accidental patterns like http://host/https://example.com
export function ensureProtocol(url: string): string {
  if (!url) return url;
  let trimmed = url.trim();

  // Fix accidental current-host prefixes such as http://host/https://example.com
  const accidentalPrefixMatch = trimmed.match(
    /^https?:\/\/[\w.-]+(?::\d+)?\/(https?:\/\/.*)$/
  );
  if (accidentalPrefixMatch) {
    trimmed = accidentalPrefixMatch[1];
  }

  // Already absolute (e.g., http://, https://, mailto:, tel:, ftp:, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return trimmed;
  }
  // Protocol-relative
  if (trimmed.startsWith('//')) {
    return 'https:' + trimmed;
  }
  // Default to https for bare domains/paths
  return 'https://' + trimmed;
}

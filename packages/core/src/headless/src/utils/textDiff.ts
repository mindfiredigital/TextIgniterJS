/**
 * Finds the longest common prefix between two strings.
 */
export function findCommonPrefix(str1: string, str2: string): number {
  let prefixLength = 0;
  const maxLength = Math.min(str1.length, str2.length);

  while (
    prefixLength < maxLength &&
    str1[prefixLength] === str2[prefixLength]
  ) {
    prefixLength++;
  }

  return prefixLength;
}

/**
 * Finds the longest common suffix between two strings.
 */
export function findCommonSuffix(str1: string, str2: string): number {
  let suffixLength = 0;
  const minLength = Math.min(str1.length, str2.length);

  while (
    suffixLength < minLength &&
    str1[str1.length - 1 - suffixLength] ===
      str2[str2.length - 1 - suffixLength]
  ) {
    suffixLength++;
  }

  return suffixLength;
}

/**
 * Determines if text was appended (new text starts with old text).
 */
export function isAppended(oldText: string, newText: string): boolean {
  return newText.startsWith(oldText);
}

/**
 * Determines if text was prepended (new text ends with old text).
 */
export function isPrepended(oldText: string, newText: string): boolean {
  return newText.endsWith(oldText);
}

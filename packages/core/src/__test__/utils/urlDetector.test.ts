import { describe, it, expect } from 'vitest';
import { detectUrlsInText } from '../../utils/urlDetector';

describe('detectUrlsInText', () => {
  it('detects a single http URL', () => {
    const input = 'Visit http://example.com for info.';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'Visit ', isUrl: false },
      { text: 'http://example.com', isUrl: true, url: 'http://example.com' },
      { text: ' for info.', isUrl: false },
    ]);
  });

  it('detects a single https URL', () => {
    const input = 'Go to https://secure.com!';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'Go to ', isUrl: false },
      { text: 'https://secure.com', isUrl: true, url: 'https://secure.com' },
      { text: '!', isUrl: false },
    ]);
  });

  it('detects www. URLs and adds https://', () => {
    const input = 'Try www.site.org now.';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'Try ', isUrl: false },
      { text: 'www.site.org', isUrl: true, url: 'https://www.site.org' },
      { text: ' now.', isUrl: false },
    ]);
  });

  it('detects bare domain URLs and adds https://', () => {
    const input = 'Contact at mail.example.net.';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'Contact at ', isUrl: false },
      {
        text: 'mail.example.net',
        isUrl: true,
        url: 'https://mail.example.net',
      },
      { text: '.', isUrl: false },
    ]);
  });

  it('detects multiple URLs in text', () => {
    const input = 'See http://a.com and www.b.org or c.net/page.';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'See ', isUrl: false },
      { text: 'http://a.com', isUrl: true, url: 'http://a.com' },
      { text: ' and ', isUrl: false },
      { text: 'www.b.org', isUrl: true, url: 'https://www.b.org' },
      { text: ' or ', isUrl: false },
      { text: 'c.net/page', isUrl: true, url: 'https://c.net/page' },
      { text: '.', isUrl: false },
    ]);
  });

  it('returns all text as non-URL if no URLs present', () => {
    const input = 'No links here!';
    const result = detectUrlsInText(input);
    expect(result).toEqual([{ text: 'No links here!', isUrl: false }]);
  });

  it('handles empty string', () => {
    const result = detectUrlsInText('');
    expect(result).toEqual([]);
  });

  it('handles URLs at the start and end', () => {
    const input = 'www.start.com is good, so is end.com';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'www.start.com', isUrl: true, url: 'https://www.start.com' },
      { text: ' is good, so is ', isUrl: false },
      { text: 'end.com', isUrl: true, url: 'https://end.com' },
    ]);
  });

  it('handles URLs with paths', () => {
    const input = 'Go to site.com/path/to/page.';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'Go to ', isUrl: false },
      {
        text: 'site.com/path/to/page',
        isUrl: true,
        url: 'https://site.com/path/to/page',
      },
      { text: '.', isUrl: false },
    ]);
  });

  it('does not treat email addresses as URLs', () => {
    const input = 'Email me at user@example.com.';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'Email me at user@example.com.', isUrl: false },
    ]);
  });

  it('detects URLs inside parentheses and quotes', () => {
    const input = 'Check (http://foo.com), or "www.bar.com"!';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'Check (', isUrl: false },
      { text: 'http://foo.com', isUrl: true, url: 'http://foo.com' },
      { text: '),', isUrl: false },
      { text: ' or "', isUrl: false },
      { text: 'www.bar.com', isUrl: true, url: 'https://www.bar.com' },
      { text: '"!', isUrl: false },
    ]);
  });

  it('detects percent-encoded URLs', () => {
    const input = 'Go to https://example.com/path%20with%20spaces.';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'Go to ', isUrl: false },
      {
        text: 'https://example.com/path%20with%20spaces',
        isUrl: true,
        url: 'https://example.com/path%20with%20spaces',
      },
      { text: '.', isUrl: false },
    ]);
  });

  it('handles very long URLs', () => {
    const longUrl =
      'https://example.com/' + 'a'.repeat(100) + '?q=' + 'b'.repeat(50);
    const input = 'Long: ' + longUrl + '!';
    const result = detectUrlsInText(input);
    expect(result).toEqual([
      { text: 'Long: ', isUrl: false },
      { text: longUrl, isUrl: true, url: longUrl },
      { text: '!', isUrl: false },
    ]);
  });
});

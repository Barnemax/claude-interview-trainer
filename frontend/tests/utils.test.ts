import { describe, it, expect } from 'vitest';
import { parseBody, isCovered } from '../src/utils';

describe('parseBody', () => {
  it('returns a single text part when there are no code fences', () => {
    const result = parseBody('What does this code do?');
    expect(result).toEqual([{ type: 'text', content: 'What does this code do?' }]);
  });

  it('extracts a fenced code block with a language tag', () => {
    const body = 'Look at this:\n```js\nconsole.log(1);\n```';
    const result = parseBody(body);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ type: 'text' });
    expect(result[1]).toMatchObject({ type: 'code', lang: 'js', content: 'console.log(1);\n' });
  });

  it('defaults lang to "text" when no language is specified', () => {
    const body = '```\nsome code\n```';
    const result = parseBody(body);
    expect(result[0]).toMatchObject({ type: 'code', lang: 'text' });
  });

  it('handles multiple code blocks with text between them', () => {
    const body = 'First:\n```js\nfoo();\n```\nThen:\n```py\nbar()\n```';
    const result = parseBody(body);
    expect(result).toHaveLength(4);
    expect(result.map((p) => p.type)).toEqual(['text', 'code', 'text', 'code']);
  });

  it('returns a single text part when body is only text after a code block', () => {
    const body = '```js\nfoo();\n```\nAfter the code.';
    const result = parseBody(body);
    const last = result[result.length - 1];
    expect(last.type).toBe('text');
    expect(last.content.trim()).toBe('After the code.');
  });

  it('returns empty array for empty string', () => {
    expect(parseBody('')).toEqual([]);
  });
});

describe('isCovered', () => {
  it('returns true for an exact match', () => {
    expect(isCovered('closure', ['closure', 'hoisting'])).toBe(true);
  });

  it('returns true when concept is a substring of a covered concept', () => {
    expect(isCovered('closure', ['closure capture', 'hoisting'])).toBe(true);
  });

  it('returns true when a covered concept is a substring of the concept', () => {
    expect(isCovered('var hoisting', ['hoisting'])).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isCovered('Closure', ['closure'])).toBe(true);
    expect(isCovered('closure', ['Closure'])).toBe(true);
  });

  it('returns false when concept is not covered', () => {
    expect(isCovered('event loop', ['closure', 'hoisting'])).toBe(false);
  });

  it('returns false for an empty covered list', () => {
    expect(isCovered('closure', [])).toBe(false);
  });
});

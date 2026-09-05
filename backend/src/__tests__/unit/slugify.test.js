const slugify = require('../../common/utils/slugify');

describe('Slugify Utility', () => {
  it('should convert standard text to slug format', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello! World@#$')).toBe('hello-world');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world');
  });

  it('should handle leading and trailing spaces', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('should convert everything to lowercase', () => {
    expect(slugify('HELLO WORLD')).toBe('hello-world');
  });

  it('should return empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });
  
  it('should return empty string for null/undefined', () => {
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
  });
});

/**
 * Generate a URL-friendly slug from a string.
 * Supports English and Arabic characters.
 * 
 * @param {string} text - The input string to slugify
 * @returns {string} - The slugified string
 */
const generateSlug = (text) => {
  if (!text) return '';

  return text
    .toString()
    .trim()
    .toLowerCase()
    // Replace spaces and special characters with hyphens (keep Arabic letters, English letters, and numbers)
    // Arabic unicode range: \u0621-\u064A
    .replace(/[^\w\u0621-\u064A0-9]+/g, '-')
    // Replace multiple consecutive hyphens with a single hyphen
    .replace(/--+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

module.exports = generateSlug;

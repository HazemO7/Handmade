/**
 * Format phone number for WhatsApp wa.me links
 * Strips all non-digit characters (+, spaces, hyphens, parentheses)
 * Handles Egypt local numbers (e.g., 01012345678 -> 201012345678)
 *
 * @param {string} phone
 * @returns {string}
 */
export const formatWhatsAppNumber = (phone) => {
  if (!phone) return '';

  // Remove any non-numeric characters
  let cleaned = String(phone).replace(/\D/g, '');

  // If local Egyptian number format (11 digits starting with 01)
  if (cleaned.length === 11 && cleaned.startsWith('01')) {
    cleaned = '20' + cleaned.substring(1);
  }

  return cleaned;
};

/**
 * Generate a pre-filled WhatsApp message for a product order/inquiry
 *
 * @param {Object} options
 * @param {Object} options.product - Product object { name, price, currency, slug }
 * @param {string} [options.storeUrl] - Absolute URL to the product page
 * @param {string} [options.customText] - Optional custom message prefix
 * @returns {string}
 */
export const generateWhatsAppMessage = ({ product, storeUrl, customText }) => {
  if (!product) return '';

  const productName = product.name || 'Product';
  const price = product.price ? `${product.price} ${product.currency || 'EGP'}` : '';
  const url = storeUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const lines = [
    customText || 'مرحباً! أود طلب هذا المنتج:',
    '',
    `🏷️ *المنتج:* ${productName}`,
  ];

  if (price) {
    lines.push(`💰 *السعر:* ${price}`);
  }

  if (url) {
    lines.push(`🔗 *الرابط:* ${url}`);
  }

  lines.push('', 'هل المنتج متوفر حالياً؟ شكراً!');

  return lines.join('\n');
};

/**
 * Generate the complete wa.me link with encoded text
 *
 * @param {Object} options
 * @param {string} options.phone - Store WhatsApp phone number
 * @param {Object} options.product - Product data
 * @param {string} [options.storeUrl] - URL of product
 * @param {string} [options.customMessage] - Override message
 * @returns {string|null} - Returns wa.me URL or null if no valid phone number
 */
export const generateWhatsAppUrl = ({ phone, product, storeUrl, customMessage }) => {
  const formattedNumber = formatWhatsAppNumber(phone);
  const message = customMessage || generateWhatsAppMessage({ product, storeUrl });
  const encodedMessage = encodeURIComponent(message);

  if (!formattedNumber) {
    // If no phone number is provided, return generic wa.me share link
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
};

export default {
  formatWhatsAppNumber,
  generateWhatsAppMessage,
  generateWhatsAppUrl,
};

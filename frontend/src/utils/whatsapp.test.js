import { describe, it, expect } from 'vitest';
import {
  formatWhatsAppNumber,
  generateWhatsAppMessage,
  generateWhatsAppUrl,
} from './whatsapp';

describe('WhatsApp Utilities', () => {
  describe('formatWhatsAppNumber', () => {
    it('should strip special characters, spaces, and plus signs', () => {
      expect(formatWhatsAppNumber('+20 101 234 5678')).toBe('201012345678');
      expect(formatWhatsAppNumber('+1 (555) 123-4567')).toBe('15551234567');
      expect(formatWhatsAppNumber('20-101-234-5678')).toBe('201012345678');
    });

    it('should format Egyptian local numbers (01xxxxxxxxx -> 201xxxxxxxxx)', () => {
      expect(formatWhatsAppNumber('01012345678')).toBe('201012345678');
      expect(formatWhatsAppNumber('01198765432')).toBe('201198765432');
    });

    it('should return empty string for empty input', () => {
      expect(formatWhatsAppNumber('')).toBe('');
      expect(formatWhatsAppNumber(null)).toBe('');
      expect(formatWhatsAppNumber(undefined)).toBe('');
    });
  });

  describe('generateWhatsAppMessage', () => {
    it('should format product details into an ordering message', () => {
      const product = {
        name: 'Handmade Ceramic Vase',
        price: 450,
        currency: 'EGP',
      };
      const storeUrl = 'https://handmade-store.com/product/ceramic-vase';

      const message = generateWhatsAppMessage({ product, storeUrl });

      expect(message).toContain('Handmade Ceramic Vase');
      expect(message).toContain('450 EGP');
      expect(message).toContain(storeUrl);
      expect(message).toContain('مرحباً');
    });

    it('should handle custom intro text', () => {
      const product = { name: 'Clay Mug', price: 120, currency: 'EGP' };
      const message = generateWhatsAppMessage({ product, customText: 'Custom greeting:' });

      expect(message).toContain('Custom greeting:');
      expect(message).toContain('Clay Mug');
    });
  });

  describe('generateWhatsAppUrl', () => {
    it('should generate valid wa.me URL with phone and encoded message', () => {
      const product = {
        name: 'Handmade Wooden Tray',
        price: 350,
        currency: 'EGP',
      };
      const phone = '+20 101 234 5678';
      const storeUrl = 'https://handmade-store.com/product/wooden-tray';

      const url = generateWhatsAppUrl({ phone, product, storeUrl });

      expect(url.startsWith('https://wa.me/201012345678?text=')).toBe(true);
      // Verify Arabic encoding
      expect(url).toContain(encodeURIComponent('المنتج'));
      expect(url).toContain(encodeURIComponent('Handmade Wooden Tray'));
    });

    it('should handle missing phone number with fallback wa.me share link', () => {
      const product = { name: 'Knitted Scarf' };
      const url = generateWhatsAppUrl({ phone: '', product });

      expect(url.startsWith('https://wa.me/?text=')).toBe(true);
      expect(url).toContain(encodeURIComponent('Knitted Scarf'));
    });
  });
});

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import WhatsAppButton from '../components/product/WhatsAppButton';
import { vi } from 'vitest';

// Mock settings API
vi.mock('../services/api', () => ({
  settingsApi: {
    getSettings: vi.fn(() => Promise.resolve({ data: { whatsappNumber: '+20123456789' } }))
  }
}));

describe('WhatsAppButton Component', () => {
  const mockProduct = {
    name: 'Test Product',
    price: 100,
    slug: 'test-product',
    stock: 5
  };

  it('renders out of stock state correctly', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<WhatsAppButton product={outOfStockProduct} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders active button for in-stock products', async () => {
    await act(async () => {
      render(<WhatsAppButton product={mockProduct} />);
    });
    
    expect(screen.getByText('Order via WhatsApp')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', expect.stringContaining('wa.me'));
  });
});

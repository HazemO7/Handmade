import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

describe('ProductCard Component', () => {
  const mockProduct = {
    _id: '1',
    slug: 'test-bag',
    name: 'Handmade Bag',
    price: 500,
    currency: 'EGP',
    category: { name: 'Bags' },
    images: [{ processedUrl: 'http://test.com/img.jpg', alt: 'Test Bag Image' }]
  };

  it('renders product name and price correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Handmade Bag')).toBeInTheDocument();
    expect(screen.getByText('500 EGP')).toBeInTheDocument();
    expect(screen.getByText('Bags')).toBeInTheDocument();
  });
});

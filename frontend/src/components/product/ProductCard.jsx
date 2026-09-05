import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { name, slug, price, currency, images, category } = product;
  const primaryImage = images?.find(img => img.isPrimary) || images?.[0] || null;
  const imageUrl = primaryImage?.processedUrl || primaryImage?.originalUrl || 'https://via.placeholder.com/400x500?text=No+Image';

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden card-hover border border-warm-100 flex flex-col h-full">
      <Link to={`/product/${slug}`} className="block relative aspect-[4/5] bg-warm-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={primaryImage?.alt || name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          {category && (
            <span className="text-xs font-medium text-brand-600 uppercase tracking-wider">
              {category.name}
            </span>
          )}
        </div>
        
        <Link to={`/product/${slug}`} className="block">
          <h3 className="text-lg font-heading font-semibold text-warm-900 mb-1 group-hover:text-brand-700 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="text-lg font-medium text-brand-800">
            {price} {currency || 'EGP'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { name, slug, price, currency, images, category, stock } = product;
  const primaryImage = images?.find(img => img.isPrimary) || images?.[0] || null;
  const imageUrl = primaryImage?.processedUrl || primaryImage?.originalUrl
    || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop';
  const isOutOfStock = stock === 0;
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="group relative flex flex-col h-full"
      style={{ backgroundColor: '#fff' }}
    >
      {/* Image Container */}
      <Link
        to={`/product/${slug}`}
        className="block relative overflow-hidden"
        style={{ aspectRatio: '4/5', backgroundColor: '#F7F1E8' }}
      >
        <img
          src={imageUrl}
          alt={primaryImage?.alt || `${name} — HABA Handmade`}
          loading="lazy"
          decoding="async"
          width="400"
          height="500"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
          style={{ background: 'linear-gradient(to top, rgba(41,37,37,0.3) 0%, transparent 60%)' }}
        >
          <span
            className="font-body text-xs tracking-widest uppercase"
            style={{ color: '#F7F1E8', letterSpacing: '0.15em' }}
          >
            View Piece
          </span>
        </div>

        {/* Out of Stock badge */}
        {isOutOfStock && (
          <div
            className="absolute top-3 left-3 font-body text-xs tracking-wider uppercase"
            style={{ backgroundColor: '#292525', color: '#F7F1E8', padding: '4px 10px', borderRadius: '2px' }}
          >
            Sold Out
          </div>
        )}

        {/* Heart button */}
        <button
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5"
          style={{ color: liked ? '#542A3A' : '#292525' }}
          onClick={e => { e.preventDefault(); setLiked(l => !l); }}
          aria-label="Save to wishlist"
        >
          <FiHeart
            className="h-4 w-4 transition-colors"
            style={{ fill: liked ? '#542A3A' : 'none', stroke: liked ? '#542A3A' : '#F7F1E8' }}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="pt-4 pb-1 px-0 flex flex-col flex-grow">
        {/* Category */}
        {category && (
          <span
            className="font-body text-xs uppercase tracking-wider mb-1"
            style={{ color: '#C5A56A', letterSpacing: '0.12em' }}
          >
            {category.name}
          </span>
        )}

        {/* Name */}
        <Link to={`/product/${slug}`} className="block">
          <h3
            className="font-heading transition-colors line-clamp-2"
            style={{ fontSize: '19px', fontWeight: 400, color: '#292525', lineHeight: 1.3, marginBottom: '6px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#542A3A'}
            onMouseLeave={e => e.currentTarget.style.color = '#292525'}
          >
            {name}
          </h3>
        </Link>

        {/* Price */}
        <p
          className="font-body font-medium mt-auto"
          style={{ fontSize: '15px', color: isOutOfStock ? '#978572' : '#292525' }}
        >
          {isOutOfStock ? 'Sold Out' : `${price} ${currency || 'EGP'}`}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;

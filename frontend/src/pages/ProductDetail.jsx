import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../services/api';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import WhatsAppButton from '../components/product/WhatsAppButton';
import SEO from '../components/common/SEO';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await productApi.getProductBySlug(slug);
        setProduct(res.data);
        
        // Set initial selected image
        const primary = res.data.images?.find(img => img.isPrimary) || res.data.images?.[0];
        if (primary) {
          setSelectedImage(primary.processedUrl || primary.originalUrl);
        }
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-warm-50 px-4 text-center">
        <h2 className="text-3xl font-heading font-bold text-warm-900 mb-4">Product Not Found</h2>
        <p className="text-warm-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  // Fallback image handling
  const displayImage = selectedImage || 'https://via.placeholder.com/800x1000?text=No+Image';

  return (
    <div className="bg-warm-50 min-h-screen py-12">
      <SEO
        title={product.seo?.title || product.name}
        description={product.seo?.description || product.shortDescription || product.description?.slice(0, 150)}
        image={displayImage}
        type="product"
        product={product}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm font-medium text-warm-500">
          <Link to="/" className="hover:text-brand-700">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-brand-700">Shop</Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-brand-700">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-warm-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Gallery */}
            <div className="p-6 lg:p-12 lg:border-r border-warm-100 flex flex-col">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-warm-100 mb-4">
                <img 
                  src={displayImage} 
                  alt={`${product.name} — Handcrafted ${product.category?.name || 'Item'}`}
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, idx) => {
                    const imgUrl = img.processedUrl || img.originalUrl;
                    return (
                      <button
                        key={img._id || idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                          selectedImage === imgUrl ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          width="80"
                          height="80"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-12 flex flex-col">
              <div className="mb-8">
                {product.category && (
                  <span className="text-sm font-medium text-brand-600 uppercase tracking-widest mb-2 block">
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-warm-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl text-brand-800 font-medium">
                  {product.price} {product.currency || 'EGP'}
                </p>
              </div>

              {product.shortDescription && (
                <div className="prose prose-warm mb-8">
                  <p className="text-warm-700 text-lg leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>
              )}

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <ul className="space-y-3 mb-10">
                  {product.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-brand-500 mr-3 mt-1">•</span>
                      <span className="text-warm-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Actions */}
              <div className="mt-auto pt-8 border-t border-warm-100">
                <p className="text-sm text-warm-500 mb-4">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">✓ In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-red-600 font-medium">✗ Out of Stock</span>
                  )}
                </p>
                
                <div className="w-full">
                  <WhatsAppButton product={product} />
                </div>
              </div>
              
              {/* Detailed Description */}
              {product.description && (
                <div className="mt-12 pt-8 border-t border-warm-100">
                  <h3 className="text-xl font-heading font-bold text-warm-900 mb-4">Product Details</h3>
                  <div 
                    className="prose prose-warm max-w-none text-warm-700"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

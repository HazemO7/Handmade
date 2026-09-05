import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'Handmade Store — Unique Artisanal Crafts & Handcrafted Gifts';
const DEFAULT_DESCRIPTION = 'Discover beautifully handcrafted, artisanal products made with passion and premium materials. Unique home decor, accessories, and gifts.';
const DEFAULT_IMAGE = '/favicon.svg';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  product = null,
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const pageTitle = title ? `${title} | Handmade Store` : DEFAULT_TITLE;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageImage = image?.startsWith('http') ? image : `${siteUrl}${image || DEFAULT_IMAGE}`;

  // Generate JSON-LD Schema
  let schema = null;
  if (product) {
    const primaryImg = product.images?.find((img) => img.isPrimary) || product.images?.[0];
    const productImageUrl = primaryImg?.processedUrl || primaryImg?.originalUrl || pageImage;

    schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: [productImageUrl],
      description: product.shortDescription || product.description || pageDescription,
      sku: product.id || product._id || product.slug,
      offers: {
        '@type': 'Offer',
        url: currentUrl,
        priceCurrency: product.currency || 'EGP',
        price: product.price,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
      category: product.category?.name || undefined,
    };
  } else {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Handmade Store',
      url: siteUrl || 'https://handmade-store.com',
      description: DEFAULT_DESCRIPTION,
    };
  }

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content="Handmade Store" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

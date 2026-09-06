import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEO from '../components/common/SEO';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.getProducts({ limit: 4, sort: '-createdAt' }),
          categoryApi.getCategories()
        ]);

        const products = Array.isArray(productsRes.data)
          ? productsRes.data
          : (productsRes.data?.products || []);
        setFeaturedProducts(products);

        const cats = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : (categoriesRes.data?.categories || []);
        setCategories(cats.slice(0, 3));
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F1E8' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-transition">
      <SEO
        title="HABA | حَبّة — Made Bead by Bead"
        description="Handmade bags, necklaces & little pieces made with patience, detail and love. Made bead by bead."
        keywords="handmade, artisan, beaded bags, necklaces, HABA, حبة, Egyptian handmade"
      />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#F7F1E8', minHeight: '88vh', display: 'flex', alignItems: 'center' }}
      >
        {/* Subtle bead pattern decoration */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div
            className="absolute"
            style={{
              right: '-80px', top: '50%', transform: 'translateY(-50%)',
              width: '520px', height: '520px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #E8C7B8 0%, transparent 70%)',
              opacity: 0.45
            }}
          />
          <div
            className="absolute"
            style={{
              left: '-60px', bottom: '-40px',
              width: '280px', height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #C98B91 0%, transparent 70%)',
              opacity: 0.15
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32">
          <div className="max-w-2xl">
            {/* Arabic hero line */}
            <p
              className="font-heading font-medium"
              style={{ fontSize: 'clamp(18px, 3vw, 22px)', color: '#C98B91', marginBottom: '16px', letterSpacing: '0.02em' }}
              dir="rtl"
            >
              حَبّة ورا حَبّة، حكاية بتتعمل.
            </p>

            {/* English headline */}
            <h1
              className="font-heading"
              style={{
                fontSize: 'clamp(40px, 7vw, 80px)',
                color: '#292525',
                lineHeight: 1.1,
                fontWeight: 400,
                marginBottom: '24px',
              }}
            >
              Made bead<br />
              <span style={{ fontStyle: 'italic', color: '#542A3A' }}>by bead.</span>
            </h1>

            <p
              className="font-body"
              style={{ fontSize: '16px', color: '#635751', lineHeight: 1.8, maxWidth: '440px', marginBottom: '40px' }}
            >
              Handmade bags, necklaces & little pieces made with patience,<br className="hidden sm:block" /> detail and love.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center font-body font-medium tracking-widest uppercase transition-all"
                style={{
                  backgroundColor: '#542A3A',
                  color: '#F7F1E8',
                  padding: '14px 32px',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  borderRadius: '3px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3d1e2a'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#542A3A'}
              >
                Shop the Collection →
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center font-body font-medium tracking-widest uppercase transition-all"
                style={{
                  border: '1px solid #542A3A',
                  color: '#542A3A',
                  padding: '14px 32px',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  borderRadius: '3px',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#542A3A'; e.currentTarget.style.color = '#F7F1E8'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#542A3A'; }}
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Thin Divider ── */}
      <div style={{ backgroundColor: '#F7F1E8', padding: '0 0 0 0' }}>
        <hr className="haba-divider" />
      </div>

      {/* ── Shop by Category ── */}
      {categories.length > 0 && (
        <section style={{ backgroundColor: '#F7F1E8', paddingTop: '60px', paddingBottom: '80px' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-body text-xs tracking-[0.2em] uppercase mb-3" style={{ color: '#C5A56A' }}>
                Explore
              </p>
              <h2 className="font-heading" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#292525', fontWeight: 400 }}>
                Shop by Collection
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id || cat._id}
                  to={`/shop?category=${cat.slug}`}
                  className="group relative overflow-hidden"
                  style={{
                    backgroundColor: i === 0 ? '#E8C7B8' : i === 1 ? '#542A3A' : '#C98B91',
                    borderRadius: '2px',
                    minHeight: '260px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '32px',
                  }}
                >
                  <div>
                    <h3
                      className="font-heading transition-transform group-hover:translate-x-1"
                      style={{
                        fontSize: '28px',
                        fontWeight: 400,
                        color: i === 1 ? '#F7F1E8' : '#292525',
                        marginBottom: '6px',
                      }}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className="font-body text-xs tracking-widest uppercase"
                      style={{ color: i === 1 ? '#C98B91' : '#542A3A' }}
                    >
                      Explore →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      <section style={{ backgroundColor: '#fff', paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#C5A56A' }}>
                Just Arrived
              </p>
              <h2 className="font-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#292525', fontWeight: 400 }}>
                New Pieces
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex font-body text-xs tracking-widest uppercase transition-colors"
              style={{ color: '#542A3A' }}
              onMouseEnter={e => e.currentTarget.style.color = '#3d1e2a'}
              onMouseLeave={e => e.currentTarget.style.color = '#542A3A'}
            >
              View All →
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-heading italic" style={{ fontSize: '22px', color: '#978572' }}>
                New pieces arriving soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Brand CTA ── */}
      <section style={{ backgroundColor: '#542A3A', padding: '96px 16px', textAlign: 'center' }}>
        <div className="max-w-xl mx-auto">
          <p className="font-heading italic" style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', color: '#C98B91', marginBottom: '12px' }}>
            حَبّة ورا حَبّة،
          </p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#F7F1E8', fontWeight: 400, lineHeight: 1.2, marginBottom: '20px' }}>
            A little piece,<br />
            <span style={{ fontStyle: 'italic' }}>made to be yours.</span>
          </h2>
          <p className="font-body" style={{ fontSize: '15px', color: '#C98B91', marginBottom: '36px', lineHeight: 1.8 }}>
            Every piece in HABA starts from a single bead.<br />
            Each one made slowly, with care, for you.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center font-body font-medium tracking-widest uppercase transition-all"
            style={{
              backgroundColor: '#F7F1E8',
              color: '#542A3A',
              padding: '14px 36px',
              fontSize: '12px',
              letterSpacing: '0.15em',
              borderRadius: '3px',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C5A56A'; e.currentTarget.style.color = '#F7F1E8'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F7F1E8'; e.currentTarget.style.color = '#542A3A'; }}
          >
            Shop the Collection →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

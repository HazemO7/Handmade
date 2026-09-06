import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
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
        // Only take the top 3 categories for the home page layout
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-transition">
      <SEO
        title="Artisanal Handcrafted Items & Decor"
        description="Explore one-of-a-kind handmade artisanal pieces, pottery, bags, and gifts crafted with natural materials and authentic passion."
        keywords="handmade, artisanal, crafts, home decor, gifts, handcrafted"
      />
      {/* Hero Section */}
      <section className="bg-brand-100 py-20 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-warm-900 leading-tight mb-6">
              Artisan Crafted,<br />
              <span className="text-brand-700">Mindfully Designed.</span>
            </h1>
            <p className="text-lg md:text-xl text-warm-700 mb-8 max-w-lg">
              Discover our curated collection of premium handmade goods that bring warmth, character, and beauty to your everyday life.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/shop">
                <Button size="lg">Shop Collection</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">Our Story</Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 hidden lg:block"></div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-warm-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-warm-900 mb-4">Shop by Category</h2>
              <div className="w-24 h-1 bg-brand-300 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="group relative rounded-xl overflow-hidden aspect-square flex items-end">
                  <div className="absolute inset-0 bg-warm-200">
                     {/* If we had category images, they'd go here. Using a solid color/gradient fallback */}
                    <div className="w-full h-full bg-gradient-to-tr from-brand-800/80 to-transparent absolute inset-0 z-10"></div>
                  </div>
                  <div className="relative z-20 p-8 w-full">
                    <h3 className="text-2xl font-heading font-bold text-white mb-2 group-hover:translate-x-2 transition-transform">{cat.name}</h3>
                    <p className="text-warm-100 font-medium flex items-center">
                      Explore <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Arrivals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-warm-900 mb-4">New Arrivals</h2>
              <div className="w-24 h-1 bg-brand-300"></div>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex text-brand-700 font-medium hover:text-brand-800">
              View All Products &rarr;
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-warm-500 text-center py-10">No products found.</p>
          )}
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/shop">
              <Button variant="outline" fullWidth>View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-brand-900 py-24 text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-warm-50 mb-6">Join Our Community</h2>
          <p className="text-brand-200 mb-10 text-lg">
            Follow us on WhatsApp to get the latest updates, exclusive drops, and behind-the-scenes looks at our process.
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white border-none">
            Follow on WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;

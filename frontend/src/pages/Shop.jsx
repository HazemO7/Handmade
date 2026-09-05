import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi, categoryApi } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const categoryFilter = searchParams.get('category') || '';
  const searchFilter = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || '-createdAt';

  useEffect(() => {
    // Load categories once
    categoryApi.getCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
          sort
        };
        
        if (categoryFilter) {
          // Find category ID by slug for the API
          const cat = categories.find(c => c.slug === categoryFilter);
          if (cat) params.category = cat.id;
        }
        
        if (searchFilter) {
          params.search = searchFilter;
        }

        const res = await productApi.getProducts(params);
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };

    // We only want to fetch if categories are loaded (or if we have no categories)
    // to properly map the category slug to ID for the backend.
    fetchProducts();
  }, [categoryFilter, searchFilter, currentPage, sort, categories]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter change
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="bg-warm-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-heading font-bold text-warm-900 mb-4">Our Collection</h1>
          <p className="text-warm-600 max-w-2xl">
            Browse our entire catalog of beautifully handcrafted items. Use the filters to find exactly what you're looking for.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-warm-100 sticky top-24">
              
              {/* Search */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-warm-900 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border-warm-200 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm"
                  defaultValue={searchFilter}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFilterChange('search', e.target.value);
                  }}
                  onBlur={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Categories */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-warm-900 mb-3">Categories</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className={`block w-full text-left text-sm py-1 transition-colors ${!categoryFilter ? 'text-brand-700 font-semibold' : 'text-warm-600 hover:text-warm-900'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleFilterChange('category', cat.slug)}
                      className={`block w-full text-left text-sm py-1 transition-colors ${categoryFilter === cat.slug ? 'text-brand-700 font-semibold' : 'text-warm-600 hover:text-warm-900'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-warm-900 mb-2">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full border-warm-200 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="-createdAt">Newest Arrivals</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-12 flex justify-center space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handleFilterChange('page', String(currentPage - 1))}
                      className="px-4 py-2 border border-warm-200 rounded-md text-sm font-medium text-warm-700 hover:bg-warm-100 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-warm-900">
                      Page {currentPage} of {pagination.pages}
                    </span>
                    <button
                      disabled={currentPage === pagination.pages}
                      onClick={() => handleFilterChange('page', String(currentPage + 1))}
                      className="px-4 py-2 border border-warm-200 rounded-md text-sm font-medium text-warm-700 hover:bg-warm-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-12 text-center rounded-xl border border-warm-100">
                <h3 className="text-xl font-medium text-warm-900 mb-2">No products found</h3>
                <p className="text-warm-500">Try adjusting your filters or search term.</p>
                <button 
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="mt-6 text-brand-600 font-medium hover:text-brand-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Shop;

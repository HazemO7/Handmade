import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBox, FiTag, FiShoppingBag, FiEye } from 'react-icons/fi';
import { productApi, categoryApi } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    totalCategories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.getAdminProducts({ limit: 1 }),
          categoryApi.getCategories()
        ]);
        
        const total = productsRes.pagination?.total || productsRes.data?.pagination?.total || 0;
        const productsList = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.products || []);
        const categoriesList = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data?.categories || []);
        
        setStats({
          totalProducts: total,
          publishedProducts: productsList.filter(p => p.status === 'PUBLISHED').length,
          totalCategories: categoriesList.length,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Products', stat: stats.totalProducts, icon: FiBox, color: 'bg-blue-500' },
    { name: 'Total Categories', stat: stats.totalCategories, icon: FiTag, color: 'bg-green-500' },
    { name: 'Active Orders', stat: 'Check WhatsApp', icon: FiShoppingBag, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-900 font-heading">Welcome back!</h1>
        <p className="text-sm text-warm-600 mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-warm-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${item.color}`}>
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-warm-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-2xl font-bold text-warm-900">
                        {isLoading ? '...' : item.stat}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-warm-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/products/new" className="flex items-center p-4 bg-white border border-warm-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
            <div className="p-2 bg-brand-50 text-brand-700 rounded-md group-hover:bg-brand-100 transition-colors">
              <FiBox className="w-5 h-5" />
            </div>
            <span className="ml-3 font-medium text-warm-700">Add New Product</span>
          </Link>
          <Link to="/admin/categories" className="flex items-center p-4 bg-white border border-warm-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
            <div className="p-2 bg-brand-50 text-brand-700 rounded-md group-hover:bg-brand-100 transition-colors">
              <FiTag className="w-5 h-5" />
            </div>
            <span className="ml-3 font-medium text-warm-700">Manage Categories</span>
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 bg-white border border-warm-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
            <div className="p-2 bg-brand-50 text-brand-700 rounded-md group-hover:bg-brand-100 transition-colors">
              <FiEye className="w-5 h-5" />
            </div>
            <span className="ml-3 font-medium text-warm-700">View Public Store</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

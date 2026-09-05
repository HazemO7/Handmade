import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      setIsLoading(true);
      const res = await productApi.getAdminProducts({ page, limit: 10, sort: '-createdAt' });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await productApi.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts(currentPage);
    } catch (error) {
      toast.error(error.error?.message || 'Failed to delete product');
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      await productApi.updateProduct(product.id, { status: newStatus });
      toast.success(`Product is now ${newStatus}`);
      fetchProducts(currentPage);
    } catch (error) {
      toast.error(error.error?.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-warm-900 font-heading">Products</h1>
          <p className="text-sm text-warm-600">Manage your store's inventory and listings.</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-700 hover:bg-brand-800 focus:outline-none"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-warm-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-warm-500">
            No products found. Start by adding a new one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-warm-200">
              <thead className="bg-warm-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-warm-200">
                {products.map((product) => {
                  const primaryImg = product.images?.find(i => i.isPrimary) || product.images?.[0];
                  const imgUrl = primaryImg?.processedUrl || primaryImg?.originalUrl || 'https://via.placeholder.com/40';
                  
                  return (
                    <tr key={product.id} className="hover:bg-warm-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-warm-100 rounded-md overflow-hidden">
                            <img className="h-10 w-10 object-cover" src={imgUrl} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-warm-900">{product.name}</div>
                            <div className="text-sm text-warm-500">{product.category?.name || 'Uncategorized'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-warm-900">{product.price} {product.currency}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${product.stock > 0 ? 'text-warm-900' : 'text-red-600 font-medium'}`}>
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(product)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            product.status === 'PUBLISHED' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-warm-100 text-warm-800 hover:bg-warm-200'
                          }`}
                        >
                          {product.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a 
                          href={`/product/${product.slug}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-warm-400 hover:text-brand-600 mr-3 inline-block"
                          title="View on Store"
                        >
                          <FiEye className="w-4 h-4" />
                        </a>
                        <Link 
                          to={`/admin/products/${product.id}/edit`} 
                          className="text-brand-600 hover:text-brand-900 mr-3 inline-block"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-600 hover:text-red-900 inline-block"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 bg-white border-t border-warm-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-warm-300 rounded-md text-sm font-medium text-warm-700 bg-white hover:bg-warm-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-warm-700">
              Page {currentPage} of {pagination.pages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
              disabled={currentPage === pagination.pages}
              className="px-3 py-1 border border-warm-300 rounded-md text-sm font-medium text-warm-700 bg-white hover:bg-warm-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;

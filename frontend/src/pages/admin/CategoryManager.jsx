import React, { useState, useEffect } from 'react';
import { categoryApi } from '../../services/api';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await categoryApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      if (isEditing) {
        await categoryApi.updateCategory(currentId, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryApi.createCategory(formData);
        toast.success('Category created successfully');
      }
      
      // Reset and refresh
      setFormData({ name: '', description: '' });
      setIsEditing(false);
      setCurrentId(null);
      await fetchCategories();
      
    } catch (error) {
      toast.error(error.error?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setCurrentId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await categoryApi.deleteCategory(id);
      toast.success('Category deleted successfully');
      await fetchCategories();
    } catch (error) {
      toast.error(error.error?.message || 'Failed to delete category');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-warm-900 font-heading">Categories</h1>
          <p className="text-sm text-warm-600">Manage your product categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-warm-200">
            <h2 className="text-lg font-medium text-warm-900 mb-4">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm p-2 border"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" isLoading={isSubmitting} fullWidth>
                  {isEditing ? 'Update' : 'Create'}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-warm-200 overflow-hidden">
            {isLoading ? (
              <div className="p-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center text-warm-500">
                No categories found. Create your first one!
              </div>
            ) : (
              <table className="min-w-full divide-y divide-warm-200">
                <thead className="bg-warm-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-warm-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-warm-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-warm-900">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-warm-500 truncate max-w-xs">{category.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warm-100 text-warm-800">
                          {category.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-brand-600 hover:text-brand-900 mr-4"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CategoryManager;

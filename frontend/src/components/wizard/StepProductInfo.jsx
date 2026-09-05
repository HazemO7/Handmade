import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categoryApi, productApi } from '../../services/api';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name cannot exceed 200 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  // Optional fields for now, can be enriched by AI later
  shortDescription: z.string().optional(),
  materials: z.string().optional(), // Will store as comma separated temporarily
});

const StepProductInfo = ({ productData, setProductData, onNext }) => {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: productData?.name || '',
      category: productData?.category?._id || productData?.category?.id || productData?.category || '',
      price: productData?.price || 0,
      stock: productData?.stock || 1,
      shortDescription: productData?.shortDescription || '',
      materials: productData?.materials?.join(', ') || '',
    }
  });

  useEffect(() => {
    categoryApi.getCategories().then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Parse materials into array
      const payload = {
        ...data,
        materials: data.materials ? data.materials.split(',').map(m => m.trim()).filter(Boolean) : [],
        status: 'DRAFT',
      };

      let savedProduct;
      if (productData?.id) {
        // Update existing draft
        const res = await productApi.updateProduct(productData.id, payload);
        savedProduct = res.data;
      } else {
        // Create new draft
        const res = await productApi.createProduct(payload);
        savedProduct = res.data;
      }

      setProductData(savedProduct);
      onNext();
    } catch (error) {
      toast.error(error.error?.message || 'Failed to save product info');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-warm-900 mb-1">Product Name *</label>
          <input
            {...register('name')}
            className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm ${errors.name ? 'border-red-500' : 'border-warm-300'}`}
            placeholder="e.g. Hand-painted Ceramic Vase"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-900 mb-1">Category *</label>
          <select
            {...register('category')}
            className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm ${errors.category ? 'border-red-500' : 'border-warm-300'}`}
          >
            <option value="">Select a category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-900 mb-1">Price (EGP) *</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm ${errors.price ? 'border-red-500' : 'border-warm-300'}`}
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-900 mb-1">Stock Quantity *</label>
          <input
            type="number"
            {...register('stock', { valueAsNumber: true })}
            className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm ${errors.stock ? 'border-red-500' : 'border-warm-300'}`}
          />
          {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-900 mb-1">Materials (comma separated)</label>
          <input
            {...register('materials')}
            className="w-full p-3 border border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            placeholder="e.g. Clay, Glaze, Ceramic"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-warm-900 mb-1">Short Description (Optional)</label>
          <textarea
            {...register('shortDescription')}
            rows={3}
            className="w-full p-3 border border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            placeholder="A brief summary. AI can generate this for you later."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-warm-200">
        <Button type="submit" isLoading={isSubmitting}>
          Save & Continue
        </Button>
      </div>
    </form>
  );
};

export default StepProductInfo;

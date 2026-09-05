import React, { useState } from 'react';
import { productApi } from '../../services/api';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { FiEdit2 } from 'react-icons/fi';

const StepReview = ({ productData, setProductData, onNext, onBack, onEditStep }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const res = await productApi.updateProduct(productData.id, { status: 'PUBLISHED' });
      setProductData(res.data);
      onNext();
    } catch (error) {
      toast.error(error.error?.message || 'Failed to publish product');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    // It's already saved as draft continuously in DB
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Product saved as draft');
      // Could redirect to product list here, but let's just show success
    }, 500);
  };

  if (!productData) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-warm-900">Review & Publish</h2>
        <p className="text-warm-600 mt-1">Check how your product will look to customers before making it live.</p>
      </div>

      <div className="bg-white rounded-xl border border-warm-200 overflow-hidden shadow-sm mb-8">
        {/* Mock Public Product Page Layout */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Gallery Preview */}
            <div className="relative group">
              <button onClick={() => onEditStep(2)} className="absolute top-2 right-2 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity z-10 text-brand-600">
                <FiEdit2 />
              </button>
              
              <div className="aspect-[4/5] bg-warm-100 rounded-lg overflow-hidden border border-warm-200">
                {productData.images && productData.images.length > 0 ? (
                  <img 
                    src={productData.images.find(i => i.isPrimary)?.processedUrl || productData.images[0].processedUrl || productData.images[0].originalUrl} 
                    alt="Main" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-warm-400">No Image</div>
                )}
              </div>
              {productData.images && productData.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {productData.images.map(img => (
                    <div key={img._id} className="w-16 h-16 rounded border border-warm-200 overflow-hidden flex-shrink-0">
                      <img src={img.processedUrl || img.originalUrl} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Preview */}
            <div className="relative group flex flex-col">
              <button onClick={() => onEditStep(1)} className="absolute top-0 right-0 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity z-10 text-brand-600">
                <FiEdit2 />
              </button>
              
              <div className="mb-2">
                <span className="text-xs font-medium text-brand-600 uppercase tracking-wider">
                  {productData.category?.name || 'Category'}
                </span>
              </div>
              <h1 className="text-3xl font-heading font-bold text-warm-900 mb-4">
                {productData.name || 'Product Name'}
              </h1>
              <p className="text-2xl text-brand-800 font-medium mb-6">
                {productData.price || 0} {productData.currency || 'EGP'}
              </p>
              
              <div className="relative group/content mb-8">
                <button onClick={() => onEditStep(4)} className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow opacity-0 group-hover/content:opacity-100 transition-opacity z-10 text-brand-600">
                  <FiEdit2 size={14}/>
                </button>
                <div className="prose prose-warm text-warm-700">
                  <p className="text-lg leading-relaxed">{productData.shortDescription || 'No short description provided.'}</p>
                </div>
                
                {productData.highlights && productData.highlights.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {productData.highlights.map((h, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-brand-500 mr-2">•</span>
                        <span className="text-warm-700">{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="mt-auto pt-6 border-t border-warm-100">
                <div className="w-full py-3 bg-green-600 text-white text-center font-medium rounded-md opacity-70 cursor-not-allowed">
                  Order via WhatsApp (Preview)
                </div>
              </div>
            </div>
          </div>
          
          {productData.description && (
            <div className="mt-12 pt-8 border-t border-warm-200">
              <h3 className="text-xl font-heading font-bold text-warm-900 mb-4">Product Details</h3>
              <div className="prose prose-warm max-w-none text-warm-700" dangerouslySetInnerHTML={{ __html: productData.description }} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleSaveDraft} isLoading={isSaving}>
            Save as Draft
          </Button>
          <Button onClick={handlePublish} isLoading={isPublishing}>
            Publish to Store
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepReview;

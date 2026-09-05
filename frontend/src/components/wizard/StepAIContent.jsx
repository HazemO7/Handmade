import React, { useState } from 'react';
import { aiApi, productApi } from '../../services/api';
import useAIJob from '../../hooks/useAIJob';
import Button from '../common/Button';
import AIJobStatus from '../admin/AIJobStatus';
import toast from 'react-hot-toast';
import { FiEdit3, FiCheck, FiZap } from 'react-icons/fi';

const StepAIContent = ({ productData, setProductData, onNext, onBack }) => {
  const [jobId, setJobId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  
  // Local editable state for content
  const [content, setContent] = useState({
    shortDescription: productData?.shortDescription || '',
    description: productData?.description || '',
    highlights: productData?.highlights ? productData.highlights.join('\n') : '',
    tags: productData?.tags ? productData.tags.join(', ') : '',
    seoTitle: productData?.seo?.title || '',
    seoDescription: productData?.seo?.description || '',
  });

  const { job, status, error, retryJob } = useAIJob(jobId, {
    onCompleted: (completedJob) => {
      // Pre-fill local state with generated content
      const generated = completedJob.result?.generatedContent || {};
      setContent({
        shortDescription: generated.shortDescription || '',
        description: generated.description || '',
        highlights: generated.highlights ? generated.highlights.join('\n') : '',
        tags: generated.tags ? generated.tags.join(', ') : '',
        seoTitle: generated.seo?.title || '',
        seoDescription: generated.seo?.description || '',
      });
      setIsManualEdit(true); // Allow them to tweak it immediately
      toast.success('Content generated successfully');
    }
  });

  const handleGenerate = async () => {
    try {
      const res = await aiApi.generateContent({
        productId: productData.id,
        productBasicInfo: {
          name: productData.name,
          category: productData.category?.name || productData.category,
          materials: productData.materials
        }
      });
      setJobId(res.data.id);
    } catch (err) {
      toast.error(err.error?.message || 'Failed to start AI generation');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveContent = async () => {
    try {
      setIsApplying(true);
      
      const payload = {
        shortDescription: content.shortDescription,
        description: content.description,
        highlights: content.highlights.split('\n').map(s => s.trim()).filter(Boolean),
        tags: content.tags.split(',').map(s => s.trim()).filter(Boolean),
        seo: {
          title: content.seoTitle,
          description: content.seoDescription
        }
      };

      const res = await productApi.updateProduct(productData.id, payload);
      setProductData(res.data);
      toast.success('Content saved');
      onNext();
    } catch (error) {
      toast.error(error.error?.message || 'Failed to save content');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-warm-900">AI Content Generation</h2>
        <p className="text-warm-600 mt-1">Generate beautiful product descriptions, highlights, and SEO tags automatically.</p>
      </div>

      {status === 'IDLE' && !isManualEdit && (
        <div className="text-center p-12 bg-warm-50 rounded-xl border border-warm-200">
          <FiZap className="w-12 h-12 text-brand-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-warm-900 mb-2">Write Product Copy</h3>
          <p className="text-warm-600 mb-6 max-w-md mx-auto">
            Our AI will write compelling marketing copy based on your product's name, category, and materials.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={handleGenerate} size="lg">
              <FiZap className="mr-2" /> Generate Content
            </Button>
            <Button variant="outline" size="lg" onClick={() => setIsManualEdit(true)}>
              <FiEdit3 className="mr-2" /> Write Manually
            </Button>
          </div>
        </div>
      )}

      {status === 'POLLING' && (
        <div className="max-w-md mx-auto">
          <AIJobStatus job={job} status={status} error={error} />
        </div>
      )}

      {status === 'FAILED' && (
        <div className="max-w-md mx-auto">
          <AIJobStatus job={job} status={status} error={error} onRetry={retryJob} />
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setIsManualEdit(true)}>
              Write Manually Instead
            </Button>
          </div>
        </div>
      )}

      {isManualEdit && (
        <div className="bg-white p-6 rounded-xl border border-warm-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-warm-900">Product Content</h3>
            {status === 'COMPLETED' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheck className="mr-1" /> AI Generated
              </span>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-warm-900 mb-1">Short Description</label>
            <textarea
              name="shortDescription"
              value={content.shortDescription}
              onChange={handleInputChange}
              rows={2}
              className="w-full p-3 border border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-900 mb-1">Full Description</label>
            <textarea
              name="description"
              value={content.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full p-3 border border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-900 mb-1">Highlights (One per line)</label>
            <textarea
              name="highlights"
              value={content.highlights}
              onChange={handleInputChange}
              rows={4}
              placeholder="e.g. Handmade with care&#10;Eco-friendly materials"
              className="w-full p-3 border border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-warm-100">
            <div>
              <label className="block text-sm font-medium text-warm-900 mb-1">SEO Title</label>
              <input
                type="text"
                name="seoTitle"
                value={content.seoTitle}
                onChange={handleInputChange}
                className="w-full p-3 border border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-900 mb-1">Tags (Comma separated)</label>
              <input
                type="text"
                name="tags"
                value={content.tags}
                onChange={handleInputChange}
                className="w-full p-3 border border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-warm-900 mb-1">SEO Description</label>
              <textarea
                name="seoDescription"
                value={content.seoDescription}
                onChange={handleInputChange}
                rows={2}
                className="w-full p-3 border border-warm-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-8 mt-8 border-t border-warm-200">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex space-x-3">
          {isManualEdit ? (
            <Button onClick={handleSaveContent} isLoading={isApplying}>
              Save & Continue
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => { setIsManualEdit(true); }}>
              Skip to Manual Entry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepAIContent;

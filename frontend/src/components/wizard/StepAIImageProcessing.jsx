import React, { useState } from 'react';
import { aiApi } from '../../services/api';
import useAIJob from '../../hooks/useAIJob';
import Button from '../common/Button';
import AIJobStatus from '../admin/AIJobStatus';
import toast from 'react-hot-toast';
import { FiZap } from 'react-icons/fi';

const ImageProcessorCard = ({ product, image, onImageProcessed }) => {
  const [jobId, setJobId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  
  const { job, status, error, retryJob } = useAIJob(jobId, {
    onCompleted: (completedJob) => {
      onImageProcessed(completedJob.result);
      toast.success('Image enhanced successfully');
    }
  });

  const handleProcess = async () => {
    try {
      setIsStarting(true);
      const prodId = product?.id || product?._id;
      const imgId = image?._id || image?.id;
      const imgUrl = image?.originalUrl;
      const pubId = image?.publicId || `img_${Date.now()}`;

      const res = await aiApi.processImage({
        productId: prodId,
        imageId: imgId,
        imageUrl: imgUrl,
        imagePublicId: pubId
      });
      
      const newJobId = res.data?.id || res.data?._id;
      if (newJobId) {
        setJobId(newJobId);
      }

      // If already completed synchronously
      if (res.data?.status === 'COMPLETED' && res.data?.result) {
        onImageProcessed(res.data.result);
        toast.success('Image enhanced successfully');
      }
    } catch (err) {
      toast.error(err.error?.message || 'Failed to start AI processing');
    } finally {
      setIsStarting(false);
    }
  };

  const isProcessed = !!image.processedUrl;

  return (
    <div className="border border-warm-200 rounded-xl p-4 bg-white mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Original */}
        <div>
          <h4 className="text-sm font-medium text-warm-700 mb-2">Original</h4>
          <div className="aspect-square bg-warm-100 rounded-lg overflow-hidden border border-warm-200">
            <img src={image.originalUrl} alt="Original" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* Processed / Status */}
        <div className="flex flex-col h-full">
          <h4 className="text-sm font-medium text-brand-700 mb-2">
            {isProcessed ? 'Enhanced' : 'AI Processing'}
          </h4>
          
          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
            {isProcessed ? (
              <div className="w-full aspect-square bg-warm-100 rounded-lg overflow-hidden border border-brand-300">
                <img src={image.processedUrl} alt="Enhanced" className="w-full h-full object-cover" />
              </div>
            ) : status === 'IDLE' ? (
              <div className="text-center p-6 bg-warm-50 rounded-lg border border-warm-200 w-full h-full flex flex-col items-center justify-center">
                <FiZap className="w-10 h-10 text-brand-400 mb-3" />
                <p className="text-sm text-warm-600 mb-4">Remove background and apply brand styling.</p>
                <Button onClick={handleProcess} isLoading={isStarting}>
                  Enhance Image
                </Button>
              </div>
            ) : (
              <div className="w-full">
                <AIJobStatus job={job} status={status} error={error} onRetry={retryJob} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StepAIImageProcessing = ({ productData, setProductData, onNext, onBack }) => {
  const images = productData?.images || [];

  const handleImageProcessed = (result) => {
    const targetUrl = result?.imageUrl || result?.processedUrl;
    if (!targetUrl) return;
    
    const updatedImages = images.map(img => {
      const isMatch = (result.imageId && (img._id === result.imageId || img.id === result.imageId)) ||
                      (img.originalUrl === result.originalUrl) ||
                      (images.length === 1);
      if (isMatch) {
        return { ...img, processedUrl: targetUrl };
      }
      return img;
    });
    
    setProductData(prev => ({ ...prev, images: updatedImages }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-warm-900">AI Image Enhancement</h2>
        <p className="text-warm-600 mt-1">Let AI automatically remove backgrounds and apply your brand's signature look.</p>
      </div>

      <div className="space-y-6">
        {images.map(image => (
          <ImageProcessorCard 
            key={image._id} 
            product={productData}
            image={image} 
            onImageProcessed={handleImageProcessed}
          />
        ))}
        
        {images.length === 0 && (
          <div className="text-center p-12 bg-warm-50 rounded-xl border border-warm-200">
            <p className="text-warm-500">No images to process.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-8 mt-8 border-t border-warm-200">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex space-x-3">
          <Button variant="ghost" onClick={onNext}>
            Skip for now
          </Button>
          <Button onClick={onNext}>
            Continue (AI Content)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepAIImageProcessing;

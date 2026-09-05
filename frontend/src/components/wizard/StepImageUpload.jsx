import React, { useState, useRef } from 'react';
import { productApi } from '../../services/api';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiTrash2, FiStar } from 'react-icons/fi';

const StepImageUpload = ({ productData, setProductData, onNext, onBack }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const images = productData?.images || [];

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed per product');
      return;
    }

    setIsUploading(true);
    let updatedProduct = null;

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        continue;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        continue;
      }

      try {
        const res = await productApi.uploadImage(productData.id, file);
        updatedProduct = res.data;
        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        toast.error(error.error?.message || `Failed to upload ${file.name}`);
      }
    }

    if (updatedProduct) {
      setProductData(updatedProduct);
    }
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      const res = await productApi.deleteImage(productData.id, imageId);
      setProductData(res.data);
      toast.success('Image deleted');
    } catch (error) {
      toast.error(error.error?.message || 'Failed to delete image');
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      // Create a copy of the images array and map it to update the isPrimary flag
      const updatedImages = images.map(img => ({
        ...img,
        isPrimary: img._id === imageId
      }));
      
      const res = await productApi.updateProduct(productData.id, { images: updatedImages });
      setProductData(res.data);
      toast.success('Primary image updated');
    } catch (error) {
      toast.error(error.error?.message || 'Failed to update primary image');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-warm-900">Upload Product Images</h2>
        <p className="text-warm-600 mt-1">Add up to 5 high-quality images. The first image will be used as the primary display.</p>
      </div>

      <div className="bg-warm-50 border-2 border-dashed border-warm-300 rounded-xl p-10 text-center hover:bg-warm-100 transition-colors cursor-pointer"
           onClick={() => fileInputRef.current?.click()}
      >
        <FiUploadCloud className="mx-auto h-12 w-12 text-warm-400 mb-4" />
        <span className="text-warm-700 font-medium block">Click to upload or drag and drop</span>
        <span className="text-warm-500 text-sm mt-1 block">PNG, JPG, WEBP up to 10MB</span>
        <input 
          type="file" 
          multiple 
          accept="image/jpeg, image/png, image/webp"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isUploading || images.length >= 5}
        />
      </div>

      {isUploading && (
        <div className="mt-4 text-center text-brand-600 font-medium flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading images...
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img._id} className={`relative group rounded-lg overflow-hidden border-2 ${img.isPrimary ? 'border-brand-500' : 'border-warm-200'}`}>
              <div className="aspect-square bg-warm-100">
                <img src={img.processedUrl || img.originalUrl} alt="Product" className="w-full h-full object-cover" />
              </div>
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSetPrimary(img._id); }}
                  className={`p-1.5 rounded-full ${img.isPrimary ? 'bg-brand-500 text-white' : 'bg-white text-warm-700 hover:bg-brand-100'}`}
                  title="Set as Primary"
                >
                  <FiStar className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(img._id); }}
                  className="p-1.5 rounded-full bg-white text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              
              {img.isPrimary && (
                <div className="absolute top-1 left-1 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-8 mt-8 border-t border-warm-200">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={images.length === 0}>
          Next Step (AI Enhance)
        </Button>
      </div>
    </div>
  );
};

export default StepImageUpload;

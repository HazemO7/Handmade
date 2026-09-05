import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiExternalLink, FiPlus, FiList } from 'react-icons/fi';
import Button from '../common/Button';

const StepPublish = ({ productData }) => {
  if (!productData) return null;

  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <div className="flex justify-center mb-6">
        <FiCheckCircle className="w-24 h-24 text-green-500" />
      </div>
      
      <h2 className="text-3xl font-heading font-bold text-warm-900 mb-4">
        Product Published!
      </h2>
      <p className="text-lg text-warm-600 mb-8 max-w-lg mx-auto">
        <span className="font-semibold text-warm-900">{productData.name}</span> is now live on your store and visible to customers.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a 
          href={`/product/${productData.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="w-full sm:w-auto text-brand-700 border-brand-700 hover:bg-brand-50">
            <FiExternalLink className="mr-2" /> View on Store
          </Button>
        </a>
        
        <Link to="/admin/products">
          <Button variant="secondary" className="w-full sm:w-auto">
            <FiList className="mr-2" /> Back to Products
          </Button>
        </Link>
        
        <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
          <FiPlus className="mr-2" /> Add Another Product
        </Button>
      </div>
    </div>
  );
};

export default StepPublish;

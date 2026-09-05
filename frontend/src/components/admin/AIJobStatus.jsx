import React from 'react';
import { FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

const AIJobStatus = ({ job, status, error, onRetry, className = '' }) => {
  if (!job && status === 'IDLE') return null;

  if (status === 'POLLING') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-blue-50 border border-blue-100 rounded-lg ${className}`}>
        <LoadingSpinner size="md" className="mb-4 text-blue-600" />
        <h3 className="text-lg font-medium text-blue-900 mb-1">AI Processing</h3>
        <p className="text-sm text-blue-700">{job?.progress?.stage || 'Initializing...'}</p>
        
        {job?.progress?.details && (
          <p className="text-xs text-blue-500 mt-2">{job.progress.details}</p>
        )}
      </div>
    );
  }

  if (status === 'COMPLETED') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-green-50 border border-green-100 rounded-lg ${className}`}>
        <FiCheckCircle className="w-10 h-10 text-green-500 mb-3" />
        <h3 className="text-lg font-medium text-green-900 mb-1">Processing Complete</h3>
        <p className="text-sm text-green-700">AI successfully enhanced your product.</p>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-red-50 border border-red-100 rounded-lg ${className}`}>
        <FiXCircle className="w-10 h-10 text-red-500 mb-3" />
        <h3 className="text-lg font-medium text-red-900 mb-1">Processing Failed</h3>
        <p className="text-sm text-red-700 mb-4">{error || job?.error || 'An unexpected error occurred.'}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="border-red-300 text-red-700 hover:bg-red-100">
            <FiRefreshCw className="mr-2" /> Retry Processing
          </Button>
        )}
      </div>
    );
  }

  return null;
};

export default AIJobStatus;

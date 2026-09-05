import { useState, useEffect, useRef } from 'react';
import { aiApi } from '../services/api';
import toast from 'react-hot-toast';

export const useAIJob = (initialJobId = null, options = {}) => {
  const { 
    pollingInterval = 2000, 
    onCompleted = null, 
    onFailed = null 
  } = options;

  const [jobId, setJobId] = useState(initialJobId);
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState('IDLE'); // IDLE, POLLING, COMPLETED, FAILED
  const [error, setError] = useState(null);
  
  const pollingRef = useRef(null);

  useEffect(() => {
    if (jobId && status !== 'COMPLETED' && status !== 'FAILED') {
      startPolling(jobId);
    }
    
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const startPolling = (currentJobId) => {
    stopPolling();
    setStatus('POLLING');
    
    // Immediate first fetch
    fetchJobStatus(currentJobId);
    
    // Then set interval
    pollingRef.current = setInterval(() => {
      fetchJobStatus(currentJobId);
    }, pollingInterval);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const fetchJobStatus = async (currentJobId) => {
    try {
      const res = await aiApi.getJobStatus(currentJobId);
      const currentJob = res.data;
      
      setJob(currentJob);
      
      if (currentJob.status === 'COMPLETED') {
        stopPolling();
        setStatus('COMPLETED');
        if (onCompleted) onCompleted(currentJob);
      } else if (currentJob.status === 'FAILED') {
        stopPolling();
        setStatus('FAILED');
        setError(currentJob.error || 'Job failed');
        if (onFailed) onFailed(currentJob);
      }
    } catch (err) {
      console.error('Error fetching job status:', err);
      // Don't stop polling on network error, but maybe track consecutive errors
      // In this simple version, we'll keep polling until backend says FAILED
    }
  };

  const retryJob = async () => {
    if (!jobId) return;
    try {
      setStatus('POLLING');
      setError(null);
      await aiApi.retryJob(jobId);
      startPolling(jobId);
    } catch (err) {
      toast.error(err.error?.message || 'Failed to retry job');
    }
  };

  return {
    jobId,
    setJobId,
    job,
    status,
    isLoading: status === 'POLLING',
    isCompleted: status === 'COMPLETED',
    isFailed: status === 'FAILED',
    error,
    retryJob
  };
};

export default useAIJob;

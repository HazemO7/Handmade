const AIJob = require('./aiJob.model');
const Product = require('../products/product.model');
const BrandSettings = require('../settings/settings.model');
const imageProcessor = require('./imageProcessor.service');
const AppError = require('../../common/errors/AppError');
// Assuming we might need to download the processed URL and upload to Cloudinary, 
// but since we are mocking, we can just save the URL. In real life we'd re-upload.

/**
 * Async worker to process the image job.
 * Note: This runs in the background and catches its own errors to update the job.
 */
const processImageJob = async (jobId) => {
  try {
    const job = await AIJob.findById(jobId);
    if (!job) return;

    // Mark as processing
    job.status = 'PROCESSING';
    await job.save();

    const { imageUrl, imagePublicId, imageId } = job.input;

    // Fetch brand settings
    const brandSettings = await BrandSettings.getSettings();

    // Call AI Processor
    const processedUrl = await imageProcessor.processImage(imageUrl, brandSettings);

    // In a full real app, we would download `processedUrl` and re-upload to our Cloudinary bucket here.
    // For now, we will just update the product with the new URL.

    const product = await Product.findById(job.product);
    if (product) {
      // Find the specific image in the product's array
      const imageDoc = product.images.id(imageId);
      if (imageDoc) {
        imageDoc.processedUrl = processedUrl;
        await product.save();
      }
    }

    job.status = 'COMPLETED';
    job.result = { processedUrl };
    job.completedAt = new Date();
    await job.save();

  } catch (error) {
    console.error(`AI Job ${jobId} failed:`, error);
    try {
      const job = await AIJob.findById(jobId);
      if (job) {
        job.status = 'FAILED';
        job.error = error.message || 'Unknown processing error';
        await job.save();
      }
    } catch (saveError) {
      console.error('Failed to update job status to FAILED', saveError);
    }
  }
};

/**
 * Create a new AI Image Processing job
 */
const createImageProcessingJob = async (productId, imageId, imageUrl, imagePublicId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Create job document
  const job = await AIJob.create({
    type: 'IMAGE_PROCESSING',
    status: 'PENDING',
    product: productId,
    input: {
      imageId,
      imageUrl,
      imagePublicId,
    },
  });

  // Fire and forget
  processImageJob(job._id).catch(err => console.error('Background job invocation failed:', err));

  return job;
};

/**
 * Get job status by ID
 */
const getJobStatus = async (jobId) => {
  const job = await AIJob.findById(jobId);
  if (!job) {
    throw new AppError('AI Job not found', 404);
  }
  return job;
};

/**
 * Retry a failed job
 */
const retryJob = async (jobId) => {
  const job = await AIJob.findById(jobId);
  if (!job) {
    throw new AppError('AI Job not found', 404);
  }

  if (job.status !== 'FAILED') {
    throw new AppError('Only failed jobs can be retried', 400);
  }

  if (job.retryCount >= job.maxRetries) {
    throw new AppError('Max retries exceeded for this job', 400);
  }

  job.status = 'PENDING';
  job.retryCount += 1;
  job.error = '';
  await job.save();

  // Fire and forget
  processImageJob(job._id).catch(err => console.error('Background job invocation failed:', err));

  return job;
};

module.exports = {
  createImageProcessingJob,
  processImageJob,
  getJobStatus,
  retryJob,
};

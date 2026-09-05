const AIJob = require('./aiJob.model');
const Product = require('../products/product.model');
const BrandSettings = require('../settings/settings.model');
const imageProcessor = require('./imageProcessor.service');
const contentGenerator = require('./contentGenerator.service');
const AppError = require('../../common/errors/AppError');

/**
 * Async worker to process the image job.
 */
const processImageJob = async (jobId) => {
  // ... existing code ...
  try {
    const job = await AIJob.findById(jobId);
    if (!job) return;

    job.status = 'PROCESSING';
    await job.save();

    const { imageUrl, imagePublicId, imageId } = job.input;
    const brandSettings = await BrandSettings.getSettings();
    const processedUrl = await imageProcessor.processImage(imageUrl, brandSettings);

    const product = await Product.findById(job.product);
    if (product) {
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
    console.error(`AI Image Job ${jobId} failed:`, error);
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
 * Async worker to process the content generation job.
 */
const processContentJob = async (jobId) => {
  try {
    const job = await AIJob.findById(jobId);
    if (!job) return;

    job.status = 'PROCESSING';
    await job.save();

    const { productBasicInfo } = job.input;
    const brandSettings = await BrandSettings.getSettings();
    
    // Generate content
    const generatedContent = await contentGenerator.generateContent(productBasicInfo, brandSettings);

    // Save result to job (do not automatically update product, requires admin review/apply)
    job.status = 'COMPLETED';
    job.result = generatedContent;
    job.completedAt = new Date();
    await job.save();

  } catch (error) {
    console.error(`AI Content Job ${jobId} failed:`, error);
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
  if (!product) throw new AppError('Product not found', 404);

  const job = await AIJob.create({
    type: 'IMAGE_PROCESSING',
    status: 'PENDING',
    product: productId,
    input: { imageId, imageUrl, imagePublicId },
  });

  processImageJob(job._id).catch(err => console.error('Background job invocation failed:', err));
  return job;
};

/**
 * Create a new AI Content Generation job
 */
const createContentGenerationJob = async (productId, productBasicInfo) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  const job = await AIJob.create({
    type: 'CONTENT_GENERATION',
    status: 'PENDING',
    product: productId,
    input: { productBasicInfo },
  });

  processContentJob(job._id).catch(err => console.error('Background job invocation failed:', err));
  return job;
};

/**
 * Get job status by ID
 */
const getJobStatus = async (jobId) => {
  const job = await AIJob.findById(jobId);
  if (!job) throw new AppError('AI Job not found', 404);
  return job;
};

/**
 * Retry a failed job
 */
const retryJob = async (jobId) => {
  const job = await AIJob.findById(jobId);
  if (!job) throw new AppError('AI Job not found', 404);

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

  if (job.type === 'IMAGE_PROCESSING') {
    processImageJob(job._id).catch(err => console.error('Background job invocation failed:', err));
  } else if (job.type === 'CONTENT_GENERATION') {
    processContentJob(job._id).catch(err => console.error('Background job invocation failed:', err));
  }

  return job;
};

/**
 * Apply content from a completed AI Content Generation job to a product
 */
const applyContentJob = async (jobId) => {
  const job = await AIJob.findById(jobId);
  if (!job) throw new AppError('AI Job not found', 404);

  if (job.type !== 'CONTENT_GENERATION' || job.status !== 'COMPLETED') {
    throw new AppError('Only completed content generation jobs can be applied', 400);
  }

  const product = await Product.findById(job.product);
  if (!product) throw new AppError('Product not found', 404);

  const content = job.result;
  
  if (content.shortDescription) product.shortDescription = content.shortDescription;
  if (content.description) product.description = content.description;
  if (content.highlights) product.highlights = content.highlights;
  if (content.features) product.features = content.features;
  if (content.tags) product.tags = content.tags;
  if (content.seo) {
    product.seo = {
      title: content.seo.title || product.seo?.title,
      description: content.seo.description || product.seo?.description,
    };
  }

  await product.save();
  return { product, job };
};

module.exports = {
  createImageProcessingJob,
  createContentGenerationJob,
  getJobStatus,
  retryJob,
  applyContentJob,
};

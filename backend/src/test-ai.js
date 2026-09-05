const request = require('supertest');
const mongoose = require('mongoose');
const sinon = require('sinon');
const app = require('./app');
const env = require('./config/env');
const User = require('./modules/users/user.model');
const Product = require('./modules/products/product.model');
const AIJob = require('./modules/ai/aiJob.model');
const BrandSettings = require('./modules/settings/settings.model');
const imageProcessor = require('./modules/ai/imageProcessor.service');
const { generateToken } = require('./modules/auth/auth.service');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runAITests() {
  console.log('--- Starting Phase 8 AI Verification ---');
  let adminToken, productId, imageId;

  // We will stub the processor slightly to control success/failure
  let processStub = sinon.stub(imageProcessor, 'processImage');
  
  try {
    await mongoose.connect(env.MONGODB_URI);
    
    // Cleanup
    await User.deleteMany({ email: 'admin@ai.com' });
    await Product.deleteMany({ name: 'AI Product' });
    await AIJob.deleteMany({});
    await BrandSettings.deleteMany({});
    
    // Setup Admin
    const admin = await User.create({ name: 'Admin', email: 'admin@ai.com', password: 'password', role: 'admin' });
    adminToken = generateToken(admin._id, admin.role);

    // Create a dummy Category via Mongoose just for product requirements (schema takes category)
    const Category = require('./modules/categories/category.model');
    const cat = await Category.create({ name: 'AI Category' });

    // Create Product with dummy image
    const prod = await Product.create({
      name: 'AI Product',
      price: 100,
      stock: 10,
      category: cat._id,
      images: [
        { originalUrl: 'http://test.com/img.jpg', publicId: 'test_public_id' }
      ]
    });
    productId = prod._id;
    imageId = prod.images[0]._id;

    // --- TEST 1: Job Creation & Completion (Success) ---
    console.log('\n[1/4] Testing async job creation...');
    processStub.resolves('http://test.com/processed.jpg');

    let res = await request(app)
      .post('/api/ai/image-process')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        productId,
        imageId,
        imageUrl: 'http://test.com/img.jpg',
        imagePublicId: 'test_public_id'
      });
      
    if (res.statusCode !== 202 || res.body.data.status !== 'PENDING') {
      throw new Error('Failed to create job or status is not PENDING');
    }
    const jobId = res.body.data.id;
    console.log('✅ Job created with 202 and PENDING status.');

    console.log('\n[2/4] Testing async completion polling...');
    // Give background process a little time to run
    await wait(200);
    
    res = await request(app)
      .get(`/api/ai/jobs/${jobId}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    if (res.body.data.status !== 'COMPLETED') {
      throw new Error(`Expected COMPLETED, got ${res.body.data.status}`);
    }
    
    const updatedProd = await Product.findById(productId);
    if (updatedProd.images[0].processedUrl !== 'http://test.com/processed.jpg') {
      throw new Error('Product image was not updated with processed URL');
    }
    console.log('✅ Polling confirmed COMPLETED and Product was updated.');

    // --- TEST 2: Job Failure & Retry ---
    console.log('\n[3/4] Testing AI failure handling...');
    // Make the mock fail
    processStub.rejects(new Error('Mocked AI Failure'));
    
    res = await request(app)
      .post('/api/ai/image-process')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        productId,
        imageId,
        imageUrl: 'http://test.com/img.jpg',
        imagePublicId: 'test_public_id'
      });
      
    const failJobId = res.body.data.id;
    
    // Wait for background process to fail
    await wait(200);
    
    res = await request(app)
      .get(`/api/ai/jobs/${failJobId}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    if (res.body.data.status !== 'FAILED' || !res.body.data.error.includes('Mocked AI Failure')) {
      throw new Error('Job did not transition to FAILED correctly with error message');
    }
    console.log('✅ Failure properly caught and status set to FAILED.');

    console.log('\n[4/4] Testing retry mechanism...');
    // Fix the mock
    processStub.resolves('http://test.com/retried.jpg');
    
    res = await request(app)
      .post(`/api/ai/jobs/${failJobId}/retry`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    if (res.statusCode !== 202 || res.body.data.status !== 'PENDING' || res.body.data.retryCount !== 1) {
      throw new Error('Retry failed to reset status or increment retryCount');
    }

    // Wait for background process to succeed
    await wait(200);
    
    res = await request(app)
      .get(`/api/ai/jobs/${failJobId}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    if (res.body.data.status !== 'COMPLETED') {
      throw new Error(`Expected retry to complete, got ${res.body.data.status}`);
    }
    console.log('✅ Retry succeeded and job completed successfully.');

    console.log('\n🎉 ALL PHASE 8 AI REQUIREMENTS VERIFIED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    processStub.restore();
    await User.deleteMany({ email: 'admin@ai.com' });
    await mongoose.connection.close();
  }
}

runAITests();

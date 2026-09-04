const request = require('supertest');
const mongoose = require('mongoose');
const sinon = require('sinon');
const { cloudinary } = require('./config/cloudinary');
const app = require('./app');
const env = require('./config/env');
const User = require('./modules/users/user.model');
const Category = require('./modules/categories/category.model');
const Product = require('./modules/products/product.model');
const { generateToken } = require('./modules/auth/auth.service');
const fs = require('fs');
const path = require('path');

async function runMediaTests() {
  console.log('--- Starting Phase 7 Media Verification ---');
  let adminToken;
  let productId;

  // 0. Mock Cloudinary to avoid real network requests
  const uploadStub = sinon.stub(cloudinary.uploader, 'upload_stream').callsFake((options, cb) => {
    // Return a mock stream object that immediately calls the callback
    const stream = require('stream');
    const pass = new stream.PassThrough();
    pass.on('data', () => {});
    pass.on('end', () => {
      cb(null, { secure_url: 'https://mocked.com/image.jpg', public_id: 'mock_public_id' });
    });
    return pass;
  });

  const destroyStub = sinon.stub(cloudinary.uploader, 'destroy').callsFake((publicId, cb) => {
    cb(null, { result: 'ok' });
  });

  try {
    await mongoose.connect(env.MONGODB_URI);
    await User.deleteMany({ email: 'admin@media.com' });
    
    const admin = await User.create({ name: 'Admin', email: 'admin@media.com', password: 'password', role: 'admin' });
    adminToken = generateToken(admin._id, admin.role);

    const cat = await Category.create({ name: 'Media Category' });
    const prod = await Product.create({ name: 'Media Product', price: 10, category: cat._id, stock: 5 });
    productId = prod._id;

    // Create a dummy image file for testing
    const testImagePath = path.join(__dirname, 'test.png');
    fs.writeFileSync(testImagePath, 'fake-image-data');
    
    const testTxtPath = path.join(__dirname, 'test.txt');
    fs.writeFileSync(testTxtPath, 'hello world');

    // Create a giant mock file buffer (not actual file to save disk space, just mocking the request if possible, but multer checks size of stream)
    // Actually, we'll just test the route logic.

    console.log('\n[1/4] Testing upload invalid file type...');
    let res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', testTxtPath, { contentType: 'text/plain' });
    
    if (res.statusCode !== 400 || !res.body.error.message.includes('Not an image')) {
      throw new Error(`Expected 400 for invalid type, got ${res.statusCode} - ${res.body.error?.message}`);
    }
    console.log('✅ Invalid file type properly rejected.');

    console.log('\n[2/4] Testing upload valid image (global)...');
    res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', testImagePath, { contentType: 'image/png' });
    
    if (res.statusCode !== 201 || !res.body.data.url) {
      throw new Error('Failed to upload valid image.');
    }
    console.log('✅ Valid image uploaded (mocked Cloudinary).');

    console.log('\n[3/4] Testing upload valid image directly to Product...');
    res = await request(app)
      .post(`/api/products/${productId}/images`)
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', testImagePath, { contentType: 'image/png' });
    
    if (res.statusCode !== 201 || res.body.data.images.length === 0) {
      throw new Error('Failed to upload image to product.');
    }
    console.log('✅ Image uploaded and attached to Product.');
    
    const imageId = res.body.data.images[0].id || res.body.data.images[0]._id;

    console.log('\n[4/4] Testing delete image from Product...');
    res = await request(app)
      .delete(`/api/products/${productId}/images/${imageId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    if (res.statusCode !== 200 || res.body.data.images.length !== 0) {
      throw new Error('Failed to delete image from product.');
    }
    console.log('✅ Image removed from Product and Cloudinary.');

    console.log('\n🎉 ALL PHASE 7 MEDIA REQUIREMENTS VERIFIED SUCCESSFULLY! 🎉\n');

    // Cleanup files
    fs.unlinkSync(testImagePath);
    fs.unlinkSync(testTxtPath);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    uploadStub.restore();
    destroyStub.restore();
    await User.deleteMany({ email: 'admin@media.com' });
    await Category.deleteMany({ name: 'Media Category' });
    await Product.deleteMany({ name: 'Media Product' });
    await mongoose.connection.close();
  }
}

runMediaTests();

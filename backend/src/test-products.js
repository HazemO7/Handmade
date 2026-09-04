const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const User = require('./modules/users/user.model');
const Category = require('./modules/categories/category.model');
const Product = require('./modules/products/product.model');
const { generateToken } = require('./modules/auth/auth.service');

async function runProductTests() {
  console.log('--- Starting Phase 6 Product Management Verification ---');
  let testAdmin, adminToken;
  let categoryId;
  let productId;

  try {
    await mongoose.connect(env.MONGODB_URI);
    
    // Cleanup
    await User.deleteMany({ email: 'admin@prod.com' });
    await Category.deleteMany({ name: 'Test Product Category' });
    await Product.deleteMany({ name: { $regex: 'Test Product' } });

    testAdmin = await User.create({ name: 'Admin', email: 'admin@prod.com', password: 'password', role: 'admin' });
    adminToken = generateToken(testAdmin._id, testAdmin.role);

    // Create a category
    const catRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Product Category' });
    categoryId = catRes.body.data.id;

    // 1. Create Product -> DRAFT
    console.log('\n[1/6] Testing create product...');
    let res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product 1',
        price: 150.50,
        category: categoryId,
        stock: 10,
        description: 'A beautiful handmade item'
      });
    
    if (res.statusCode !== 201 || res.body.data.status !== 'DRAFT') {
      throw new Error(`Product creation failed or not DRAFT. Status: ${res.statusCode}`);
    }
    productId = res.body.data.id;
    console.log('✅ Product created successfully in DRAFT status.');

    // 2. Publish without image -> 400
    console.log('\n[2/6] Testing publish product without image...');
    res = await request(app)
      .post(`/api/products/${productId}/publish`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    if (res.statusCode !== 400) {
      throw new Error(`Expected 400 when publishing without image, got ${res.statusCode}`);
    }
    console.log('✅ Publish properly rejected due to missing image.');

    // Add a fake image directly to bypass media upload phase for now
    await Product.findByIdAndUpdate(productId, {
      $push: { images: { originalUrl: 'http://test.com/img.jpg', publicId: 'test_id' } }
    });

    // Publish with image
    res = await request(app)
      .post(`/api/products/${productId}/publish`)
      .set('Authorization', `Bearer ${adminToken}`);
    if (res.statusCode !== 200 || res.body.data.status !== 'PUBLISHED') {
      throw new Error('Failed to publish product even with image.');
    }

    // 3. Public GET products -> only PUBLISHED
    console.log('\n[3/6] Testing public GET products (PUBLISHED only)...');
    // Create a draft product
    await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Product 2', price: 100, category: categoryId, stock: 5 });
    
    res = await request(app).get('/api/products');
    if (res.statusCode !== 200) throw new Error('Public GET failed');
    
    const products = res.body.data;
    if (products.some(p => p.status !== 'PUBLISHED')) {
      throw new Error('Public GET returned non-published products!');
    }
    if (products.some(p => p.name === 'Test Product 2')) {
      throw new Error('Public GET returned Draft product!');
    }
    console.log('✅ Public GET returns ONLY PUBLISHED products.');

    // 4. Text Search
    console.log('\n[4/6] Testing text search...');
    res = await request(app).get('/api/products?search=beautiful');
    if (res.statusCode !== 200 || res.body.data.length === 0) {
      throw new Error('Text search failed to find product with word "beautiful".');
    }
    console.log('✅ Text search working correctly.');

    // 5. Filter by category
    console.log('\n[5/6] Testing category filter...');
    res = await request(app).get(`/api/products?category=${categoryId}`);
    if (res.statusCode !== 200 || res.body.data.length === 0) {
      throw new Error('Category filter failed.');
    }
    console.log('✅ Category filter working correctly.');

    // 6. Pagination
    console.log('\n[6/6] Testing pagination metadata...');
    if (!res.body.pagination || res.body.pagination.page !== 1 || res.body.pagination.limit !== 12 || res.body.pagination.total === undefined) {
      throw new Error('Pagination metadata is missing or incorrect.');
    }
    console.log('✅ Pagination metadata included correctly.');

    // 7. Verify category population
    console.log('\n[7/7] Testing category population...');
    if (!res.body.data[0].category || typeof res.body.data[0].category !== 'object' || !res.body.data[0].category.name) {
      throw new Error('Category is not populated.');
    }
    console.log('✅ Category is populated with object (name, slug, _id).');

    console.log('\n🎉 ALL PHASE 6 PRODUCT REQUIREMENTS VERIFIED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await User.deleteMany({ email: 'admin@prod.com' });
    await Category.deleteMany({ name: 'Test Product Category' });
    await Product.deleteMany({ name: { $regex: 'Test Product' } });
    await mongoose.connection.close();
  }
}

runProductTests();

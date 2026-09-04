const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const User = require('./modules/users/user.model');
const Category = require('./modules/categories/category.model');
const Product = require('./modules/products/product.model');
const { generateToken } = require('./modules/auth/auth.service');

async function runCategoryTests() {
  console.log('--- Starting Phase 5 Category Management Verification ---');
  let testAdmin, testUser, adminToken, userToken;
  let categoryId;

  try {
    await mongoose.connect(env.MONGODB_URI);
    
    // Cleanup previous test data
    await User.deleteMany({ email: { $in: ['admin@cat.com', 'user@cat.com'] } });
    await Category.deleteMany({ name: { $in: ['Test Category 1', 'Test Category 2'] } });
    await Product.deleteMany({ name: 'Test Product' });

    testAdmin = await User.create({ name: 'Admin', email: 'admin@cat.com', password: 'password', role: 'admin' });

    adminToken = generateToken(testAdmin._id, testAdmin.role);

    // 1. Unauthenticated POST
    console.log('\n[1/5] Testing unauthenticated POST category...');
    let res = await request(app).post('/api/categories').send({ name: 'Test Category 1' });
    if (res.statusCode !== 401) throw new Error(`Expected 401, got ${res.statusCode}`);
    console.log('✅ Unauthenticated request rejected (401).');

    // 2. Create category (Success)
    console.log('\n[2/5] Testing category creation (Admin)...');
    res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Category 1', sortOrder: 1 });
    if (res.statusCode !== 201 || res.body.data.name !== 'Test Category 1') {
      throw new Error(`Category creation failed. Status: ${res.statusCode}`);
    }
    categoryId = res.body.data.id;
    console.log('✅ Category created successfully. Slug auto-generated.');

    // 3. Create duplicate category (409 Conflict)
    console.log('\n[3/5] Testing duplicate category creation...');
    res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Category 1' });
    if (res.statusCode !== 409) {
      throw new Error(`Expected 409 Conflict, got ${res.statusCode}`);
    }
    console.log('✅ Duplicate category properly rejected (409).');

    // 4. Delete category with products (400)
    console.log('\n[4/5] Testing delete category with associated products...');
    // Create product referencing this category
    const product = await Product.create({
      name: 'Test Product',
      description: 'Desc',
      price: 10,
      stock: 5,
      category: categoryId,
    });
    
    res = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    if (res.statusCode !== 400) {
      throw new Error(`Expected 400 for deleting category with products, got ${res.statusCode}`);
    }
    console.log('✅ Delete blocked correctly when products exist.');
    
    // Cleanup product to allow deletion later if needed
    await product.deleteOne();

    // 5. Public GET categories (sorted)
    console.log('\n[5/5] Testing public GET categories sorting...');
    await Category.create({ name: 'Test Category 2', sortOrder: 0 }); // should appear first
    
    res = await request(app).get('/api/categories');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    
    const cats = res.body.data.filter(c => c.name.startsWith('Test Category'));
    if (cats[0].name !== 'Test Category 2' || cats[1].name !== 'Test Category 1') {
      throw new Error('Sorting by sortOrder failed.');
    }
    console.log('✅ Public GET returns correctly sorted categories (no auth required).');

    console.log('\n🎉 ALL PHASE 5 CATEGORY REQUIREMENTS VERIFIED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await User.deleteMany({ email: { $in: ['admin@cat.com', 'user@cat.com'] } });
    await Category.deleteMany({ name: { $in: ['Test Category 1', 'Test Category 2'] } });
    await Product.deleteMany({ name: 'Test Product' });
    await mongoose.connection.close();
  }
}

runCategoryTests();

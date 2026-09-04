const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const User = require('./modules/users/user.model');

async function runAuthTests() {
  console.log('--- Starting Phase 4 Authentication Verification ---');

  let testUser;
  
  try {
    // 1. Connect to DB
    await mongoose.connect(env.MONGODB_URI);
    console.log('📦 Connected to MongoDB for testing.');

    // 2. Create test user
    await User.deleteMany({ email: 'testadmin@example.com' });
    testUser = await User.create({
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: 'password123',
      role: 'admin',
    });
    console.log('👤 Test user created.');

    // 3. Test Invalid Login
    console.log('\n[1/5] Testing Login with Invalid Credentials...');
    let res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@example.com', password: 'wrongpassword' });
    
    if (res.statusCode !== 401 || res.body.success !== false) {
      throw new Error(`Invalid login check failed. Status: ${res.statusCode}`);
    }
    console.log('✅ Invalid login rejected (401).');

    // 4. Test Valid Login
    console.log('\n[2/5] Testing Login with Valid Credentials...');
    res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@example.com', password: 'password123' });
    
    if (res.statusCode !== 200 || !res.body.success || !res.body.data.token) {
      throw new Error(`Valid login failed. Status: ${res.statusCode}`);
    }
    const token = res.body.data.token;
    console.log('✅ Valid login succeeded. Token generated.');

    // 5. Test GET /me with Valid Token
    console.log('\n[3/5] Testing GET /me with Valid Token...');
    res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    if (res.statusCode !== 200 || !res.body.success || res.body.data.user.email !== 'testadmin@example.com') {
      throw new Error(`GET /me failed. Status: ${res.statusCode}`);
    }
    // Verify password is NOT returned
    if (res.body.data.user.password) {
      throw new Error(`GET /me is returning the user's password!`);
    }
    console.log('✅ GET /me succeeded (Password omitted).');

    // 6. Test GET /me with Invalid Token
    console.log('\n[4/5] Testing GET /me with Invalid Token...');
    res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer invalidtoken`);
    
    if (res.statusCode !== 401 || res.body.success !== false) {
      throw new Error(`Invalid token check failed. Status: ${res.statusCode}`);
    }
    console.log('✅ Invalid token rejected (401).');

    // 7. Test Rate Limiter (5 attempts allowed, 6th should be blocked)
    console.log('\n[5/5] Testing Rate Limiter (Max 5 attempts)...');
    
    // We already used 2 login requests (1 invalid, 1 valid) from the same IP (127.0.0.1 via supertest usually)
    // So 3 more allowed, 4th should fail with 429.
    for (let i = 0; i < 3; i++) {
      await request(app).post('/api/auth/login').send({ email: 'fake@example.com', password: 'fake' });
    }
    
    // This one should be rate limited
    res = await request(app).post('/api/auth/login').send({ email: 'fake@example.com', password: 'fake' });
    if (res.statusCode !== 429) {
      throw new Error(`Rate limiter failed. Expected 429, got ${res.statusCode}`);
    }
    console.log('✅ Rate limiter works (429 Too Many Requests).');

    console.log('\n🎉 ALL PHASE 4 AUTHENTICATION REQUIREMENTS VERIFIED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    if (testUser) {
      await User.deleteOne({ _id: testUser._id });
      console.log('🧹 Test user cleaned up.');
    }
    await mongoose.connection.close();
  }
}

runAuthTests();

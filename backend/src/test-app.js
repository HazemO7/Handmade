const request = require('supertest');
const app = require('./app');

async function runTests() {
  console.log('--- Starting Phase 3 App Verification ---');
  
  try {
    // 1. Test Health Check
    console.log('\n[1/4] Testing Health Check Route...');
    let res = await request(app).get('/api/health');
    if (res.statusCode !== 200 || !res.body.success || res.body.data.status !== 'ok') {
      throw new Error(`Health check failed. Status: ${res.statusCode}, Body: ${JSON.stringify(res.body)}`);
    }
    console.log('✅ Health check route passed.');

    // 2. Test 404 Route
    console.log('\n[2/4] Testing Unknown Route (404)...');
    res = await request(app).get('/api/nonexistent');
    if (res.statusCode !== 404 || res.body.success !== false) {
      throw new Error(`404 check failed. Status: ${res.statusCode}, Body: ${JSON.stringify(res.body)}`);
    }
    if (!res.body.error.message.includes('Route not found')) {
      throw new Error('404 message incorrect.');
    }
    console.log('✅ 404 handler passed.');

    // 3. Test Invalid JSON Body
    console.log('\n[3/4] Testing Invalid JSON Body...');
    res = await request(app)
      .post('/api/health') // any route that might parse body
      .set('Content-Type', 'application/json')
      .send('{"invalid_json": true, }'); // trailing comma is invalid json
    
    // express.json() throws a 400 Bad Request error for malformed JSON
    if (res.statusCode !== 400 || res.body.success !== false) {
      throw new Error(`Invalid JSON body check failed. Status: ${res.statusCode}, Body: ${JSON.stringify(res.body)}`);
    }
    console.log('✅ Invalid JSON handling passed.');

    // 4. Test Intentional Error with asyncHandler (Simulated)
    console.log('\n[4/4] Testing Custom Error Handler...');
    // test-error route is added in routes/index.js if NODE_ENV === 'development'
    res = await request(app).get('/api/test-error');
    if (res.statusCode !== 403 || res.body.success !== false || res.body.error.message !== 'This is an intentional test error') {
      throw new Error(`Custom error check failed. Status: ${res.statusCode}, Body: ${JSON.stringify(res.body)}`);
    }
    console.log('✅ Custom error handler and asyncHandler passed.');

    console.log('\n🎉 ALL PHASE 3 MIDDLEWARE & UTILS VERIFIED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

runTests();

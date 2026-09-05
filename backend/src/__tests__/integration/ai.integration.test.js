const request = require('supertest');
const app = require('../../app');
const User = require('../../modules/users/user.model');
const Product = require('../../modules/products/product.model');
const AIJob = require('../../modules/ai/aiJob.model');
const Category = require('../../modules/categories/category.model');

describe('AI Integration Tests', () => {
  let token;
  let productId;

  beforeEach(async () => {
    const user = new User({
      name: 'Admin',
      email: 'admin@handmade.com',
      password: 'Password123!',
      role: 'admin'
    });
    await user.save();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@handmade.com', password: 'Password123!' });
    
    token = loginRes.body.data.token;

    const category = await Category.create({ name: 'Test', slug: 'test' });

    const product = await Product.create({
      name: 'Test Bag',
      slug: 'test-bag',
      price: 100,
      category: category._id,
      stock: 1
    });
    productId = product._id;
  });

  describe('AI Job Status Polling', () => {
    it('should return 404 for non-existent job', async () => {
      const fakeId = '5f8d04f1b54764421b7156d0'; // random valid ObjectId
      const res = await request(app)
        .get(`/api/ai/jobs/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return job details for valid job', async () => {
      const job = await AIJob.create({
        type: 'CONTENT_GENERATION',
        status: 'PENDING',
        product: productId,
        input: { name: 'Test Bag' }
      });

      const res = await request(app)
        .get(`/api/ai/jobs/${job._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe('CONTENT_GENERATION');
      expect(res.body.data.status).toBe('PENDING');
    });
  });
});

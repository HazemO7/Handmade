const request = require('supertest');
const app = require('../../app');
const User = require('../../modules/users/user.model');
const Category = require('../../modules/categories/category.model');

describe('Categories Integration Tests', () => {
  let token;
  let adminId;

  beforeEach(async () => {
    // Setup admin user and get token
    const user = new User({
      name: 'Admin',
      email: 'admin@handmade.com',
      password: 'Password123!',
      role: 'admin'
    });
    await user.save();
    adminId = user._id;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@handmade.com', password: 'Password123!' });
    
    token = loginRes.body.data.token;
  });

  describe('POST /api/categories', () => {
    it('should create a category as admin', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Crochet Bags',
          description: 'Handmade crochet bags'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.category.name).toBe('Crochet Bags');
      expect(res.body.data.category.slug).toBe('crochet-bags');
    });

    it('should fail if unauthenticated', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Crochet Bags' });

      expect(res.status).toBe(401);
    });

    it('should fail to create category with duplicate name', async () => {
      await Category.create({ name: 'Crochet Bags', slug: 'crochet-bags' });

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Crochet Bags' });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      await Category.create([
        { name: 'Cat A', slug: 'cat-a', sortOrder: 2 },
        { name: 'Cat B', slug: 'cat-b', sortOrder: 1 }
      ]);

      const res = await request(app).get('/api/categories');

      expect(res.status).toBe(200);
      expect(res.body.data.categories.length).toBe(2);
      // Should be sorted by sortOrder
      expect(res.body.data.categories[0].name).toBe('Cat B');
      expect(res.body.data.categories[1].name).toBe('Cat A');
    });
  });

  describe('PATCH /api/categories/:id', () => {
    it('should update a category as admin', async () => {
      const cat = await Category.create({ name: 'Old Name', slug: 'old-name' });

      const res = await request(app)
        .patch(`/api/categories/${cat._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.category.name).toBe('New Name');
      expect(res.body.data.category.slug).toBe('new-name'); // slug should be updated
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category as admin', async () => {
      const cat = await Category.create({ name: 'To Delete', slug: 'to-delete' });

      const res = await request(app)
        .delete(`/api/categories/${cat._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      const check = await Category.findById(cat._id);
      expect(check).toBeNull();
    });
  });
});

const request = require('supertest');
const app = require('../../app');
const User = require('../../modules/users/user.model');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');

describe('Auth Integration Tests', () => {
  const mockUser = {
    name: 'Admin User',
    email: 'admin@handmade.com',
    password: 'Password123!',
    role: 'admin'
  };

  beforeEach(async () => {
    const user = new User(mockUser);
    await user.save();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(mockUser.email);
      expect(res.body.data.user.password).toBeUndefined(); // Should not return password
    });

    it('should fail login with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@handmade.com',
          password: mockUser.password
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: 'WrongPassword123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      // First login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        });
      
      const token = loginRes.body.data.token;

      // Then get user
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(mockUser.email);
    });

    it('should fail without token', async () => {
      const res = await request(app).get('/api/auth/me');
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

const request = require('supertest');
const app = require('../../../server');
const User = require('../../models/User');

describe('Auth Routes', () => {
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Traveler',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not signup a user with an existing email', async () => {
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'password456',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should login an existing user', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect credentials', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
  });
});
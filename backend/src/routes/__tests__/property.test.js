const request = require('supertest');
const app = require('../../../server');
const Property = require('../../models/Property');
const User = require('../../models/User');
require('../../models/Review'); // Import to register schema

describe('Property Routes', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Host User',
      email: 'host@example.com',
      password: 'password123',
      role: 'Host',
    });
    userId = user._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'host@example.com',
        password: 'password123',
      });
    token = res.body.token;
  });

  it('should create a new property', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Property',
        description: 'A beautiful property',
        location: {
          address: '123 Test St',
          city: 'Testville',
          country: 'Testland',
        },
        pricePerNight: 100,
        maxGuests: 2,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('title', 'Test Property');
  });

  it('should get all properties', async () => {
    await Property.create({
      hostId: userId,
      title: 'Test Property 1',
      description: 'A beautiful property',
      location: { address: '123 Test St', city: 'Testville', country: 'Testland' },
      pricePerNight: 100,
      maxGuests: 2,
    });
    await Property.create({
      hostId: userId,
      title: 'Test Property 2',
      description: 'Another beautiful property',
      location: { address: '456 Test St', city: 'Testville', country: 'Testland' },
      pricePerNight: 150,
      maxGuests: 4,
    });

    const res = await request(app).get('/api/properties');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(2);
  });

  it('should get a single property by id', async () => {
    const property = await Property.create({
      hostId: userId,
      title: 'Test Property',
      description: 'A beautiful property',
      location: { address: '123 Test St', city: 'Testville', country: 'Testland' },
      pricePerNight: 100,
      maxGuests: 2,
    });

    const res = await request(app).get(`/api/properties/${property._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('title', 'Test Property');
  });

  it('should update a property', async () => {
    const property = await Property.create({
      hostId: userId,
      title: 'Test Property',
      description: 'A beautiful property',
      location: { address: '123 Test St', city: 'Testville', country: 'Testland' },
      pricePerNight: 100,
      maxGuests: 2,
    });

    const res = await request(app)
      .put(`/api/properties/${property._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Test Property' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('title', 'Updated Test Property');
  });

  it('should delete a property', async () => {
    const property = await Property.create({
      hostId: userId,
      title: 'Test Property',
      description: 'A beautiful property',
      location: { address: '123 Test St', city: 'Testville', country: 'Testland' },
      pricePerNight: 100,
      maxGuests: 2,
    });

    const res = await request(app)
      .delete(`/api/properties/${property._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
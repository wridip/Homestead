const request = require('supertest');
const app = require('../../../server');
const Booking = require('../../models/Booking');
const Property = require('../../models/Property');
const User = require('../../models/User');

describe('Booking Routes', () => {
  let hostToken;
  let travelerToken;
  let hostId;
  let travelerId;
  let propertyId;

  beforeEach(async () => {
    const host = await User.create({ name: 'Host', email: 'host@test.com', password: 'password', role: 'Host' });
    const traveler = await User.create({ name: 'Traveler', email: 'traveler@test.com', password: 'password', role: 'Traveler' });
    hostId = host._id;
    travelerId = traveler._id;

    let res = await request(app).post('/api/auth/login').send({ email: 'host@test.com', password: 'password' });
    hostToken = res.body.token;

    res = await request(app).post('/api/auth/login').send({ email: 'traveler@test.com', password: 'password' });
    travelerToken = res.body.token;

    const property = await Property.create({
      hostId,
      title: 'A lovely place',
      description: 'Test description',
      location: { address: '123 Main St', city: 'Test City', country: 'Testland' },
      pricePerNight: 100,
      maxGuests: 2,
    });
    propertyId = property._id;
  });

  it('should create a new booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${travelerToken}`)
      .send({
        propertyId,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-05'),
        totalPrice: 400,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('status', 'Pending');
  });

  it('should not create a booking for overlapping dates', async () => {
    await Booking.create({
      travelerId,
      propertyId,
      hostId,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-05'),
      totalPrice: 400,
    });

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${travelerToken}`)
      .send({
        propertyId,
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-06'),
        totalPrice: 400,
      });

    expect(res.statusCode).toEqual(400);
  });

  it('should get bookings for a user', async () => {
    await Booking.create({ travelerId, propertyId, hostId, startDate: new Date(), endDate: new Date(), totalPrice: 100 });

    const res = await request(app)
      .get('/api/bookings/user')
      .set('Authorization', `Bearer ${travelerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
  });

  it('should get bookings for a host', async () => {
    await Booking.create({ travelerId, propertyId, hostId, startDate: new Date(), endDate: new Date(), totalPrice: 100 });

    const res = await request(app)
      .get('/api/bookings/host')
      .set('Authorization', `Bearer ${hostToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
  });

  it('should cancel a booking', async () => {
    const booking = await Booking.create({ travelerId, propertyId, hostId, startDate: new Date(), endDate: new Date(), totalPrice: 100 });

    const res = await request(app)
      .put(`/api/bookings/${booking._id}/cancel`)
      .set('Authorization', `Bearer ${travelerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('status', 'Cancelled');
  });
});
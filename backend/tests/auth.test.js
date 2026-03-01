const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

// Create a simple express app for testing auth routes
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock the User model methods
jest.mock('../models/User', () => {
    return {
        create: jest.fn(),
        findOne: jest.fn()
    };
});

describe('POST /api/auth/register', () => {
    it('returns 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@luxe.store' }); // Missing name, password

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });

    it('returns 201 when registration is successful', async () => {
        const User = require('../models/User');
        User.findOne.mockResolvedValue(null); // Emulate no existing user
        User.create.mockResolvedValue({ _id: '123', name: 'Test', email: 'test@luxe.store', role: 'user' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'test@luxe.store', password: 'Password@123' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });
});

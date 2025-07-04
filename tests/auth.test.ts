/**
 * Authentication Routes Tests
 * Comprehensive testing for authentication endpoints
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import supertest from 'supertest';
import { App } from '../src/app';
import '../tests/setup';

describe('Authentication Routes', () => {
  let app: App;
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(() => {
    app = new App();
    request = supertest(app.getApp());
  });

  afterEach(() => {
    // Clean up
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@banedonv.com',
          password: 'admin123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe('admin@banedonv.com');
      expect(response.body.data.user.role).toBe('admin');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@banedonv.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail with non-existent user', async () => {
      const response = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@banedonv.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail with missing email', async () => {
      const response = await request
        .post('/api/v1/auth/login')
        .send({
          password: 'admin123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should fail with missing password', async () => {
      const response = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@banedonv.com'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@banedonv.com',
          password: 'password123',
          name: 'New User'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('newuser@banedonv.com');
      expect(response.body.data.user.role).toBe('user');
    });

    it('should fail with existing email', async () => {
      const response = await request
        .post('/api/v1/auth/register')
        .send({
          email: 'admin@banedonv.com',
          password: 'password123',
          name: 'Admin User'
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      // First login to get a token
      const loginResponse = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@banedonv.com',
          password: 'admin123'
        });

      const token = loginResponse.body.data.token;

      const response = await request
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
    });

    it('should fail without token', async () => {
      const response = await request
        .post('/api/v1/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // First login to get a refresh token
      const loginResponse = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@banedonv.com',
          password: 'admin123'
        });

      const refreshToken = loginResponse.body.data.refreshToken;

      const response = await request
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: 'invalid-refresh-token'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid refresh token');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile with valid token', async () => {
      // First login to get a token
      const loginResponse = await request
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@banedonv.com',
          password: 'admin123'
        });

      const token = loginResponse.body.data.token;

      const response = await request
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('admin@banedonv.com');
      expect(response.body.data.user.role).toBe('admin');
    });

    it('should fail without token', async () => {
      const response = await request
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should send password reset email successfully', async () => {
      const response = await request
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'admin@banedonv.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password reset email sent');
    });

    it('should handle non-existent email gracefully', async () => {
      const response = await request
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'nonexistent@banedonv.com'
        })
        .expect(200);

      // For security, we still return success even if email doesn't exist
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password reset email sent');
    });
  });

  describe('POST /api/v1/auth/reset-password', () => {
    it('should reset password successfully with valid token', async () => {
      const response = await request
        .post('/api/v1/auth/reset-password')
        .send({
          token: 'valid-reset-token',
          password: 'newpassword123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password reset successfully');
    });

    it('should fail with invalid reset token', async () => {
      const response = await request
        .post('/api/v1/auth/reset-password')
        .send({
          token: 'invalid-reset-token',
          password: 'newpassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or expired reset token');
    });
  });
});

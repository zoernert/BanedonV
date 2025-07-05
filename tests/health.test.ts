/**
 * Health Routes Test
 * Tests for health check endpoints
 */

import request from 'supertest';
import { App } from '../src/app';
import { Express } from 'express';

describe('Health Routes', () => {
  let app: Express;

  beforeAll(() => {
    const appInstance = new App();
    app = appInstance.getApp();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'System is healthy',
        data: expect.objectContaining({
          status: 'healthy',
          uptime: expect.any(Number),
          memory: expect.objectContaining({
            used: expect.any(Number),
            total: expect.any(Number)
          })
        })
      });
    });
  });

  describe('GET /health/detailed', () => {
    it('should return detailed health status', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Detailed system health',
        data: expect.objectContaining({
          status: 'healthy',
          system: expect.any(Object),
          services: expect.any(Object),
          endpoints: expect.any(Object)
        })
      });
    });
  });

  describe('GET /health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/health/ready')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'System is ready',
        data: expect.objectContaining({
          ready: true,
          services: expect.any(Object)
        })
      });
    });
  });

  describe('GET /health/live', () => {
    it('should return liveness status', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'System is alive',
        data: expect.objectContaining({
          alive: true,
          uptime: expect.any(Number)
        })
      });
    });
  });
});

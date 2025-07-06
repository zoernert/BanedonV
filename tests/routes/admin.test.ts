import request from 'supertest';
import express from 'express';
import adminRoutes from '../../src/routes/admin';
import '../setup';

describe('Admin Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/admin', adminRoutes);
  });

  describe('GET /admin/dashboard', () => {
    it('should return admin dashboard data', async () => {
      const response = await request(app)
        .get('/admin/dashboard')
        .set(testUtils.getAdminAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('activeUsers');
      expect(response.body.data).toHaveProperty('totalCollections');
      expect(response.body.data).toHaveProperty('totalFiles');
      expect(response.body.data).toHaveProperty('systemHealth');
      expect(response.body.data.systemHealth).toBe('healthy');
    });

    it('should return numeric values for statistics', async () => {
      const response = await request(app)
        .get('/admin/dashboard')
        .set(testUtils.getAdminAuthHeaders())
        .expect(200);

      expect(typeof response.body.data.totalUsers).toBe('number');
      expect(typeof response.body.data.activeUsers).toBe('number');
      expect(typeof response.body.data.totalCollections).toBe('number');
      expect(typeof response.body.data.totalFiles).toBe('number');
      expect(response.body.data.totalUsers).toBeGreaterThan(0);
      expect(response.body.data.activeUsers).toBeGreaterThan(0);
      expect(response.body.data.totalCollections).toBeGreaterThan(0);
      expect(response.body.data.totalFiles).toBeGreaterThan(0);
    });
  });
});

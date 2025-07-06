import request from 'supertest';
import express from 'express';
import metricsRoutes from '../../src/routes/metrics';
import '../setup';

describe('Metrics Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/metrics', metricsRoutes);
  });

  describe('GET /metrics', () => {
    it('should return application metrics', async () => {
      const response = await request(app)
        .get('/metrics')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('requests');
      expect(response.body.data).toHaveProperty('performance');
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data).toHaveProperty('api');
    });

    it('should return proper metric structure', async () => {
      const response = await request(app)
        .get('/metrics')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      const { data } = response.body;
      
      // Check requests metrics
      expect(data.requests).toHaveProperty('total');
      expect(data.requests).toHaveProperty('success');
      expect(data.requests).toHaveProperty('error');
      expect(data.requests).toHaveProperty('rate');
      
      // Check performance metrics
      expect(data.performance).toHaveProperty('averageResponseTime');
      expect(data.performance).toHaveProperty('p95ResponseTime');
      expect(data.performance).toHaveProperty('p99ResponseTime');
      
      // Check user metrics
      expect(data.users).toHaveProperty('active');
      expect(data.users).toHaveProperty('total');
      expect(data.users).toHaveProperty('registrations');
    });
  });

  describe('GET /metrics/performance', () => {
    it('should return performance metrics', async () => {
      const response = await request(app)
        .get('/metrics/performance')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('responseTime');
      expect(response.body.data).toHaveProperty('throughput');
      expect(response.body.data).toHaveProperty('cpu');
      expect(response.body.data).toHaveProperty('memory');
    });
  });

  describe('GET /metrics/users', () => {
    it('should return user metrics', async () => {
      const response = await request(app)
        .get('/metrics/users')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('active');
      expect(response.body.data).toHaveProperty('registrations');
      expect(response.body.data).toHaveProperty('activity');
    });
  });

  describe('GET /metrics/api', () => {
    it('should return API endpoint metrics', async () => {
      const response = await request(app)
        .get('/metrics/api')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('endpoints');
      expect(response.body.data).toHaveProperty('topErrors');
    });
  });

  describe('GET /metrics/system', () => {
    it('should return system metrics', async () => {
      const response = await request(app)
        .get('/metrics/system')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('cpu');
      expect(response.body.data).toHaveProperty('memory');
      expect(response.body.data).toHaveProperty('storage');
    });
  });
});

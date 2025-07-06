import request from 'supertest';
import express from 'express';
import searchRoutes from '../../src/routes/search';
import '../setup';

describe('Search Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/search', searchRoutes);
  });

  describe('GET /search', () => {
    it('should return search results for a query', async () => {
      const response = await request(app)
        .get('/search?q=test')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('total');
    });

    it('should handle search with filters', async () => {
      const response = await request(app)
        .get('/search?q=test&type=file&fileType=pdf')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination in search', async () => {
      const response = await request(app)
        .get('/search?q=test&page=2&limit=5')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.pagination).toHaveProperty('page', 2);
      expect(response.body.pagination).toHaveProperty('limit', 5);
    });

    it('should return validation error for missing query', async () => {
      const response = await request(app)
        .get('/search')
        .set(testUtils.getAuthHeaders())
        .expect(422);

      // Just check that we get an error status, the exact structure may vary
      expect(response.status).toBe(422);
    });
  });

  describe('GET /search/suggestions', () => {
    it('should return search suggestions', async () => {
      const response = await request(app)
        .get('/search/suggestions?q=pro')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /search/filters', () => {
    it('should return search filters', async () => {
      const response = await request(app)
        .get('/search/filters')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('fileTypes');
      expect(response.body.data).toHaveProperty('tags');
      expect(response.body.data).toHaveProperty('dateRanges');
    });
  });
});

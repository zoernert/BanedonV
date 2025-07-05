import supertest from 'supertest';
import { App } from '../src/app';
import { Express } from 'express';
import { Server } from 'http';

describe('Search Routes', () => {
  let app: Express;
  let server: Server;
  let request: supertest.SuperTest<supertest.Test>;
  let token: string;
  let adminToken: string;
  
  beforeAll(async () => {
    const appInstance = new App();
    app = appInstance.getApp();
    server = app.listen();
    request = supertest(server);
    
    const adminLoginRes = await request
      .post('/api/v1/auth/login')
      .send({ email: 'admin@banedonv.com', password: 'admin123' });
    adminToken = adminLoginRes.body.data.token;

    const userLoginRes = await request
      .post('/api/v1/auth/login')
      .send({ email: 'user@banedonv.com', password: 'user123' });
    token = userLoginRes.body.data.token;
  });

  afterAll((done) => {
    server.close(done);
  });
  
  describe('GET /api/v1/search', () => {
    it('should return 422 if query parameter is missing', async () => {
      const res = await request
        .get('/api/v1/search')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 200 with search results for a valid query', async () => {
      const res = await request
        .get('/api/v1/search?q=test')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should respect pagination parameters', async () => {
      const res = await request
        .get('/api/v1/search?q=test&page=2&limit=5')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.pagination.limit).toBe(5);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should filter results by type', async () => {
        const res = await request
          .get('/api/v1/search?q=test&type=file')
          .set('Authorization', `Bearer ${token}`);
  
        expect(res.status).toBe(200);
        res.body.data.forEach((item: any) => {
            expect(item.type).toBe('file');
        });
    });
  });

  describe('GET /api/v1/search/suggestions', () => {
    it('should return 422 if query parameter is missing', async () => {
      const res = await request
        .get('/api/v1/search/suggestions')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return suggestions for a valid query', async () => {
      const res = await request
        .get('/api/v1/search/suggestions?q=hello')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/search/filters', () => {
    it('should return a list of available filters', async () => {
      const res = await request
        .get('/api/v1/search/filters')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('fileTypes');
      expect(res.body.data).toHaveProperty('tags');
      expect(res.body.data).toHaveProperty('dateRanges');
    });
  });
});

import request from 'supertest';
import App from '../src/app';
import { Express } from 'express';
import { AuthMiddleware, AuthUser } from '../src/middleware/auth';
import { mockUsers } from '../src/config/auth';

describe('Search Routes', () => {
  let app: Express;
  let token: string;
  let adminToken: string;
  
  beforeAll(() => {
    const server = new App();
    app = server.getApp();
    
    const adminMockUser = mockUsers.find(u => u.role === 'admin')!;
    const adminUser: AuthUser = {
        id: adminMockUser.id,
        email: adminMockUser.email,
        name: adminMockUser.name,
        role: adminMockUser.role as 'admin',
        active: adminMockUser.active,
        createdAt: adminMockUser.createdAt
    };
    adminToken = AuthMiddleware.generateToken(adminUser);

    const regularMockUser = mockUsers.find(u => u.role === 'user')!;
    const regularUser: AuthUser = {
      id: regularMockUser.id,
      email: regularMockUser.email,
      name: regularMockUser.name,
      role: regularMockUser.role as 'user',
      active: regularMockUser.active,
      createdAt: regularMockUser.createdAt
    };
    token = AuthMiddleware.generateToken(regularUser);
  });
  
  describe('GET /api/v1/search', () => {
    it('should return 422 if query parameter is missing', async () => {
      const res = await request(app)
        .get('/api/v1/search')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 200 with search results for a valid query', async () => {
      const res = await request(app)
        .get('/api/v1/search?q=test')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should respect pagination parameters', async () => {
      const res = await request(app)
        .get('/api/v1/search?q=test&page=2&limit=5')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.pagination.limit).toBe(5);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should filter results by type', async () => {
        const res = await request(app)
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
      const res = await request(app)
        .get('/api/v1/search/suggestions')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return suggestions for a valid query', async () => {
      const res = await request(app)
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
      const res = await request(app)
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

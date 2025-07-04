/**
 * Admin Routes
 * Administrative endpoints
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import ResponseUtil from '../utils/response';

const router = Router();

router.get('/dashboard', AuthMiddleware.authenticate, AuthMiddleware.adminOnly, async (req: Request, res: Response) => {
  await ResponseUtil.withDelay(async () => {
    const mockDashboard = {
      totalUsers: 1000,
      activeUsers: 750,
      totalCollections: 5000,
      totalFiles: 50000,
      systemHealth: 'healthy'
    };
    return ResponseUtil.success(res, mockDashboard, 'Dashboard data retrieved successfully');
  });
});

export default router;

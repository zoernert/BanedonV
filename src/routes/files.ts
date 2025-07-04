/**
 * File Routes
 * File management endpoints
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import ResponseUtil from '../utils/response';

const router = Router();

router.get('/', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
  await ResponseUtil.withDelay(async () => {
    const mockFiles = [
      {
        id: 'file_1',
        name: 'sample.txt',
        size: 1024,
        type: 'text/plain',
        createdAt: new Date().toISOString()
      }
    ];
    return ResponseUtil.success(res, mockFiles, 'Files retrieved successfully');
  });
});

export default router;

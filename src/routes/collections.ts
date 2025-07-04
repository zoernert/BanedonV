/**
 * Collection Routes
 * Collection management endpoints
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import ResponseUtil from '../utils/response';

const router = Router();

router.get('/', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
  await ResponseUtil.withDelay(async () => {
    const mockCollections = [
      {
        id: 'collection_1',
        name: 'Sample Collection',
        description: 'A sample collection',
        createdAt: new Date().toISOString()
      }
    ];
    return ResponseUtil.success(res, mockCollections, 'Collections retrieved successfully');
  });
});

export default router;

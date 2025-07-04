/**
 * Search Routes
 * Search functionality endpoints
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import ResponseUtil from '../utils/response';

const router = Router();

router.get('/', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
  await ResponseUtil.withDelay(async () => {
    const mockResults = [
      {
        id: 'result_1',
        title: 'Sample Result',
        content: 'Sample search result content',
        score: 0.95,
        type: 'document'
      }
    ];
    return ResponseUtil.success(res, mockResults, 'Search completed successfully');
  });
});

export default router;

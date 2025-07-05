/**
 * Public Metrics Routes
 * Publicly accessible application metrics for status pages, etc.
 */

import { Router, Request, Response } from 'express';
import { ErrorMiddleware } from '../middleware/error';
import ResponseUtil from '../utils/response';
import { randomFloat } from '../utils/number.util';

const router = Router();

/**
 * Get public status metrics
 */
router.get('/', ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
  await ResponseUtil.withDelay(async () => {
    // Only expose safe, public metrics
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      status: 'ok',
      averageResponseTime: randomFloat(50, 300), // mock value
    };
    return ResponseUtil.success(res, metrics, 'Public metrics retrieved successfully');
  });
}));

export default router;

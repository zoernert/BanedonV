/**
 * Public Metrics Routes
 * Publicly accessible application metrics for status pages, etc.
 */

import { Router, Request, Response } from 'express';
import { ErrorMiddleware } from '../middleware/error';
import ResponseUtil from '../utils/response';

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
      averageResponseTime: Math.random() * 250 + 50, // mock value
    };
    return ResponseUtil.success(res, metrics, 'Public metrics retrieved successfully');
  });
}));

export default router;

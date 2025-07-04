/**
 * Billing Routes
 * Billing and subscription endpoints
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import ResponseUtil from '../utils/response';

const router = Router();

router.get('/subscription', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
  await ResponseUtil.withDelay(async () => {
    const mockSubscription = {
      id: 'sub_1',
      plan: 'premium',
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    return ResponseUtil.success(res, mockSubscription, 'Subscription retrieved successfully');
  });
});

export default router;

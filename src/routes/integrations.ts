/**
 * Integration Routes
 * Third-party integration endpoints
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import ResponseUtil from '../utils/response';

const router = Router();

router.get('/', AuthMiddleware.mockAuthenticate, async (req: Request, res: Response) => {
  await ResponseUtil.withDelay(async () => {
    const mockIntegrations = [
      {
        id: 'integration_1',
        name: 'Slack',
        type: 'webhook',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];
    return ResponseUtil.success(res, mockIntegrations, 'Integrations retrieved successfully');
  });
});

export default router;

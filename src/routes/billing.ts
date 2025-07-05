/**
 * Billing Routes
 * Billing and subscription endpoints
 */

import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { ErrorMiddleware } from '../middleware/error';
import { ValidationMiddleware } from '../middleware/validation';
import ResponseUtil from '../utils/response';

const router = Router();

router.get('/subscription',
  AuthMiddleware.authenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    await ResponseUtil.withDelay(async () => {
      const mockSubscription = {
        id: 'sub_1',
        plan: 'premium',
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 99.99,
        currency: 'USD'
      };
      return ResponseUtil.success(res, mockSubscription, 'Subscription retrieved successfully');
    });
  })
);

router.get('/plans',
  AuthMiddleware.authenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    await ResponseUtil.withDelay(async () => {
      const mockPlans = [
        { id: 'free', name: 'Free', price: 0, features: ['100 files', '1 collection'] },
        { id: 'standard', name: 'Standard', price: 29.99, features: ['1000 files', '50 collections', 'API access'] },
        { id: 'premium', name: 'Premium', price: 99.99, features: ['Unlimited files', 'Unlimited collections', 'Priority support'] }
      ];
      return ResponseUtil.success(res, mockPlans, 'Plans retrieved successfully');
    });
  })
);

router.post('/subscribe',
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validateBillingSubscribe,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.body;
    await ResponseUtil.withDelay(async () => {
      return ResponseUtil.success(res, { planId, status: 'subscription_created' }, 'Subscribed successfully');
    });
  })
);

router.post('/cancel-subscription',
  AuthMiddleware.authenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    await ResponseUtil.withDelay(async () => {
      return ResponseUtil.success(res, { status: 'subscription_cancelled' }, 'Subscription cancelled successfully');
    });
  })
);

router.get('/invoices',
  AuthMiddleware.authenticate,
  ValidationMiddleware.common.validatePagination,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = ResponseUtil.parsePagination(req.query);
    await ResponseUtil.withDelay(async () => {
      const mockInvoices = Array.from({ length: 15 }, (_, i) => ({
        id: `invoice_${i+1}`,
        date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 99.99,
        status: 'paid',
        pdfUrl: `/invoices/invoice_${i+1}.pdf`
      }));
      const { items, total } = ResponseUtil.paginateArray(mockInvoices, page, limit);
      return ResponseUtil.success(res, items, 'Invoices retrieved successfully', 200, { page, limit, total });
    });
  })
);

router.put('/payment-method',
  AuthMiddleware.authenticate,
  ErrorMiddleware.asyncHandler(async (req: Request, res: Response) => {
    await ResponseUtil.withDelay(async () => {
      return ResponseUtil.success(res, { status: 'payment_method_updated' }, 'Payment method updated successfully');
    });
  })
);

export default router;

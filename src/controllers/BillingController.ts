import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { IBillingService } from '../services/interfaces/IBillingService';
import ResponseUtil from '../utils/response';

export class BillingController extends BaseController {
  constructor(private billingService: IBillingService) {
    super();
  }

  async getSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const subscription = await this.billingService.getSubscription(userId);
      if (!subscription) {
        return ResponseUtil.notFound(res);
      }
      await this.executeWithDelay(async () => subscription, res, 'Subscription retrieved successfully');
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.executeWithDelay(
        () => this.billingService.getPlans(),
        res,
        'Plans retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { planId } = req.body;
      await this.executeWithDelay(
        () => this.billingService.subscribe(userId, planId),
        res,
        'Subscription created successfully',
        201
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async cancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await this.executeWithDelay(
        () => this.billingService.cancelSubscription(userId),
        res,
        'Subscription canceled successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const pagination = ResponseUtil.parsePagination(req.query);
      await this.executeWithPagination(
        () => this.billingService.getInvoices(userId, pagination),
        res,
        'Invoices retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async updatePaymentMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { paymentMethodId } = req.body;
      await this.executeWithDelay(
        () => this.billingService.updatePaymentMethod(userId, paymentMethodId),
        res,
        'Payment method updated successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }

  async getBillingUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await this.executeWithDelay(
        () => this.billingService.getBillingUsage(userId),
        res,
        'Billing usage retrieved successfully'
      );
    } catch (error) {
      this.handleError(error as Error, next);
    }
  }
}

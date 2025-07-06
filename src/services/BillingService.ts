import { IBillingService, BillingPlan, Subscription, Invoice } from './interfaces/IBillingService';
import { ValidationError } from '../domain/errors/ValidationError';
import { ErrorCodes } from '../domain/errors/ErrorCodes';
import { randomInt, randomFloat } from '../utils/number.util';
import { generateId } from '../utils/id.util';
import logger from '../utils/logger';

export class BillingService implements IBillingService {
  private mockPlans: BillingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      features: ['Up to 1GB storage', 'Basic file sharing', 'Email support'],
      limits: {
        storage: 1024 * 1024 * 1024, // 1GB
        users: 1,
        apiCalls: 1000
      }
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      currency: 'USD',
      features: ['Up to 100GB storage', 'Advanced file sharing', 'Priority support', 'API access'],
      limits: {
        storage: 100 * 1024 * 1024 * 1024, // 100GB
        users: 10,
        apiCalls: 10000
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 29.99,
      currency: 'USD',
      features: ['Unlimited storage', 'Advanced security', '24/7 support', 'Custom integrations'],
      limits: {
        storage: -1, // Unlimited
        users: -1, // Unlimited
        apiCalls: -1 // Unlimited
      }
    }
  ];

  private mockSubscriptions: Map<string, Subscription> = new Map();

  async getSubscription(userId: string): Promise<Subscription | null> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    try {
      // Check if user has existing subscription
      const existingSubscription = this.mockSubscriptions.get(userId);
      if (existingSubscription) {
        return existingSubscription;
      }

      // Return mock subscription for demo
      const mockSubscription: Subscription = {
        id: generateId('sub'),
        planId: 'premium',
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 9.99,
        currency: 'USD'
      };

      this.mockSubscriptions.set(userId, mockSubscription);
      return mockSubscription;
    } catch (error) {
      logger.error('Error getting subscription', { userId, error });
      throw error;
    }
  }

  async getPlans(): Promise<BillingPlan[]> {
    try {
      return this.mockPlans;
    } catch (error) {
      logger.error('Error getting plans', { error });
      throw error;
    }
  }

  async subscribe(userId: string, planId: string): Promise<Subscription> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    if (!planId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Plan ID is required');
    }

    try {
      const plan = this.mockPlans.find(p => p.id === planId);
      if (!plan) {
        throw new ValidationError(ErrorCodes.VALIDATION.INVALID_REQUEST, 'Invalid plan ID');
      }

      const subscription: Subscription = {
        id: generateId('sub'),
        planId: planId,
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: plan.price,
        currency: plan.currency
      };

      this.mockSubscriptions.set(userId, subscription);
      logger.info('User subscribed', { userId, planId, subscriptionId: subscription.id });
      return subscription;
    } catch (error) {
      logger.error('Error subscribing user', { userId, planId, error });
      throw error;
    }
  }

  async cancelSubscription(userId: string): Promise<void> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    try {
      const subscription = this.mockSubscriptions.get(userId);
      if (!subscription) {
        throw new ValidationError(ErrorCodes.VALIDATION.INVALID_REQUEST, 'No active subscription found');
      }

      subscription.status = 'canceled';
      this.mockSubscriptions.set(userId, subscription);
      logger.info('Subscription canceled', { userId, subscriptionId: subscription.id });
    } catch (error) {
      logger.error('Error canceling subscription', { userId, error });
      throw error;
    }
  }

  async getInvoices(userId: string, pagination: any): Promise<any> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    try {
      // Mock invoices
      const mockInvoices: Invoice[] = Array.from({ length: 12 }, (_, i) => {
        const invoice: Invoice = {
          id: `inv_${i + 1}`,
          amount: randomFloat(5, 30),
          currency: 'USD',
          status: ['paid', 'pending', 'failed'][i % 3] as 'paid' | 'pending' | 'failed',
          createdAt: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000 + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        if (i % 3 === 0) {
          invoice.paidAt = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000 + 1 * 24 * 60 * 60 * 1000).toISOString();
        }
        
        return invoice;
      });

      const { page = 1, limit = 20 } = pagination;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const items = mockInvoices.slice(startIndex, endIndex);
      const total = mockInvoices.length;

      return {
        items,
        total,
        page,
        limit
      };
    } catch (error) {
      logger.error('Error getting invoices', { userId, error });
      throw error;
    }
  }

  async updatePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    if (!paymentMethodId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'Payment method ID is required');
    }

    try {
      // Mock updating payment method
      logger.info('Payment method updated', { userId, paymentMethodId });
    } catch (error) {
      logger.error('Error updating payment method', { userId, paymentMethodId, error });
      throw error;
    }
  }

  async getBillingUsage(userId: string): Promise<any> {
    if (!userId) {
      throw new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, 'User ID is required');
    }

    try {
      // Mock billing usage data
      const mockUsage = {
        storage: {
          used: randomInt(100000000, 1000000000), // 100MB - 1GB
          limit: 100 * 1024 * 1024 * 1024, // 100GB
          percentage: randomFloat(10, 80)
        },
        apiCalls: {
          used: randomInt(100, 5000),
          limit: 10000,
          percentage: randomFloat(5, 50)
        },
        users: {
          used: randomInt(1, 8),
          limit: 10,
          percentage: randomFloat(10, 80)
        },
        period: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        }
      };

      return mockUsage;
    } catch (error) {
      logger.error('Error getting billing usage', { userId, error });
      throw error;
    }
  }
}

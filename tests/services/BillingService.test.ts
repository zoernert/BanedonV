/**
 * BillingService Tests
 * Comprehensive test suite for billing service functionality
 */

import { BillingService } from '../../src/services/BillingService';
import { ValidationError } from '../../src/domain/errors/ValidationError';
import { BillingPlan, Subscription, Invoice } from '../../src/services/interfaces/IBillingService';

describe('BillingService', () => {
  let billingService: BillingService;

  beforeEach(() => {
    billingService = new BillingService();
  });

  describe('getPlans', () => {
    it('should return all available billing plans', async () => {
      const plans = await billingService.getPlans();
      
      expect(plans).toBeInstanceOf(Array);
      expect(plans.length).toBeGreaterThan(0);
      
      const freePlan = plans.find(p => p.id === 'free');
      expect(freePlan).toBeDefined();
      expect(freePlan?.price).toBe(0);
      
      const premiumPlan = plans.find(p => p.id === 'premium');
      expect(premiumPlan).toBeDefined();
      expect(premiumPlan?.price).toBeGreaterThan(0);
    });

    it('should return plans with required properties', async () => {
      const plans = await billingService.getPlans();
      
      plans.forEach(plan => {
        expect(plan).toHaveProperty('id');
        expect(plan).toHaveProperty('name');
        expect(plan).toHaveProperty('price');
        expect(plan).toHaveProperty('currency');
        expect(plan).toHaveProperty('features');
        expect(plan).toHaveProperty('limits');
      });
    });
  });

  describe('getSubscription', () => {
    it('should return mock subscription for any user (service returns mock data)', async () => {
      const userId = 'user_without_subscription';
      const subscription = await billingService.getSubscription(userId);
      
      expect(subscription).toBeDefined();
      expect(subscription).toHaveProperty('id');
      expect(subscription).toHaveProperty('planId');
      expect(subscription).toHaveProperty('status');
    });

    it('should return subscription for user with active subscription', async () => {
      const userId = 'user_1';
      
      // First subscribe the user
      const plans = await billingService.getPlans();
      const premiumPlan = plans.find(p => p.id === 'premium');
      await billingService.subscribe(userId, premiumPlan!.id);
      
      const subscription = await billingService.getSubscription(userId);
      
      expect(subscription).toBeDefined();
      expect(subscription?.planId).toBe(premiumPlan!.id);
      expect(subscription?.status).toBe('active');
    });

    it('should throw error for invalid user ID', async () => {
      await expect(billingService.getSubscription(''))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('subscribe', () => {
    it('should create subscription for valid plan', async () => {
      const userId = 'user_1';
      const planId = 'premium';
      
      const subscription = await billingService.subscribe(userId, planId);
      
      expect(subscription).toHaveProperty('id');
      expect(subscription.planId).toBe(planId);
      expect(subscription.status).toBe('active');
      expect(subscription).toHaveProperty('nextBillingDate');
    });

    it('should throw error for invalid plan ID', async () => {
      const userId = 'user_1';
      const invalidPlanId = 'invalid_plan';
      
      await expect(billingService.subscribe(userId, invalidPlanId))
        .rejects
        .toThrow(ValidationError);
    });

    it('should throw error for empty user ID', async () => {
      const planId = 'premium';
      
      await expect(billingService.subscribe('', planId))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel active subscription', async () => {
      const userId = 'user_1';
      const planId = 'premium';
      
      // First subscribe the user
      await billingService.subscribe(userId, planId);
      
      // Then cancel the subscription
      await expect(billingService.cancelSubscription(userId))
        .resolves
        .not
        .toThrow();
      
      // Verify subscription is canceled
      const subscription = await billingService.getSubscription(userId);
      expect(subscription?.status).toBe('canceled');
    });

    it('should throw error for user without subscription', async () => {
      const userId = 'user_without_subscription';
      
      await expect(billingService.cancelSubscription(userId))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('getInvoices', () => {
    it('should return paginated invoices', async () => {
      const userId = 'user_1';
      const pagination = { page: 1, limit: 10 };
      
      // First subscribe the user to generate invoices
      await billingService.subscribe(userId, 'premium');
      
      const result = await billingService.getInvoices(userId, pagination);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
    });

    it('should handle pagination correctly', async () => {
      const userId = 'user_1';
      const pagination = { page: 2, limit: 5 };
      
      const result = await billingService.getInvoices(userId, pagination);
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
    });
  });

  describe('updatePaymentMethod', () => {
    it('should update payment method successfully', async () => {
      const userId = 'user_1';
      const paymentMethodId = 'pm_test_card';
      
      // First subscribe the user
      await billingService.subscribe(userId, 'premium');
      
      await expect(billingService.updatePaymentMethod(userId, paymentMethodId))
        .resolves
        .not
        .toThrow();
    });

    it('should update payment method for any user (service doesn\'t validate subscription)', async () => {
      const userId = 'user_without_subscription';
      const paymentMethodId = 'pm_test_card';
      
      await expect(billingService.updatePaymentMethod(userId, paymentMethodId))
        .resolves
        .not
        .toThrow();
    });
  });

  describe('getBillingUsage', () => {
    it('should return billing usage information', async () => {
      const userId = 'user_1';
      
      // First subscribe the user
      await billingService.subscribe(userId, 'premium');
      
      const usage = await billingService.getBillingUsage(userId);
      
      expect(usage).toHaveProperty('storage');
      expect(usage).toHaveProperty('apiCalls');
      expect(usage).toHaveProperty('period');
    });

    it('should return mock usage data for any user (service returns mock data)', async () => {
      const userId = 'user_without_subscription';
      
      const usage = await billingService.getBillingUsage(userId);
      
      expect(usage).toHaveProperty('storage');
      expect(usage).toHaveProperty('apiCalls');
      expect(usage).toHaveProperty('period');
    });
  });
});

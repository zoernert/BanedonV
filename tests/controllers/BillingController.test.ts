/**
 * BillingController Tests
 * Comprehensive test suite for billing controller functionality
 */

import { Request, Response, NextFunction } from 'express';
import { BillingController } from '../../src/controllers/BillingController';
import { BillingService } from '../../src/services/BillingService';
import ResponseUtil from '../../src/utils/response';

// Mock ResponseUtil
jest.mock('../../src/utils/response', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    notFound: jest.fn(),
    parsePagination: jest.fn().mockReturnValue({ page: 1, limit: 10 }),
    withDelay: jest.fn().mockImplementation((operation) => operation()),
  },
}));

// Mock sleep utility
jest.mock('../../src/utils/async.util', () => ({
  sleep: jest.fn().mockResolvedValue(undefined),
}));

// Mock randomFloat utility  
jest.mock('../../src/utils/number.util', () => ({
  randomFloat: jest.fn().mockReturnValue(100),
}));

describe('BillingController', () => {
  let billingController: BillingController;
  let mockBillingService: jest.Mocked<BillingService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock BillingService
    mockBillingService = {
      getPlans: jest.fn(),
      getSubscription: jest.fn(),
      subscribe: jest.fn(),
      cancelSubscription: jest.fn(),
      getInvoices: jest.fn(),
      updatePaymentMethod: jest.fn(),
      getBillingUsage: jest.fn()
    } as any;

    billingController = new BillingController(mockBillingService);

    // Mock Express request/response
    mockRequest = {
      params: {},
      query: {},
      body: {},
    } as any;

    // Add user property manually
    (mockRequest as any).user = {
      id: 'user_1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      active: true,
      createdAt: '2023-01-01T00:00:00.000Z'
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { requestId: 'test-request-id' }
    };

    mockNext = jest.fn();
  });

  describe('getPlans', () => {
    it('should return billing plans successfully', async () => {
      const mockPlans = [
        { id: 'free', name: 'Free', price: 0 },
        { id: 'premium', name: 'Premium', price: 9.99 }
      ];
      
      mockBillingService.getPlans.mockResolvedValue(mockPlans as any);

      await billingController.getPlans(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBillingService.getPlans).toHaveBeenCalled();
      expect(ResponseUtil.success).toHaveBeenCalledWith(
        mockResponse,
        mockPlans,
        'Plans retrieved successfully',
        200
      );
    });

    it('should handle errors properly', async () => {
      const error = new Error('Service error');
      mockBillingService.getPlans.mockRejectedValue(error);

      await billingController.getPlans(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getSubscription', () => {
    it('should return user subscription', async () => {
      const mockSubscription = {
        id: 'sub_1',
        planId: 'premium',
        status: 'active'
      };
      
      mockBillingService.getSubscription.mockResolvedValue(mockSubscription as any);

      await billingController.getSubscription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBillingService.getSubscription).toHaveBeenCalledWith('user_1');
      expect(ResponseUtil.success).toHaveBeenCalledWith(
        mockResponse,
        mockSubscription,
        'Subscription retrieved successfully',
        200
      );
    });

    it('should handle user without subscription', async () => {
      mockBillingService.getSubscription.mockResolvedValue(null);

      await billingController.getSubscription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBillingService.getSubscription).toHaveBeenCalledWith('user_1');
      expect(ResponseUtil.notFound).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('subscribe', () => {
    it('should create subscription successfully', async () => {
      mockRequest.body = { planId: 'premium' };
      const mockSubscription = {
        id: 'sub_1',
        planId: 'premium',
        status: 'active'
      };
      
      mockBillingService.subscribe.mockResolvedValue(mockSubscription as any);

      await billingController.subscribe(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBillingService.subscribe).toHaveBeenCalledWith('user_1', 'premium');
      expect(ResponseUtil.success).toHaveBeenCalledWith(
        mockResponse,
        mockSubscription,
        'Subscription created successfully',
        201
      );
    });

    it('should handle service errors', async () => {
      mockRequest.body = { planId: 'premium' };
      const error = new Error('Subscription failed');
      mockBillingService.subscribe.mockRejectedValue(error);

      await billingController.subscribe(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      mockBillingService.cancelSubscription.mockResolvedValue(undefined);

      await billingController.cancelSubscription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBillingService.cancelSubscription).toHaveBeenCalledWith('user_1');
      expect(ResponseUtil.success).toHaveBeenCalledWith(
        mockResponse,
        undefined,
        'Subscription canceled successfully',
        200
      );
    });

    it('should handle cancellation errors', async () => {
      const error = new Error('Cancellation failed');
      mockBillingService.cancelSubscription.mockRejectedValue(error);

      await billingController.cancelSubscription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getInvoices', () => {
    it('should return user invoices', async () => {
      mockRequest.query = { page: '1', limit: '10' };
      const mockInvoices = {
        items: [{ id: 'inv_1', amount: 9.99 }],
        total: 1,
        page: 1,
        limit: 10
      };
      
      mockBillingService.getInvoices.mockResolvedValue(mockInvoices as any);

      await billingController.getInvoices(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBillingService.getInvoices).toHaveBeenCalledWith('user_1', { page: 1, limit: 10 });
      expect(ResponseUtil.success).toHaveBeenCalledWith(
        mockResponse,
        mockInvoices.items,
        'Invoices retrieved successfully',
        200,
        { 
          page: mockInvoices.page,
          limit: mockInvoices.limit,
          total: mockInvoices.total,
        }
      );
    });
  });

  describe('updatePaymentMethod', () => {
    it('should update payment method successfully', async () => {
      mockRequest.body = { paymentMethodId: 'pm_123' };
      mockBillingService.updatePaymentMethod.mockResolvedValue(undefined);

      await billingController.updatePaymentMethod(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBillingService.updatePaymentMethod).toHaveBeenCalledWith('user_1', 'pm_123');
      expect(ResponseUtil.success).toHaveBeenCalledWith(
        mockResponse,
        undefined,
        'Payment method updated successfully',
        200
      );
    });
  });

  describe('getBillingUsage', () => {
    it('should return billing usage', async () => {
      const mockUsage = {
        storage: { used: 1000, limit: 10000 },
        apiCalls: { used: 100, limit: 1000 }
      };
      
      mockBillingService.getBillingUsage.mockResolvedValue(mockUsage as any);

      await billingController.getBillingUsage(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBillingService.getBillingUsage).toHaveBeenCalledWith('user_1');
      expect(ResponseUtil.success).toHaveBeenCalledWith(
        mockResponse,
        mockUsage,
        'Billing usage retrieved successfully',
        200
      );
    });
  });
});

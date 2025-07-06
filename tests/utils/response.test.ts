import { Response } from 'express';
import ResponseUtil from '../../src/utils/response';

describe('ResponseUtil', () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      locals: { requestId: 'test-request-id' },
    };
  });

  describe('success', () => {
    it('should send success response with data', () => {
      const data = { id: 1, name: 'Test' };
      const message = 'Success message';

      ResponseUtil.success(mockRes as Response, data, message);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data,
        message,
        timestamp: expect.any(String),
        requestId: expect.any(String)
      }));
    });

    it('should send success response with custom status code', () => {
      const data = { created: true };

      ResponseUtil.success(mockRes as Response, data, 'Created', 201);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should send success response with pagination', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = { page: 1, limit: 10, total: 50 };

      ResponseUtil.success(mockRes as Response, data, 'Success', 200, pagination);

      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data,
        pagination: expect.objectContaining({
          page: 1,
          limit: 10,
          total: 50,
          pages: 5
        })
      }));
    });

    it('should send success response without data', () => {
      ResponseUtil.success(mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Operation successful'
      }));
    });
  });

  describe('error', () => {
    it('should send error response with details', () => {
      const errorCode = 'VALIDATION_ERROR';
      const errorMessage = 'Invalid input';
      const details = { field: 'email' };

      ResponseUtil.error(mockRes as Response, errorCode, errorMessage, 400, details);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
          details
        },
        timestamp: expect.any(String),
        requestId: expect.any(String)
      }));
    });

    it('should send error response with default status code', () => {
      ResponseUtil.error(mockRes as Response, 'UNKNOWN_ERROR', 'Something went wrong');

      expect(mockRes.status).toHaveBeenCalledWith(400); // default is 400
    });

    it('should send error response without details', () => {
      ResponseUtil.error(mockRes as Response, 'NOT_FOUND', 'Resource not found', 404);

      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found'
        }
      }));
    });
  });

  describe('notFound', () => {
    it('should send 404 response with default message', () => {
      ResponseUtil.notFound(mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found'
        }
      }));
    });

    it('should send 404 response with custom message', () => {
      const customMessage = 'User not found';

      ResponseUtil.notFound(mockRes as Response, customMessage);

      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: {
          code: 'NOT_FOUND',
          message: customMessage
        }
      }));
    });
  });

  describe('unauthorized', () => {
    it('should send 401 response with default message', () => {
      ResponseUtil.unauthorized(mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized access'
        }
      }));
    });

    it('should send 401 response with custom message', () => {
      const customMessage = 'Invalid token';

      ResponseUtil.unauthorized(mockRes as Response, customMessage);

      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: {
          code: 'UNAUTHORIZED',
          message: customMessage
        }
      }));
    });
  });

  describe('forbidden', () => {
    it('should send 403 response with default message', () => {
      ResponseUtil.forbidden(mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Forbidden access'
        }
      }));
    });

    it('should send 403 response with custom message', () => {
      const customMessage = 'Insufficient permissions';

      ResponseUtil.forbidden(mockRes as Response, customMessage);

      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: {
          code: 'FORBIDDEN',
          message: customMessage
        }
      }));
    });
  });

  describe('withDelay', () => {
    it('should execute callback with simulated delay', async () => {
      const callback = jest.fn().mockResolvedValue('result');
      
      const result = await ResponseUtil.withDelay(callback);

      expect(callback).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should handle callback errors', async () => {
      const error = new Error('Callback error');
      const callback = jest.fn().mockRejectedValue(error);

      await expect(ResponseUtil.withDelay(callback)).rejects.toThrow('Callback error');
    });
  });
});

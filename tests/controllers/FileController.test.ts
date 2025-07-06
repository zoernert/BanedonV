import { Request, Response, NextFunction } from 'express';
import { FileController } from '../../src/controllers/FileController';
import { IFileService } from '../../src/services/interfaces/IFileService';
import { AuthUser } from '../../src/domain/models/AuthUser';

describe('FileController', () => {
  let fileController: FileController;
  let mockFileService: jest.Mocked<IFileService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockFileService = {
      getAllFiles: jest.fn(),
      getFileById: jest.fn(),
      getRecentFiles: jest.fn(),
      uploadFile: jest.fn(),
      updateFile: jest.fn(),
      deleteFile: jest.fn(),
      getFilePreview: jest.fn(),
      getFileHistory: jest.fn()
    };

    fileController = new FileController(mockFileService);

    // Mock Express request/response
    mockRequest = {
      params: {},
      query: {},
      body: {},
      user: {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        active: true,
        createdAt: '2023-01-01T00:00:00.000Z'
      } as AuthUser
    } as Partial<Request>;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('getAllFiles', () => {
    it('should return all files with pagination', async () => {
      const mockFiles = {
        items: [
          { id: 'file_1', name: 'test.pdf' },
          { id: 'file_2', name: 'doc.docx' }
        ],
        total: 2,
        page: 1,
        limit: 10
      };

      mockRequest.query = { page: '1', limit: '10' };
      mockFileService.getAllFiles.mockResolvedValue(mockFiles as any);

      await fileController.getAllFiles(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockFileService.getAllFiles).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockFileService.getAllFiles.mockRejectedValue(error);

      await fileController.getAllFiles(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getFileById', () => {
    it('should return file by id', async () => {
      const mockFile = { id: 'file_1', name: 'test.pdf' };
      mockRequest.params = { id: 'file_1' };
      mockFileService.getFileById.mockResolvedValue(mockFile as any);

      await fileController.getFileById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockFileService.getFileById).toHaveBeenCalledWith('file_1');
    });

    it('should handle file not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockFileService.getFileById.mockResolvedValue(null);

      await fileController.getFileById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockFileService.getFileById).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const mockFile = { id: 'file_1', name: 'test.pdf' };
      mockRequest.body = {
        name: 'test.pdf',
        type: 'application/pdf',
        size: 1024
      };

      mockFileService.uploadFile.mockResolvedValue(mockFile as any);

      await fileController.uploadFile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockFileService.uploadFile).toHaveBeenCalledWith('user_1', mockRequest.body);
    });

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed');
      mockRequest.body = { name: 'test.pdf' };
      mockFileService.uploadFile.mockRejectedValue(error);

      await fileController.uploadFile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      mockRequest.params = { id: 'file_1' };
      mockFileService.deleteFile.mockResolvedValue();

      await fileController.deleteFile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockFileService.deleteFile).toHaveBeenCalledWith('file_1', 'user_1');
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      mockRequest.params = { id: 'file_1' };
      mockFileService.deleteFile.mockRejectedValue(error);

      await fileController.deleteFile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

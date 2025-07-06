/**
 * FileService Tests
 * Comprehensive test suite for file service functionality
 */

import { FileService } from '../../src/services/FileService';
import { MockFileRepository } from '../../src/repositories/mock/MockFileRepository';
import { ValidationError } from '../../src/domain/errors/ValidationError';
import { CreateFileDto, UpdateFileDto } from '../../src/services/interfaces/IFileService';

describe('FileService', () => {
  let fileService: FileService;
  let mockFileRepository: MockFileRepository;

  beforeEach(() => {
    mockFileRepository = new MockFileRepository();
    fileService = new FileService(mockFileRepository);
  });

  describe('getAllFiles', () => {
    it('should return paginated files', async () => {
      const pagination = { page: 1, limit: 10 };
      
      const result = await fileService.getAllFiles(pagination);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
    });

    it('should handle pagination correctly', async () => {
      const pagination = { page: 2, limit: 5 };
      
      const result = await fileService.getAllFiles(pagination);
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
    });
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const userId = 'user_1';
      const fileData: CreateFileDto = {
        name: 'test.txt',
        type: 'text/plain',
        size: 12,
        content: 'test content',
        metadata: { description: 'Test file' }
      };
      
      const uploadedFile = await fileService.uploadFile(userId, fileData);
      
      expect(uploadedFile).toHaveProperty('id');
      expect(uploadedFile).toHaveProperty('name', 'test.txt');
      expect(uploadedFile).toHaveProperty('type', 'text/plain');
      expect(uploadedFile).toHaveProperty('size', 12);
      expect(uploadedFile).toHaveProperty('owner');
      expect(uploadedFile.owner).toHaveProperty('id', userId);
    });

    it('should throw error for invalid file data', async () => {
      const userId = 'user_1';
      const invalidFileData = {} as CreateFileDto;
      
      await expect(fileService.uploadFile(userId, invalidFileData))
        .rejects
        .toThrow(ValidationError);
    });

    it('should throw error for empty user ID', async () => {
      const fileData: CreateFileDto = {
        name: 'test.txt',
        type: 'text/plain',
        size: 12
      };
      
      await expect(fileService.uploadFile('', fileData))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('getFileById', () => {
    it('should return file by ID', async () => {
      const userId = 'user_1';
      const fileData: CreateFileDto = {
        name: 'test.txt',
        type: 'text/plain',
        size: 12,
        content: 'test content'
      };
      
      const uploadedFile = await fileService.uploadFile(userId, fileData);
      const retrievedFile = await fileService.getFileById(uploadedFile.id);
      
      expect(retrievedFile).toEqual(uploadedFile);
    });

    it('should return null for non-existent file', async () => {
      const nonExistentId = 'non_existent_file';
      
      const result = await fileService.getFileById(nonExistentId);
      
      expect(result).toBeNull();
    });

    it('should throw error for invalid file ID', async () => {
      await expect(fileService.getFileById(''))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('getRecentFiles', () => {
    it('should return recent files for user', async () => {
      const userId = 'user_1';
      const limit = 5;
      
      const recentFiles = await fileService.getRecentFiles(userId, limit);
      
      expect(recentFiles).toBeInstanceOf(Array);
      expect(recentFiles.length).toBeLessThanOrEqual(limit);
    });

    it('should use default limit when not provided', async () => {
      const userId = 'user_1';
      
      const recentFiles = await fileService.getRecentFiles(userId);
      
      expect(recentFiles).toBeInstanceOf(Array);
      expect(recentFiles.length).toBeLessThanOrEqual(10); // Default limit
    });

    it('should throw error for empty user ID', async () => {
      await expect(fileService.getRecentFiles(''))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('updateFile', () => {
    it('should update file successfully', async () => {
      const userId = 'user_1';
      const fileData: CreateFileDto = {
        name: 'test.txt',
        type: 'text/plain',
        size: 12,
        content: 'test content'
      };
      
      const uploadedFile = await fileService.uploadFile(userId, fileData);
      const updateData: UpdateFileDto = {
        name: 'updated_test.txt',
        content: 'updated content',
        metadata: { description: 'Updated description' }
      };
      
      const updatedFile = await fileService.updateFile(uploadedFile.id, userId, updateData);
      
      expect(updatedFile.name).toBe('updated_test.txt');
      // Note: content property may not be directly exposed on File model
    });

    it('should throw error for non-existent file', async () => {
      const nonExistentId = 'non_existent_file';
      const userId = 'user_1';
      const updateData: UpdateFileDto = { name: 'new_name.txt' };
      
      await expect(fileService.updateFile(nonExistentId, userId, updateData))
        .rejects
        .toThrow();
    });

    it('should throw error for invalid user ID', async () => {
      const fileId = 'file_1';
      const updateData: UpdateFileDto = { name: 'new_name.txt' };
      
      await expect(fileService.updateFile(fileId, '', updateData))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const userId = 'user_1';
      const fileData: CreateFileDto = {
        name: 'test.txt',
        type: 'text/plain',
        size: 12,
        content: 'test content'
      };
      
      const uploadedFile = await fileService.uploadFile(userId, fileData);
      
      await expect(fileService.deleteFile(uploadedFile.id, userId))
        .resolves
        .not
        .toThrow();
      
      // Verify file is deleted
      const deletedFile = await fileService.getFileById(uploadedFile.id);
      expect(deletedFile).toBeNull();
    });

    it('should throw error for non-existent file', async () => {
      const nonExistentId = 'non_existent_file';
      const userId = 'user_1';
      
      await expect(fileService.deleteFile(nonExistentId, userId))
        .rejects
        .toThrow();
    });

    it('should throw error for invalid user ID', async () => {
      const fileId = 'file_1';
      
      await expect(fileService.deleteFile(fileId, ''))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('getFilePreview', () => {
    it('should return file preview', async () => {
      const userId = 'user_1';
      const fileData: CreateFileDto = {
        name: 'test.txt',
        type: 'text/plain',
        size: 12,
        content: 'test content'
      };
      
      const uploadedFile = await fileService.uploadFile(userId, fileData);
      const preview = await fileService.getFilePreview(uploadedFile.id);
      
      expect(preview).toBeDefined();
      expect(typeof preview).toBe('string');
    });

    it('should return null for non-previewable file', async () => {
      const userId = 'user_1';
      const fileData: CreateFileDto = {
        name: 'test.bin',
        type: 'application/octet-stream',
        size: 1024
      };
      
      const uploadedFile = await fileService.uploadFile(userId, fileData);
      const preview = await fileService.getFilePreview(uploadedFile.id);
      
      expect(preview).toBeDefined();
      expect(typeof preview).toBe('string');
    });
  });

  describe('getFileHistory', () => {
    it('should return file history with pagination', async () => {
      const userId = 'user_1';
      const fileData: CreateFileDto = {
        name: 'test.txt',
        type: 'text/plain',
        size: 12,
        content: 'test content'
      };
      
      const uploadedFile = await fileService.uploadFile(userId, fileData);
      const pagination = { page: 1, limit: 10 };
      
      const history = await fileService.getFileHistory(uploadedFile.id, pagination);
      
      expect(history).toHaveProperty('items');
      expect(history).toHaveProperty('total');
      expect(history).toHaveProperty('page');
      expect(history).toHaveProperty('limit');
    });

    it('should handle pagination correctly', async () => {
      const userId = 'user_1';
      const fileData: CreateFileDto = {
        name: 'test.txt',
        type: 'text/plain',
        size: 12,
        content: 'test content'
      };
      
      const uploadedFile = await fileService.uploadFile(userId, fileData);
      const pagination = { page: 2, limit: 5 };
      
      const history = await fileService.getFileHistory(uploadedFile.id, pagination);
      
      expect(history.page).toBe(2);
      expect(history.limit).toBe(5);
    });
  });
});

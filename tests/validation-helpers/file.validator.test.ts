import { validateFileType, validateFileSize } from '../../src/validation-helpers/file.validator';

describe('File Validators', () => {
  describe('validateFileType', () => {
    it('should validate allowed file types', () => {
      const allowedTypes = ['jpg', 'png', 'gif', 'pdf'];
      
      expect(validateFileType('image.jpg', allowedTypes)).toBe(true);
      expect(validateFileType('image.PNG', allowedTypes)).toBe(true); // Case insensitive
      expect(validateFileType('document.pdf', allowedTypes)).toBe(true);
      expect(validateFileType('animation.gif', allowedTypes)).toBe(true);
    });

    it('should reject disallowed file types', () => {
      const allowedTypes = ['jpg', 'png', 'gif'];
      
      expect(validateFileType('document.txt', allowedTypes)).toBe(false);
      expect(validateFileType('script.js', allowedTypes)).toBe(false);
      expect(validateFileType('data.json', allowedTypes)).toBe(false);
    });

    it('should handle files without extensions', () => {
      const allowedTypes = ['jpg', 'png'];
      
      expect(validateFileType('filename', allowedTypes)).toBe(false);
      expect(validateFileType('', allowedTypes)).toBe(false);
    });

    it('should handle multiple dots in filename', () => {
      const allowedTypes = ['jpg', 'png'];
      
      expect(validateFileType('image.final.jpg', allowedTypes)).toBe(true);
      expect(validateFileType('backup.2023.01.png', allowedTypes)).toBe(true);
      expect(validateFileType('image.final.txt', allowedTypes)).toBe(false);
    });

    it('should handle case sensitivity', () => {
      const allowedTypes = ['jpg', 'png'];
      
      expect(validateFileType('image.JPG', allowedTypes)).toBe(true);
      expect(validateFileType('image.Png', allowedTypes)).toBe(true);
      expect(validateFileType('image.PNG', allowedTypes)).toBe(true);
    });

    it('should handle empty allowed types array', () => {
      expect(validateFileType('image.jpg', [])).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should validate file size within limit', () => {
      expect(validateFileSize(1024, 2048)).toBe(true);
      expect(validateFileSize(1024, 1024)).toBe(true); // Exactly at limit
      expect(validateFileSize(0, 1024)).toBe(true); // Zero size
    });

    it('should reject file size exceeding limit', () => {
      expect(validateFileSize(2048, 1024)).toBe(false);
      expect(validateFileSize(1025, 1024)).toBe(false);
    });

    it('should handle zero max size', () => {
      expect(validateFileSize(0, 0)).toBe(true);
      expect(validateFileSize(1, 0)).toBe(false);
    });

    it('should handle negative sizes', () => {
      expect(validateFileSize(-1, 1024)).toBe(true); // Negative size is smaller than limit
      expect(validateFileSize(1024, -1)).toBe(false); // Negative limit
    });
  });
});

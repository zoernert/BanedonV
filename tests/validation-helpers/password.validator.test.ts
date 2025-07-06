/**
 * Password Validator Tests
 */

import { validatePasswordStrength } from '../../src/validation-helpers/password.validator';

describe('Password Validator', () => {
  describe('validatePasswordStrength', () => {
    it('should validate a strong password', () => {
      const result = validatePasswordStrength('StrongP@ss123');
      expect(result.isValid).toBe(true);
      expect(result.score).toBe(6);
      expect(result.feedback).toEqual([]);
    });

    it('should reject weak passwords', () => {
      const result = validatePasswordStrength('weak');
      expect(result.isValid).toBe(false);
      expect(result.score).toBeLessThan(3);
      expect(result.feedback).toContain('Password must be at least 6 characters long');
    });

    it('should provide feedback for missing character types', () => {
      const result = validatePasswordStrength('password123');
      expect(result.feedback).toContain('Password should contain uppercase letters');
      expect(result.feedback).toContain('Password should contain special characters');
    });

    it('should score based on password complexity', () => {
      const weakResult = validatePasswordStrength('password');
      const mediumResult = validatePasswordStrength('Password123');
      const strongResult = validatePasswordStrength('Password123!');

      expect(weakResult.score).toBeLessThan(mediumResult.score);
      expect(mediumResult.score).toBeLessThan(strongResult.score);
    });

    it('should handle empty password', () => {
      const result = validatePasswordStrength('');
      expect(result.isValid).toBe(false);
      expect(result.score).toBe(0);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should handle medium length passwords', () => {
      const result = validatePasswordStrength('medPass1');
      expect(result.score).toBeGreaterThan(0);
      expect(result.feedback).toContain('Password should contain special characters');
    });
  });
});

import { randomInt, randomFloat, calculatePercentage } from '../../src/utils/number.util';

describe('Number Utilities', () => {
  describe('randomInt', () => {
    it('should generate integers within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should handle single value range', () => {
      const result = randomInt(5, 5);
      expect(result).toBe(5);
    });

    it('should handle negative numbers', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomInt(-10, -1);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-1);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should handle mixed positive and negative range', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomInt(-5, 5);
        expect(result).toBeGreaterThanOrEqual(-5);
        expect(result).toBeLessThanOrEqual(5);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('randomFloat', () => {
    it('should generate floats within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(1.0, 10.0);
        expect(result).toBeGreaterThanOrEqual(1.0);
        expect(result).toBeLessThan(10.0);
      }
    });

    it('should handle single value range', () => {
      const result = randomFloat(5.5, 5.5);
      expect(result).toBe(5.5);
    });

    it('should handle negative numbers', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomFloat(-10.0, -1.0);
        expect(result).toBeGreaterThanOrEqual(-10.0);
        expect(result).toBeLessThan(-1.0);
      }
    });

    it('should handle very small ranges', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomFloat(0.1, 0.2);
        expect(result).toBeGreaterThanOrEqual(0.1);
        expect(result).toBeLessThan(0.2);
      }
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate correct percentages', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(50, 100)).toBe(50);
      expect(calculatePercentage(75, 100)).toBe(75);
      expect(calculatePercentage(100, 100)).toBe(100);
    });

    it('should handle zero value', () => {
      expect(calculatePercentage(0, 100)).toBe(0);
    });

    it('should handle zero total', () => {
      expect(calculatePercentage(50, 0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(calculatePercentage(33.33, 100)).toBe(33);
      expect(calculatePercentage(66.67, 100)).toBe(67);
    });

    it('should handle values greater than total', () => {
      expect(calculatePercentage(150, 100)).toBe(150);
    });

    it('should handle fractional totals', () => {
      expect(calculatePercentage(1, 3)).toBe(33);
      expect(calculatePercentage(2, 3)).toBe(67);
      expect(calculatePercentage(3, 3)).toBe(100);
    });

    it('should round to nearest integer', () => {
      expect(calculatePercentage(1, 6)).toBe(17); // 16.666... rounds to 17
      expect(calculatePercentage(1, 7)).toBe(14); // 14.285... rounds to 14
    });

    it('should handle negative values', () => {
      expect(calculatePercentage(-25, 100)).toBe(-25);
      expect(calculatePercentage(25, -100)).toBe(-25);
      expect(calculatePercentage(-25, -100)).toBe(25);
    });
  });
});

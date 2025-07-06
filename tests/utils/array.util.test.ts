/**
 * Array Utility Tests
 */

import { randomElement, shuffleArray, removeDuplicates, groupBy, sortBy } from '../../src/utils/array.util';

// Mock randomInt to make tests deterministic
jest.mock('../../src/utils/number.util', () => ({
  randomInt: jest.fn(),
}));

const mockRandomInt = require('../../src/utils/number.util').randomInt as jest.MockedFunction<typeof import('../../src/utils/number.util').randomInt>;

describe('Array Utilities', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('randomElement', () => {
    it('should return a random element from array', () => {
      mockRandomInt.mockReturnValue(1);
      const array = ['a', 'b', 'c'];
      const result = randomElement(array);
      expect(result).toBe('b');
      expect(mockRandomInt).toHaveBeenCalledWith(0, 2);
    });

    it('should throw error for empty array', () => {
      expect(() => randomElement([])).toThrow('Array cannot be empty');
    });
  });

  describe('shuffleArray', () => {
    it('should shuffle array', () => {
      mockRandomInt.mockReturnValueOnce(1).mockReturnValueOnce(0);
      const array = [1, 2, 3];
      const result = shuffleArray(array);
      expect(result).not.toBe(array); // should be a new array
      expect(result).toHaveLength(3);
      expect(result.sort()).toEqual([1, 2, 3]); // should contain same elements
    });

    it('should not modify original array', () => {
      mockRandomInt.mockReturnValue(0);
      const array = [1, 2, 3];
      const original = [...array];
      shuffleArray(array);
      expect(array).toEqual(original);
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicates from array', () => {
      const array = [1, 2, 2, 3, 3, 3, 4];
      const result = removeDuplicates(array);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty array', () => {
      const result = removeDuplicates([]);
      expect(result).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      const array = [1, 2, 3, 4];
      const result = removeDuplicates(array);
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe('groupBy', () => {
    it('should group objects by property', () => {
      const array = [
        { type: 'fruit', name: 'apple' },
        { type: 'vegetable', name: 'carrot' },
        { type: 'fruit', name: 'banana' },
      ];
      const result = groupBy(array, 'type');
      expect(result).toEqual({
        fruit: [
          { type: 'fruit', name: 'apple' },
          { type: 'fruit', name: 'banana' },
        ],
        vegetable: [
          { type: 'vegetable', name: 'carrot' },
        ],
      });
    });

    it('should handle empty array', () => {
      const result = groupBy([], 'type' as any);
      expect(result).toEqual({});
    });
  });

  describe('sortBy', () => {
    it('should sort by property ascending', () => {
      const array = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ];
      const result = sortBy(array, 'age');
      expect(result.map(item => item.age)).toEqual([25, 30, 35]);
    });

    it('should sort by property descending', () => {
      const array = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ];
      const result = sortBy(array, 'age', 'desc');
      expect(result.map(item => item.age)).toEqual([35, 30, 25]);
    });

    it('should not modify original array', () => {
      const array = [{ age: 30 }, { age: 25 }];
      const original = [...array];
      sortBy(array, 'age');
      expect(array).toEqual(original);
    });
  });
});

import { deepClone, isEmpty, parseJSON } from '../../src/utils/object.util';

describe('Object Utilities', () => {
  describe('deepClone', () => {
    it('should clone simple objects', () => {
      const original = { a: 1, b: 'test' };
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should clone nested objects', () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 'nested'
          }
        }
      };
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
      expect(cloned.b.d).not.toBe(original.b.d);
    });

    it('should clone arrays', () => {
      const original = [1, 2, { a: 3 }];
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[2]).not.toBe(original[2]);
    });

    it('should handle null', () => {
      expect(deepClone(null)).toBe(null);
    });

    it('should handle undefined by returning undefined behavior', () => {
      // deepClone with undefined will cause JSON.stringify to return undefined
      // which JSON.parse cannot handle - this is expected behavior
      expect(() => deepClone(undefined)).toThrow();
    });

    it('should handle primitive values', () => {
      expect(deepClone(123)).toBe(123);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(true)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(false); // Non-empty string
    });

    it('should return true for empty arrays', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1])).toBe(false);
    });

    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });

    it('should handle numbers', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(123)).toBe(false);
      expect(isEmpty(-1)).toBe(false);
    });

    it('should handle booleans', () => {
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty(true)).toBe(false);
    });
  });

  describe('parseJSON', () => {
    it('should parse valid JSON', () => {
      const json = '{"a": 1, "b": "test"}';
      const result = parseJSON(json);
      
      expect(result).toEqual({ a: 1, b: 'test' });
    });

    it('should parse valid JSON arrays', () => {
      const json = '[1, 2, 3]';
      const result = parseJSON(json);
      
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return default value for invalid JSON', () => {
      const invalidJson = '{"invalid": json}';
      const result = parseJSON(invalidJson, 'default');
      
      expect(result).toBe('default');
    });

    it('should return null as default value when not specified', () => {
      const invalidJson = '{"invalid": json}';
      const result = parseJSON(invalidJson);
      
      expect(result).toBe(null);
    });

    it('should handle empty strings', () => {
      const result = parseJSON('', 'empty');
      expect(result).toBe('empty');
    });

    it('should handle complex objects', () => {
      const complexObject = {
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ],
        meta: {
          total: 2,
          page: 1
        }
      };
      const json = JSON.stringify(complexObject);
      const result = parseJSON(json);
      
      expect(result).toEqual(complexObject);
    });
  });
});

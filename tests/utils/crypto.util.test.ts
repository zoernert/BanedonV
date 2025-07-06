import { generateHash } from '../../src/utils/crypto.util';

describe('Crypto Utilities', () => {
  describe('generateHash', () => {
    it('should generate a hash with default algorithm (sha256)', () => {
      const input = 'test-string';
      const hash = generateHash(input);
      
      expect(hash).toBeTruthy();
      expect(hash).toHaveLength(64); // SHA256 produces 64 character hex string
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate consistent hashes for same input', () => {
      const input = 'test-string';
      const hash1 = generateHash(input);
      const hash2 = generateHash(input);
      
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = generateHash('input1');
      const hash2 = generateHash('input2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should work with different algorithms', () => {
      const input = 'test-string';
      const sha256Hash = generateHash(input, 'sha256');
      const md5Hash = generateHash(input, 'md5');
      
      expect(sha256Hash).toHaveLength(64);
      expect(md5Hash).toHaveLength(32);
      expect(sha256Hash).not.toBe(md5Hash);
    });

    it('should handle empty string input', () => {
      const hash = generateHash('');
      expect(hash).toBeTruthy();
      expect(hash).toHaveLength(64);
    });
  });
});

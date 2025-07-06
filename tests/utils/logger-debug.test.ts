import * as logger from '../../src/utils/logger';

describe('Logger Debug', () => {
  test('check exports', () => {
    console.log('Logger exports:', Object.keys(logger));
    console.log('setLogger available:', typeof logger.setLogger);
  });
});

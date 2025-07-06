// Simple debug test to check logger module exports
describe('Logger Debug', () => {
  it('should debug logger module', () => {
    console.log('=== BEFORE REQUIRE ===');
    const loggerModule = require('../../src/utils/logger');
    console.log('=== AFTER REQUIRE ===');
    console.log('Logger module keys:', Object.keys(loggerModule));
    console.log('setLogger type:', typeof loggerModule.setLogger);
    console.log('setLogger function:', loggerModule.setLogger);
    console.log('=== END DEBUG ===');
  });
});

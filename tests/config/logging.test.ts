import { loggingConfig, logLevels, logColors } from '../../src/config/logging';

describe('Logging Configuration', () => {
  it('should export a valid logging configuration', () => {
    expect(loggingConfig).toBeDefined();
    expect(loggingConfig.level).toBe('info');
    expect(loggingConfig.silent).toBe(false);
    expect(loggingConfig.format).toBe('json');
  });

  it('should have console transport configuration', () => {
    expect(loggingConfig.transports.console).toBeDefined();
    expect(loggingConfig.transports.console.enabled).toBe(true);
    expect(loggingConfig.transports.console.level).toBe('debug');
    expect(loggingConfig.transports.console.colorize).toBe(true);
  });

  it('should have file transport configuration', () => {
    expect(loggingConfig.transports.file).toBeDefined();
    expect(loggingConfig.transports.file.enabled).toBe(true);
    expect(loggingConfig.transports.file.level).toBe('info');
    expect(loggingConfig.transports.file.filename).toBe('logs/combined.log');
    expect(loggingConfig.transports.file.maxSize).toBe('10m');
    expect(loggingConfig.transports.file.maxFiles).toBe(10);
  });

  it('should have error transport configuration', () => {
    expect(loggingConfig.transports.error).toBeDefined();
    expect(loggingConfig.transports.error.enabled).toBe(true);
    expect(loggingConfig.transports.error.level).toBe('error');
    expect(loggingConfig.transports.error.filename).toBe('logs/error.log');
    expect(loggingConfig.transports.error.maxSize).toBe('10m');
    expect(loggingConfig.transports.error.maxFiles).toBe(10);
  });

  it('should have request logging configuration', () => {
    expect(loggingConfig.requestLogging).toBeDefined();
    expect(loggingConfig.requestLogging.enabled).toBe(true);
    expect(loggingConfig.requestLogging.skipSuccessfulRequests).toBe(false);
    expect(loggingConfig.requestLogging.skipFailedRequests).toBe(false);
    expect(loggingConfig.requestLogging.includeUserAgent).toBe(true);
    expect(loggingConfig.requestLogging.includeRemoteAddr).toBe(true);
  });

  it('should have performance logging configuration', () => {
    expect(loggingConfig.performanceLogging).toBeDefined();
    expect(loggingConfig.performanceLogging.enabled).toBe(true);
    expect(loggingConfig.performanceLogging.threshold).toBe(1000);
    expect(loggingConfig.performanceLogging.includeStackTrace).toBe(false);
  });

  it('should export log levels', () => {
    expect(logLevels).toBeDefined();
    expect(logLevels.error).toBe(0);
    expect(logLevels.warn).toBe(1);
    expect(logLevels.info).toBe(2);
    expect(logLevels.http).toBe(3);
    expect(logLevels.verbose).toBe(4);
    expect(logLevels.debug).toBe(5);
    expect(logLevels.silly).toBe(6);
  });

  it('should export log colors', () => {
    expect(logColors).toBeDefined();
    expect(logColors.error).toBe('red');
    expect(logColors.warn).toBe('yellow');
    expect(logColors.info).toBe('green');
    expect(logColors.http).toBe('magenta');
    expect(logColors.verbose).toBe('cyan');
    expect(logColors.debug).toBe('blue');
    expect(logColors.silly).toBe('grey');
  });

  it('should have proper TypeScript types', () => {
    expect(typeof loggingConfig.level).toBe('string');
    expect(typeof loggingConfig.silent).toBe('boolean');
    expect(typeof loggingConfig.format).toBe('string');
    expect(typeof loggingConfig.transports).toBe('object');
    expect(typeof loggingConfig.requestLogging).toBe('object');
    expect(typeof loggingConfig.performanceLogging).toBe('object');
  });
});

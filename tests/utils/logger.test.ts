import logger from '../../src/utils/logger';

// Mock external dependencies
jest.mock('winston', () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    level: 'info',
    clear: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    configure: jest.fn(),
    query: jest.fn(),
    stream: jest.fn(),
    profile: jest.fn(),
    startTimer: jest.fn(),
    log: jest.fn(),
    silly: jest.fn(),
    verbose: jest.fn(),
    notice: jest.fn(),
    http: jest.fn(),
    warning: jest.fn(),
    crit: jest.fn(),
    alert: jest.fn(),
    emerg: jest.fn(),
    child: jest.fn(),
    exceptions: {
      handle: jest.fn(),
      unhandle: jest.fn()
    },
    rejections: {
      handle: jest.fn(),
      unhandle: jest.fn()
    }
  }),
  format: {
    combine: jest.fn().mockReturnValue({}),
    timestamp: jest.fn().mockReturnValue({}),
    errors: jest.fn().mockReturnValue({}),
    json: jest.fn().mockReturnValue({}),
    colorize: jest.fn().mockReturnValue({}),
    simple: jest.fn().mockReturnValue({}),
    printf: jest.fn().mockReturnValue({})
  },
  transports: {
    Console: jest.fn().mockImplementation(() => ({})),
    File: jest.fn().mockImplementation(() => ({}))
  }
}));

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/'))
}));

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export a logger instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should log info messages', () => {
    logger.info('Test info message');
    expect(logger.info).toHaveBeenCalledWith('Test info message');
  });

  it('should log error messages', () => {
    logger.error('Test error message');
    expect(logger.error).toHaveBeenCalledWith('Test error message');
  });

  it('should log warning messages', () => {
    logger.warn('Test warning message');
    expect(logger.warn).toHaveBeenCalledWith('Test warning message');
  });

  it('should log debug messages', () => {
    logger.debug('Test debug message');
    expect(logger.debug).toHaveBeenCalledWith('Test debug message');
  });

  it('should log messages with objects', () => {
    const testObj = { key: 'value' };
    logger.info('Test message with object', testObj);
    expect(logger.info).toHaveBeenCalledWith('Test message with object', testObj);
  });

  it('should log error messages with error objects', () => {
    const error = new Error('Test error');
    logger.error('Test error message', { error });
    expect(logger.error).toHaveBeenCalledWith('Test error message', { error });
  });
});

// Mock dependencies before importing the server
jest.mock('../src/app', () => {
  return jest.fn().mockImplementation(() => ({
    getApp: jest.fn().mockReturnValue({
      listen: jest.fn().mockImplementation((port, host, callback) => {
        callback();
        return {
          close: jest.fn().mockImplementation((callback) => {
            callback();
          })
        };
      })
    }),
    getConfig: jest.fn().mockReturnValue({
      port: 3000,
      host: 'localhost',
      protocol: 'http',
      api: {
        prefix: '/api',
        version: 'v1'
      }
    })
  }));
});

jest.mock('../src/utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

jest.mock('../src/config/server', () => ({
  serverConfig: {
    port: 3000,
    host: 'localhost',
    protocol: 'http',
    api: {
      prefix: '/api',
      version: 'v1'
    }
  }
}));

jest.mock('../src/middleware/error', () => ({
  ErrorMiddleware: {
    setupGlobalHandlers: jest.fn()
  }
}));

describe('Server', () => {
  let logger: any;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    logger = require('../src/utils/logger').default;
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should test server module can be imported', () => {
    // Test that server module exists and can be imported
    expect(() => {
      require('../src/server');
    }).not.toThrow();
  });

  it('should create server with proper configuration', () => {
    const server = require('../src/server');
    expect(server).toBeDefined();
  });

  it('should log server start information when imported', () => {
    // Re-import to trigger logging
    jest.isolateModules(() => {
      require('../src/server');
    });
    
    expect(logger.info).toHaveBeenCalledWith('BanedonV Mock Server started', expect.objectContaining({
      port: expect.any(Number),
      host: expect.any(String),
      protocol: expect.any(String),
      environment: expect.any(String),
      pid: expect.any(Number),
      timestamp: expect.any(String)
    }));
  });

  it('should log available endpoints when imported', () => {
    // Re-import to trigger logging
    jest.isolateModules(() => {
      require('../src/server');
    });
    
    expect(logger.info).toHaveBeenCalledWith('Available endpoints:', expect.objectContaining({
      health: expect.any(String),
      metrics: expect.any(String),
      api: expect.any(String),
      docs: expect.any(String)
    }));
  });

  it('should use PORT from environment variable', () => {
    process.env.PORT = '4000';
    
    // Re-import to test with new env
    jest.isolateModules(() => {
      require('../src/server');
    });
    
    expect(logger.info).toHaveBeenCalledWith('BanedonV Mock Server started', expect.objectContaining({
      port: 4000
    }));
  });

  it('should use HOST from environment variable', () => {
    process.env.HOST = '0.0.0.0';
    
    // Re-import to test with new env
    jest.isolateModules(() => {
      require('../src/server');
    });
    
    expect(logger.info).toHaveBeenCalledWith('BanedonV Mock Server started', expect.objectContaining({
      host: '0.0.0.0'
    }));
  });

  it('should handle SIGTERM gracefully', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    // Import server to set up handlers
    jest.isolateModules(() => {
      require('../src/server');
    });

    // Simulate SIGTERM
    try {
      process.emit('SIGTERM');
    } catch (error) {
      // Expected to throw due to mocked process.exit
    }

    expect(logger.info).toHaveBeenCalledWith('SIGTERM received, shutting down gracefully');
    expect(logger.info).toHaveBeenCalledWith('Server closed');
    expect(mockExit).toHaveBeenCalledWith(0);

    mockExit.mockRestore();
  });

  it('should handle SIGINT gracefully', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    // Import server to set up handlers
    jest.isolateModules(() => {
      require('../src/server');
    });

    // Simulate SIGINT
    try {
      process.emit('SIGINT');
    } catch (error) {
      // Expected to throw due to mocked process.exit
    }

    expect(logger.info).toHaveBeenCalledWith('SIGINT received, shutting down gracefully');
    expect(logger.info).toHaveBeenCalledWith('Server closed');
    expect(mockExit).toHaveBeenCalledWith(0);

    mockExit.mockRestore();
  });
});

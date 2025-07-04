/**
 * Health Check Routes
 * System health monitoring endpoints
 */

import { Router, Request, Response } from 'express';
import ResponseUtil from '../utils/response';
import logger from '../utils/logger';

const router = Router();

/**
 * Basic health check
 */
router.get('/', (req: Request, res: Response) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    },
    version: process.version,
    platform: process.platform,
    arch: process.arch
  };

  ResponseUtil.success(res, healthData, 'System is healthy');
});

/**
 * Detailed health check
 */
router.get('/detailed', (req: Request, res: Response) => {
  const detailedHealth = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    system: {
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
      },
      cpu: {
        usage: process.cpuUsage()
      },
      process: {
        pid: process.pid,
        version: process.version,
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.versions.node,
        v8Version: process.versions.v8
      }
    },
    services: {
      database: {
        status: 'healthy',
        type: 'mock',
        connectionTime: Math.random() * 10
      },
      cache: {
        status: 'healthy',
        type: 'memory',
        hitRate: Math.random() * 100
      },
      storage: {
        status: 'healthy',
        type: 'mock',
        freeSpace: Math.random() * 1000
      }
    },
    endpoints: {
      api: {
        status: 'healthy',
        responseTime: Math.random() * 100
      },
      auth: {
        status: 'healthy',
        responseTime: Math.random() * 100
      },
      search: {
        status: 'healthy',
        responseTime: Math.random() * 100
      }
    }
  };

  ResponseUtil.success(res, detailedHealth, 'Detailed system health');
});

/**
 * Readiness check
 */
router.get('/ready', (req: Request, res: Response) => {
  const readinessData = {
    ready: true,
    timestamp: new Date().toISOString(),
    services: {
      database: true,
      cache: true,
      storage: true,
      auth: true
    }
  };

  ResponseUtil.success(res, readinessData, 'System is ready');
});

/**
 * Liveness check
 */
router.get('/live', (req: Request, res: Response) => {
  const livenessData = {
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };

  ResponseUtil.success(res, livenessData, 'System is alive');
});

export default router;

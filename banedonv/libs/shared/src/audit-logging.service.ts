import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

enum AuditLogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface AuditLog {
  level: AuditLogLevel;
  message: string;
  userId?: string;
  details?: Record<string, any>;
}

export class AuditLoggingService {
  async log(log: AuditLog): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          level: log.level,
          message: log.message,
          userId: log.userId,
          details: log.details ? JSON.stringify(log.details) : undefined,
        },
      });
    } catch (error) {
      console.error('Failed to write to audit log:', error);
      // In a production environment, you might have a fallback logging mechanism
    }
  }

  info(message: string, userId?: string, details?: Record<string, any>): void {
    this.log({ level: AuditLogLevel.INFO, message, userId, details });
  }

  warn(message: string, userId?: string, details?: Record<string, any>): void {
    this.log({ level: AuditLogLevel.WARN, message, userId, details });
  }

  error(message: string, userId?: string, details?: Record<string, any>): void {
    this.log({ level: AuditLogLevel.ERROR, message, userId, details });
  }
}

// Example Usage:
// const auditLogger = new AuditLoggingService();
// auditLogger.info('User logged in successfully', 'user-123', { ip: '127.0.0.1' });
// auditLogger.warn('Failed login attempt', undefined, { email: 'attempt@example.com' });

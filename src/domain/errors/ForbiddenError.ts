import { DomainError } from './DomainError';
import { ErrorCodes } from './ErrorCodes';

export class ForbiddenError extends DomainError {
  readonly statusCode = 403;
  readonly code = ErrorCodes.VALIDATION.FORBIDDEN;

  constructor(message: string = 'Access denied') {
    super(message);
  }

  static accessDenied(): ForbiddenError {
    return new ForbiddenError('Access denied');
  }

  static insufficientPermissions(): ForbiddenError {
    return new ForbiddenError('Insufficient permissions');
  }

  static teamAccess(): ForbiddenError {
    return new ForbiddenError('You do not have permission to access this team');
  }

  static teamModification(): ForbiddenError {
    return new ForbiddenError('You do not have permission to modify this team');
  }

  static memberManagement(): ForbiddenError {
    return new ForbiddenError('You do not have permission to manage team members');
  }
}

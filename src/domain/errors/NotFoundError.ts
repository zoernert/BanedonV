import { DomainError } from './DomainError';
import { ErrorCodes } from './ErrorCodes';

export class NotFoundError extends DomainError {
  readonly statusCode = 404;
  readonly code = ErrorCodes.VALIDATION.NOT_FOUND;

  constructor(message: string = 'Resource not found') {
    super(message);
  }

  static team(id?: string): NotFoundError {
    return new NotFoundError(id ? `Team with id ${id} not found` : 'Team not found');
  }

  static user(id?: string): NotFoundError {
    return new NotFoundError(id ? `User with id ${id} not found` : 'User not found');
  }

  static invitation(id?: string): NotFoundError {
    return new NotFoundError(id ? `Invitation with id ${id} not found` : 'Invitation not found');
  }

  static joinRequest(id?: string): NotFoundError {
    return new NotFoundError(id ? `Join request with id ${id} not found` : 'Join request not found');
  }
}

import { DomainError } from './DomainError';
import { ErrorCodes } from './ErrorCodes';

export class UserError extends DomainError {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 404
  ) {
    super(message);
  }

  static notFound(): UserError {
    return new UserError(ErrorCodes.USER.NOT_FOUND, 'User not found');
  }

  static cannotDeleteSelf(): UserError {
    return new UserError(ErrorCodes.USER.CANNOT_DELETE_SELF, 'Cannot delete your own account', 400);
  }

  static cannotChangeOwnRole(): UserError {
    return new UserError(ErrorCodes.USER.CANNOT_CHANGE_OWN_ROLE, 'Cannot change your own role', 400);
  }

  static invalidRole(): UserError {
    return new UserError(ErrorCodes.USER.INVALID_ROLE, 'Invalid role specified', 400);
  }
}

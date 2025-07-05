import { DomainError } from './DomainError';
import { ErrorCodes } from './ErrorCodes';

export class AuthError extends DomainError {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 401
  ) {
    super(message);
  }

  static invalidCredentials(): AuthError {
    return new AuthError(ErrorCodes.AUTH.INVALID_CREDENTIALS, 'Invalid email or password');
  }

  static tokenExpired(): AuthError {
    return new AuthError(ErrorCodes.AUTH.TOKEN_EXPIRED, 'Authentication token has expired');
  }

  static userExists(): AuthError {
    return new AuthError(ErrorCodes.AUTH.EMAIL_ALREADY_EXISTS, 'Email already exists', 409);
  }

  static refreshTokenRequired(): AuthError {
    return new AuthError(ErrorCodes.AUTH.REFRESH_TOKEN_REQUIRED, 'Refresh token required', 400);
  }

  static invalidRefreshToken(): AuthError {
    return new AuthError(ErrorCodes.AUTH.INVALID_REFRESH_TOKEN, 'Invalid refresh token');
  }

  static invalidToken(): AuthError {
    return new AuthError(ErrorCodes.AUTH.INVALID_TOKEN, 'Invalid or expired token', 400);
  }
}

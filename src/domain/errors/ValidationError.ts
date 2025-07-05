import { DomainError } from './DomainError';
import { ErrorCodes } from './ErrorCodes';

export class ValidationError extends DomainError {
  readonly statusCode = 400;

  constructor(public readonly code: string, message: string) {
    super(message);
  }

  static requiredField(fieldName: string): ValidationError {
    return new ValidationError(ErrorCodes.VALIDATION.REQUIRED_FIELD, `${fieldName} is required`);
  }
}

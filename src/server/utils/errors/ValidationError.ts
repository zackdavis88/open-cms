import { ErrorType, ERROR_TYPES } from './index';

class ValidationError extends Error {
  statusCode: number;
  errorType: ErrorType;

  constructor(message: string) {
    super(message);
    this.statusCode = 422;
    this.errorType = ERROR_TYPES.VALIDATION;
  }
}

export default ValidationError;

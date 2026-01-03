import { ErrorType, ERROR_TYPES } from './index';

class AuthorizationError extends Error {
  statusCode: number;
  errorType: ErrorType;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
    this.errorType = ERROR_TYPES.AUTHORIZATION;
  }
}

export default AuthorizationError;

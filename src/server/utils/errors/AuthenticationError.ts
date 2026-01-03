import { ErrorType, ERROR_TYPES } from './index';

class AuthenticationError extends Error {
  statusCode: number;
  errorType: ErrorType;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    this.errorType = ERROR_TYPES.AUTHENTICATION;
  }
}

export default AuthenticationError;

import { ErrorType, ERROR_TYPES } from './index';

class NotFoundError extends Error {
  statusCode: number;
  errorType: ErrorType;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    this.errorType = ERROR_TYPES.NOT_FOUND;
  }
}

export default NotFoundError;

import { Response, Request, NextFunction } from 'express';
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  ERROR_TYPES,
} from './errors';

/*
  NAME: Success
  CODE: 200
  DESC: Used to send a successful API response.
*/
const success = (res: Response) => {
  return (message: string, data: Record<string, unknown> = {}) => {
    res.statusCode = 200;
    if (!res.headersSent) {
      return res.json({ message, ...data });
    }
  };
};

/*
  NAME: SendError
  DESC: Receives a thrown error and sends an error response 
        based on the type of error received.
*/
const sendError = (res: Response) => (error: unknown) => {
  const isValidationError = error instanceof ValidationError;
  const isNotFoundError = error instanceof NotFoundError;
  const isAuthenticationError = error instanceof AuthenticationError;
  const isAuthorizationError = error instanceof AuthorizationError;

  const isKnownError =
    isValidationError || isNotFoundError || isAuthenticationError || isAuthorizationError;

  if (!res.headersSent) {
    if (isKnownError) {
      res.statusCode = error.statusCode;
      return res.json({
        error: error.message,
        errorType: error.errorType,
      });
    } else {
      res.statusCode = 500;
      return res.json({
        error: 'an unknown error has occurred',
        errorType: ERROR_TYPES.FATAL,
        errorDetails: error,
      });
    }
  }
};

const configureResponseHandlers = (_req: Request, res: Response, next: NextFunction) => {
  res.success = success(res);
  res.sendError = sendError(res);
  return next();
};

export default configureResponseHandlers;

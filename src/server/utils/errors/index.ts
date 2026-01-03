export const ERROR_TYPES = {
  FATAL: 'FATAL',
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

export { default as ValidationError } from './ValidationError';
export { default as NotFoundError } from './NotFoundError';
export { default as AuthenticationError } from './AuthenticationError';
export { default as AuthorizationError } from './AuthorizationError';

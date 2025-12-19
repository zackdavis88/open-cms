const AuthorizationError = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      description: 'Error message describing what went wrong',
      examples: ['An authorization error occurred.'],
    },
    errorType: {
      type: 'string',
      description: 'Type of error that occurred',
      examples: ['AUTHORIZATION'],
    },
  },
  required: ['error', 'errorType'],
};

export default AuthorizationError;

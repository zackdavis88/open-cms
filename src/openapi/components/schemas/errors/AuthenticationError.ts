const AuthenticationError = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      description: 'Error message describing what went wrong',
      examples: ['An authentication error occurred.'],
    },
    errorType: {
      type: 'string',
      description: 'Type of error that occurred',
      examples: ['AUTHENTICATION'],
    },
  },
  required: ['error', 'errorType'],
};

export default AuthenticationError;

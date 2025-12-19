const NotFoundError = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      description: 'Error message describing what went wrong',
      examples: ['Requested resource was not found.'],
    },
    errorType: {
      type: 'string',
      description: 'Type of error that occurred',
      examples: ['NOT_FOUND'],
    },
  },
  required: ['error', 'errorType'],
};

export default NotFoundError;

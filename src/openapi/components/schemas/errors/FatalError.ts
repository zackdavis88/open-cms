const FatalError = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      description: 'Error message describing what went wrong',
      examples: ['Something went wrong.'],
    },
    errorType: {
      type: 'string',
      description: 'Type of error that occurred',
      examples: ['FATAL'],
    },
  },
  required: ['error', 'errorType'],
};

export default FatalError;

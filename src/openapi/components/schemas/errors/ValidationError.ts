const ValidationError = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      description: 'Error message describing what went wrong',
      examples: ['A validation error occurred.'],
    },
    errorType: {
      type: 'string',
      description: 'Type of error that occurred',
      examples: ['VALIDATION'],
    },
  },
  required: ['error', 'errorType'],
};

export default ValidationError;

const ValidationError = {
  description: 'Validation Error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        description: 'Validation error details',
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
      },
    },
  },
};

export default ValidationError;

const FatalError = {
  description: 'Internal Server Error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        description: 'Fatal error details',
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
      },
    },
  },
};

export default FatalError;

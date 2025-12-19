const NotFoundError = {
  description: 'Not Found Error',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        description: 'NotFound error details',
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
      },
    },
  },
};

export default NotFoundError;

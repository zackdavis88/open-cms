import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Open CMS',
      version: '0.0.1',
      description: 'Endpoint documentation for Open CMS API',
    },
    servers: [
      {
        url: 'http://www.open-cms.com',
        description: 'API server',
      },
    ],
    components: {
      schemas: {
        FatalError: {
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
        },
        ValidationError: {
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
        },
        AuthenticationError: {
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
        },
        AuthorizationError: {
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
        },
        NotFoundError: {
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
        },
      },
    },
  },
  apis: ['./src/routes/**/*.openapi.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

const configureDiscoveryRoutes = (router: Router) => {
  router.route('/discovery/swagger.json').get((_req, res) => {
    res.json(swaggerSpec);
  });
};

export default configureDiscoveryRoutes;

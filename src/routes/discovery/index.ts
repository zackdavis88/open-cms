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
        url: 'https://www.open-cms.com',
        description: 'API server',
      },
      {
        url: `http://localhost:${process.env.SERVER_PORT}`,
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          format: 'JWT',
        },
      },
      schemas: {
        PublicUserData: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Unique, lowercase, username for the user',
              examples: ['johndoe'],
            },
            displayName: {
              type: 'string',
              description: 'Unique, case-sensitive display name for the user',
              examples: ['JohnDoe'],
            },
            createdOn: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of when the user was created',
              examples: ['2023-10-05T14:48:00.000Z'],
            },
          },
          required: ['username', 'displayName', 'createdOn'],
        },
        UserData: {
          allOf: [
            { $ref: '#/components/schemas/PublicUserData' },
            {
              type: 'object',
              properties: {
                updatedOn: {
                  type: ['string', 'null'],
                  format: 'date-time',
                  description: 'Timestamp of when the user was last updated',
                  examples: ['2023-11-05T15:00:00.000Z', null],
                },
              },
            },
          ],
          required: ['username', 'displayName', 'createdOn', 'updatedOn'],
        },
        PageParam: {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
          },
          description: 'Requested page of results',
        },
        ItemsPerPageParam: {
          name: 'itemsPerPage',
          in: 'query',
          schema: {
            type: 'integer',
          },
          description: 'Number of results per page',
        },
        OrderColumnParam: {
          name: 'orderColumn',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Column to order results by',
        },
        OrderByParam: {
          name: 'orderBy',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc',
          },
          description: 'Direction to order results by',
        },
        FilterStringColumnParam: {
          name: 'filterStringColumn',
          in: 'query',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          style: 'form',
          explode: true,
        },
        FilterStringValueParam: {
          name: 'filterStringValue',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
        FilterDateColumnParam: {
          name: 'filterDateColumn',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
        FilterDateValueParam: {
          name: 'filterDateValue',
          in: 'query',
          schema: {
            type: 'date',
            format: 'date-time',
          },
        },
        FilterDateOpParam: {
          name: 'filterDateOp',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['eq', 'gt', 'lt', 'gte', 'lte'],
          },
        },
        PaginationData: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'the current page of the results',
              examples: [1],
            },
            totalPages: {
              type: 'integer',
              description: 'the total number of pages',
              examples: [7],
            },
            itemsPerPage: {
              type: 'integer',
              description: 'the total number of items per page',
              examples: [10],
            },
            totalItems: {
              type: 'integer',
              description: 'the total number of results',
              examples: [70],
            },
          },
          required: ['page', 'totalPages', 'itemsPerPage', 'totalItems'],
        },
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

export const swaggerSpec = swaggerJsdoc(options);

const configureDiscoveryRoutes = (router: Router) => {
  router.route('/discovery').get((_req, res) => {
    return res.json(swaggerSpec);
  });
};

export default configureDiscoveryRoutes;

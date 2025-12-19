import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const buildComponentSchemas = () => {
  const rootPath = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
  const schemaFiles = fs.globSync([
    `./${rootPath}/openapi/components/schemas/**/*.${fileExtension}`,
  ]);

  return schemaFiles.reduce((prev, fullPath) => {
    const file = path.resolve(fullPath);
    const filenameWithoutExt = path.basename(fullPath, path.extname(fullPath));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const schema = require(path.resolve(file)).default;
    if (typeof schema === 'object') {
      return {
        ...prev,
        [filenameWithoutExt]: schema,
      };
    }

    return prev;
  }, {});
};

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
      schemas: buildComponentSchemas(),
    },
  },
  apis: ['./src/openapi/apis/**/*.openapi.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

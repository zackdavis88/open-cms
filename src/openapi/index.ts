import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

let BASE_URL = '/api';
if (typeof process.env.BASE_URL === 'string' && process.env.BASE_URL.startsWith('/')) {
  BASE_URL = process.env.BASE_URL;
}

const buildComponents = (componentGroup: 'schemas' | 'parameters' | 'responses') => {
  const rootPath = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
  const componentFiles = fs.globSync([
    `./${rootPath}/openapi/components/${componentGroup}/**/*.${fileExtension}`,
  ]);

  return componentFiles.reduce((prev, fullPath) => {
    const file = path.resolve(fullPath);
    const filenameWithoutExt = path.basename(fullPath, path.extname(fullPath));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const component = require(path.resolve(file)).default;
    if (typeof component === 'object') {
      return {
        ...prev,
        [filenameWithoutExt]: component,
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
      version: '1.0.0',
      description: 'Endpoint documentation for Open CMS API',
    },
    servers: [
      {
        url: new URL(BASE_URL, 'https://www.open-cms.com').toString(),
        description: 'API server',
      },
      {
        url: new URL(BASE_URL, `http://localhost:${process.env.SERVER_PORT}`).toString(),
        description: 'Local development API server',
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
        },
      },
      schemas: buildComponents('schemas'),
      parameters: buildComponents('parameters'),
      responses: buildComponents('responses'),
    },
  },
  apis: ['./src/openapi/apis/**/*.openapi.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

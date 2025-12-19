import express, { Express } from 'express';
import path from 'path';
import fs from 'fs';
import { NotFoundError } from './errors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from 'src/openapi';

const configureRoutes = (app: Express) => {
  const rootPath = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
  const routeFiles = fs.globSync(`./${rootPath}/routes/**/index.${fileExtension}`);
  const apiRouter = express.Router();

  const routeFilePromises = routeFiles.map(async (file) => {
    const routeModule = await import(path.resolve(file));
    if (routeModule.default && typeof routeModule.default === 'function') {
      routeModule.default(apiRouter);
      app.use('/api', apiRouter);
    }
  });

  return Promise.all(routeFilePromises).then(() => {
    const documentationRouter = express.Router();
    documentationRouter.use('/docs', swaggerUi.serve);
    documentationRouter.route('/docs').get(swaggerUi.setup(swaggerSpec));
    app.use(documentationRouter);

    const catchAllRouter = express.Router();
    catchAllRouter.route('/{*splat}').all((_req, res) => {
      const routeNotFoundError = new NotFoundError('API route not found');
      res.sendError(routeNotFoundError);
    });
    app.use(catchAllRouter);
  });
};

export default configureRoutes;

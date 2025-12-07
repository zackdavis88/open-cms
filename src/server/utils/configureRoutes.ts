import express, { Express } from 'express';
import path from 'path';
import fs from 'fs';
import { NotFoundError } from './errors';

const configureRoutes = (app: Express) => {
  const rootPath = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const routeFiles = fs.globSync(`./${rootPath}/routes/**/*`);

  const routeFilePromises = routeFiles.map(async (file) => {
    const routeModule = await import(path.resolve(file));
    if (routeModule.default && typeof routeModule.default === 'function') {
      const router = express.Router();
      routeModule.default(router);
      app.use('/api', router);
    }
  });

  return Promise.all(routeFilePromises).then(() => {
    app.route('/{*splat}').all((_req, res) => {
      const routeNotFoundError = new NotFoundError('API route not found');
      res.sendError(routeNotFoundError);
    });
  });
};

export default configureRoutes;

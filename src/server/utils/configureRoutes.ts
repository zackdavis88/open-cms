import express, { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { NotFoundError } from './errors';

let DEFAULT_BASE_URL = '/api';
if (typeof process.env.BASE_URL === 'string' && process.env.BASE_URL.startsWith('/')) {
  DEFAULT_BASE_URL = process.env.BASE_URL;
}

const configureRoutes = async (app: Express) => {
  const rootPath = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
  const routeFiles = fs.globSync(`./${rootPath}/routes/**/index.${fileExtension}`);
  const router = express.Router();

  const routeFilePromises = routeFiles.map(async (file) => {
    const routeModule = await import(path.resolve(file));
    if (routeModule.default && typeof routeModule.default === 'function') {
      routeModule.default(router);
      const { baseUrl } = routeModule;
      if (typeof baseUrl === 'string' && baseUrl.startsWith('/')) {
        app.use(baseUrl, router);
      } else {
        app.use(DEFAULT_BASE_URL, router);
      }
    }
  });

  await Promise.all(routeFilePromises);

  // After configuring all known routes, setup a catch-all that returns a 404 for any unknown route.
  const catchAllRouter = express.Router();
  catchAllRouter.route('/{*splat}').all((_req: Request, res: Response) => {
    const routeNotFounderror = new NotFoundError('API route not found');
    return res.sendError(routeNotFounderror);
  });
  app.use(catchAllRouter);
};

export default configureRoutes;

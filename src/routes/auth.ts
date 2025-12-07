import { Router } from 'express';

const configureAuthRoutes = (router: Router) => {
  router.get('/auth', (_req, res) => {
    return res.success('Hello, Auth!');
  });
};

export default configureAuthRoutes;

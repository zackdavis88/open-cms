import { Router } from 'express';

const configureUserRoutes = (router: Router) => {
  router.get('/users', (_req, res) => {
    return res.success('Hello, Users!');
  });
};

export default configureUserRoutes;

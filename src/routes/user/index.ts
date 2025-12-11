import { Router } from 'express';
import { UserController } from 'src/controllers';

const configureUserRoutes = (router: Router) => {
  router.post('/users', UserController.create);
};

export default configureUserRoutes;

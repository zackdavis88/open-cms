import { Router } from 'express';
import { AuthController } from 'src/controllers';

const configureAuthRoutes = (router: Router) => {
  router.route('/auth').get(AuthController.generateAuthToken);

  router.route('/auth/refresh').get(AuthController.refreshAuthToken);
};

export default configureAuthRoutes;

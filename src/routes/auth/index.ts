import { Router } from 'express';
import { AuthController } from 'src/controllers';

const configureAuthRoutes = (router: Router) => {
  router.route('/auth').get(AuthController.generateAuthToken);

  router.route('/auth/refresh').get(AuthController.refreshAuthToken);

  router
    .route('/auth/token')
    .get(
      AuthController.authenticateAuthTokenMiddleware,
      AuthController.authenticateAuthToken,
    );
};

export default configureAuthRoutes;

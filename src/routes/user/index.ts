import { Router } from 'express';
import { AuthController, UserController } from 'src/controllers';

const configureUserRoutes = (router: Router) => {
  router.route('/users').post(UserController.create);

  router
    .route('/users/password')
    .patch(AuthController.authenticateAuthTokenMiddleware, UserController.update);
};

export default configureUserRoutes;

import { Router } from 'express';
import { AuthController, UserController } from 'src/controllers';

const configureUserRoutes = (router: Router) => {
  router.route('/users').post(UserController.create);

  router
    .route('/users/password')
    .patch(AuthController.authenticateAuthToken, UserController.update);

  router
    .route('/users/:username')
    .all(AuthController.authenticateAuthToken)
    .get(UserController.getUser);
};

export default configureUserRoutes;

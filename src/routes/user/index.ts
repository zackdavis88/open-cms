import { Router } from 'express';
import { AuthController, UserController } from 'src/controllers';

const configureUserRoutes = (router: Router) => {
  router
    .route('/users')
    .post(UserController.create)
    .get(AuthController.authenticateAuthToken, UserController.getUsers);

  router
    .route('/users/password')
    .patch(AuthController.authenticateAuthToken, UserController.update);

  router
    .route('/users/:username')
    .get(AuthController.authenticateAuthToken, UserController.getUser);
};

export default configureUserRoutes;

import { Router } from 'express';
import { AuthController, ImageController, ProjectController } from 'src/controllers';
import { AuthorizationAction } from 'src/types';

const configureImageRoutes = (router: Router) => {
  router
    .route('/projects/:projectId/images')
    .post(
      AuthController.authenticateAuthToken,
      ProjectController.getProjectMiddleware,
      AuthController.authorizeProjectResourceAction(AuthorizationAction.CREATE),
      ImageController.create,
    );
};

export default configureImageRoutes;

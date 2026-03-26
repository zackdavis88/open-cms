import { Router } from 'express';
import { AuthController, ImageController, ProjectController } from 'src/controllers';
import { AuthorizationAction } from 'src/types';

const configureImageRoutes = (router: Router) => {
  router
    .route('/projects/:projectId/images')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .post(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.CREATE),
      ImageController.create,
    )
    .get(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.READ),
      ImageController.getImages,
    );

  router
    .route('/projects/:projectId/images/:imageId')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .get(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.READ),
      ImageController.getImageMiddleware,
      ImageController.getImage,
    );
};

export default configureImageRoutes;

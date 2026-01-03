import { Router } from 'express';
import { AuthController, ProjectController, LayoutController } from 'src/controllers';
import { AuthorizationAction } from 'src/types';

const configureLayoutRoutes = (router: Router) => {
  router
    .route('/projects/:projectId/layouts')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .post(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.CREATE),
      LayoutController.create,
    )
    .get(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.READ),
      LayoutController.getLayouts,
    );
};

export default configureLayoutRoutes;

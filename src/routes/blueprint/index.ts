import { Router } from 'express';
import { AuthController, ProjectController, BlueprintController } from 'src/controllers';
import { AuthorizationAction } from 'src/types';

const configureBlueprintRoutes = (router: Router) => {
  router
    .route('/projects/:projectId/blueprints')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .post(
      AuthController.authorizeBlueprintAction(AuthorizationAction.CREATE),
      BlueprintController.create,
    );
};

export default configureBlueprintRoutes;

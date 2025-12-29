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
    )
    .get(
      AuthController.authorizeBlueprintAction(AuthorizationAction.READ),
      BlueprintController.getBlueprints,
    );

  router
    .route('/projects/:projectId/blueprints/:blueprintId')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .get(
      AuthController.authorizeBlueprintAction(AuthorizationAction.READ),
      BlueprintController.getBlueprintMiddleware,
      BlueprintController.getBlueprint,
    )
    .patch(
      AuthController.authorizeBlueprintAction(AuthorizationAction.UPDATE),
      BlueprintController.getBlueprintMiddleware,
      BlueprintController.update,
    );
};

export default configureBlueprintRoutes;

import { Router } from 'express';
import { AuthController, ProjectController, BlueprintController } from 'src/controllers';
import { AuthorizationAction } from 'src/types';

const configureBlueprintRoutes = (router: Router) => {
  router
    .route('/projects/:projectId/blueprints')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .post(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.CREATE),
      BlueprintController.create,
    )
    .get(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.READ),
      BlueprintController.getBlueprints,
    );

  router
    .route('/projects/:projectId/blueprints/:blueprintId')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .get(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.READ),
      BlueprintController.getBlueprintMiddleware,
      BlueprintController.getBlueprint,
    )
    .patch(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.UPDATE),
      BlueprintController.getBlueprintMiddleware,
      BlueprintController.update,
    )
    .delete(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.DELETE),
      BlueprintController.getBlueprintMiddleware,
      BlueprintController.remove,
    );
};

export default configureBlueprintRoutes;

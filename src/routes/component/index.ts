import { Router } from 'express';
import {
  AuthController,
  ProjectController,
  BlueprintController,
  ComponentController,
} from 'src/controllers';
import { AuthorizationAction } from 'src/types';

const configureComponentRoutes = (router: Router) => {
  router
    .route('/projects/:projectId/components/:blueprintId')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .post(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.CREATE),
      BlueprintController.getBlueprintMiddleware,
      ComponentController.create,
    );

  router
    .route('/projects/:projectId/components')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .get(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.READ),
      ComponentController.getComponents,
    );

  router
    .route('/projects/:projectId/components/:componentId')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .get(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.READ),
      ComponentController.getComponentMiddleware,
      ComponentController.getComponent,
    )
    .patch(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.UPDATE),
      ComponentController.getComponentMiddleware,
      ComponentController.update,
    )
    .delete(
      AuthController.authorizeProjectResourceAction(AuthorizationAction.DELETE),
      ComponentController.getComponentMiddleware,
      ComponentController.remove,
    );
};
export default configureComponentRoutes;

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
      AuthController.authorizeBlueprintAction(AuthorizationAction.CREATE), // TODO: Make this authAction more generic so it can be used for blueprints/components/layouts
      BlueprintController.getBlueprintMiddleware,
      ComponentController.create,
    );
};

export default configureComponentRoutes;

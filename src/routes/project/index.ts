import { Router } from 'express';
import { AuthController, ProjectController } from 'src/controllers';
import { AuthorizationAction } from 'src/types';

const configureProjectRoutes = (router: Router) => {
  router
    .route('/projects')
    .all(AuthController.authenticateAuthToken)
    .post(ProjectController.create)
    .get(ProjectController.getProjects);

  router
    .route('/projects/:projectId')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .get(ProjectController.getProject)
    .post(
      AuthController.authorizeProjectAction(AuthorizationAction.UPDATE),
      ProjectController.update,
    )
    .delete(
      AuthController.authorizeProjectAction(AuthorizationAction.DELETE),
      ProjectController.remove,
    );
};

export default configureProjectRoutes;

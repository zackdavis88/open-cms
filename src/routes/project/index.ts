import { Router } from 'express';
import { AuthController, ProjectController } from 'src/controllers';

const configureProjectRoutes = (router: Router) => {
  router
    .route('/projects')
    .all(AuthController.authenticateAuthToken)
    .post(ProjectController.create)
    .get(ProjectController.getProjects);

  router
    .route('/projects/:projectId')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .get(ProjectController.getProject);
};

export default configureProjectRoutes;

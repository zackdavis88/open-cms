import { Router } from 'express';
import { AuthController, ProjectController } from 'src/controllers';

const configureProjectRoutes = (router: Router) => {
  router
    .route('/projects')
    .all(AuthController.authenticateAuthToken)
    .post(ProjectController.create);
};

export default configureProjectRoutes;

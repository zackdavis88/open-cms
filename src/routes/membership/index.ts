import { Router } from 'express';
import { AuthController, ProjectController, MembershipController } from 'src/controllers';
import { AuthorizationAction } from 'src/types';

const configureMembershipRoutes = (router: Router) => {
  router
    .route('/projects/:projectId/memberships/:username')
    .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
    .post(
      AuthController.authorizeProjectAction(AuthorizationAction.CREATE),
      MembershipController.create,
    );
  //   .get(MembershipController.getMemberships);

  // router
  //   .route('/projects/:projectId/memberships/:membershipId')
  //   .all(AuthController.authenticateAuthToken, ProjectController.getProjectMiddleware)
  //   .get(MembershipController.getMembership)
  //   .patch(
  //     AuthController.authorizeProjectAction(AuthorizationAction.UPDATE),
  //     MembershipController.update,
  //   )
  //   .delete(
  //     AuthController.authorizeProjectAction(AuthorizationAction.DELETE),
  //     MembershipController.remove,
  //  );
};

export default configureMembershipRoutes;

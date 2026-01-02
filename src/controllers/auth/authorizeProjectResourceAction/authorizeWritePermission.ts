import { Project } from 'src/models';
import { AuthorizationError } from 'src/server/utils/errors';

type AuthorizeBlueprintCreate = (
  authUserMembership: Project['authUserMembership'],
) => void;

const authorizeBlueprintCreate: AuthorizeBlueprintCreate = (authUserMembership) => {
  if (
    !authUserMembership ||
    (!authUserMembership.isAdmin && !authUserMembership.isWriter)
  ) {
    throw new AuthorizationError('you do not have permissions to perform this action');
  }
};

export default authorizeBlueprintCreate;

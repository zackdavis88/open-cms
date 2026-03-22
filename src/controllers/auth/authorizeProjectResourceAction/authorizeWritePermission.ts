import { Project } from 'src/models';
import { AuthorizationError } from 'src/server/utils/errors';

type AuthorizeWritePermission = (
  authUserMembership: Project['authUserMembership'],
) => void;

const authorizeWritePermission: AuthorizeWritePermission = (authUserMembership) => {
  if (
    !authUserMembership ||
    (!authUserMembership.isAdmin && !authUserMembership.isWriter)
  ) {
    throw new AuthorizationError('you do not have permissions to perform this action');
  }
};

export default authorizeWritePermission;

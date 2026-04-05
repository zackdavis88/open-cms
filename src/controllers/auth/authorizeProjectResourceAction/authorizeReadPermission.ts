import { Project } from 'src/models';
import { AuthorizationError } from 'src/server/utils/errors';

type AuthorizeReadPermission = (
  authUserMembership: Project['authUserMembership'],
) => void;

const authorizeReadPermission: AuthorizeReadPermission = (authUserMembership) => {
  if (!authUserMembership) {
    throw new AuthorizationError('you do not have permissions to perform this action');
  }
};

export default authorizeReadPermission;

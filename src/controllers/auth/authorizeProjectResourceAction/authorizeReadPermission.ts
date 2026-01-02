import { Project } from 'src/models';
import { AuthorizationError } from 'src/server/utils/errors';

type AuthorizeBlueprintRead = (authUserMembership: Project['authUserMembership']) => void;

const authorizeBlueprintRead: AuthorizeBlueprintRead = (authUserMembership) => {
  if (!authUserMembership) {
    throw new AuthorizationError('you do not have permissions to perform this action');
  }
};

export default authorizeBlueprintRead;

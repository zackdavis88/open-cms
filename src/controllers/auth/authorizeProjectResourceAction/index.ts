import { NextFunction, Request, Response } from 'express';
import { AuthorizationAction } from 'src/types';
import authorizeWritePermission from './authorizeWritePermission';
import authorizeReadPermission from './authorizeReadPermission';

const authorizeProjectResourceActionFlow = (action: AuthorizationAction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        action === AuthorizationAction.CREATE ||
        action === AuthorizationAction.UPDATE ||
        action === AuthorizationAction.DELETE
      ) {
        authorizeWritePermission(req.project.authUserMembership);
        return next();
      }

      if (action === AuthorizationAction.READ) {
        authorizeReadPermission(req.project.authUserMembership);
        return next();
      }

      next();
    } catch (error) {
      return res.sendError(error);
    }
  };
};

export default authorizeProjectResourceActionFlow;

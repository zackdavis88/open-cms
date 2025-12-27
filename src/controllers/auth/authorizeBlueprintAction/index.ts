import { NextFunction, Request, Response } from 'express';
import { AuthorizationAction } from 'src/types';
import authorizeBlueprintWrite from './authorizeBlueprintWrite';
import authorizeBlueprintRead from './authorizeBlueprintRead';

const authorizeBlueprintActionFlow = (action: AuthorizationAction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        action === AuthorizationAction.CREATE ||
        action === AuthorizationAction.UPDATE ||
        action === AuthorizationAction.DELETE
      ) {
        authorizeBlueprintWrite(req.project.authUserMembership);
        return next();
      }

      if (action === AuthorizationAction.READ) {
        authorizeBlueprintRead(req.project.authUserMembership);
        return next();
      }

      next();
    } catch (error) {
      return res.sendError(error);
    }
  };
};

export default authorizeBlueprintActionFlow;

import { NextFunction, Request, Response } from 'express';
import { AuthorizationAction } from 'src/types';
import authorizeProjectAdmin from './authorizeProjectAdmin';

const authorizeProjectActionFlow = (action: AuthorizationAction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        action === AuthorizationAction.UPDATE || // update a project or membership
        action === AuthorizationAction.DELETE || // delete a project or membership
        action === AuthorizationAction.CREATE // create a project membership
      ) {
        authorizeProjectAdmin(req.project.authUserMembership);
        return next();
      }

      next();
    } catch (error) {
      return res.sendError(error);
    }
  };
};

export default authorizeProjectActionFlow;

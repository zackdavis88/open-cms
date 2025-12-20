import { NextFunction, Request, Response } from 'express';
import { AuthorizationAction } from 'src/types';
import authorizeProjectUpdate from './authorizeProjectUpdate';

const authorizeProjectActionFlow = (action: AuthorizationAction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (action === AuthorizationAction.UPDATE) {
        authorizeProjectUpdate(req.project.authUserMembership);
        return next();
      }

      next();
    } catch (error) {
      return res.sendError(error);
    }
  };
};

export default authorizeProjectActionFlow;

import { NextFunction, Request, Response } from 'express';
import validateAuthToken from './validateAuthToken';
import { UserData } from 'src/types';

export const authenticateAuthTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await validateAuthToken(req);
    req.user = user;
    next();
  } catch (error) {
    const realm = req.host;
    res.setHeader('WWW-Authenticate', `Bearer realm="${realm}"`);
    return res.sendError(error);
  }
};

type AuthenticateAuthTokenResponseBody = {
  user: UserData;
};

const authenticateAuthTokenFlow = (req: Request, res: Response) => {
  const { user } = req;
  const responseBody: AuthenticateAuthTokenResponseBody = {
    user: {
      username: user.username,
      displayName: user.displayName,
      createdOn: user.createdOn,
      updatedOn: user.updatedOn,
    },
  };
  return res.success('user successfully authenticated', responseBody);
};

export default authenticateAuthTokenFlow;

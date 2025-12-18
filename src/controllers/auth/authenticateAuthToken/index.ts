import { NextFunction, Request, Response } from 'express';
import validateAuthToken from './validateAuthToken';
import { UserData } from 'src/types';
import { getPublicUserData } from 'src/controllers/utils';

export const authenticateAuthToken = async (
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

type GetMeResponseBody = {
  user: UserData;
};

const getMeFlow = (req: Request, res: Response) => {
  const { user } = req;
  const responseBody: GetMeResponseBody = {
    user: { ...getPublicUserData(user), updatedOn: user.updatedOn || null },
  };
  return res.success('user successfully authenticated', responseBody);
};

export default getMeFlow;

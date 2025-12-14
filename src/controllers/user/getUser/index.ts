import { Request, Response } from 'express';
import { UserData } from 'src/types';
import { getPublicUserData } from 'src/controllers/utils';
import getUser from './getUser';

type GetUserResponseBody = {
  user: UserData;
};

const getUserFlow = async (req: Request, res: Response) => {
  try {
    const user = await getUser(req.params.username);
    const responseBody: GetUserResponseBody = {
      user: getPublicUserData(user),
    };
    return res.success('user has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getUserFlow;

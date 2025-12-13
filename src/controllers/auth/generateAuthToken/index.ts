import { Request, Response } from 'express';
import validateBasicAuthHeader from './validateBasicAuthHeader';
import generateAuthToken from './generateAuthToken';
import { UserData } from 'src/server/types';

type GenerateAuthTokenResponseBody = {
  authToken: string;
  user: UserData;
};

const generateAuthTokenFlow = async (req: Request, res: Response) => {
  try {
    const user = await validateBasicAuthHeader(req);
    const authToken = await generateAuthToken(user);

    const responseBody: GenerateAuthTokenResponseBody = {
      authToken,
      user: {
        username: user.username,
        displayName: user.displayName,
        createdOn: user.createdOn,
        updatedOn: user.updatedOn,
      },
    };

    return res.success('user successfully authenticated', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default generateAuthTokenFlow;

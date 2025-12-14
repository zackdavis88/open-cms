import { Request, Response } from 'express';
import validateRefreshAuthToken from './validateRefreshAuthToken';
import { UserData } from 'src/types';
import { AuthenticationError } from 'src/server/utils/errors';
import { signJwtToken } from 'src/controllers/auth/utils';
import { getPublicUserData } from 'src/controllers/utils';

type RefreshAuthTokenResponseBody = {
  authToken: string;
  user: UserData;
};

const refreshAuthTokenFlow = async (req: Request, res: Response) => {
  try {
    const user = await validateRefreshAuthToken(req);
    const authToken = signJwtToken(user);

    const responseBody: RefreshAuthTokenResponseBody = {
      authToken,
      user: getPublicUserData(user),
    };

    return res.success('authToken successfully refreshed', responseBody);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      const realm = req.host;
      res.setHeader('WWW-Authenticate', `Bearer realm="${realm}"`);
    }

    return res.sendError(error);
  }
};

export default refreshAuthTokenFlow;

import { Request } from 'express';
import { User } from 'src/models';
import { AuthenticationError } from 'src/server/utils/errors';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

const AUTH_SECRET = process.env.AUTH_SECRET || '';

type ValidateRefreshAuthToken = (req: Request) => Promise<User>;

const validateRefreshAuthToken: ValidateRefreshAuthToken = async (req: Request) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    throw new AuthenticationError('authorization header is missing from input');
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('authorization header must use Bearer schema');
  }

  const authToken = authorizationHeader.split(' ')[1];

  try {
    const tokenData = jwt.verify(authToken, AUTH_SECRET, { ignoreExpiration: true });

    if (typeof tokenData === 'string' || !tokenData.id || !tokenData.apiKey) {
      throw new AuthenticationError('authorization header is invalid');
    }

    const user = await User.findOne({
      where: {
        id: tokenData.id,
        apiKey: tokenData.apiKey,
        isActive: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('authorization header could not be authenticated');
    }

    return user;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new AuthenticationError('authorization header could not be verified');
    }

    throw error;
  }
};

export default validateRefreshAuthToken;

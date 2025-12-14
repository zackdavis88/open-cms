import { Request } from 'express';
import { User } from 'src/models';
import { AuthenticationError } from 'src/server/utils/errors';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const AUTH_SECRET = process.env.AUTH_SECRET || '';

type ValidateAuthToken = (req: Request) => Promise<User>;

const validateAuthToken: ValidateAuthToken = async (req) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    throw new AuthenticationError('authorization header is missing from input');
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('authorization header must use Bearer schema');
  }

  const authToken = authorizationHeader.split(' ')[1];

  try {
    const tokenData = jwt.verify(authToken, AUTH_SECRET);

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

    // If a user's password was updated after this token was issued, it should be considered invalid.
    // This should force user's to reauthenticate after password changes.
    if (user.updatedOn && tokenData.iat) {
      const updatedOn = Math.floor(new Date(user.updatedOn).getTime() / 1000);
      if (tokenData.iat <= updatedOn) {
        throw new AuthenticationError('authorization header is expired');
      }
    }

    return user;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthenticationError('authorization header is expired');
    }

    if (error instanceof JsonWebTokenError) {
      throw new AuthenticationError('authorization header could not be verified');
    }

    throw error;
  }
};

export default validateAuthToken;

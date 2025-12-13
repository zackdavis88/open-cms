import { User } from 'src/models';
import { AuthenticationError } from 'src/server/utils/errors';
import auth from 'basic-auth';
import { Request } from 'express';

type ValidateBasicAuthHeader = (req: Request) => Promise<User>;

const validateBasicAuthHeader: ValidateBasicAuthHeader = async (req) => {
  if (!req.headers['authorization']) {
    throw new AuthenticationError('authorization header is missing from input');
  }

  const credentials = auth(req);
  if (!credentials) {
    throw new AuthenticationError('username and password combination is invalid');
  }

  const user = await User.findOne({
    where: {
      username: credentials.name.toLowerCase(),
      isActive: true,
    },
  });

  if (!user || !user.compareHash(credentials.pass)) {
    throw new AuthenticationError('username and password combination is invalid');
  }

  return user;
};

export default validateBasicAuthHeader;

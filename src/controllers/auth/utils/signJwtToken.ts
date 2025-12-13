import { User } from 'src/models';
import jwt from 'jsonwebtoken';

const AUTH_SECRET = process.env.AUTH_SECRET || '';
let AUTH_TOKEN_EXPIRATION: number | '10h' = '10h';
if (!isNaN(Number(process.env.AUTH_TOKEN_EXPIRATION))) {
  AUTH_TOKEN_EXPIRATION = Number(process.env.AUTH_TOKEN_EXPIRATION);
}

type SignJwtToken = (user: User) => string;

const signJwtToken: SignJwtToken = (user) => {
  const tokenData = {
    id: user.id,
    apiKey: user.apiKey,
  };

  const authToken = jwt.sign(tokenData, AUTH_SECRET, {
    expiresIn: AUTH_TOKEN_EXPIRATION,
  });

  return authToken;
};

export default signJwtToken;

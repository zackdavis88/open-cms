import jwt from 'jsonwebtoken';
import { User } from 'src/models';

const SECRET = process.env.SECRET || '';

type GenerateAuthToken = (user: User) => string;

const generateAuthToken: GenerateAuthToken = (user) => {
  const tokenData = {
    id: user.id,
    apiKey: user.apiKey,
  };

  const authToken = jwt.sign(tokenData, SECRET, { expiresIn: '10h' });

  return authToken;
};

export default generateAuthToken;

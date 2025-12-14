import { Request, Response } from 'express';
import createUserValidation from './createUserValidation';
import { User } from 'src/models';
import { UserData } from 'src/types';
import { getPublicUserData } from 'src/controllers/utils';

type CreateUserRequestBody = {
  username: unknown;
  password: unknown;
};

type CreateUserResponseBody = {
  user: UserData;
};

const createUserFlow = async (
  req: Request<never, never, CreateUserRequestBody>,
  res: Response,
) => {
  try {
    const { username, password } = await createUserValidation({
      usernameInput: req.body.username,
      passwordInput: req.body.password,
    });

    const newUser = await User.create({
      username: username.toLowerCase(),
      displayName: username,
      hash: User.generateHash(password),
    });

    const responseBody: CreateUserResponseBody = {
      user: getPublicUserData(newUser),
    };
    return res.success('user has been successfully created', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default createUserFlow;

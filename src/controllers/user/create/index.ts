import { Request, Response } from 'express';
import createUserValidation from './createUserValidation';
import createUser from './createUser';
import { UserData } from 'src/types';

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

    const userData = await createUser({
      username,
      password,
    });

    const responseBody: CreateUserResponseBody = { user: userData };
    return res.success('user has been successfully created', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default createUserFlow;

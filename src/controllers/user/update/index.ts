import { Request, Response } from 'express';
import updatePasswordValidation from './updatePasswordValidation';
import { User } from 'src/models';
import { UserData } from 'src/types';
import { getPublicUserData } from 'src/controllers/utils';

interface UpdatePasswordRequestBody {
  currentPassword?: unknown;
  newPassword?: unknown;
}

type UpdatePasswordResponseBody = {
  user: UserData;
};

const updatePasswordFlow = async (
  req: Request<never, never, UpdatePasswordRequestBody>,
  res: Response,
) => {
  try {
    const { user } = req;
    const { newPassword } = updatePasswordValidation({
      user,
      newPasswordInput: req.body.newPassword,
      currentPasswordInput: req.body.currentPassword,
    });

    user.hash = User.generateHash(newPassword);
    user.updatedOn = new Date();

    await user.save();

    const responseBody: UpdatePasswordResponseBody = {
      user: { ...getPublicUserData(user), updatedOn: user.updatedOn },
    };

    return res.success('user password successfully updated', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default updatePasswordFlow;

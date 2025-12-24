import { Request, Response } from 'express';
import removeUserValidation from './removeUserValidation';
import { UserData } from 'src/types';
import { getPublicUserData } from 'src/controllers/utils';

interface RemoveUserRequestBody {
  confirm?: unknown;
}

type RemoveUserResponseBody = {
  user: UserData & { updatedOn?: Date | null; deletedOn: Date };
};

const RemoveUserFlow = async (
  req: Request<never, never, RemoveUserRequestBody>,
  res: Response,
) => {
  try {
    const { user } = req;
    removeUserValidation({ user, confirm: req.body?.confirm });

    user.isActive = false;
    user.deletedOn = new Date();
    await user.save();

    const responseBody: RemoveUserResponseBody = {
      user: {
        ...getPublicUserData(user),
        updatedOn: user.updatedOn || null,
        deletedOn: user.deletedOn,
      },
    };
    return res.success('user has been successfully removed', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default RemoveUserFlow;

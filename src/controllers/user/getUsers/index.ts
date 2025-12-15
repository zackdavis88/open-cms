import { Request, Response } from 'express';
import getUsersValidation from './getUsersValidation';
import { User } from 'src/models';
import { getPublicUserData } from 'src/controllers/utils';
import { UserData, PaginationData } from 'src/types';

type GetUsersResponseBody = {
  users: UserData[];
} & PaginationData;

const getUsersFlow = async (req: Request, res: Response) => {
  try {
    const { order, ...paginationData } = await getUsersValidation(req.query);

    const { itemsPerPage, pageOffset } = paginationData;

    const users = await User.scope('publicAttributes').findAll({
      where: { isActive: true },
      limit: itemsPerPage,
      offset: pageOffset,
      order,
    });

    const responseBody: GetUsersResponseBody = {
      users: users.map((user) => getPublicUserData(user)),
      ...paginationData,
    };

    return res.success('user list has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getUsersFlow;

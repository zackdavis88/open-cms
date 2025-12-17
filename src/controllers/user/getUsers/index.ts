import { Request, Response } from 'express';
import getUsersValidation from './getUsersValidation';
import { User } from 'src/models';
import { getPublicUserData } from 'src/controllers/utils';
import { UserData, PublicPaginationData } from 'src/types';

type GetUsersResponseBody = {
  users: UserData[];
} & PublicPaginationData;

const getUsersFlow = async (req: Request, res: Response) => {
  try {
    const { order, whereQuery, ...paginationData } = await getUsersValidation(req.query);

    const { pageOffset, ...publicPaginationData } = paginationData;

    const users = await User.scope('publicAttributes').findAll({
      ...whereQuery,
      limit: publicPaginationData.itemsPerPage,
      offset: pageOffset,
      order,
    });

    const responseBody: GetUsersResponseBody = {
      users: users.map((user) => getPublicUserData(user)),
      ...publicPaginationData,
    };

    return res.success('user list has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getUsersFlow;

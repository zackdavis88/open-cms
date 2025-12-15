import { Request } from 'express';
import { User } from 'src/models';
import { validatePagination, validateOrder } from 'src/controllers/utils';
import { PaginationData } from 'src/types';
import { Order } from 'sequelize';

type GetUsersValidation = (
  query: Request['query'],
) => Promise<PaginationData & { order: Order }>;

const getUsersValidation: GetUsersValidation = async (query) => {
  const userCount = await User.count({ where: { isActive: true } });
  const order = validateOrder({
    query,
    defaultOrderColumn: 'createdOn',
    allowedColumns: ['createdOn', 'username'],
  });
  return { ...validatePagination(query, userCount), order: order };
};

export default getUsersValidation;

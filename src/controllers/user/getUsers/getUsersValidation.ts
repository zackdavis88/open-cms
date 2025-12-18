import { Request } from 'express';
import { User } from 'src/models';
import {
  validatePagination,
  validateOrder,
  validateFilters,
} from 'src/controllers/utils';
import { AllPaginationData } from 'src/types';
import { Order, WhereOptions } from 'sequelize';

type GetUsersValidation = (
  query: Request['query'],
) => Promise<AllPaginationData & { order: Order; whereQuery: WhereOptions }>;

const getUsersValidation: GetUsersValidation = async (query) => {
  const filters = validateFilters({
    query,
    allowedColumns: {
      stringColumns: ['username'],
      dateColumns: ['createdOn'],
    },
  });

  const whereQuery: WhereOptions = {
    where: {
      isActive: true,
    },
  };

  if (filters) {
    whereQuery.where = {
      ...whereQuery.where,
      ...filters,
    };
  }

  const userCount = await User.count(whereQuery);
  const paginationData = validatePagination(query, userCount);
  const order = validateOrder({
    query,
    defaultOrderColumn: 'createdOn',
    allowedColumns: ['createdOn', 'username'],
  });

  return { ...paginationData, order, whereQuery };
};

export default getUsersValidation;

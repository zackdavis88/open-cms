import { Request } from 'express';
import { Project } from 'src/models';
import {
  validatePagination,
  validateOrder,
  validateFilters,
} from 'src/controllers/utils';
import { AllPaginationData } from 'src/types';
import { Order, WhereOptions } from 'sequelize';

type GetProjectsValidation = (
  query: Request['query'],
) => Promise<AllPaginationData & { order: Order; whereQuery: WhereOptions }>;

const getProjectsValidation: GetProjectsValidation = async (query) => {
  const filters = validateFilters({
    query,
    allowedColumns: {
      stringColumns: ['name', 'description'],
      dateColumns: ['createdOn', 'updatedOn'],
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

  const projectCount = await Project.count(whereQuery);
  const paginationData = validatePagination(query, projectCount);
  const order = validateOrder({
    query,
    defaultOrderColumn: 'createdOn',
    allowedColumns: ['createdOn', 'updatedOn', 'name', 'description'],
  });

  return { ...paginationData, order, whereQuery };
};

export default getProjectsValidation;

import { Request } from 'express';
import { WhereOptions, Order, Includeable } from 'sequelize';
import {
  validateFilters,
  validateOrder,
  validatePagination,
} from 'src/controllers/utils';
import { Project, Blueprint, User } from 'src/models';
import { AllPaginationData } from 'src/types';

type GetBlueprintsValidation = ({
  query,
  project,
}: {
  query: Request['query'];
  project: Project;
}) => Promise<
  AllPaginationData & {
    order: Order;
    dbQuery: { where: WhereOptions; include: Includeable[] };
  }
>;

const getBlueprintsValidation: GetBlueprintsValidation = async ({ query, project }) => {
  const filters = validateFilters({
    query,
    allowedColumns: {
      stringColumns: ['name', '__createdBy_username', '__updatedBy_username'],
      dateColumns: ['createdOn', 'updatedOn'],
    },
  });

  const dbQuery: { where: WhereOptions; include: Includeable[] } = {
    where: {
      projectId: project.id,
      isActive: true,
    },
    include: [
      {
        model: User.scope('publicAttributes'),
        as: 'createdBy',
        where:
          (filters?.filterAssociations?.__createdBy_username && {
            username: filters.filterAssociations.__createdBy_username,
          }) ||
          undefined,
      },
      {
        model: User.scope('publicAttributes'),
        as: 'updatedBy',
        where:
          (filters?.filterAssociations?.__updatedBy_username && {
            username: filters.filterAssociations.__updatedBy_username,
          }) ||
          undefined,
      },
    ],
  };

  if (filters) {
    dbQuery.where = {
      ...dbQuery.where,
      ...filters.filterStrings,
      ...filters.filterDates,
    };
  }

  const blueprintCount = await Blueprint.count(dbQuery);
  const paginationData = validatePagination(query, blueprintCount);
  const order = validateOrder({
    query,
    defaultOrderColumn: 'createdOn',
    allowedColumns: [
      'name',
      'createdOn',
      'updatedOn',
      '__createdBy_username',
      '__updatedBy_username',
    ],
  });

  return { ...paginationData, order, dbQuery };
};

export default getBlueprintsValidation;

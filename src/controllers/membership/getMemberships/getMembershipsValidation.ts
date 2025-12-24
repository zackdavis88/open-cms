import { Request } from 'express';
import { WhereOptions, Order, Includeable } from 'sequelize';
import {
  validateFilters,
  validateOrder,
  validatePagination,
} from 'src/controllers/utils';
import { Project, Membership, User } from 'src/models';
import { AllPaginationData } from 'src/types';

type GetMembershipsValidation = ({
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

const getMembershipsValidation: GetMembershipsValidation = async ({ query, project }) => {
  const filters = validateFilters({
    query,
    allowedColumns: {
      stringColumns: ['__user_username', '__createdBy_username', '__updatedBy_username'],
      dateColumns: ['createdOn', 'updatedOn'],
      booleanColumns: ['isAdmin', 'isWriter'],
    },
  });

  const dbQuery: { where: WhereOptions; include: Includeable[] } = {
    where: {
      projectId: project.id,
    },
    include: [
      {
        model: User.scope('publicAttributes'),
        as: 'user',
        where:
          (filters?.filterAssociations?.__user_username && {
            username: filters.filterAssociations.__user_username,
          }) ||
          undefined,
      },
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
      ...filters.filterBooleans,
    };
  }

  const membershipCount = await Membership.count(dbQuery);
  const paginationData = validatePagination(query, membershipCount);
  const order = validateOrder({
    query,
    defaultOrderColumn: 'createdOn',
    allowedColumns: [
      'createdOn',
      'updatedOn',
      '__user_username',
      '__createdBy_username',
      '__updatedBy_username',
      'isAdmin',
      'isWriter',
    ],
  });

  return { ...paginationData, order, dbQuery };
};

export default getMembershipsValidation;

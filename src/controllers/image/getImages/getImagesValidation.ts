import { Request } from 'express';
import { WhereOptions, Order, Includeable } from 'sequelize';
import {
  validateFilters,
  validateOrder,
  validatePagination,
} from 'src/controllers/utils';
import { Project, User, Image } from 'src/models';
import { AllPaginationData } from 'src/types';

type GetImagesValidation = ({
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

const getImagesValidation: GetImagesValidation = async ({ query, project }) => {
  const filters = validateFilters({
    query,
    allowedColumns: {
      stringColumns: ['originalFileName', 'extension', '__createdBy_username'],
      dateColumns: ['createdOn'],
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
    ],
  };

  if (filters) {
    dbQuery.where = {
      ...dbQuery.where,
      ...filters.filterStrings,
      ...filters.filterDates,
    };
  }

  const imageCount = await Image.count(dbQuery);
  const paginationData = validatePagination(query, imageCount);
  const order = validateOrder({
    query,
    defaultOrderColumn: 'createdOn',
    allowedColumns: [
      'originalFileName',
      'extension',
      'createdOn',
      '__createdBy_username',
    ],
  });

  return { ...paginationData, order, dbQuery };
};

export default getImagesValidation;

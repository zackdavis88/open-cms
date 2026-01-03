import { Request } from 'express';
import { WhereOptions, Order, Includeable } from 'sequelize';
import {
  validateFilters,
  validateOrder,
  validatePagination,
} from 'src/controllers/utils';
import { Project, Blueprint, User, BlueprintVersion, Component } from 'src/models';
import { AllPaginationData } from 'src/types';

type GetComponentsValidation = ({
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

const getComponentsValidation: GetComponentsValidation = async ({ query, project }) => {
  const filters = validateFilters({
    query,
    allowedColumns: {
      stringColumns: [
        'name',
        '__createdBy_username',
        '__updatedBy_username',
        '__blueprint_name',
        '__blueprintVersion_name',
      ],
      dateColumns: ['createdOn', 'updatedOn'],
      idColumns: ['__blueprint_id', '__blueprintVersion_id'],
    },
  });

  let includeBlueprintWhere: WhereOptions | undefined = undefined;
  if (filters?.filterAssociations?.__blueprint_id) {
    includeBlueprintWhere = Object.assign(includeBlueprintWhere || {}, {
      id: filters.filterAssociations.__blueprint_id,
    });
  }
  if (filters?.filterAssociations?.__blueprint_name) {
    includeBlueprintWhere = Object.assign(includeBlueprintWhere || {}, {
      name: filters.filterAssociations.__blueprint_name,
    });
  }

  let includeBlueprintVersionWhere: WhereOptions | undefined = undefined;
  if (filters?.filterAssociations?.__blueprintVersion_id) {
    includeBlueprintVersionWhere = Object.assign(includeBlueprintVersionWhere || {}, {
      id: filters.filterAssociations.__blueprintVersion_id,
    });
  }
  if (filters?.filterAssociations?.__blueprintVersion_name) {
    includeBlueprintVersionWhere = Object.assign(includeBlueprintVersionWhere || {}, {
      name: filters.filterAssociations.__blueprintVersion_name,
    });
  }

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
      {
        model: Blueprint,
        as: 'blueprint',
        where: includeBlueprintWhere,
      },
      {
        model: BlueprintVersion,
        as: 'blueprintVersion',
        where: includeBlueprintVersionWhere,
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

  const blueprintCount = await Component.count(dbQuery);
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
      '__blueprint_name',
      '__blueprintVersion_name',
    ],
    customOrderColumn: {
      name: 'Component.name',
    },
  });

  return { ...paginationData, order, dbQuery };
};

export default getComponentsValidation;

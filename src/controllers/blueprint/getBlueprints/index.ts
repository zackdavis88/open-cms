import { Request, Response } from 'express';
import getBlueprintsValidation from './getBlueprintsValidation';
import { Project } from 'src/models';
import { BlueprintData, PublicPaginationData } from 'src/types';
import { getBlueprintData, getPublicUserData } from 'src/controllers/utils';

type GetBlueprintResponseBody = {
  project: { id: Project['id']; name: Project['name'] };
  blueprints: Omit<BlueprintData, 'project'>[];
} & PublicPaginationData;

const getBlueprintsFlow = async (req: Request, res: Response) => {
  try {
    const { project } = req;
    const { order, dbQuery, ...paginationData } = await getBlueprintsValidation({
      query: req.query,
      project,
    });

    const { pageOffset, ...publicPaginationData } = paginationData;

    const blueprints = await project.getBlueprints({
      where: dbQuery.where,
      limit: publicPaginationData.itemsPerPage,
      offset: pageOffset,
      order,
      include: dbQuery.include,
      attributes: { exclude: ['fields'] },
    });

    const responseBody: GetBlueprintResponseBody = {
      project: {
        id: project.id,
        name: project.name,
      },
      blueprints: blueprints.map((blueprint) => ({
        ...getBlueprintData(Object.assign(blueprint, { project })),
        project: undefined,
        updatedOn: blueprint.updatedOn || null,
        updatedBy:
          blueprint.updatedById &&
          blueprint.updatedBy &&
          getPublicUserData(blueprint.updatedBy),
      })),
      ...publicPaginationData,
    };

    return res.success('blueprint list has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getBlueprintsFlow;

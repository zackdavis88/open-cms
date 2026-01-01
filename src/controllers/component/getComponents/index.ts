import { Request, Response } from 'express';
import getComponentsValidation from './getComponentsValidation';
import { Project } from 'src/models';
import { ComponentData, PublicPaginationData } from 'src/types';
import { getComponentData, getPublicUserData } from 'src/controllers/utils';

type GetComponentResponseBody = {
  project: { id: Project['id']; name: Project['name'] };
  components: Omit<ComponentData, 'project'>[];
} & PublicPaginationData;

const getComponentsFlow = async (req: Request, res: Response) => {
  try {
    const { project } = req;
    const { order, dbQuery, ...paginationData } = await getComponentsValidation({
      query: req.query,
      project,
    });

    const { pageOffset, ...publicPaginationData } = paginationData;

    const components = await project.getComponents({
      where: dbQuery.where,
      limit: publicPaginationData.itemsPerPage,
      offset: pageOffset,
      order,
      include: dbQuery.include,
      attributes: { exclude: ['content'] },
    });

    const responseBody: GetComponentResponseBody = {
      project: {
        id: project.id,
        name: project.name,
      },
      components: components.map((component) => {
        const blueprintVersionData = component.blueprintVersionId &&
          component.blueprintVersion && {
            id: component.blueprintVersion.id,
            name: component.blueprintVersion.name,
          };
        return {
          ...getComponentData(Object.assign(component, { project })),
          project: undefined,
          blueprintVersion: blueprintVersionData,
          updatedOn: component.updatedOn || null,
          updatedBy:
            component.updatedById &&
            component.updatedBy &&
            getPublicUserData(component.updatedBy),
        };
      }),
      ...publicPaginationData,
    };

    return res.success('component list has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getComponentsFlow;

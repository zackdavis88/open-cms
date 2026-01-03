import { Request, Response } from 'express';
import getLayoutsValidation from './getLayoutsValidation';
import { Project } from 'src/models';
import { LayoutData, PublicPaginationData } from 'src/types';
import { getLayoutData, getPublicUserData } from 'src/controllers/utils';

type GetLayoutResponseBody = {
  project: { id: Project['id']; name: Project['name'] };
  layouts: Omit<LayoutData, 'project'>[];
} & PublicPaginationData;

const getLayoutsFlow = async (req: Request, res: Response) => {
  try {
    const { project } = req;
    const { order, dbQuery, ...paginationData } = await getLayoutsValidation({
      query: req.query,
      project,
    });

    const { pageOffset, ...publicPaginationData } = paginationData;

    const layouts = await project.getLayouts({
      where: dbQuery.where,
      limit: publicPaginationData.itemsPerPage,
      offset: pageOffset,
      order,
      include: dbQuery.include,
    });

    const responseBody: GetLayoutResponseBody = {
      project: {
        id: project.id,
        name: project.name,
      },
      layouts: layouts.map((layout) => ({
        ...getLayoutData(Object.assign(layout, { project })),
        project: undefined,
        updatedOn: layout.updatedOn || null,
        updatedBy:
          layout.updatedById && layout.updatedBy && getPublicUserData(layout.updatedBy),
      })),
      ...publicPaginationData,
    };

    return res.success('layout list has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getLayoutsFlow;

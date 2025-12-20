import { Request, Response } from 'express';
import getProjectsValidation from './getProjectsValidation';
import { Project, User } from 'src/models';
import { getProjectData } from 'src/controllers/utils';
import { ProjectData, PublicPaginationData } from 'src/types';

type GetProjectsResponseBody = {
  projects: ProjectData[];
} & PublicPaginationData;

const getProjectsFlow = async (req: Request, res: Response) => {
  try {
    const { order, whereQuery, ...paginationData } = await getProjectsValidation(
      req.query,
    );

    const { pageOffset, ...publicPaginationData } = paginationData;

    const projects = await Project.findAll({
      ...whereQuery,
      limit: publicPaginationData.itemsPerPage,
      offset: pageOffset,
      order,
      include: [
        { model: User.scope('publicAttributes'), as: 'createdBy', required: false },
        { model: User.scope('publicAttributes'), as: 'updatedBy', required: false },
      ],
    });

    const responseBody: GetProjectsResponseBody = {
      projects: projects.map((project) => ({
        ...getProjectData(project),
        updatedOn: project.updatedOn,
      })),
      ...publicPaginationData,
    };

    return res.success('project list has been successfully retrieved', responseBody);
  } catch (error) {
    console.log(error);
    return res.sendError(error);
  }
};

export default getProjectsFlow;

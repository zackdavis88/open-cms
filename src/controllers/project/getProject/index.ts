import { Request, Response, NextFunction } from 'express';
import { ProjectData } from 'src/types';
import { getProjectData, getPublicUserData } from 'src/controllers/utils';
import getProject from './getProject';
import getProjectValidation from './getProjectValidation';

export const getProjectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    getProjectValidation(req.params.projectId);
    const project = await getProject({
      projectId: req.params.projectId,
      authenticatedUser: req.user,
    });
    req.project = project;
    next();
  } catch (error) {
    return res.sendError(error);
  }
};

type GetProjectResponseBody = {
  project: ProjectData;
};

const getProjectFlow = async (req: Request, res: Response) => {
  try {
    const { project } = req;
    const responseBody: GetProjectResponseBody = {
      project: {
        ...getProjectData(project),
        updatedOn: project.updatedOn,
        updatedBy:
          project.updatedById &&
          project.updatedBy &&
          getPublicUserData(project.updatedBy),
      },
    };
    return res.success('project has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getProjectFlow;

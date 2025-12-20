import { Request, Response } from 'express';
import removeProjectValidation from './removeProjectValidation';
import { ProjectData } from 'src/types';
import { getProjectData } from 'src/controllers/utils';

interface RemoveProjectRequestBody {
  confirm?: unknown;
}

type RemoveProjectResponseBody = {
  project: ProjectData;
};

const RemoveProjectFlow = async (
  req: Request<never, never, RemoveProjectRequestBody>,
  res: Response,
) => {
  try {
    const { user, project } = req;
    removeProjectValidation({ project, confirm: req.body.confirm });

    project.isActive = false;
    project.deletedOn = new Date();
    project.deletedBy = user;
    await project.save();

    const responseBody: RemoveProjectResponseBody = {
      project: getProjectData(project),
    };
    return res.success('project has been successfully removed', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default RemoveProjectFlow;

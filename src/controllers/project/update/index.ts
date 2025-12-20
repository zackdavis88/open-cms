import { Request, Response } from 'express';
import updateProjectValidation from './updateProjectValidation';
import { ProjectData } from 'src/types';
import { getProjectData, getPublicUserData } from 'src/controllers/utils';

type UpdateProjectResponseBody = {
  project: ProjectData;
};

const updateProjectFlow = async (req: Request, res: Response) => {
  try {
    const { user, project } = req;
    const { name, description } = updateProjectValidation({
      nameInput: req.body.name,
      descriptionInput: req.body.description,
    });

    if (name) {
      project.name = name;
    }

    if (description) {
      project.description = description;
    } else if (description === '') {
      project.description = null;
    }

    project.updatedOn = new Date();
    project.updatedBy = user;
    await project.save();

    const responseBody: UpdateProjectResponseBody = {
      project: {
        ...getProjectData(project),
        updatedOn: project.updatedOn,
        updatedBy: getPublicUserData(user),
      },
    };
    return res.success('project has been successfully updated', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default updateProjectFlow;

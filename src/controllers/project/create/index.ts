import { Request, Response } from 'express';
import createProjectValidation from './createProjectValidation';
import { ProjectData } from 'src/types';
import { getProjectData } from 'src/controllers/utils';

type CreateProjectResponseBody = {
  project: ProjectData;
};

const createProjectFlow = async (req: Request, res: Response) => {
  const dbTransaction = await req.sequelize.transaction();
  try {
    const { user } = req;
    const { name, description } = createProjectValidation({
      nameInput: req.body?.name,
      descriptionInput: req.body?.description,
    });

    const newProject = await user.createProject(
      {
        name,
        description,
      },
      { transaction: dbTransaction },
    );
    newProject.createdBy = user;

    // All project creators are automatically given an admin membership.
    await newProject.createMembership(
      {
        userId: user.id,
        isAdmin: true,
        createdById: user.id,
      },
      { transaction: dbTransaction },
    );

    await dbTransaction.commit();

    const responseBody: CreateProjectResponseBody = {
      project: getProjectData(newProject),
    };
    return res.success('project has been successfully created', responseBody);
  } catch (error) {
    await dbTransaction.rollback();
    return res.sendError(error);
  }
};

export default createProjectFlow;

import { Request, Response } from 'express';
import createProjectValidation from './createProjectValidation';
import { ProjectData, MembershipData } from 'src/types';
import { getProjectData, getMembershipData } from 'src/controllers/utils';

type CreateProjectResponseBody = {
  project: ProjectData;
  membership: MembershipData;
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
    const adminMembership = await newProject.createMembership(
      {
        userId: user.id,
        isAdmin: true,
        createdById: user.id,
      },
      { transaction: dbTransaction },
    );
    adminMembership.user = user;
    adminMembership.project = newProject;
    adminMembership.createdBy = user;

    await dbTransaction.commit(); // Insert both models in a single transaction.

    const responseBody: CreateProjectResponseBody = {
      project: getProjectData(newProject),
      membership: getMembershipData(adminMembership),
    };
    return res.success('project has been successfully created', responseBody);
  } catch (error) {
    await dbTransaction.rollback();
    return res.sendError(error);
  }
};

export default createProjectFlow;

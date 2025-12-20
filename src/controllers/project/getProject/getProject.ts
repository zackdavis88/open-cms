import { Includeable } from 'sequelize';
import { Membership, Project, User } from 'src/models';
import { NotFoundError } from 'src/server/utils/errors';

type GetProject = ({
  projectId,
  authenticatedUser,
}: {
  projectId: string;
  authenticatedUser: User;
}) => Promise<Project>;

const getProject: GetProject = async ({ projectId, authenticatedUser }) => {
  const include: Includeable[] = [
    { model: User.scope('publicAttributes'), as: 'createdBy', required: false },
    { model: User.scope('publicAttributes'), as: 'updatedBy', required: false },
    {
      model: Membership,
      as: 'authUserMembership',
      required: false,
      where: { userId: authenticatedUser.id },
    },
  ];

  const project = await Project.findOne({
    where: {
      id: projectId,
      isActive: true,
    },
    include,
  });

  if (!project) {
    throw new NotFoundError('requested project not found');
  }

  return project;
};

export default getProject;

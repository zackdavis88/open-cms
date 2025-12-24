import { Project, User } from 'src/models';
import { NotFoundError, ValidationError } from 'src/server/utils/errors';
import { validateRole } from 'src/controllers/membership/utils';

type CreateMembershipValidation = ({
  usernameInput,
  isAdminInput,
  isWriterInput,
  project,
}: {
  usernameInput: string;
  isAdminInput?: unknown;
  isWriterInput?: unknown;
  project: Project;
}) => Promise<{ user: User; isAdmin: boolean; isWriter: boolean }>;

const createMembershipValidation: CreateMembershipValidation = async ({
  usernameInput,
  isAdminInput,
  isWriterInput,
  project,
}) => {
  const user = await User.findOne({
    where: {
      username: usernameInput.toLowerCase(),
      isActive: true,
    },
  });

  if (!user) {
    throw new NotFoundError('requested user not found');
  }

  const existingMembership = await project.getMembership({
    where: {
      userId: user.id,
    },
  });

  if (existingMembership) {
    throw new ValidationError('membership already exists for this user');
  }

  const isAdmin = !!validateRole({ name: 'isAdmin', value: isAdminInput });
  const isWriter = !!validateRole({ name: 'isWriter', value: isWriterInput });

  return {
    user,
    isAdmin,
    isWriter,
  };
};

export default createMembershipValidation;

import { User } from 'src/models';
import { NotFoundError } from 'src/server/utils/errors';

type GetUser = (username: string) => Promise<User>;

const getUser: GetUser = async (username: string) => {
  const user = await User.findOne({
    where: {
      username: username.toLowerCase(),
      isActive: true,
    },
  });

  if (!user) {
    throw new NotFoundError('requested user not found');
  }

  return user;
};

export default getUser;

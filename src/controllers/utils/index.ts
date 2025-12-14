import { User } from 'src/models';

export const getPublicUserData = (user: User) => {
  return {
    username: user.username,
    displayName: user.displayName,
    createdOn: user.createdOn,
    updatedOn: user.updatedOn,
  };
};

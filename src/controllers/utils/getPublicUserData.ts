import { User } from 'src/models';

const getPublicUserData = (user: User) => {
  return {
    username: user.username,
    displayName: user.displayName,
    createdOn: user.createdOn,
    updatedOn: user.updatedOn,
  };
};

export default getPublicUserData;

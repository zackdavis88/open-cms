import { User } from 'src/models';

const getPublicUserData = (user: User) => {
  return {
    username: user.username,
    displayName: user.displayName,
    createdOn: user.createdOn,
  };
};

export default getPublicUserData;

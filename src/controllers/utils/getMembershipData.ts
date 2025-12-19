import { Membership } from 'src/models';
import getPublicUserData from './getPublicUserData';

const getMembershipData = (membership: Membership) => {
  return {
    id: membership.id,
    user: getPublicUserData(membership.user),
    project: {
      id: membership.project.id,
      name: membership.project.name,
    },
    createdOn: membership.createdOn,
    createdBy: membership.createdBy && getPublicUserData(membership.createdBy),
    isAdmin: membership.isAdmin,
    isWriter: membership.isWriter,
  };
};

export default getMembershipData;

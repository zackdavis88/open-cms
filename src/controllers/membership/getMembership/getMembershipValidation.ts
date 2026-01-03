import { validateUUID } from 'src/controllers/utils';

type GetMembershipValidation = (membershipId: string) => void;

const getMembershipValidation: GetMembershipValidation = (membershipId) => {
  validateUUID(membershipId, 'membership');
};

export default getMembershipValidation;

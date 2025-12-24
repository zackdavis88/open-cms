import { User } from 'src/models';
import { ValidationError } from 'src/server/utils/errors';

type RemoveMembershipValidation = ({
  user,
  confirm,
}: {
  user: User;
  confirm: unknown;
}) => void;

const removeMembershipValidation: RemoveMembershipValidation = ({ user, confirm }) => {
  if (confirm === null || confirm === undefined) {
    throw new ValidationError('confirm is missing from input');
  }

  if (typeof confirm !== 'string') {
    throw new ValidationError('confirm must be a string');
  }

  if (user.displayName !== confirm) {
    throw new ValidationError(
      `confirm must match the membership displayName: ${user.displayName}`,
    );
  }
};

export default removeMembershipValidation;

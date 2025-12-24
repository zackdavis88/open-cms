import { ValidationError } from 'src/server/utils/errors';
import { validateRole } from 'src/controllers/membership/utils';

type UpdateMembershipValidation = ({
  isAdminInput,
  isWriterInput,
}: {
  isAdminInput?: unknown;
  isWriterInput?: unknown;
}) => { isAdmin: boolean | void; isWriter: boolean | void };

const updateMembershipValidation: UpdateMembershipValidation = ({
  isAdminInput,
  isWriterInput,
}) => {
  if (typeof isAdminInput !== 'boolean' && typeof isWriterInput !== 'boolean') {
    throw new ValidationError('input contains nothing to update');
  }

  const isAdmin = validateRole({ name: 'isAdmin', value: isAdminInput });
  const isWriter = validateRole({ name: 'isWriter', value: isWriterInput });

  return {
    isAdmin,
    isWriter,
  };
};

export default updateMembershipValidation;

import { User } from 'src/models';
import { ValidationError } from 'src/server/utils/errors';
import { validatePassword } from '../utils';

type UpdatePasswordValidation = ({
  user,
  currentPasswordInput,
  newPasswordInput,
}: {
  user: User;
  currentPasswordInput?: unknown;
  newPasswordInput?: unknown;
}) => { newPassword: string };

const updatePasswordValidation: UpdatePasswordValidation = ({
  user,
  currentPasswordInput,
  newPasswordInput,
}) => {
  if (currentPasswordInput === null || currentPasswordInput === undefined) {
    throw new ValidationError('currentPassword is missing from input');
  }

  if (typeof currentPasswordInput !== 'string') {
    throw new ValidationError('currentPassword must be a string');
  }

  if (!user.compareHash(currentPasswordInput)) {
    throw new ValidationError('currentPassword input is invalid');
  }

  if (currentPasswordInput === newPasswordInput) {
    throw new ValidationError('currentPassword and newPassword are the same');
  }

  const newPassword = validatePassword(newPasswordInput, 'newPassword');
  return {
    newPassword,
  };
};

export default updatePasswordValidation;

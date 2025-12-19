import { ValidationError } from 'src/server/utils/errors';

type ValidateDescription = (description: unknown) => string | undefined;

const validateDescription: ValidateDescription = (description) => {
  if (description === undefined || description === null) {
    return;
  }

  if (typeof description !== 'string') {
    throw new ValidationError('description must be a string');
  }

  if (description.length > 350) {
    throw new ValidationError('description must be 350 characters or less');
  }

  return description;
};

export default validateDescription;

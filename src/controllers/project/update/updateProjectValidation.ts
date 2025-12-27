import { validateDescription } from 'src/controllers/project/utils';
import { validateName } from 'src/controllers/utils';
import { ValidationError } from 'src/server/utils/errors';

type UpdateProjectValidation = ({
  nameInput,
  descriptionInput,
}: {
  nameInput: unknown;
  descriptionInput: unknown;
}) => { name: string | undefined; description: string | undefined };

const updateProjectValidation: UpdateProjectValidation = ({
  nameInput,
  descriptionInput,
}) => {
  if (!nameInput && !descriptionInput) {
    throw new ValidationError('input contains nothing to update');
  }

  const name = validateName({ name: nameInput, isOptional: true });
  const description = validateDescription(descriptionInput);

  return { name, description };
};

export default updateProjectValidation;

import { validateName, validateDescription } from 'src/controllers/project/utils';

type CreateProjectValidation = ({
  nameInput,
  descriptionInput,
}: {
  nameInput: unknown;
  descriptionInput: unknown;
}) => { name: string; description: string | undefined };

const createProjectValidation: CreateProjectValidation = ({
  nameInput,
  descriptionInput,
}) => {
  const name = validateName({ name: nameInput, isOptional: false }) as string;
  const description = validateDescription(descriptionInput);

  return { name, description };
};

export default createProjectValidation;

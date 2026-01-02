import { validateName } from 'src/controllers/utils';
import { Blueprint, BlueprintVersion } from 'src/models';
import { validateContent } from 'src/controllers/component/utils';
import { ValidationError } from 'src/server/utils/errors';

type UpdateComponentValidation = (input: {
  blueprint: Blueprint;
  blueprintVersion?: BlueprintVersion;
  nameInput?: unknown;
  contentInput?: unknown;
}) => { name: string | undefined; content: Record<string, unknown> | undefined };

const updateComponentValidation: UpdateComponentValidation = ({
  blueprint,
  blueprintVersion,
  nameInput,
  contentInput,
}) => {
  if (!nameInput && !contentInput) {
    throw new ValidationError('input contains nothing to update');
  }
  const name = validateName({ name: nameInput, isOptional: true });
  const content = validateContent({
    blueprint: blueprintVersion || blueprint,
    content: contentInput,
    isOptional: true,
  });

  return { name, content };
};

export default updateComponentValidation;

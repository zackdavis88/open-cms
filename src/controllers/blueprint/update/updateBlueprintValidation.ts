import { validateName } from 'src/controllers/utils';
import { BlueprintField } from 'src/types';
import { validateFields } from 'src/controllers/blueprint/utils';
import { ValidationError } from 'src/server/utils/errors';

type UpdateBlueprintValidation = ({
  nameInput,
  fieldsInput,
}: {
  nameInput?: unknown;
  fieldsInput?: unknown;
}) => { name: string | undefined; fields: BlueprintField[] | undefined };

const updateBlueprintValidation: UpdateBlueprintValidation = ({
  nameInput,
  fieldsInput,
}) => {
  if (!nameInput && !fieldsInput) {
    throw new ValidationError('input contains nothing to update');
  }
  const name = validateName({ name: nameInput, isOptional: true });
  const fields = validateFields({ fields: fieldsInput, isOptional: true });

  return { name, fields };
};

export default updateBlueprintValidation;

import { validateName } from 'src/controllers/utils';
import { BlueprintField } from 'src/types';
import { validateFields } from 'src/controllers/blueprint/utils';

type CreateBlueprintValidation = ({
  nameInput,
  fieldsInput,
}: {
  nameInput?: unknown;
  fieldsInput?: unknown;
}) => { name: string; fields: BlueprintField[] };

const createBlueprintValidation: CreateBlueprintValidation = ({
  nameInput,
  fieldsInput,
}) => {
  const name = validateName({ name: nameInput }) as string;
  const fields = validateFields({ fields: fieldsInput }) as BlueprintField[];

  return { name, fields };
};

export default createBlueprintValidation;

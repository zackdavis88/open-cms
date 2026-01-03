import { BlueprintField } from '../../src/models/blueprint/blueprint';

type GenerateBlueprintField = ({
  type,
  options,
}: {
  type: string;
  options?: GenerateBlueprintFieldOptions;
}) => BlueprintField;

type GenerateBlueprintFieldOptions = {
  id?: string;
  name?: string;
  isRequired?: boolean;
  regex?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  isInteger?: boolean;
  arrayOf?: BlueprintField;
  fields?: BlueprintField[];
};

const generateBlueprintField: GenerateBlueprintField = ({ type, options }) => {
  const blueprintField = {
    id: options?.id ?? undefined,
    name: options?.name ?? crypto.randomUUID(),
    type,
    isRequired: options?.isRequired ?? undefined,
    regex: options?.regex ?? undefined,
    minLength: options?.minLength ?? undefined,
    maxLength: options?.maxLength ?? undefined,
    min: options?.min ?? undefined,
    max: options?.max ?? undefined,
    isInteger: options?.isInteger ?? undefined,
    arrayOf: options?.arrayOf ?? undefined,
    fields: options?.fields ?? undefined,
  } as BlueprintField;

  return JSON.parse(JSON.stringify(blueprintField));
};

export default generateBlueprintField;

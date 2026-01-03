import { validateUUID } from 'src/controllers/utils';

type GetBlueprintValidation = (blueprintId: string) => void;

const getBlueprintValidation: GetBlueprintValidation = (blueprintId) => {
  validateUUID(blueprintId, 'blueprint');
};

export default getBlueprintValidation;

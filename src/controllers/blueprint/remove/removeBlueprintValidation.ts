import { Blueprint } from 'src/models';
import { ValidationError } from 'src/server/utils/errors';

type RemoveBlueprintValidation = ({
  blueprint,
  confirm,
}: {
  blueprint: Blueprint;
  confirm: unknown;
}) => void;

const removeBlueprintValidation: RemoveBlueprintValidation = ({ blueprint, confirm }) => {
  if (confirm === null || confirm === undefined) {
    throw new ValidationError('confirm is missing from input');
  }

  if (typeof confirm !== 'string') {
    throw new ValidationError('confirm must be a string');
  }

  if (blueprint.name !== confirm) {
    throw new ValidationError(`confirm must match the blueprint name: ${blueprint.name}`);
  }
};

export default removeBlueprintValidation;

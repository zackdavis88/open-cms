import { ValidationError } from 'src/server/utils/errors';

type ValidateRole = ({
  name,
  value,
}: {
  name: string;
  value?: unknown;
}) => boolean | void;

const validateRole: ValidateRole = ({ name, value }) => {
  if (value === null || value === undefined) {
    return;
  }

  if (typeof value !== 'boolean') {
    throw new ValidationError(`${name} must be a boolean`);
  }

  return value;
};

export default validateRole;

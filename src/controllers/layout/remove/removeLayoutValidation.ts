import { Layout } from 'src/models';
import { ValidationError } from 'src/server/utils/errors';

type RemoveLayoutValidation = ({
  layout,
  confirm,
}: {
  layout: Layout;
  confirm: unknown;
}) => void;

const removeLayoutValidation: RemoveLayoutValidation = ({ layout, confirm }) => {
  if (confirm === null || confirm === undefined) {
    throw new ValidationError('confirm is missing from input');
  }

  if (typeof confirm !== 'string') {
    throw new ValidationError('confirm must be a string');
  }

  if (layout.name !== confirm) {
    throw new ValidationError(`confirm must match the layout name: ${layout.name}`);
  }
};

export default removeLayoutValidation;

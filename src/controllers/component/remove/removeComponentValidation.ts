import { Component } from 'src/models';
import { ValidationError } from 'src/server/utils/errors';

type RemoveComponentValidation = ({
  component,
  confirm,
}: {
  component: Component;
  confirm: unknown;
}) => void;

const removeComponentValidation: RemoveComponentValidation = ({ component, confirm }) => {
  if (confirm === null || confirm === undefined) {
    throw new ValidationError('confirm is missing from input');
  }

  if (typeof confirm !== 'string') {
    throw new ValidationError('confirm must be a string');
  }

  if (component.name !== confirm) {
    throw new ValidationError(`confirm must match the component name: ${component.name}`);
  }
};

export default removeComponentValidation;

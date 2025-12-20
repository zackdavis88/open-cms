import { Project } from 'src/models';
import { ValidationError } from 'src/server/utils/errors';

type RemoveProjectValidation = ({
  project,
  confirm,
}: {
  project: Project;
  confirm: unknown;
}) => void;

const validateRemoveProject: RemoveProjectValidation = ({ project, confirm }) => {
  if (confirm === null || confirm === undefined) {
    throw new ValidationError('confirm is missing from input');
  }

  if (typeof confirm !== 'string') {
    throw new ValidationError('confirm must be a string');
  }

  if (project.name !== confirm) {
    throw new ValidationError(`confirm must match the project name: ${project.name}`);
  }
};

export default validateRemoveProject;

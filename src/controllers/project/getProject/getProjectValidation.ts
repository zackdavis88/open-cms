import { validateUUID } from 'src/controllers/utils';

type GetProjectValidation = (projectId: string) => void;

const getProjectValidation: GetProjectValidation = (projectId) => {
  validateUUID(projectId, 'project');
};

export default getProjectValidation;

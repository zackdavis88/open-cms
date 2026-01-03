import { validateUUID } from 'src/controllers/utils';

type GetComponentValidation = (componentId: string) => void;

const getComponentValidation: GetComponentValidation = (componentId) => {
  validateUUID(componentId, 'component');
};

export default getComponentValidation;

import { validateUUID } from 'src/controllers/utils';

type GetLayoutValidation = (layoutId: string) => void;

const getLayoutValidation: GetLayoutValidation = (layoutId) => {
  validateUUID(layoutId, 'layout');
};

export default getLayoutValidation;

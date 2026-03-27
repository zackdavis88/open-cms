import { validateUUID } from 'src/controllers/utils';

type GetImageValidation = (imageId: string) => void;

const getImageValidation: GetImageValidation = (imageId) => {
  validateUUID(imageId, 'image');
};

export default getImageValidation;

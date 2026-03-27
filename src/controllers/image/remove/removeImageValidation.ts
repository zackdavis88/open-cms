import { Image } from 'src/models';
import { ValidationError } from 'src/server/utils/errors';

type RemoveImageValidation = ({
  image,
  confirm,
}: {
  image: Image;
  confirm: unknown;
}) => void;

const removeImageValidation: RemoveImageValidation = ({ image, confirm }) => {
  if (confirm === null || confirm === undefined) {
    throw new ValidationError('confirm is missing from input');
  }

  if (typeof confirm !== 'string') {
    throw new ValidationError('confirm must be a string');
  }

  if (image.originalFileName !== confirm) {
    throw new ValidationError(
      `confirm must match the image original name: ${image.originalFileName}`,
    );
  }
};

export default removeImageValidation;

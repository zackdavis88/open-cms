import { Image } from 'src/models';
import getPublicUserData from './getPublicUserData';

const getImageData = (image: Image & { url: string }) => {
  return {
    id: image.id,
    originalFileName: image.originalFileName,
    extension: image.extension,
    url: image.url,
    project: {
      id: image.project.id,
      name: image.project.name,
    },
    createdOn: image.createdOn,
    createdBy: image.createdBy && getPublicUserData(image.createdBy),
  };
};

export default getImageData;

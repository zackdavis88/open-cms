import { Project, Image } from 'src/models';

let BASE_STATIC_URL = '/static';
if (
  typeof process.env.BASE_STATIC_URL === 'string' &&
  process.env.BASE_STATIC_URL.startsWith('/')
) {
  BASE_STATIC_URL = process.env.BASE_STATIC_URL;
}

type GetImageUrl = ({
  host,
  image,
  project,
  protocol,
}: {
  host: string;
  image: Image;
  project: Project;
  protocol: string;
}) => string;

const getImageUrl: GetImageUrl = ({ host, image, project, protocol }) => {
  return new URL(
    `${BASE_STATIC_URL}/${project.id}/${image.id}${image.extension}`,
    `${protocol}://${host}`,
  ).toString();
};

export default getImageUrl;

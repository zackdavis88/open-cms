import { Request, Response, NextFunction } from 'express';
import { ImageData } from 'src/types';
import { getImageData } from 'src/controllers/utils';
import getImageValidation from './getImageValidation';
import { NotFoundError } from 'src/server/utils/errors';
import { User } from 'src/models';
import { getImageUrl } from 'src/controllers/image/utils';

export const getImageMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { project } = req;
    getImageValidation(req.params.imageId);
    const image = await project.getImage({
      where: { id: req.params.imageId, isActive: true },
      include: [{ model: User.scope('publicAttributes'), as: 'createdBy' }],
    });

    if (!image) {
      throw new NotFoundError('requested image not found');
    }

    req.image = image;
    next();
  } catch (error) {
    return res.sendError(error);
  }
};

type GetImageResponseBody = {
  image: ImageData;
};

const getImageFlow = async (req: Request, res: Response) => {
  try {
    const { project, image, host, protocol } = req;
    const responseBody: GetImageResponseBody = {
      image: getImageData(
        Object.assign(image, {
          project,
          url: getImageUrl({ host, image, project, protocol }),
        }),
      ),
    };
    return res.success('image has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getImageFlow;

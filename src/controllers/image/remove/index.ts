import { Request, Response } from 'express';
import removeImageValidation from './removeImageValidation';
import { getImageData, getPublicUserData } from 'src/controllers/utils';

interface RemoveImageRequestBody {
  confirm?: unknown;
}

const removeImageFlow = async (
  req: Request<never, never, RemoveImageRequestBody>,
  res: Response,
) => {
  try {
    const { image, project, user: authUser } = req;
    removeImageValidation({ image, confirm: req.body?.confirm });

    image.isActive = false;
    image.deletedOn = new Date();
    image.deletedById = authUser.id;
    image.deletedBy = authUser;
    await image.save();

    const responseBody = {
      image: {
        ...getImageData(Object.assign(image, { project, url: '' })),
        deletedOn: image.deletedOn,
        deletedBy: getPublicUserData(authUser),
        url: undefined,
      },
    };
    return res.success('image has been successfully removed', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default removeImageFlow;

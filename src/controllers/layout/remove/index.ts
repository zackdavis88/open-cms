import { Request, Response } from 'express';
import removeLayoutValidation from './removeLayoutValidation';
import { LayoutData } from 'src/types';
import { getLayoutData, getPublicUserData } from 'src/controllers/utils';

interface RemoveLayoutRequestBody {
  confirm?: unknown;
}

type RemoveLayoutResponseBody = {
  layout: LayoutData;
};

const removeLayoutFlow = async (
  req: Request<never, never, RemoveLayoutRequestBody>,
  res: Response,
) => {
  try {
    const { layout, project, user: authUser } = req;
    removeLayoutValidation({ layout, confirm: req.body?.confirm });

    layout.isActive = false;
    layout.deletedOn = new Date();
    layout.deletedById = authUser.id;
    layout.deletedBy = authUser;
    await layout.save();

    const responseBody: RemoveLayoutResponseBody = {
      layout: {
        ...getLayoutData(Object.assign(layout, { project })),
        updatedOn: layout.updatedOn || null,
        updatedBy:
          (layout.updatedById &&
            layout.updatedBy &&
            getPublicUserData(layout.updatedBy)) ||
          null,
        deletedOn: layout.deletedOn,
        deletedBy: getPublicUserData(layout.deletedBy),
      },
    };
    return res.success('layout has been successfully removed', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default removeLayoutFlow;

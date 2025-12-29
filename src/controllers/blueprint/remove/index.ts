import { Request, Response } from 'express';
import removeBlueprintValidation from './removeBlueprintValidation';
import { BlueprintData } from 'src/types';
import { getBlueprintData, getPublicUserData } from 'src/controllers/utils';

interface RemoveBlueprintRequestBody {
  confirm?: unknown;
}

type RemoveBlueprintResponseBody = {
  blueprint: BlueprintData;
};

const removeBlueprintFlow = async (
  req: Request<never, never, RemoveBlueprintRequestBody>,
  res: Response,
) => {
  try {
    const { blueprint, project, user: authUser } = req;
    removeBlueprintValidation({ blueprint, confirm: req.body?.confirm });

    blueprint.isActive = false;
    blueprint.deletedOn = new Date();
    blueprint.deletedById = authUser.id;
    blueprint.deletedBy = authUser;
    await blueprint.save();

    const responseBody: RemoveBlueprintResponseBody = {
      blueprint: {
        ...getBlueprintData(Object.assign(blueprint, { project })),
        updatedOn: blueprint.updatedOn || null,
        updatedBy:
          (blueprint.updatedById &&
            blueprint.updatedBy &&
            getPublicUserData(blueprint.updatedBy)) ||
          null,
        deletedOn: blueprint.deletedOn,
        deletedBy: getPublicUserData(blueprint.deletedBy),
      },
    };
    return res.success('blueprint has been successfully removed', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default removeBlueprintFlow;

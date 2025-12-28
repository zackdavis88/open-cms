import { Request, Response, NextFunction } from 'express';
import { BlueprintData } from 'src/types';
import { getBlueprintData, getPublicUserData } from 'src/controllers/utils';
import getBlueprintValidation from './getBlueprintValidation';
import { NotFoundError } from 'src/server/utils/errors';
import { User } from 'src/models';

export const getBlueprintMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { project } = req;
    getBlueprintValidation(req.params.blueprintId);
    const blueprint = await project.getBlueprint({
      where: { id: req.params.blueprintId, isActive: true },
      include: [
        { model: User.scope('publicAttributes'), as: 'createdBy' },
        { model: User.scope('publicAttributes'), as: 'updatedBy' },
      ],
    });

    if (!blueprint) {
      throw new NotFoundError('requested blueprint not found');
    }

    req.blueprint = blueprint;
    next();
  } catch (error) {
    return res.sendError(error);
  }
};

type GetBlueprintResponseBody = {
  blueprint: BlueprintData;
};

const getBlueprintFlow = async (req: Request, res: Response) => {
  try {
    const { project, blueprint } = req;
    const responseBody: GetBlueprintResponseBody = {
      blueprint: {
        ...getBlueprintData(Object.assign(blueprint, { project })),
        updatedOn: blueprint.updatedOn,
        updatedBy:
          blueprint.updatedById &&
          blueprint.updatedBy &&
          getPublicUserData(blueprint.updatedBy),
      },
    };
    return res.success('blueprint has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getBlueprintFlow;

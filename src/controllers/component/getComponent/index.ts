import { Request, Response, NextFunction } from 'express';
import { ComponentData } from 'src/types';
import { getComponentData, getPublicUserData } from 'src/controllers/utils';
import getComponentValidation from './getComponentValidation';
import { NotFoundError } from 'src/server/utils/errors';
import { User, Blueprint, BlueprintVersion } from 'src/models';

export const getComponentMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { project } = req;
    getComponentValidation(req.params.componentId);
    const component = await project.getComponent({
      where: { id: req.params.componentId, isActive: true },
      include: [
        { model: User.scope('publicAttributes'), as: 'createdBy' },
        { model: User.scope('publicAttributes'), as: 'updatedBy' },
        { model: Blueprint, as: 'blueprint' },
        { model: BlueprintVersion, as: 'blueprintVersion' },
      ],
    });

    if (!component) {
      throw new NotFoundError('requested component not found');
    }

    req.component = component;
    next();
  } catch (error) {
    return res.sendError(error);
  }
};

type GetComponentResponseBody = {
  component: ComponentData;
};

const getComponentFlow = async (req: Request, res: Response) => {
  try {
    const { project, component } = req;
    const responseBody: GetComponentResponseBody = {
      component: {
        ...getComponentData(Object.assign(component, { project })),
        blueprintVersion: component.blueprintVersionId &&
          component.blueprintVersion && {
            id: component.blueprintVersion.id,
            name: component.blueprintVersion.name,
          },
        updatedOn: component.updatedOn || null,
        updatedBy:
          (component.updatedById &&
            component.updatedBy &&
            getPublicUserData(component.updatedBy)) ||
          null,
      },
    };
    return res.success('component has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getComponentFlow;

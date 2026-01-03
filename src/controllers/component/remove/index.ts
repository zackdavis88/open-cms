import { Request, Response } from 'express';
import removeComponentValidation from './removeComponentValidation';
import { ComponentData } from 'src/types';
import { getComponentData, getPublicUserData } from 'src/controllers/utils';

interface RemoveComponentRequestBody {
  confirm?: unknown;
}

type RemoveComponentResponseBody = {
  component: ComponentData;
};

const removeComponentFlow = async (
  req: Request<never, never, RemoveComponentRequestBody>,
  res: Response,
) => {
  try {
    const { component, project, user: authUser } = req;
    removeComponentValidation({ component, confirm: req.body?.confirm });

    component.isActive = false;
    component.deletedOn = new Date();
    component.deletedById = authUser.id;
    component.deletedBy = authUser;
    await component.save();

    const responseBody: RemoveComponentResponseBody = {
      component: {
        ...getComponentData(Object.assign(component, { project })),
        updatedOn: component.updatedOn || null,
        updatedBy:
          (component.updatedById &&
            component.updatedBy &&
            getPublicUserData(component.updatedBy)) ||
          null,
        deletedOn: component.deletedOn,
        deletedBy: getPublicUserData(component.deletedBy),
        blueprintVersion: component.blueprintVersionId &&
          component.blueprintVersion && {
            id: component.blueprintVersion.id,
            name: component.blueprintVersion.name,
          },
      },
    };
    return res.success('component has been successfully removed', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default removeComponentFlow;

import { Request, Response } from 'express';
import updateComponentValidation from './updateComponentValidation';
import { ComponentData } from 'src/types';
import { getComponentData, getPublicUserData } from 'src/controllers/utils';

interface UpdateComponentRequestBody {
  name?: unknown;
  content?: unknown;
}

type UpdateComponentResponseBody = {
  component: ComponentData;
};

const updateComponentFlow = async (
  req: Request<never, never, UpdateComponentRequestBody>,
  res: Response,
) => {
  const dbTransaction = await req.sequelize.transaction();
  try {
    const { user, project, component } = req;
    const { name, content } = updateComponentValidation({
      blueprint: component.blueprint,
      blueprintVersion: component.blueprintVersion ?? undefined,
      nameInput: req.body?.name,
      contentInput: req.body?.content,
    });

    await component.createVersion(
      {
        createdById: user.id,
        name: component.name,
        content: component.content,
      },
      { transaction: dbTransaction },
    );

    if (name) {
      component.name = name;
    }

    if (content) {
      component.content = content;
    }

    component.updatedOn = new Date();
    component.updatedById = user.id;
    await component.save({ transaction: dbTransaction });
    await dbTransaction.commit();

    const responseBody: UpdateComponentResponseBody = {
      component: {
        ...getComponentData(
          Object.assign(component, {
            project,
          }),
        ),
        blueprintVersion: component.blueprintVersionId &&
          component.blueprintVersion && {
            id: component.blueprintVersion.id,
            name: component.blueprintVersion.name,
          },
        updatedOn: component.updatedOn,
        updatedBy: getPublicUserData(user),
      },
    };

    return res.success('component has been successfully updated', responseBody);
  } catch (error) {
    await dbTransaction.rollback();
    return res.sendError(error);
  }
};

export default updateComponentFlow;

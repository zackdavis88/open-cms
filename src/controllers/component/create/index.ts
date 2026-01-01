import { Request, Response } from 'express';
import createComponentValidation from './createComponentValidation';
import { ComponentData } from 'src/types';
import { getComponentData } from 'src/controllers/utils';

interface CreateComponentRequestBody {
  name?: unknown;
  content?: unknown;
}

type CreateComponentResponseBody = {
  component: ComponentData;
};

const createComponentFlow = async (
  req: Request<never, never, CreateComponentRequestBody>,
  res: Response,
) => {
  try {
    const { user, project, blueprint } = req;
    const { name, content } = await createComponentValidation({
      blueprint,
      nameInput: req.body?.name,
      contentInput: req.body?.content,
    });

    const newComponent = await project.createComponent({
      createdById: user.id,
      blueprintId: blueprint.id,
      name,
      content,
    });

    const responseBody: CreateComponentResponseBody = {
      component: getComponentData(
        Object.assign(newComponent, {
          createdBy: user,
          project,
          blueprint,
        }),
      ),
    };

    return res.success('component has been successfully created', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default createComponentFlow;

import { Request, Response } from 'express';
import createLayoutValidation from './createLayoutValidation';
import { LayoutData } from 'src/types';
import { getLayoutData } from 'src/controllers/utils';
import { LayoutComponent } from 'src/models';

interface CreateLayoutRequestBody {
  name?: unknown;
  layoutComponents?: unknown;
}

type CreateLayoutResponseBody = {
  layout: LayoutData;
};

const createLayoutFlow = async (
  req: Request<never, never, CreateLayoutRequestBody>,
  res: Response,
) => {
  const dbTransaction = await req.sequelize.transaction();
  try {
    const { user, project } = req;
    const { name, layoutComponents, layoutComponentsMap } = await createLayoutValidation({
      nameInput: req.body?.name,
      layoutComponentsInput: req.body?.layoutComponents,
      project,
    });

    const newLayout = await project.createLayout(
      {
        createdById: user.id,
        name,
      },
      { transaction: dbTransaction },
    );

    const newLayoutComponents = await LayoutComponent.bulkCreate(
      layoutComponents.map((layoutComponentId, index) => ({
        layoutId: newLayout.id,
        componentId: layoutComponentId,
        order: index,
      })),
      { transaction: dbTransaction },
    );
    await dbTransaction.commit();

    const responseBody: CreateLayoutResponseBody = {
      layout: getLayoutData(
        Object.assign(newLayout, {
          layoutComponents: newLayoutComponents.map((layoutComponent) => ({
            ...layoutComponent,
            component: layoutComponentsMap[layoutComponent.componentId],
          })),
          project,
          createdBy: user,
        }),
      ),
    };

    return res.success('layout has been successfully created', responseBody);
  } catch (error) {
    await dbTransaction.rollback();
    return res.sendError(error);
  }
};

export default createLayoutFlow;

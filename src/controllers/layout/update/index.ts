import { Request, Response } from 'express';
import updateLayoutValidation from './updateLayoutValidation';
import { LayoutData } from 'src/types';
import { getLayoutData, getPublicUserData } from 'src/controllers/utils';
import { LayoutComponent } from 'src/models';

interface UpdateLayoutRequestBody {
  name?: unknown;
  layoutComponents?: unknown;
}

type UpdateLayoutResponseBody = {
  layout: LayoutData;
};

const updateLayoutFlow = async (
  req: Request<never, never, UpdateLayoutRequestBody>,
  res: Response,
) => {
  const dbTransaction = await req.sequelize.transaction();
  try {
    const { user, project, layout } = req;
    const { name, layoutComponents, layoutComponentsMap } = await updateLayoutValidation({
      project,
      nameInput: req.body?.name,
      layoutComponentsInput: req.body?.layoutComponents,
    });

    if (name) {
      layout.name = name;
    }

    if (layoutComponents && layoutComponentsMap) {
      // TODO: Is this the best way to do this? I want to do an upsert but its not good enough because a user
      //       could be updating the layoutComponents to be less than the previous version..therefore stragglers
      //       remain in the layout_components table.

      // If we are updating layoutComponents, lets first remove all existing layoutComponents for this layout.
      await LayoutComponent.destroy({
        where: { layoutId: layout.id },
        transaction: dbTransaction,
      });

      const newLayoutComponents = await LayoutComponent.bulkCreate(
        layoutComponents.map((layoutComponentId, index) => ({
          layoutId: layout.id,
          componentId: layoutComponentId,
          order: index,
        })),
        { transaction: dbTransaction },
      );

      layout.layoutComponents = newLayoutComponents.map((createdLayoutComponent) =>
        Object.assign(createdLayoutComponent, {
          component: layoutComponentsMap[createdLayoutComponent.componentId],
        }),
      );
    }

    layout.updatedOn = new Date();
    layout.updatedById = user.id;
    await layout.save({ transaction: dbTransaction });
    await dbTransaction.commit();

    const responseBody: UpdateLayoutResponseBody = {
      layout: {
        ...getLayoutData(
          Object.assign(layout, {
            project,
          }),
        ),
        updatedOn: layout.updatedOn,
        updatedBy: getPublicUserData(user),
      },
    };

    return res.success('layout has been successfully updated', responseBody);
  } catch (error) {
    await dbTransaction.rollback();
    return res.sendError(error);
  }
};

export default updateLayoutFlow;

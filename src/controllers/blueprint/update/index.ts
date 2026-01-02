import { Request, Response } from 'express';
import updateBlueprintValidation from './updateBlueprintValidation';
import { BlueprintData } from 'src/types';
import { getBlueprintData, getPublicUserData } from 'src/controllers/utils';
import { Component } from 'src/models';

interface UpdateBlueprintRequestBody {
  name?: unknown;
  fields?: unknown;
}

type UpdateBlueprintResponseBody = {
  blueprint: BlueprintData;
};

const updateBlueprintFlow = async (
  req: Request<never, never, UpdateBlueprintRequestBody>,
  res: Response,
) => {
  const dbTransaction = await req.sequelize.transaction();
  try {
    const { user: authUser, project, blueprint } = req;
    const { name, fields } = await updateBlueprintValidation({
      nameInput: req.body?.name,
      fieldsInput: req.body?.fields,
    });

    const newVersion = await blueprint.createVersion(
      {
        name: blueprint.name,
        fields: blueprint.fields,
        createdById: authUser.id,
      },
      { transaction: dbTransaction },
    );

    // Update all Components that reference this blueprint to point to the new version
    await Component.update(
      { blueprintVersionId: newVersion.id },
      {
        where: { blueprintId: blueprint.id, isActive: true },
        transaction: dbTransaction,
      },
    );

    if (name) {
      blueprint.name = name;
    }

    if (fields) {
      blueprint.fields = fields;
    }

    blueprint.updatedOn = new Date();
    blueprint.updatedById = authUser.id;
    blueprint.updatedBy = authUser;
    await blueprint.save({ transaction: dbTransaction });
    await dbTransaction.commit();

    const responseBody: UpdateBlueprintResponseBody = {
      blueprint: {
        ...getBlueprintData(
          Object.assign(blueprint, {
            project,
          }),
        ),
        updatedOn: blueprint.updatedOn,
        updatedBy: getPublicUserData(blueprint.updatedBy),
      },
    };

    return res.success('blueprint has been successfully updated', responseBody);
  } catch (error) {
    await dbTransaction.rollback();
    return res.sendError(error);
  }
};

export default updateBlueprintFlow;

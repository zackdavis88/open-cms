import { Request, Response } from 'express';
import { BlueprintVersion } from 'src/models';
import createBlueprintValidation from './createBlueprintValidation';
import { BlueprintData } from 'src/types';
import { getBlueprintData } from 'src/controllers/utils';

interface CreateBlueprintRequestBody {
  name?: unknown;
  fields?: unknown;
}

type CreateBlueprintResponseBody = {
  blueprint: BlueprintData;
};

const createBlueprintFlow = async (
  req: Request<never, never, CreateBlueprintRequestBody>,
  res: Response,
) => {
  const dbTransaction = await req.sequelize.transaction();
  try {
    const { user, project } = req;
    const { name, fields } = await createBlueprintValidation({
      nameInput: req.body?.name,
      fieldsInput: req.body?.fields,
    });

    // We are declaring the ids of the Blueprint and BlueprintVersion in advanced
    // because they are both models that reference each other so we need to know the id.
    // These models are setup with deferred foreign key constraints, so as long as these
    // ids are used as expected, we shouldnt get any transaction errors.
    const blueprintId = crypto.randomUUID();
    const blueprintVersionId = crypto.randomUUID();

    const initialVersion = await BlueprintVersion.create(
      {
        id: blueprintVersionId,
        blueprintId,
        name,
        fields,
        createdById: user.id,
      },
      { transaction: dbTransaction },
    );

    const newBlueprint = await project.createBlueprint(
      {
        id: blueprintId,
        createdById: user.id,
        blueprintVersionId,
      },
      { transaction: dbTransaction },
    );

    await dbTransaction.commit();

    const responseBody: CreateBlueprintResponseBody = {
      blueprint: getBlueprintData(
        Object.assign(newBlueprint, {
          createdBy: user,
          project,
          version: initialVersion,
        }),
      ),
    };

    return res.success('blueprint has been successfully created', responseBody);
  } catch (error) {
    await dbTransaction.rollback();
    return res.sendError(error);
  }
};

export default createBlueprintFlow;

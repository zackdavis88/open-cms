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
  try {
    const { user, project } = req;
    const { name, fields } = await createBlueprintValidation({
      nameInput: req.body?.name,
      fieldsInput: req.body?.fields,
    });

    const blueprintId = crypto.randomUUID();

    const initialVersion = await BlueprintVersion.create({
      blueprintId,
      name,
      fields,
      createdById: user.id,
    });

    const newBlueprint = await project.createBlueprint({
      id: blueprintId,
      createdById: user.id,
      blueprintVersionId: initialVersion.id,
    });

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
    return res.sendError(error);
  }
};

export default createBlueprintFlow;

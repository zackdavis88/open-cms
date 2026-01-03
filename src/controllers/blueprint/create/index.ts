import { Request, Response } from 'express';
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

    const newBlueprint = await project.createBlueprint({
      createdById: user.id,
      name,
      fields,
    });

    const responseBody: CreateBlueprintResponseBody = {
      blueprint: getBlueprintData(
        Object.assign(newBlueprint, {
          createdBy: user,
          project,
        }),
      ),
    };

    return res.success('blueprint has been successfully created', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default createBlueprintFlow;

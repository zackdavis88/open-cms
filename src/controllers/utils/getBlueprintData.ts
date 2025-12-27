import { Blueprint } from 'src/models';
import getPublicUserData from './getPublicUserData';

const getBlueprintData = (blueprint: Blueprint) => {
  return {
    id: blueprint.id,
    project: {
      id: blueprint.project.id,
      name: blueprint.project.name,
    },
    createdOn: blueprint.createdOn,
    createdBy: blueprint.createdBy && getPublicUserData(blueprint.createdBy),
    blueprintVersionId: blueprint.blueprintVersionId,
    name: blueprint.version.name,
    fields: blueprint.version.fields,
  };
};

export default getBlueprintData;

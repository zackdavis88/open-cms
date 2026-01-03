import { Op } from 'sequelize';
import { validateUUID } from 'src/controllers/utils';
import { Component, Project } from 'src/models';
import { ValidationError } from 'src/server/utils/errors';

type ValidateLayoutComponents = ({
  project,
  layoutComponents,
  isOptional,
}: {
  project: Project;
  layoutComponents?: unknown;
  isOptional?: boolean;
}) => Promise<
  | {
      layoutComponents: string[] | undefined;
      layoutComponentsMap: Record<string, Component> | undefined;
    }
  | undefined
>;
const validateLayoutComponents: ValidateLayoutComponents = async ({
  project,
  layoutComponents,
  isOptional = false,
}: {
  project: Project;
  layoutComponents?: unknown;
  isOptional?: boolean;
}) => {
  if ((isOptional && layoutComponents === null) || layoutComponents === undefined) {
    return;
  }

  if (!Array.isArray(layoutComponents) || layoutComponents.length === 0) {
    throw new ValidationError('layoutComponents must be an array of componentIds');
  }

  layoutComponents.forEach((layoutComponentId) => {
    if (typeof layoutComponentId !== 'string') {
      throw new ValidationError('layoutComponents must be strings of componentIds');
    }

    validateUUID(layoutComponentId, 'layoutComponent');
  });

  const uniqueIds = [...new Set(layoutComponents)];

  const uniqueComponents = await project.getComponents({
    where: { id: { [Op.in]: uniqueIds }, isActive: true },
  });

  if (uniqueComponents.length !== uniqueIds.length) {
    throw new ValidationError('one or more layoutComponents was not found');
  }

  const layoutComponentsMap = uniqueComponents.reduce(
    (layoutComponentsMap, component) => {
      return { ...layoutComponentsMap, [component.id]: component };
    },
    {},
  );

  return { layoutComponents, layoutComponentsMap };
};

export default validateLayoutComponents;

import { validateName } from 'src/controllers/utils';
import { Component, Project } from 'src/models';
import { validateLayoutComponents } from 'src/controllers/layout/utils';
import { ValidationError } from 'src/server/utils/errors';

type UpdateLayoutValidation = (input: {
  project: Project;
  nameInput?: unknown;
  layoutComponentsInput?: unknown;
}) => Promise<{
  name: string | undefined;
  layoutComponents: string[] | undefined;
  layoutComponentsMap: Record<string, Component> | undefined;
}>;

const updateLayoutValidation: UpdateLayoutValidation = async ({
  project,
  nameInput,
  layoutComponentsInput,
}) => {
  if (!nameInput && !layoutComponentsInput) {
    throw new ValidationError('input contains nothing to update');
  }

  const name = validateName({ name: nameInput, isOptional: true });
  const layoutValidationResult = await validateLayoutComponents({
    project,
    layoutComponents: layoutComponentsInput,
    isOptional: true,
  });

  return {
    name,
    layoutComponents: layoutValidationResult?.layoutComponents,
    layoutComponentsMap: layoutValidationResult?.layoutComponentsMap,
  };
};

export default updateLayoutValidation;

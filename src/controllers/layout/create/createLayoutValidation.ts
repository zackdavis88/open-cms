import { validateName } from 'src/controllers/utils';
import { Component, Project } from 'src/models';
import { validateLayoutComponents } from 'src/controllers/layout/utils';

type CreateLayoutValidation = (input: {
  project: Project;
  nameInput?: unknown;
  layoutComponentsInput?: unknown;
}) => Promise<{
  name: string;
  layoutComponents: string[];
  layoutComponentsMap: Record<string, Component>;
}>;

const createLayoutValidation: CreateLayoutValidation = async ({
  project,
  nameInput,
  layoutComponentsInput,
}) => {
  const name = validateName({ name: nameInput }) as string;
  const { layoutComponents, layoutComponentsMap } = (await validateLayoutComponents({
    project,
    layoutComponents: layoutComponentsInput,
  })) as { layoutComponents: string[]; layoutComponentsMap: Record<string, Component> };

  return { name, layoutComponents, layoutComponentsMap };
};

export default createLayoutValidation;

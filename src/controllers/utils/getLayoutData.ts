import { Layout } from 'src/models';
import getPublicUserData from './getPublicUserData';

const getLayoutData = (layout: Layout) => {
  return {
    id: layout.id,
    name: layout.name,
    project: {
      id: layout.project.id,
      name: layout.project.name,
    },
    layoutComponents: layout.layoutComponents.map((layoutComponent) => ({
      id: layoutComponent.component.id,
      name: layoutComponent.component.name,
      content: layoutComponent.component.content,
    })),
    createdOn: layout.createdOn,
    createdBy: layout.createdBy && getPublicUserData(layout.createdBy),
  };
};

export default getLayoutData;

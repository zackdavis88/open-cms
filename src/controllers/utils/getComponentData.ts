import { Component } from 'src/models';
import getPublicUserData from './getPublicUserData';

const getComponentData = (component: Component) => {
  return {
    id: component.id,
    project: {
      id: component.project.id,
      name: component.project.name,
    },
    blueprint: {
      id: component.blueprint.id,
      name: component.blueprint.name,
    },
    createdOn: component.createdOn,
    createdBy: component.createdBy && getPublicUserData(component.createdBy),
    name: component.name,
    content: component.content,
  };
};

export default getComponentData;

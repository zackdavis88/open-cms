import { Project } from 'src/models';
import getPublicUserData from './getPublicUserData';

const getProjectData = (project: Project) => {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    createdOn: project.createdOn,
    createdBy: project.createdBy && getPublicUserData(project.createdBy),
  };
};

export default getProjectData;

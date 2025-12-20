const ProjectIdParam = {
  name: 'projectId',
  in: 'path',
  description: 'Unique id of the project',
  required: true,
  schema: {
    type: 'string',
    format: 'uuid',
  },
};

export default ProjectIdParam;

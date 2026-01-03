const MinimalProjectData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique id of the project',
      examples: ['80d9afe5-f979-428c-887a-fe3f8fa2f21f'],
    },
    name: {
      type: 'string',
      description: 'Name of the project',
      examples: ['MyFancyProject'],
    },
  },
  required: ['id', 'name'],
};

export default MinimalProjectData;

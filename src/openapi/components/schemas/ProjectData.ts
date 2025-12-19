const ProjectData = {
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
    description: {
      type: ['string', 'null'],
      description: 'Description of the project',
      examples: ['A super fancy project'],
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp of when the project was created',
      examples: ['2023-11-10T16:30:00.000Z', null],
    },
    createdBy: {
      description: 'User details of the project creator',
      $ref: '#/components/schemas/PublicUserData',
    },
  },
  required: ['id', 'name', 'createdOn', 'createdBy'],
};

export default ProjectData;

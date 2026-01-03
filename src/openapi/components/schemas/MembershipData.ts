const MembershipData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique id of the membership',
      examples: ['091a3998-26e5-41de-87e7-b36afbe777a9'],
    },
    user: {
      description: 'User details of the membership',
      $ref: '#/components/schemas/PublicUserData',
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp of when the membership was created',
      examples: ['2023-11-10T16:46:00.093Z', null],
    },
    createdBy: {
      description: 'User details of the membership creator',
      $ref: '#/components/schemas/PublicUserData',
    },
    isAdmin: {
      type: 'boolean',
      description: 'Admin level authorization for the project',
      examples: [true],
    },
    isWriter: {
      type: 'boolean',
      description: 'Write level authorization for the project',
      examples: [false],
    },
  },
  required: ['id', 'user', 'createdOn', 'createdBy', 'isAdmin', 'isWriter'],
};

export default MembershipData;

const PublicUserData = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      description: 'Unique, lowercase, username for the user',
      examples: ['johndoe'],
    },
    displayName: {
      type: 'string',
      description: 'Unique, case-sensitive display name for the user',
      examples: ['JohnDoe'],
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp of when the user was created',
      examples: ['2023-10-05T14:48:00.000Z'],
    },
  },
  required: ['username', 'displayName', 'createdOn'],
};

export default PublicUserData;

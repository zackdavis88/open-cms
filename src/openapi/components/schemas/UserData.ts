const UserData = {
  allOf: [
    { $ref: '#/components/schemas/PublicUserData' },
    {
      type: 'object',
      properties: {
        updatedOn: {
          type: ['string', 'null'],
          format: 'date-time',
          description: 'Timestamp of when the user was last updated',
          examples: ['2023-11-05T15:00:00.000Z', null],
        },
      },
    },
  ],
  required: ['username', 'displayName', 'createdOn', 'updatedOn'],
};

export default UserData;

const LayoutData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique id of the layout',
      examples: ['4d34fb00-cf67-4902-b50a-925494ba3808'],
    },
    name: {
      type: 'string',
      description: 'Name of the layout',
      examples: ['TheBestLayout'],
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp of when the layout was created',
      examples: ['2021-01-16T00:00:00.000Z'],
    },
    createdBy: {
      description: 'User details of the layout creator',
      $ref: '#/components/schemas/PublicUserData',
    },
  },
  required: ['id', 'name', 'createdOn', 'createdBy'],
};

export default LayoutData;

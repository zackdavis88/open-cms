const ComponentData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique id of the component',
      examples: ['4d34fb00-cf67-4902-b50a-925494ba3808'],
    },
    name: {
      type: 'string',
      description: 'Name of the component',
      examples: ['AwesomeComponent'],
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp of when the component was created',
      examples: ['2021-01-16T00:00:00.000Z'],
    },
    createdBy: {
      description: 'User details of the component creator',
      $ref: '#/components/schemas/PublicUserData',
    },
    blueprint: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'Unique id of the blueprint that this component references',
          examples: ['0aca9275-26e5-41de-17a1-ba6afbe777ff'],
        },
        name: {
          type: 'string',
          description: 'Name of the blueprint that this component references',
          examples: ['SuperCoolBlueprint'],
        },
      },
    },
  },
  required: ['id', 'name', 'createdOn', 'createdBy', 'blueprint'],
};

export default ComponentData;

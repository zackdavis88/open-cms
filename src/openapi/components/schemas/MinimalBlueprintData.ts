const MinimalBlueprintData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique id of the blueprint',
      examples: ['0aca9275-26e5-41de-17a1-ba6afbe777ff'],
    },
    name: {
      type: 'string',
      description: 'Name of the blueprint',
      examples: ['SuperCoolBlueprint'],
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp of when the blueprint was created',
      examples: ['2021-01-10T16:45:00.000Z'],
    },
    createdBy: {
      description: 'User details of the blueprint creator',
      $ref: '#/components/schemas/PublicUserData',
    },
  },
  required: ['id', 'name', 'createdOn', 'createdBy'],
};

export default MinimalBlueprintData;

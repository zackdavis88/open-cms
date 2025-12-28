const BlueprintBooleanField = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the boolean field',
      examples: ['booleanField1'],
    },
    type: {
      type: 'string',
      description: 'Type of the boolean field, must be "boolean"',
      enum: ['boolean'],
      examples: ['boolean'],
    },
    isRequired: {
      type: 'boolean',
      description: 'Indicates if the field is required',
      examples: [false],
    },
  },
  required: ['name', 'type'],
};

export default BlueprintBooleanField;

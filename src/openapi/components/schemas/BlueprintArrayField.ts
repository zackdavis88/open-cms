const BlueprintArrayField = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the array field',
      examples: ['arrayField1'],
    },
    type: {
      type: 'string',
      description: 'Type of the array field, must be "array"',
      enum: ['array'],
      examples: ['array'],
    },
    isRequired: {
      type: 'boolean',
      description: 'Indicates if the field is required',
      examples: [false],
    },
    arrayOf: {
      anyOf: [
        { $ref: '#/components/schemas/BlueprintStringField' },
        { $ref: '#/components/schemas/BlueprintNumberField' },
        { $ref: '#/components/schemas/BlueprintBooleanField' },
        { $ref: '#/components/schemas/BlueprintDateField' },
        { $ref: '#/components/schemas/BlueprintArrayField' },
        { $ref: '#/components/schemas/BlueprintObjectField' },
      ],
      examples: [{ name: 'arrayString', type: 'string', isRequired: false }],
    },
  },
  required: ['name', 'type', 'arrayOf'],
};

export default BlueprintArrayField;

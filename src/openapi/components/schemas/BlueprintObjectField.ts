const BlueprintArrayField = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the object field',
      examples: ['objectField1'],
    },
    type: {
      type: 'string',
      description: 'Type of the object field, must be "object"',
      enum: ['object'],
      examples: ['object'],
    },
    isRequired: {
      type: 'boolean',
      description: 'Indicates if the field is required',
      examples: [false],
    },
    fields: {
      type: 'array',
      items: {
        anyOf: [
          { $ref: '#/components/schemas/BlueprintStringField' },
          { $ref: '#/components/schemas/BlueprintNumberField' },
          { $ref: '#/components/schemas/BlueprintBooleanField' },
          { $ref: '#/components/schemas/BlueprintDateField' },
          { $ref: '#/components/schemas/BlueprintArrayField' },
          { $ref: '#/components/schemas/BlueprintObjectField' },
        ],
      },
      examples: [
        [
          { name: 'nestedString1', type: 'string' },
          { name: 'nestedBoolean1', type: 'boolean' },
        ],
      ],
    },
  },
  required: ['name', 'type', 'fields'],
};

export default BlueprintArrayField;

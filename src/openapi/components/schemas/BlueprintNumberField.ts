const BlueprintNumberField = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the number field',
      examples: ['numberField1'],
    },
    type: {
      type: 'string',
      description: 'Type of the number field, must be "number"',
      enum: ['number'],
      examples: ['number'],
    },
    isRequired: {
      type: 'boolean',
      description: 'Indicates if the field is required',
      examples: [false],
    },
    isInteger: {
      type: 'boolean',
      description: 'Indicates if the field is restricted to integer values',
      examples: [false],
    },
    min: {
      type: 'number',
      description: 'Minimum value of the number field',
      examples: [0],
    },
    max: {
      type: 'number',
      description: 'Maximum value of the number field',
      examples: [255],
    },
  },
  required: ['name', 'type'],
};

export default BlueprintNumberField;

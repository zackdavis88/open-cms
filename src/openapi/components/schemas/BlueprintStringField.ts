const BlueprintStringField = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the string field',
      examples: ['stringField1'],
    },
    type: {
      type: 'string',
      description: 'Type of the string field, must be "string"',
      enum: ['string'],
      examples: ['string'],
    },
    isRequired: {
      type: 'boolean',
      description: 'Indicates if the field is required',
      examples: [false],
    },
    regex: {
      type: 'string',
      format: 'regex',
      description: 'Regex patterns for the string field',
      examples: ['^stringField_'],
    },
    minLength: {
      type: 'number',
      description: 'Minimum number of characters in the string field',
      examples: [1],
    },
    maxLength: {
      type: 'number',
      description: 'Maximum number of characters in the string field',
      examples: [25],
    },
  },
  required: ['name', 'type'],
};

export default BlueprintStringField;

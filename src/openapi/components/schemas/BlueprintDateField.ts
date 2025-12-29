const BlueprintDateField = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of the date field',
      examples: ['dateField1'],
    },
    type: {
      type: 'string',
      description: 'Type of the date field, must be "date"',
      enum: ['date'],
      examples: ['date'],
    },
    isRequired: {
      type: 'boolean',
      description: 'Indicates if the field is required',
      examples: [false],
    },
  },
  required: ['name', 'type'],
};

export default BlueprintDateField;

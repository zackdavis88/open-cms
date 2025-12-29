const BlueprintIdWithExample = () => ({
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'unique id of the blueprint field',
      examples: [crypto.randomUUID()],
    },
  },
  required: ['id'],
});

const BlueprintData = {
  allOf: [
    { $ref: '#/components/schemas/MinimalBlueprintData' },
    {
      type: 'object',
      properties: {
        fields: {
          type: 'array',
          items: {
            anyOf: [
              {
                allOf: [
                  BlueprintIdWithExample(),
                  { $ref: '#/components/schemas/BlueprintStringField' },
                ],
              },
              {
                allOf: [
                  BlueprintIdWithExample(),
                  { $ref: '#/components/schemas/BlueprintNumberField' },
                ],
              },
              {
                allOf: [
                  BlueprintIdWithExample(),
                  { $ref: '#/components/schemas/BlueprintBooleanField' },
                ],
              },
              {
                allOf: [
                  BlueprintIdWithExample(),
                  { $ref: '#/components/schemas/BlueprintDateField' },
                ],
              },
              {
                allOf: [
                  BlueprintIdWithExample(),
                  { $ref: '#/components/schemas/BlueprintArrayField' },
                ],
              },
              {
                allOf: [
                  BlueprintIdWithExample(),
                  { $ref: '#/components/schemas/BlueprintObjectField' },
                ],
              },
            ],
          },
        },
      },
      required: ['fields'],
    },
  ],
};

export default BlueprintData;
